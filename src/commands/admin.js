// Admin Commands :P
const common = require('./../common.js');
const bank = require('./../bank.js')
const fs = require("fs");
subCommandsHelp = {
    help: 'help',
    add: 'add <@user> <amount>',
    set: 'set <@user> <amount>',
    taxday: 'taxday <tax>'
}

subCommands = {
    help: function (msg, command) {
        let commands = Object.keys(this);
        let working = '';
        let numCommands = 0;

        commands.forEach(function (item) {
            working += `${commandPrefix}${subCommandsHelp[item]}\n`;
            numCommands++;
        });
        msg.channel.send(common.embedMessage(color.main, '🧮 Admin Commands [' + numCommands.toString() + ']', `\`\`\`\n${working}\`\`\``));
    },
    add: function (msg, command) {
        this.set(msg, command, true);
    },
    set: function (msg, command, doAdd) {
        let Bank = new bank(config.data.dataFile);
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
        if (!Bank.isUserInDb(userTag.tag)) {
            msg.channel.send(common.embedMessage(color.red, '🛑 Error', `The user \`${userTag.tag}\` is not registered...`));
            return;
        }

        if (doAdd) {
            Bank.addBalance(userTag.tag, amount);
            Bank.addHistory(userTag.tag, 'Admin Command Add', [null, userTag.tag, amount])
        }
        else {
            Bank.setBalance(userTag.tag, amount);
            Bank.addHistory(userTag.tag, 'Admin Command Set', [null, userTag.tag, amount])
        }
        Bank.save();
        msg.channel.send(common.embedMessage(color.main, '✅ Success', `This transaction has gone through successfully!!!\n\`${parseInt(amount)}\`${config.bank.currency} ➜ \`${userTag.tag}\``));
    },
    taxday: function (msg, command) {
        let Bank = new bank(config.data.dataFile);
        let tax = command[2];
        if (!common.isNumeric(tax)) {
            msg.channel.send(common.embedMessage(color.red, '🛑 Error', `Invalid tax amount of\`${tax}\``));
            return;
        }
        msg.channel.send(common.embedMessage(color.main, '🧮 **TAX DAY**', `Everyone pays \`${tax}%\`!!!`))
        tax = parseFloat(tax) / 100
        Object.keys(Bank.data).forEach((item) => {
            let money = Bank.getBalance(item);
            let finalTax = Math.round((money * tax) * 10) / 10
            Bank.setBalance(item, money - finalTax);
            Bank.addHistory(item, 'Tax Day!', [item, null, finalTax])
        })
        Bank.save();
    }
}

module.exports = {
    help: 'Hidden Admin Commands for Kool Peeps only (AKA not you)',
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