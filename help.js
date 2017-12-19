const colors = require('colors');
const commandLineUsage = require('command-line-usage');

const optionDefinitions = [
    { name: 'get-users', alias: 'g', type: Boolean },
    { name: 'set-users', alias: 's', type: Boolean },
    { name: 'validate-banners', alias: 'v', type: Boolean },
    { name: 'help', alias: 'h', type: Boolean },
];

const help = (notFound = false) => {
    const sections = [
        {
            header: 'Invoices Banner controller'.green.underline,
            content: 'Manage the users with banner.'
        },
        {
            header: 'Options'.green.underline,
            optionList: [
                {
                    name: 'get-users'.yellow,
                    alias: 'g'.yellow,
                    description: 'Get users with banner (saved from here)'
                },
                {
                    name: 'set-users'.yellow,
                    alias: 's'.yellow,
                    description: 'Add users and banners'
                },
                {
                    name: 'validate-banners'.yellow,
                    alias: 'v'.yellow,
                    description: 'Validate if users has duplicated banners'
                },
                {
                    name: 'help'.yellow,
                    alias: 'h'.yellow,
                    description: 'Print this usage guide.'
                }
            ]
        }
    ];


    if( notFound ){
        sections.unshift({
            content: '[bold]{Command not found}'.yellow
        })
    }

    const usage = commandLineUsage(sections);
    console.log(usage);
}

help.definitions = optionDefinitions;
module.exports = help;