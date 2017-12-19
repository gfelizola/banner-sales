const low      = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter  = new FileSync('banner-data.json');
const db       = low(adapter);

db.defaults({ user: [], banner: {} }).write();

module.exports = db;