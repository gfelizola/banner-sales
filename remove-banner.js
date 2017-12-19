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

const remove = (users = []) => {
    if( ! Array.isArray(users) ) {
        throw new Error('Users must be an Array');
        return;
    }

    if ( ! users.length ) {
        throw new Error('Inform users to remove banner');
        return;
    }

    spinner.setSpinnerTitle(`Getting banner information for ${totalUsers} user(s)`.yellow);
    spinner.start();

    return Promise.all(usersList.map(user => {
        return new Promise((resolve, reject) => {
            API.getBanner(user)
                .then(data => {
                    spinner.stop(true);
                    console.log(` ✓ Getting messages for user`.green, user + "".white, `success`.green);

                    spinner.setSpinnerTitle(`Getting banner status for ${--totalUsers} user(s)`.yellow);
                    totalUsers && spinner.start();
                    resolve(data);
                })
                .catch(err => {
                    spinner.stop(true);
                    console.log('Error getting banner information for user'.red, user, err.response ? err.response.body : err.message ? err.message : err );

                    spinner.setSpinnerTitle(`Getting banner status for ${--totalUsers} user(s)`.yellow);
                    totalUsers && spinner.start();
                    reject(err.message);
                })
        });
    }));
}

const getBannersInfo = allBanners => {
    let banners = [];

    allBanners.forEach( userMessages => {
        if( isNil( userMessages ) ) return;

        const { data, userID } = userMessages;
        const vendas = data.depts && data.depts.find(depto => {
            return depto.dept === VENDAS_DEPT;
        });

        if( ! isNil( vendas ) && vendas.messages ){
            const messages = vendas.messages.filter(m => m.title.text === TITLE);

            if( messages.length >= 1 ){
                // console.log(`User ${userID} has duplicated invoices message`.red);
                banners.push({ userID, qtde: messages.length, ids: messages.map(m => m.message_id ) });
            }
        }
    });

    console.table(banners.map( d => ({ user: d.userID, qtde: d.qtde })))

    return banners;
}

const showUserOptions = (banners) => {
    if (!banners.length ){
        throw '\n ✓ No users with duplicated banners found - Validation complete'.green;
    }

    return inquirer
        .prompt([{
            type: 'confirm',
            name: 'clear',
            message: `Clear duplicated messages for ${banners.length} users`
        }])
        .then(res => {
            return {
                clear: res.clear,
                banners
            }
        })
}

const normalizeList = ({ clear, banners }) => {
    if( ! clear ) return [];

    const listToDelete = banners.reduce((list, row) => {
        const listForUser = row.ids.slice( 1, row.qtde );
        return list.concat(listForUser.map(message => ({ userID: row.userID, messageID: message })));
    }, []);

    return listToDelete;
}

const startClear = list => {
    spinner.setSpinnerTitle(`Deleting ${list.length} banners`.yellow);
    spinner.start();
    return Promise.all( list.map( message => {
        return API.deleteBanner( message.userID, message.messageID )
            .then(data => {
                spinner.stop(true);
                console.log(` ✓ Message ${message.messageID} delete for user ${message.userID}`.green);
                spinner.start();
                return message;
            })
    }));
}

const reviewUsersInDb = list => {
    const users = db.get('user');

    list.forEach( user => {
        const currentUser = users.find({ user_id: user.userID });

        currentUser.assign({
            verified: true,
            has_banner: false,
            removed: Date.now()
        })
        .write()
    });

    spinner.stop(true);
    console.log('\n ✓ Remove complete'.green);
}

const execute = (users) => {
    remove(users)
        .then(getBannersInfo)
        .then(showUserOptions)
        .then(normalizeList)
        .then(startClear)
        .then(reviewUsersInDb)
        .catch(err => {
            spinner.stop(true);
            errorHandler(err);
        });
}

module.exports = execute;