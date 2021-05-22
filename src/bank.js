const fs = require("fs");

module.exports = function (file) {
    let data = JSON.parse(fs.readFileSync(file).toString());
    this.data = data;
    // Check if user is in the database
    this.isUserInDb = function (user) {
        return user in data
    };
    // Create / rest user
    this.initUser = function (user) {
        data[user] = { money: config.bank.startingValue, history: [], init: true };
        this.addHistory(user, 'Starting Money', [null, user, config.bank.startingValue])
    };
    this.addHistory = function (user, description, money) {
        data[user].history.push([description, [money[0], money[1], money[2]], Date.now()]);
    };
    this.getHistory = function (user) {
        return data[user].history
    }
    this.getBalance = function (user) {
        return data[user].money
    };
    this.addBalance = function (user, inc) {
        data[user].money += parseInt(inc);
    };
    this.setBalance = function (user, value) {
        data[user].money = parseInt(value);
    };
    this.save = function () {
        fs.writeFileSync(file, JSON.stringify(data));
    };
}