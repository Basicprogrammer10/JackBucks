const common = require('./../common.js');
const bank = require("./../bank.js");

module.exports = {
    help: 'Lets you bet money for a chance of getting more!',
    usage: 'bet <ammount>',
    process: function (msg, command) {
        let Bank = new bank(config.data.dataFile)
        let amount = command[1];

        if (!Bank.user.inDb(msg.author.tag)) {
            Bank.user.init(msg.author.tag);
            Bank.save();
            msg.channel.send(common.embedMessage(color.main, '💰', `Your bank account has been created!`));
            this.process(msg, command);
            return;
        }
        if (!common.isNumeric(amount)) {
            msg.channel.send(common.embedMessage(color.red, '🛑 Error', `Uhhh \`${amount}\` is not a number...\nYou may need to check [this](https://en.wikipedia.org/wiki/Number) out`));
            return;
        }
        if (amount <= 0) {
            msg.channel.send(common.embedMessage(color.red, '🛑 Error', `You *cant* bet \`${amount}\`${config.bank.currency}`));
            return;
        }
        if (Bank.balance.get(msg.author.tag) < parseInt(amount)) {
            msg.channel.send(common.embedMessage(color.red, '🛑 Error', `You only have \`${Bank.balance.get(msg.author.tag)}\`${config.bank.currency}...\nYou cant bet more than you have!`));
            return;
        }
        amount = Math.floor(parseInt(amount) / 2);

        const winOptions = {0: 300 - amount*0.9, 10: 15  + amount*.8, 25: 5  + amount*.7, 100: 3  + amount*.6, 200: 2 + amount*.5, 1000: 1}
        let winArray = []
        let winnings = 0;
        Object.keys(winOptions).forEach(item => {
            for (let i = 0; i < winOptions[item]; i++) winArray.push(item)
        })
        winnings = common.randomArrayIndex(winArray);
        if (winnings <= 0) msg.channel.send(common.embedMessage(color.main, `🧿 Bet - ${command[1]}${config.bank.currency}`, `You won ✨**Nothing**✨`))
        else msg.channel.send(common.embedMessage(color.main, `🧿 Bet - ${command[1]}${config.bank.currency}`, `You won **${winnings}**!!!`))
        Bank.balance.add(msg.author.tag, winnings - parseInt(command[1]));
        Bank.history.add(msg.author.tag, `Bet (${command[1]}) [${winnings}]`, [null, msg.author.tag, winnings - parseInt(command[1])]);
        Bank.save();
    }
}