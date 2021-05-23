const AsciiTable = require('ascii-table');
const common = require('./../common.js');
const Discord = require('discord.js');
const bank = require('./../bank.js');

function notNull(item) {
    if (item !== null) return item
    return ''
}

function makeTable(Bank, user, full) {
    let table = new AsciiTable().setHeading('Description', 'Transaction', 'Date & Time')
    Bank.history.get(user).reverse().forEach((item, index) => {
        if (table.toString().length + 70 <= 2048 || full) {
            if (item[1][0] === user) table.addRow(item[0], `${notNull(item[1][2])} → ${notNull(item[1][1])}`, common.dateTime(item[2]))
            else if (item[1][1] === user) table.addRow(item[0], `${notNull(item[1][1])} ← ${notNull(item[1][2])}`, common.dateTime(item[2]))
            else table.addRow(item[0], notNull(item[1][2]), common.dateTime(item[2]))
        }
    })
    return table
}

module.exports = {
    help: 'Shows your transaction history\nFull Shows full history',
    usage: 'history [@user] [full]',
    process: function (msg, command) {
        let userTag = msg.mentions.users.first();
        let Bank = new bank(config.data.dataFile);
        let full = command[1] === 'full' || command[2] === 'full';
        if (typeof userTag !== 'undefined') {
            if (!Bank.user.inDb(userTag.tag)) {
                msg.channel.send(common.embedMessage(color.main, "💸 Balance", `\`${userTag.tag}\` has not been registered...`));
                return
            }
            if (full) {
                let table = makeTable(Bank, userTag.tag, true)
                let attach = new Discord.MessageAttachment( new Buffer.from(table.toString(), "utf-8"), `history-${userTag.tag}.txt`);
                msg.channel.send(common.embedMessage(color.main, `💹 Transaction History - ${userTag.tag}`).attachFiles(attach));
                return;
            }
            let table = makeTable(Bank, userTag.tag)
            msg.channel.send(common.embedMessage(color.main, `💹 Transaction History - ${userTag.tag}`, '```\n' + table.toString() + '```'));
            return;
        }
        common.checkMakeUser(Bank, msg, msg.author.tag)

        if (full) {
            let table = makeTable(Bank, msg.author.tag, true)
            let attach = new Discord.MessageAttachment( new Buffer.from(table.toString(), "utf-8"), `history-${msg.author.tag}.txt`);
            msg.channel.send(common.embedMessage(color.main, `💹 Transaction History - ${msg.author.tag}`).attachFiles(attach));
            return;
        }
        let table = makeTable(Bank, msg.author.tag)
        msg.channel.send(common.embedMessage(color.main, `💹 Transaction History - ${msg.author.tag}`, '```\n' + table.toString() + '```'));
    }
}