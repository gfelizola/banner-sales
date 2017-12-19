// external modules
const { get } = require('lodash');

// internal modules
const spinner      = require('./spinner');
const db           = require('./db.js');
const API          = require('./api');
const template     = require('./template');
const validate     = require('./validate-banner');
const errorHandler = require('./error');
const {
    VENDAS_DEPT,
    TITLE
} = require('./constants');

const filterUsersWithBanner = (users = []) => {
    return new Promise((resolve, reject) => {
        if( ! users.length ) {
            return reject('You need to inform the users_ids.\nUsage: banner-sales -s <id1> <id2> <id3> <idn>'.yellow)
        }

        spinner.setSpinnerTitle(`Filtering users without banner`.yellow);
        spinner.start();

        const dbUsers = db.get('user');
        // const usersToAdd = [];
        const usersToAdd = users;

        // users.forEach(user => {
        //     const currentUser = dbUsers.find({ user_id: user });
        //     const has = currentUser.size().value() > 0;

        //     if (has) {
        //         const user = currentUser.value();
        //         if( user.has_banner ){
        //             console.log('- User'.gray, user.user_id + "".white, 'already has the banner'.gray);
        //         } else {
        //             usersToAdd.push( user );
        //         }
        //     } else {
        //         usersToAdd.push(user);
        //     }
        // });

        resolve(usersToAdd);
    });
}

const callAPI = users => {
    spinner.setSpinnerTitle(`Adding banner for users`.yellow);

    const callsMap = new Map();
    users.forEach( user => {
        const userCall = API.setBanner(user, template)
            .then(data => {
                spinner.stop(true);
                console.log(' - Banners saved for user'.gray, '' + user.white);
                spinner.start();
            });

        callsMap.set(user, userCall);
    })

    return Promise.all( callsMap.values() )
        .then(() => callsMap);
}

const saveUsersFromResults = resultsWithUser => {
    spinner.setSpinnerTitle(`Saving results`.yellow);

    const users = db.get('user');

    resultsWithUser.forEach(( response, user ) => {
        const currentUser = users.find({ user_id: user });
        const has = currentUser.size().value() > 0;

        if (has) {
            currentUser.assign({
                verified: true,
                has_banner: true
            })
            .write()
        } else {
            users
                .push({
                    user_id: user,
                    verified: true,
                    has_banner: true
                })
                .write();
        }
    });

    return resultsWithUser.size;
};

const success = (qtde = 10) => {
    spinner.stop(true);
    console.log(`\n ✓ All banners saved for ${qtde} user(s)`.green);
}

const execute = users => {
    filterUsersWithBanner(users)
        .then(callAPI)
        .then(saveUsersFromResults)
        .then(success)
        .catch(err => {
            spinner.stop(true);
            console.dir(err);
            errorHandler(err);
        });
};

module.exports = execute;