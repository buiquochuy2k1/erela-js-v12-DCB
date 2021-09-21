const { Client, Message, MessageEmbed } = require('discord.js');
const musicManager = require('../../events/erela')
const ProgressBar = require('../../events/progressBar')
const config = require('../../config.json')
const Pagination = require('../../events/pagination')
const prettyMilliseconds = require("pretty-ms");
const _ = require("lodash");

module.exports = {
    name: 'queue',
    description: '',
    aliases: [''],
    //cooldown: '',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        if (!message.member.voice.channel) return message.channel.send(new MessageEmbed().setDescription("❌ | **Bạn phải ở trong voice channel mới được dùng lệnh này**").setColor('RANDOM'));
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(new MessageEmbed().setDescription(":x: | **Bạn phải cùng voice channel với BOT mới nghe được nhạc!**").setColor('RANDOM'));

        try {
            const player = await musicManager.get(message.guild.id);
            if (!player) return message.channel.send(new MessageEmbed().setDescription("❌ | **Không có bài nào đang được phát...**").setColor('RANDOM'));
            await message.react("✅");


            if (!player.queue || !player.queue.length || player.queue === 0) {
                let QueueEmbed = new MessageEmbed()
                    .setAuthor("Đang chơi bài ♪", config.IconURL)
                    .setColor("RANDOM")
                    .setDescription(
                        `[${player.queue.current.title}](${player.queue.current.uri})`
                    )
                    .addField("Yêu cầu bởi", `${player.queue.current.requester}`, true)
                    .addField(
                        "Thời lượng",
                        `${
            ProgressBar(
              player.position,
              player.queue.current.duration,
              15
            ).Bar
          } \`[${prettyMilliseconds(player.position, {
            colonNotation: true,
          })} / ${prettyMilliseconds(player.queue.current.duration, {
            colonNotation: true,
          })}]\``
                    )
                    .setThumbnail(player.queue.current.displayThumbnail());
                return message.channel.send(QueueEmbed);
            }

            let Songs = player.queue.map((t, index) => {
                t.index = index;
                return t;
            });

            let ChunkedSongs = _.chunk(Songs, 10); //How many songs to show per-page

            let Pages = ChunkedSongs.map((Tracks) => {
                let SongsDescription = Tracks.map(
                    (t) =>
                    `\`${t.index + 1}.\` [${t.title}](${t.uri}) \nThời lượng: \`${prettyMilliseconds(
            t.duration,
            {
              colonNotation: true,
            }
          )}\` **|** Yêu cầu bởi: ${t.requester}\n`
                ).join("\n");

                let Embed = new MessageEmbed()
                    .setAuthor("Danh sách chờ", config.IconURL)
                    .setColor("RANDOM")
                    .setDescription(
                        `**Đang chơi bài ♪:** \n[${player.queue.current.title}](${player.queue.current.uri}) \n\n**Danh sách bài tiếp theo:** \n${SongsDescription}\n\n`
                    )
                    .addField("Tổng bài hát: \n", `\`${player.queue.totalSize - 1}\``, true)
                    .addField(
                        "Tổng thời lượng: \n",
                        `\`${prettyMilliseconds(player.queue.duration, {
            colonNotation: true,
          })}\``,
                        true
                    )
                    .addField("Yêu cầu bởi:", `${player.queue.current.requester}`, true)
                    .addField(
                        "Thời lượng bài đang chơi:",
                        `${
            ProgressBar(
              player.position,
              player.queue.current.duration,
              15
            ).Bar
          } \`${prettyMilliseconds(player.position, {
            colonNotation: true,
          })} / ${prettyMilliseconds(player.queue.current.duration, {
            colonNotation: true,
          })}\``
                    )
                    .setThumbnail(player.queue.current.displayThumbnail());

                return Embed;
            });

            if (!Pages.length || Pages.length === 1)
                return message.channel.send(Pages[0]);
            else Pagination(message, Pages);

        } catch (error) {
            console.log(error)
            message.channel.send(new MessageEmbed()
                .setDescription(`Đã xảy ra lỗi, vui lòng thử lại sau`)
                .setColor('RANDOM'));
        }


    }
}