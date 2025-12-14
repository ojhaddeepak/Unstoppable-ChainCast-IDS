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

const checkUsers = async () => {
    await connectDB();
    const users = await User.find({});
    console.log("Found Users:", users.length);
    users.forEach(u => {
        console.log(`Email: ${u.email}, Verified: ${u.isVerified}, Provider: ${u.authProvider}`);
    });
    process.exit();
};

checkUsers();
