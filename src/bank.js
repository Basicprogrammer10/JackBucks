const fs = require("fs");

module.exports = function (file) {
    let data = JSON.parse(fs.readFileSync(file).toString());
    this.data = data;
    this.isUserInDb = function (user) {
        return user in data
    };
    this.initUser = function (user) {
        data[user] = { money: config.bank.startingValue, init: true };
    };
    this.getBalance = function (user) {
        return data[user].money
    };
    this.addBalance = function (user, inc) {
        data[user].money += parseInt(inc);
    };
    this.save = function () {
        fs.writeFileSync(file, JSON.stringify(data));
    };
}