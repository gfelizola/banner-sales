const rp = require('request-promise');

const api = rp.defaults({
    baseUrl: 'http://api.internal.ml.com/',
    qs: {
        'caller.scopes': 'admin'
    }
})

class API {

    getBanner(userID){
        const endpoint = `/users/${userID}/shipping_info`
        return api.get(endpoint)
            .then( data => ({
                userID,
                data: JSON.parse(data)
            }));
    }

    getBannerForUsers(users = []){
        return Promise.all(users.map(user => this.getBanner(user)));
    }

    setBanner(userID, bannerFn) {
        const endpoint = `/shipping_info`;
        return api.post(endpoint, {
            qs: {
                type: 'user',
                value: userID
            },
            json: bannerFn(userID)
        });
    }

    setBannerForUsers(users = [], bannerFn) {
        return Promise.all(users.map(user => this.setBanner(user, bannerFn)));
    }

    deleteBanner(userID, messageID){
        const endpoint = `/users/${userID}/shipping_info`
        return api.delete(endpoint, {
            qs: {
                message_id: messageID
            }
        });
    }

    deleteBannerForUsers(list) {
        return Promise.all(list.map(item => this.deleteBanner(item.userID, item.messageID)));
    }
}

module.exports = new API();