// external modules
const { isNil } = require('lodash');
const lodashId = require('lodash-id');
const inquirer = require('inquirer');

// internal modules
const spinner      = require('./spinner');
const db           = require('./db.js');
const API          = require('./api');
const template     = require('./template');
const errorHandler = require('./error');
const {
    VENDAS_DEPT,
    TITLE
} = require('./constants');

const getUsersList = (users = []) => {
    if( ! Array.isArray(users) ) {
        throw new Error('Users must be an Array');
        return;
    }

    const usersList = !users.length ? db.get('user').map('user_id').value() : users;

    let totalUsers = usersList.length;

    spinner.setSpinnerTitle(`Getting banner status for ${totalUsers} user(s)`.yellow);
    spinner.start();

    return Promise.all(usersList.map(user => {
        return new Promise((resolve, reject) => {
            API.getBanner(user)
                .then(data => {
                    spinner.stop(true);
                    spinner.setSpinnerTitle(`Getting banner status for ${--totalUsers} user(s)`.yellow);
                    totalUsers && spinner.start();
                    resolve(data);
                })
                .catch(err => {
                    spinner.stop(true);
                    console.log('Error getting banner information for user'.red, user, err.response ? err.response.body : err.message ? err.message : err );

                    spinner.setSpinnerTitle(`Getting banner status for ${--totalUsers} user(s)`.yellow);
                    totalUsers && spinner.start();
                    resolve({});
                })
        });
    }));
}

const getInfos = allBanners => {
    let banners = {
        ok: 0,
        nok: 0,
    };

    let withoutList = [];

    allBanners.forEach( userMessages => {
        if( isNil( userMessages ) ) return;

        const { data, userID } = userMessages;
        const vendas = data.depts && data.depts.find(depto => {
            return depto.dept === VENDAS_DEPT;
        });

        if( ! isNil( vendas ) && vendas.messages ){
            const messages = vendas.messages.filter(m => m.title.text === TITLE);

            if( messages.length >= 1 ){
                // console.log(userID, 'ok'.green);
                banners.ok++;
            } else {
                // console.log(userID, 'not found'.red);
                banners.nok++;
                withoutList.push(userID);
            }
        } else {
            // console.log(userID, 'not found'.red);
            banners.nok++;
            withoutList.push(userID);
        }
    });

    console.log(`Banner information for ${allBanners.length} users`.yellow)

    console.table(banners);

    console.log('\n', 'Users'.gray);
    console.log(withoutList.join(' '))

    return banners;
}

const execute = (users) => {
    getUsersList(users)
        .then(getInfos)
        .catch(err => {
            spinner.stop(true);
            errorHandler(err);
        });
}

module.exports = execute;