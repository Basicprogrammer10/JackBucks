const common = require('./../common.js');
const bank = require('./../bank.js')
//const fs = require("fs");

module.exports = {
    "help": 'Shows top balance',
    "usage": 'baltop',
    process: function (msg) {
        let Bank = new bank(config.data.dataFile)
        let data = Bank.data;
        let top = [[0, ""], [0, ""], [0, ""]];
        let baltop = '```\n'
        for (let i in data) {
            let current = data[i].money;
            if (current > top[0][0]) {
                top[2] = top[1]
                top[1] = top[0]
                top[0] = [current, i]
                continue
            }
            if (current > top[1][0]) {
                top[2] = top[1]
                top[1] = [current, i]
                continue
            }
            if (current > top[2][0]) {
                top[2] = [current, i]
            }
        }
        for (let i = 1; i <= top.length; i++) {
            baltop += `${i}. ${top[i-1][1]} — ${top[i-1][0]}${config.bank.currency}\n`;
        }
        baltop += '```';
        msg.channel.send(common.embedMessage(color.main, "👑 BalTop", `Top 3 balances:\n${baltop}`));
    }
}