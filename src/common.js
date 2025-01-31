const Discord = require("discord.js");
const bank = require('./bank.js')
const fs = require("fs");

function compareTwoStrings(first, second) {
    //Modified From https://github.com/aceakash/string-similarity
    first = first.replace(/\s+/g, '')
    second = second.replace(/\s+/g, '')

    if (first === second) return 1;
    if (first.length < 2 || second.length < 2) return 0;

    let firstBigrams = new Map();
    for (let i = 0; i < first.length - 1; i++) {
        const bigram = first.substring(i, i + 2);
        const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) + 1 : 1;
        firstBigrams.set(bigram, count);
    }

    let intersectionSize = 0;
    for (let i = 0; i < second.length - 1; i++) {
        const bigram = second.substring(i, i + 2);
        const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) : 0;
        if (count > 0) {
            firstBigrams.set(bigram, count - 1);
            intersectionSize++;
        }
    }

    return (2.0 * intersectionSize) / (first.length + second.length - 2);
}

global.color = {
    "main": "#2fc290",
    "help": "#E8DD4D",
    "red": "#DB5953",
    "link": "#27E2E8",
    "nose": "#00EAFF"
};

module.exports = {
    embedMessage: function (embedColor, title, text) {
        return new Discord.MessageEmbed().setColor(embedColor).setTitle(title).setDescription(text || '')
    },

    loadConfig: function (configFile) {
        fs.readFile(configFile, 'utf-8', (err, jsonString) => {
            global.config = JSON.parse(jsonString);
            global.version = config.bot.version;
            global.commandPrefix = config.bot.commandPrefix;
            global.disabledCommands = config.bot.disabledCommands;
            return client.login(config.bot.clientId);
        });
    },

    localImgUploads: function (file, name) {
        return new Discord.MessageAttachment(file, name);
    },

    findBestMatch: function (mainString, targetStrings) {
        const ratings = [];
        let bestMatchIndex = 0;

        for (let i = 0; i < targetStrings.length; i++) {
            const currentTargetString = targetStrings[i];
            const currentRating = compareTwoStrings(mainString, currentTargetString)
            ratings.push({ target: currentTargetString, rating: currentRating })
            if (currentRating > ratings[bestMatchIndex].rating) {
                bestMatchIndex = i
            }
        }
        const bestMatch = ratings[bestMatchIndex]

        return { ratings: ratings, bestMatch: bestMatch, bestMatchIndex: bestMatchIndex };
    },

    isNumeric: function (str) {
        if (typeof str != "string") return false
        return !isNaN(str) && !isNaN(parseFloat(str))
    },

    dateTime: function (timestamp) {
        let date_ob = new Date(timestamp);
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();

        return  hours + ":" + minutes + " "  + month + "-" + date + "-" + year.toString().substr(2, 2)
    },

    checkMakeUser: function(Bank, msg, user, callback) {
        if (!Bank.user.inDb(user)) {
            msg.channel.send(this.embedMessage(color.main, "💰 Bank", `Your Bank Account has been created!`));
            Bank.user.init(user);
            Bank.save();
            if (callback !== undefined) callback(msg);
        }
    },

    randomArrayIndex: function (array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}