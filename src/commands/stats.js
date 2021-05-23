const common = require("./../common.js");
const bank = require("./../bank.js");
const fs = require('fs')

module.exports = {
    help: "Shows some stats...\nIts really quite simple.",
    usage: "stats",
    process: function (msg) {
        let Bank = new bank(config.data.dataFile);
        let userTag = msg.mentions.users.first();
        let data = Bank.data;
        if (typeof userTag !== 'undefined') {
            if (!Bank.user.inDb(userTag.tag)) {
                msg.channel.send(common.embedMessage(color.main, "💸 Balance", `\`${userTag.tag}\` has not been registered...`));
                return
            }
            msg.channel.send(common.embedMessage(color.main, `💸 Stats - ${userTag.tag}`)
                .addField('Money', `\`${data[userTag.tag].money}\``, true)
                .addField('Transactions', `\`${data[userTag.tag].history.length}\``, true)
                .addField('Join Date', `\`${common.dateTime(data[userTag.tag].history[0][2])}\``, true)
            );
            return
        }
        let fileStats = fs.statSync(config.data.dataFile)
        let transactions = 0;
        let supply = 0;
        Object.keys(data).forEach(t => {
            supply += data[t].money;
            transactions += data[t].history.length;
        })
        msg.channel.send(common.embedMessage(color.main, "💸 Bank Stats")
            .addField('Accounts', `\`${Object.keys(data).length}\``, true)
            .addField('Circulating Supply', `\`${supply}\``, true)
            .addField('Transactions', `\`${transactions}\``, true)
            .addField('Database Size', `\`${fileStats.size}b\``, true)
        );
    }
}