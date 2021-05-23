const common = require('./../common.js');
const bank = require('./../bank.js')

module.exports = {
    help: 'Shows your balance',
    usage: 'balance [@user]',
    process: function (msg) {
        let userTag = msg.mentions.users.first();
        let Bank = new bank(config.data.dataFile);
        if (typeof userTag !== 'undefined') {
            if (!Bank.user.inDb(userTag.tag)) {
                msg.channel.send(common.embedMessage(color.main, "💸 Balance", `\`${userTag.tag}\` has not been registered...`));
                return
            }
            msg.channel.send(common.embedMessage(color.main, "💸 Balance", `\`${userTag.tag}\`'s balance is \`${Bank.balance.get(userTag.tag)}\`${config.bank.currency}`));
            return;
        }
        common.checkMakeUser(Bank, msg, msg.author.tag)
        msg.channel.send(common.embedMessage(color.main, "💸 Balance", `You Balance is \`${Bank.balance.get(msg.author.tag)}\`${config.bank.currency}`));
    }
}