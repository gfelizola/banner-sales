module.exports = err => {
    if( err.response ){
        const { message, status } = JSON.parse(err.error);
        console.log(`API error - ${status} | ${message}`.red);
    } else {
        console.error(err);
    }
}