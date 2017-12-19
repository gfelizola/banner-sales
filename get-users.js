const db = require('./db.js');

const getUsers = () => {
    const users = [{
        user_id: 123123,
        has_banner: true
    },{
        user_id: 123123,
        has_banner: true
    },{
        user_id: 123123,
        has_banner: false
    },{
        user_id: 123123,
        has_banner: true
    }];

    const formatedUsers = users.map( u => ({
        user_id: u.user_id,
        has_banner: u.has_banner ? u.has_banner.toString().green : u.has_banner.toString().red
    }) );

    console.table(formatedUsers);
}

module.exports = getUsers;