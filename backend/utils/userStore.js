const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/users.json');

// Ensure DB exists
if (!fs.existsSync(path.dirname(DB_PATH))) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}
if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([]));
}

const readUsers = () => {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
};

const writeUsers = (users) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
};

const findUser = (email) => {
    const users = readUsers();
    return users.find(u => u.email === email);
};

const createUser = (userData) => {
    const users = readUsers();
    if (users.find(u => u.email === userData.email)) {
        throw new Error("User already exists");
    }
    const newUser = { ...userData, id: Date.now().toString(), createdAt: new Date() };
    users.push(newUser);
    writeUsers(users);
    return newUser;
};

const updateUser = (email, updates) => {
    const users = readUsers();
    const index = users.findIndex(u => u.email === email);
    if (index === -1) return null;

    users[index] = { ...users[index], ...updates };
    writeUsers(users);
    return users[index];
};

module.exports = { findUser, createUser, updateUser };
