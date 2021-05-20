const common = require('./../common.js');
const bank = require('./../bank.js')
const crypto = require('crypto');

module.exports = {
    "help": 'Do some work and EARN MONEY!',
    "usage": 'work [answer]',
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
                let payOut = Math.floor(Math.random() * 10) + 1;
                msg.channel.send(common.embedMessage(color.main, '🧭 Work', `Hooray! You got it correct!\n ${payOut} ➜ ${msg.author.tag}`));
                global.workHashes = global.workHashes.filter((value) => {value !== hash});
                bank.addBalance(config.data.dataFile, msg.author.tag, payOut);
                return
            }
            msg.channel.send(common.embedMessage(color.help, '🧭 Work', `Nope! Try again`));
            return
        }
        let operations = ['÷', '×', '+', '-'];
        let opIndex = Math.floor(Math.random() * operations.length);
        let work = `${Math.floor(Math.random() * 1000)}${operations[opIndex]}${Math.floor(Math.random() * 1000)}`;
        let asciiWork = work.replace('×', '*').replace('÷', '/');

        let shaSum = crypto.createHash('sha1')
        shaSum.update((Function(`return Math.round(${asciiWork} * 10) / 10;`))().toString())
        let hash = shaSum.digest('hex').substring(0, 5);

        if (typeof global.workHashes === 'undefined') global.workHashes = [];
        global.workHashes.push(hash);

        msg.channel.send(common.embedMessage(color.main, '🧭 Work', `What is ${work}? (Round to tenth)\nSubmit your answer with \`${config.bot.commandPrefix}work ${hash} [answer]\``));
    }
}