const common = require('./../common.js');
const bank = require('./../bank.js')
const crypto = require('crypto');

module.exports = {
    help: 'Do some work and EARN MONEY!',
    usage: 'work [answer]',
    process: function (msg, command) {
        if (command.length > 1) {
            let shaSum = crypto.createHash('sha1')
            shaSum.update((Math.round(command[2] * 10) / 10).toString())
            let hash = shaSum.digest('hex').substring(0, 5);
            if (!global.workHashes.includes(command[1])) {
                msg.channel.send(common.embedMessage(color.red, '🧭 Work', `You cant just put the same answer in twice!`));
                return;
            }
            if (hash === command[1]) {
                let Bank = new bank(config.data.dataFile)
                if (!Bank.user.inDb(msg.author.tag)) Bank.user.init(msg.author.tag);
                let payOut = Math.floor(Math.random() * 10) + 1;
                msg.channel.send(common.embedMessage(color.main, '🧭 Work', `Hooray! You got it correct!\n ${payOut} ➜ ${msg.author.tag}`));
                global.workHashes = global.workHashes.filter(value => { value !== hash });

                Bank.balance.add(msg.author.tag, payOut);
                Bank.history.add(msg.author.tag, 'Work', [null, msg.author.tag, payOut])
                Bank.save();
                return
            }
            msg.channel.send(common.embedMessage(color.help, '🧭 Work', `Nope! Try again`));
            return
        }
        const operations = ['÷', '×', '+', '-'];
        let mathNums = [Math.floor(Math.random() * 1000), Math.floor(Math.random() * 1000)];
        let opIndex = Math.floor(Math.random() * operations.length);
        let work = `${mathNums[0]}${operations[opIndex]}${mathNums[1]}`;
        let correct;

        switch (opIndex) {
            case 0:
                correct = Math.round(mathNums[0] / mathNums[1] * 10) / 10
                break
            case 1:
                correct = mathNums[0] * mathNums[1]
                break
            case 2:
                correct = mathNums[0] + mathNums[1]
                break
            case 3: correct = mathNums[0] - mathNums[1]
                break
        }

        let shaSum = crypto.createHash('sha1')
        shaSum.update(correct.toString())
        let hash = shaSum.digest('hex').substring(0, 5);

        if (typeof global.workHashes === 'undefined') global.workHashes = [];
        global.workHashes.push(hash);

        msg.channel.send(common.embedMessage(color.main, '🧭 Work', `What is ${work}? (Round to tenth)\nSubmit your answer with \`${config.bot.commandPrefix}work ${hash} [answer]\``));
    }
}