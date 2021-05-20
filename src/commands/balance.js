const common = require('./../common.js');
const bank = require('./../bank.js')

module.exports = {
    "help": 'Shows your balance',
    "usage": 'balance [@user]',
    process: function (msg) {
        let userTag = msg.mentions.users.first();
        if (typeof userTag !== 'undefined') {
            let userBankData = bank.getBalance(config.data.dataFile, userTag.tag);
            if (userBankData === undefined) {
                msg.channel.send(common.embedMessage(color.main, "💸 Balance", `\`${userTag.tag}\` has not been registered...`));
                return
            }
            msg.channel.send(common.embedMessage(color.main, "💸 Balance", `\`${userTag.tag}\`'s balance is \`${userBankData.money}\`${config.bank.currency}`));
            return;
        }
        let userBankData = bank.getBalance(config.data.dataFile, msg.author.tag);
        if (userBankData === undefined) {
            msg.channel.send(common.embedMessage(color.main, "💰 Bank", `Your Bank Account has been created!`));
            bank.initUser(config.data.dataFile, msg.author.tag);
            this.process(msg)
            return
        }
        msg.channel.send(common.embedMessage(color.main, "💸 Balance", `You Balance is \`${userBankData.money}\`${config.bank.currency}`));
    }
}