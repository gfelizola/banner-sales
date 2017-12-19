// external modules
const moment = require('moment');

// internal modules
const db           = require('./db.js');

const getInfo = (users = []) => {
    if( ! Array.isArray(users) ) {
        throw new Error('Users must be an Array');
        return;
    }

    const usersList = db.get('user');
    const list = usersList.map(user => ({
        user_id: user.user_id,
        created: user.created ? moment(user.created).format('DD/MM/YYYY HH:mm') : '-',
        removed: user.removed ? moment(user.removed).format('DD/MM/YYYY HH:mm') : '-',
    })).value();

    console.table(list);
}

const execute = (users) => {
    getInfo(users);
}

module.exports = execute;