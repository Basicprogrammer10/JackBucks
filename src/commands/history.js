const AsciiTable = require('ascii-table');
const common = require('./../common.js');
const bank = require('./../bank.js');

function notNull(item) {
    if (item !== null) return item
    return ''
}

function makeTable(Bank, user) {
    let table = new AsciiTable().setHeading('Description', 'Transaction', 'Date & Time')
    Bank.history.get(user).reverse().forEach((item, index) => {
        if (table.toString().length + 10 > 2048) return
        if (item[1][0] === user) table.addRow(item[0], `${notNull(item[1][2])} → ${notNull(item[1][1])}`, common.dateTime(item[2]))
        else if (item[1][1] === user) table.addRow(item[0], `${notNull(item[1][1])} ← ${notNull(item[1][2])}`, common.dateTime(item[2]))
        else table.addRow(item[0], notNull(item[1][2]), common.dateTime(item[2]))
    })
    return table
}

module.exports = {
    help: 'Shows your transaction history',
    usage: 'history [@user]',
    process: function (msg) {
        let userTag = msg.mentions.users.first();
        let Bank = new bank(config.data.dataFile);
        if (typeof userTag !== 'undefined') {
            if (!Bank.user.inDb(userTag.tag)) {
                msg.channel.send(common.embedMessage(color.main, "💸 Balance", `\`${userTag.tag}\` has not been registered...`));
                return
            }
            let table = makeTable(Bank, userTag.tag)
            msg.channel.send(common.embedMessage(color.main, `💹 Transaction History - ${userTag.tag}`, '```\n' + table.toString() + '```'));
            return;
        }
        common.checkMakeUser(Bank, msg, msg.author.tag)

        let table = makeTable(Bank, msg.author.tag)
        msg.channel.send(common.embedMessage(color.main, `💹 Transaction History - ${msg.author.tag}`, '```\n' + table.toString() + '```'));
    }
}