const common = require('./../common.js');

module.exports = {
    "help": 'No explanation Needed...',
    "usage": 'help [command]',
    process: function (msg, command) {
        let inviteLink = 'https://discord.com/oauth2/authorize?client_id=844676024754503740&scope=bot';
        let commands = Array.from(global.client.commands.keys());
        let cp = commandPrefix;
        let working = '';
        let numCommands = 0;

        if (command.length > 1) {
            if (!client.commands.has(command[1].toLowerCase())) {
                let bestMatch = common.findBestMatch(command[1], allCommands).bestMatch;
                let suggestion = (bestMatch.rating !== 0) ? bestMatch.target : 'help';
                msg.channel.send(common.embedMessage(color.red, `Error: :neutral_face:`,
                    `\`${cp}${command[1]}\` Is not a command...\nDid you mean: **${cp}${suggestion}** (${Math.round(bestMatch.rating * 100)}%)`));
                return;
            }
            let commandGet = client.commands.get(command[1].toLowerCase());
            let body = `${commandGet.help}\nUsage: \`${cp}${commandGet.usage}\``;
            msg.channel.send(common.embedMessage(color.help, `Help: ${command[1]}`, body));
            return;
        }

        commands.forEach(function (item) {
            if (disabledCommands.includes(item)) return;
            let use = client.commands.get(item).usage;
            if (use === undefined) return;
            working += `${cp}${use}\n`;
            numCommands++;
        });

        msg.channel.send(common.embedMessage(color.main, 'Commands [' + numCommands.toString() + ']', `\`\`\`\n${working}\`\`\`\n[▷ Invite ${config.bot.botName} to your Server here ◁](${inviteLink})`));
    }
}