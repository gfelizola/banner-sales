const Spinner = require('cli-spinner').Spinner;
const spinner = new Spinner('%s');
spinner.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏');

module.exports = spinner;