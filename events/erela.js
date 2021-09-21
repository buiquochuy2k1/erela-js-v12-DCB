const client = require('../index')
const { Manager } = require("erela.js");
const Spotify = require("erela.js-spotify");
const config = require("../config.json")
const { MessageEmbed } = require('discord.js')
const prettyMilliseconds = require("pretty-ms");

const clientID = config.SpotifyClientID
const clientSecret = config.SpotifyClientSecret


client.manager = new Manager({
    nodes: [{
        host: config.host, // Optional if Lavalink is local
        port: config.port, // Optional if Lavalink is set to default
        password: config.pass, // Optional if Lavalink is set to default
        retryAmount: 100,

    }, ],

    plugins: [
        // Initiate the plugin and pass the two required options.
        new Spotify({
            clientID,
            clientSecret
        })
    ],


    send(id, payload) {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
    },
})

.on("nodeConnect", node => console.log(`Node ${node.options.identifier} connected`))

.on("nodeError", (node, error) => console.log(`Node ${node.options.identifier} had an error: ${error.message}`))

.on("trackStart", async(player, track) => {
    let TrackStartedEmbed = new MessageEmbed()
        .setAuthor(`Đang chơi bài ♪`, config.IconURL)
        .setThumbnail(player.queue.current.displayThumbnail())
        .setDescription(`[${track.title}](${track.uri})`)
        .addField("Yêu cầu bởi", `${track.requester}`, true)
        .addField(
            "Thời lượng",
            `\`${prettyMilliseconds(track.duration, {
              colonNotation: true,
            })}\``,
            true
        )
        .setColor("RANDOM")

    let NowPlaying = await client.channels.cache
        .get(player.textChannel)
        .send(TrackStartedEmbed)
})




.on("queueEnd", (player) => {
    client.channels.cache
        .get(player.textChannel)
        .send(new MessageEmbed().setDescription(`Không còn bài hát nào trong danh sách chờ. Dừng phát....`).setColor('RANDOM'));

    if (!config.online == "on") player.destroy();
});

client.once("ready", () => {
    client.manager.init(client.user.id);
});

client.on("raw", (d) => client.manager.updateVoiceState(d));





module.exports = client.manager