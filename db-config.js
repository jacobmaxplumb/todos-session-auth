const configuration = require('./knexfile');
const environment = process.env.NODE_ENV || 'development';
const db = require('knex')(configuration[environment]);
module.exports = db;