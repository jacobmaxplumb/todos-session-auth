const db = require('./db-config');

const addUser = async (user) => {
    const [id] = await db('users').insert(user);
    return db('users').where({ id }).first();
}

const findByUsername = async (username) => {
    return db('users').where({ username }).first();
};

module.exports = {
    addUser,
    findByUsername
};