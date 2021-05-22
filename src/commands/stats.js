const common = require("./../common.js");
const bank = require("./../bank.js");

module.exports = {
  help: "Shows some stats...\nIts really quite simple.",
  usage: "stats",
  process: function (msg) {
    let Bank = new bank(config.data.dataFile);
    let data = Bank.data;
    let supply = 0;
    Object.keys(data).forEach(t => { supply += data[t].money })
    msg.channel.send(common.embedMessage(color.main, "💸 Bank Stats")
    .addField('Accounts', Object.keys(data).length, true)
    .addField('Circulating Supply', supply, true)
    );
  }
}