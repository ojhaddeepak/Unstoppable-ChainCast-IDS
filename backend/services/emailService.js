const nodemailer = require('nodemailer');

// Create a transporter
// For production, use real SMTP. For now, we try to use Ethereal or just log to console if no env vars.
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'ethereal_user',
        pass: 'ethereal_pass'
    }
});

const sendOTP = async (email, otp) => {
    console.log("==================================================");
    console.log(`🔐 OTP SERVICE: Sending OTP to ${email}`);
    console.log(`🔢 CODE: ${otp}`);
    console.log("==================================================");

    // If we had real keys, we would uncomment this:
    /*
    try {
       await transporter.sendMail({
           from: '"ChainCast Security" <no-reply@chaincast.com>',
           to: email,
           subject: 'Your Verification Code',
           text: `Your OTP code is ${otp}. It expires in 10 minutes.`
       });
    } catch (e) {
        console.error("Email send failed (expected without real keys):", e.message);
    }
    */

    return true; // Always return true for dev flow
};

module.exports = { sendOTP };
