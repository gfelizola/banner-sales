// global modules
require('colors');
require('console.table');

// external modules
const commandLineArgs  = require('command-line-args');

// internal modules
const help             = require('./help');
const db               = require('./db');

const getUsers         = require('./get-users');
const setUsers         = require('./set-users');
const validateBanners  = require('./validate-banner');
const removeBanners    = require('./remove-banner');


const commands = {
    'get-users': getUsers,
    'set-users': setUsers,
    'validate-banners': validateBanners,
    'remove-banners': removeBanners,
    'help': help,
}

const init = () => {
    const options = commandLineArgs(help.definitions, { partial: true });

    // console.dir(options);

    const subOptions = options._unknown;
    delete options._unknown;

    const optionsKeys = Object.keys(options);
    const commandKey = optionsKeys[0];

    if( optionsKeys.length !== 1 ){
        help(true);
    } else {
        commands[commandKey].apply(this, [subOptions]);
    }
}

init();