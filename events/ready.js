const client = require('../index')
const prefix = require('../config.json').prefix

client.on('ready', () => {
    client.user.setActivity(`${prefix}help`)
    console.log(`Successfully Logged in as ${client.user.username} ✅`)
})