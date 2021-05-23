const common = require('./../common.js');
const bank = require("./../bank.js");

module.exports = {
    help: 'Collect some extra money every 24Hours',
    usage: 'daily',
    process: function (msg, command) {
        let Bank = new bank(config.data.dataFile)

        common.checkMakeUser(Bank, msg, msg.author.tag)
        let history = Bank.data[msg.author.tag].history
        for (let i in history.slice().reverse()) {
            if (history[i][0] !=='Daily Money!') continue;
            let time = new Date() - history[i][2];
            if (time >= 86400000) continue;
            msg.channel.send(common.embedMessage(color.red, '🛑 Error', `You can only collect your Daily money every 24h\nYou must wait for \`${Math.round((3600000*24 - time) / 3600000 * 10) / 10}\`h`));
            return
        }
        let value = Math.floor(Math.random() * 100)
        Bank.balance.add(msg.author.tag, value);
        Bank.history.add(msg.author.tag, 'Daily Money!', [null, msg.author.tag, value])
        Bank.save();
        msg.channel.send(common.embedMessage(color.main, '📅 Daily Money!', `You got \`${value}\`${config.bank.currency}`))
    }
}