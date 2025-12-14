const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/chaincast-ids');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

const resetPass = async () => {
    await connectDB();
    // find user by regex in case email is slightly off, or just find the first user
    const user = await User.findOne({});
    if (user) {
        console.log(`Resetting password for: ${user.email}`);
        user.password = 'password123';
        user.passwordConfirm = 'password123';
        user.isVerified = true; // Ensure verified
        await user.save({ validateBeforeSave: false }); // Bypass validation to be sure
        console.log("Password reset to: password123");
    } else {
        console.log("No user found.");
    }
    process.exit();
};

resetPass();
