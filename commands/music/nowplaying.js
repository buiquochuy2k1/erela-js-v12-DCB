const { Client, Message, MessageEmbed } = require('discord.js');
const musicManager = require('../../events/erela')
const ProgressBar = require('../../events/progressBar')
const config = require('../../config.json')
const prettyMilliseconds = require("pretty-ms");


module.exports = {
    name: 'nowplaying',
    description: 'Xem bài hát hiện tại đang hát',
    aliases: ['np'],
    //cooldown: '',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        ///CHECK NGUOI DUNG TRONG VOICE\\\
        if (!message.member.voice.channel) return message.channel.send(new MessageEmbed().setDescription("❌ | **Bạn phải ở trong voice channel mới được dùng lệnh này**").setColor('RANDOM'));
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(new MessageEmbed().setDescription(":x: | **Bạn phải cùng voice channel với BOT mới nghe được nhạc!**").setColor('RANDOM'));

        try {
            const player = await musicManager.get(message.guild.id);
            if (!player) return message.channel.send(new MessageEmbed().setDescription("❌ | **Không có bài nào đang được phát...**").setColor('RANDOM'));
            await message.react("✅");

            let song = player.queue.current;
            let QueueEmbed = new MessageEmbed()
                .setAuthor("Bài đang chơi hiện tại", config.IconURL)
                .setColor("RANDOM")
                .setDescription(`[${song.title}](${song.uri})`)
                .addField("Yêu cầu bởi", `${song.requester}`, true)
                .addField(
                    "Thời lượng",
                    `${
          ProgressBar(player.position, player.queue.current.duration, 15)
            .Bar
        } \`${prettyMilliseconds(player.position, {
          colonNotation: true,
        })} / ${prettyMilliseconds(player.queue.current.duration, {
          colonNotation: true,
        })}\``
                )
                .setThumbnail(player.queue.current.displayThumbnail());
            return message.channel.send(QueueEmbed);

        } catch (error) {
            console.log(error)
            message.channel.send(new MessageEmbed()
                .setDescription(`Đã xảy ra lỗi, vui lòng thử lại sau`)
                .setColor('RANDOM'));
        }
    }
}