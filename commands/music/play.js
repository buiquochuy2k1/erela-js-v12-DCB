const { Client, Message, MessageEmbed } = require('discord.js');
const musicManager = require('../../events/erela')
const config = require('../../config.json')
const prettyMilliseconds = require("pretty-ms");



module.exports = {
    name: 'play',
    description: 'Chơi nhạc',
    aliases: ['p'],
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

        ///check bai hat\\\
        const SearchString = args.join(" ");
        if (!SearchString) return message.channel.send(new MessageEmbed().setDescription(`**Sử dụng - **\`${config.prefix}play [tên bài hát]\``).setColor('RANDOM'));

        ///Send dang tim kiem\\\
        const timkiem = await message.channel.send(new MessageEmbed().setDescription(":mag_right: Đang tìm bài hát...").setColor('RANDOM'));
        const res = await musicManager.search(
            SearchString,
            message.author
        );

        const player = musicManager.create({
            guild: message.guild.id,
            voiceChannel: message.member.voice.channel.id,
            textChannel: message.channel.id,
            selfDeafen: false,
        });

        if (player.state != "CONNECTED") await player.connect();

        if (!player) return message.channel.send(new MessageEmbed().setDescription("❌ | **Không có bài nào đang được phát...**").setColor('RANDOM'));

        try {
            if (res.loadType === "PLAYLIST_LOADED") {
                player.queue.add(res.tracks);
                if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length)
                    player.play();

                timkiem.edit(new MessageEmbed()
                    .setAuthor(`Playlist đã thêm vào danh sách chờ`, `${config.IconURL}`)
                    .setThumbnail(res.tracks[0].displayThumbnail())
                    .addField("Thời lượng", `\`${prettyMilliseconds(res.playlist.duration, { colonNotation: true })}\``, true)
                    .addField("Số lượng", `\`${res.tracks.length}\` bài`, true)
                    .addField('Yêu cầu bởi', `${message.author}`, false)
                    .setColor('RANDOM'));
            } else {
                player.queue.add(res.tracks[0]);
                if (!player.playing && !player.paused && !player.queue.size)
                    player.play()

                timkiem.edit(new MessageEmbed()
                    .setAuthor(`Đã thêm vào danh sách chờ`, `${config.IconURL}`)
                    .setDescription(`**[${res.tracks[0].title}](${res.tracks.uri})**`)
                    .setThumbnail(res.tracks[0].displayThumbnail())
                    .addField("Thời lượng", `\`${prettyMilliseconds(res.tracks[0].duration, { colonNotation: true })}\``, true)
                    .addField("Thứ tự", `${player.queue.size - 0}`, true)
                    .addField('Yêu cầu bởi', `${message.author}`, false)
                    .setColor('RANDOM'));
            }

        } catch (error) {
            console.log(error)
            message.channel.send(new MessageEmbed()
                .setDescription(`Đã xảy ra lỗi, vui lòng thử lại sau`)
                .setColor('RANDOM'));
        }


    }
}