const db = require('./db-config');

const addUser = async (user) => {
    const [newUser] = await db('users').insert(user).returning('*');
    return newUser;
}

const findByUsername = async (username) => {
    return db('users').where({ username }).first();
};

module.exports = {
    addUser,
    findByUsername
};