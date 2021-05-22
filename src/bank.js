const fs = require("fs");

module.exports = function (file) {
    let data = JSON.parse(fs.readFileSync(file).toString());
    this.data = data;

    this.user = {
        inDb: function (user) {
            return user in data
        },
        init: function (user) {
            data[user] = { money: config.bank.startingValue, history: [], init: true };
            data[user].history.push(['Starting Money', [null, user, config.bank.startingValue], Date.now()]);
        }
    }

    this.history = {
        add: function (user, description, money) {
            data[user].history.push([description, [money[0], money[1], money[2]], Date.now()]);
        },
        get: function (user) {
            return data[user].history
        }
    }

    this.balance = {
        get: function (user) {
            return data[user].money
        },
        set: function (user, value) {
            data[user].money = parseInt(value);
        },
        add: function (user, inc) {
            data[user].money += parseInt(inc);
        }
    }

    this.save = function () {
        fs.writeFileSync(file, JSON.stringify(data));
    };
}