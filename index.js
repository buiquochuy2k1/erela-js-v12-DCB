const { Collection, Client } = require('discord.js')
const fs = require('fs')

const client = new Client({
    disableEveryone: true
})

const config = require('./config.json')
const token = config.token
module.exports = client


client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");
["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});


client.login(token)