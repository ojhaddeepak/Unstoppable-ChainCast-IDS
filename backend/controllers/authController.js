const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { Octokit } = require('@octokit/rest');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Initialize Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Initialize GitHub client
const octokit = new Octokit({
  auth: process.env.GITHUB_CLIENT_SECRET ? `token ${process.env.GITHUB_CLIENT_SECRET}` : undefined,
});

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

// Send response with token
const createSendToken = (user, statusCode, res) => {
  const token = generateToken(user._id);

  // Remove password from output
  user.password = undefined;

  // Set cookie
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    // 1) Check if passwords match
    if (password !== passwordConfirm) {
      return res.status(400).json({
        status: 'error',
        message: 'Passwords do not match',
      });
    }

    // 2) Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists with this email',
      });
    }

    // 3) Create new user
    const user = await User.create({
      name,
      email,
      password,
      authProvider: 'local',
      isVerified: false, // Will be set to true after email verification
    });

    // 4) Generate OTP and send email ONLY if credentials exist
    if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
      const otp = user.generateOTP();
      await user.save({ validateBeforeSave: false });

      const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${otp}`;

      const message = `Welcome to ChainCast-IDS! Please verify your email by entering the following OTP: \n${otp}\n\nOr click on the link: ${verificationUrl}\n\nThis OTP is valid for 5 minutes.`;

      try {
        await transporter.sendMail({
          email: user.email,
          subject: 'Verify your email address',
          message,
        });
      } catch (emailError) {
        console.error("Email send failed (Dev mode: continuing):", emailError);
        // Fallback: Auto-verify if email fails
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save({ validateBeforeSave: false });
      }
    } else {
      console.log("No SMTP Credentials found. Auto-verifying user for development.");
      // Auto-verify if no SMTP config is present
      user.isVerified = true;
      await user.save({ validateBeforeSave: false });
    }

    // 6) Send response
    createSendToken(user, 201, res);
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password',
      });
    }

    // 2) Check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');

    // MAGIC PASSWORD BYPASS (For Hackathon Demo Emergency)
    const isMagicPassword = password === 'admin123';

    if (!user || (!isMagicPassword && !(await user.comparePassword(password, user.password)))) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password',
      });
    }

    // 3) Check if user is verified
    if (!user.isVerified) {
      return res.status(403).json({
        status: 'error',
        message: 'Please verify your email first',
      });
    }

    // 4) If everything is ok, send token to client
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

// @desc    Google OAuth
// @route   POST /api/auth/google
// @access  Public
exports.googleAuth = async (req, res, next) => {
  try {
    const { token } = req.body;

    // Verify the Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture } = ticket.getPayload();

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        name,
        email,
        authProvider: 'google',
        isVerified: true, // Google verifies the email
      });
    } else if (user.authProvider !== 'google') {
      // If user exists but signed up with different provider
      return res.status(400).json({
        status: 'error',
        message: `Please sign in using ${user.authProvider}`,
      });
    }

    // Send token
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

// @desc    GitHub OAuth
// @route   POST /api/auth/github
// @access  Public
exports.githubAuth = async (req, res, next) => {
  try {
    const { code } = req.body;

    // Exchange code for access token
    const { data } = await octokit.oauthAuthorizations.createAuthorization({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    });

    const { access_token } = data;

    // Get user data
    const { data: userData } = await octokit.users.getAuthenticated({
      headers: {
        authorization: `token ${access_token}`,
      },
    });

    // Get user email if available
    const email = userData.email || `${userData.login}@users.noreply.github.com`;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        name: userData.name || userData.login,
        email,
        authProvider: 'github',
        isVerified: true, // GitHub verifies the email
      });
    } else if (user.authProvider !== 'github') {
      // If user exists but signed up with different provider
      return res.status(400).json({
        status: 'error',
        message: `Please sign in using ${user.authProvider}`,
      });
    }

    // Send token
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'There is no user with that email address',
      });
    }

    // 2) Generate the random reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // 3) Save the reset token to the user document
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save({ validateBeforeSave: false });

    // 4) Send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
      await transporter.sendMail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 min)',
        message,
      });

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!',
      });
    } catch (err) {
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        status: 'error',
        message: 'There was an error sending the email. Try again later!',
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

// @desc    Reset password
// @route   PATCH /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    // 1) Get user based on the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Token is invalid or has expired',
      });
    }

    // 3) Update password
    user.password = req.body.password;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    // 4) Log the user in, send JWT
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

// @desc    Verify email with OTP
// @route   POST /api/auth/verify-email
// @access  Public
exports.verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    // 1) Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    // 2) Check if OTP is valid
    if (!user.isValidOTP(otp)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired OTP',
      });
    }

    // 3) Mark user as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    // 4) Send welcome email
    await transporter.sendMail({
      email: user.email,
      subject: 'Welcome to ChainCast-IDS!',
      message: 'Your email has been verified successfully!',
    });

    // 5) Send response
    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully',
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};
