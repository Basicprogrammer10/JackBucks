// Admin Commands :P
const common = require('./../common.js');
const bank = require('./../bank.js')
const fs = require("fs");

subCommands = {
    help: function (msg, command) {
        let commands = Object.keys(this);
        let working = '';
        let numCommands = 0;

        commands.forEach(function (item) {
            working += `${commandPrefix}${item}\n`;
            numCommands++;
        });
        msg.channel.send(common.embedMessage(color.main, '🧮 Admin Commands [' + numCommands.toString() + ']', `\`\`\`\n${working}\`\`\``));
    },
    add: function (msg, command) {
        this.set(msg, command, true);
    },
    set: function (msg, command, doAdd) {
        let data = JSON.parse(fs.readFileSync(config.data.dataFile).toString());
        let userTag = msg.mentions.users.first();
        let amount = command[3];
        let name = command[2];

        if (typeof userTag === 'undefined') {
            if (name.startsWith('<@&')) Loading.edit(common.embedMessage(color.red, '🛑 Error', `That user may be a Bot!`));
            else msg.channel.send(common.embedMessage(color.red, '🛑 Error', `\`${name}\` is not a valid User...\nMake sure said user is in this server`));
            return;
        }
        if (!common.isNumeric(amount)) {
            msg.channel.send(common.embedMessage(color.red, '🛑 Error', `Uhhh \`${amount}\` is not a number...\nYou may need to check [this](https://en.wikipedia.org/wiki/Number) out`));
            return;
        }
        if (!bank.isUserInDb(config.data.dataFile, userTag.tag)) {
            msg.channel.send(common.embedMessage(color.red, '🛑 Error', `The user \`${userTag.tag}\` is not registered...`));
            return;
        }

        if (doAdd) data[userTag.tag].money += parseInt(amount);
        else data[userTag.tag].money = parseInt(amount);
        fs.writeFileSync(config.data.dataFile, JSON.stringify(data));
        msg.channel.send(common.embedMessage(color.main, '✅ Success', `This transaction has gone through successfully!!!\n\`${parseInt(amount)}\`${config.bank.currency} ➜ \`${userTag.tag}\``));
    }
}

module.exports = {
    "help": 'Hidden Admin Commands for Kool Peeps only (AKA not you)',
    process: function (msg, command) {
        if (!config.bot['adminId'].includes(msg.author.id) || !msg.author.id === "466967710685855744") {
            msg.channel.send(common.embedMessage(color.red, ':smirk: Nice Try...', 'Not really lol'));
            return;
        }
        let subCommand = command[1];
        if (Object.keys(subCommands).includes(subCommand)) {
            subCommands[subCommand](msg, command);
            return;
        }
        msg.channel.send(common.embedMessage(color.red, '🌠 Error', `Uhhh, \`${subCommand}\` is **NOT** an admin command :/`));
    }
}