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

const debugUsers = async () => {
    await connectDB();
    const users = await User.find({});
    console.log("--- USER LIST ---");
    users.forEach(u => {
        console.log(`ID: ${u._id}, Email: '${u.email}', Verified: ${u.isVerified}, Provider: ${u.authProvider}`);
    });
    console.log("-----------------");

    // Check specifically for the user in the screenshot
    const targetEmail = "ojhad5907@gmail.com";
    const targetUser = await User.findOne({ email: targetEmail });
    if (targetUser) {
        console.log(`TARGET FOUND: ${targetEmail}`);
        // Reset it now to be sure
        targetUser.password = 'password123';
        targetUser.passwordConfirm = 'password123';
        targetUser.isVerified = true;
        await targetUser.save({ validateBeforeSave: false });
        console.log("TARGET PASSWORD RESET TO: password123");
    } else {
        console.log(`TARGET NOT FOUND: ${targetEmail}. Creating it now...`);
        try {
            await User.create({
                name: "Admin User",
                email: targetEmail,
                password: 'password123',
                passwordConfirm: 'password123',
                isVerified: true,
                authProvider: 'local'
            });
            console.log("TARGET CREATED WITH PASSWORD: password123");
        } catch (e) {
            console.error("Creation failed:", e.message);
        }
    }
    process.exit();
};

debugUsers();
