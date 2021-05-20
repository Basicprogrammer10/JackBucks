const common = require('./../common.js');

module.exports = {
    "help": 'Sends you to this bot\'s Github',
    "usage": 'github',
    process: function (msg) {
        msg.channel.send(common.embedMessage(color.main, 'Github :octopus:', '**SupremeBank**\nhttps://github.com/Basicprogrammer10/SupremeBank').attachFiles(common.localImgUploads('./assets/Github.png', 'file.png')).setThumbnail("attachment://file.png"));
    }
}