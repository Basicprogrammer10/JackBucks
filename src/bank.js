const fs = require("fs");

module.exports = {
    isUserInDb: function(file, user) {
        let data = JSON.parse(fs.readFileSync(file).toString());
        return user in data
    },
    getBalance: function (file, user) {
        let data = JSON.parse(fs.readFileSync(file).toString());
        return data[user]
    },
    initUser: function (file, user) {
        let data = JSON.parse(fs.readFileSync(file).toString());
        data[user] = {money: config.bank.startingValue, init: true};
        fs.writeFileSync(file, JSON.stringify(data));
    }
}