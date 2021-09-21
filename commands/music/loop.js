const { Client, Message, MessageEmbed } = require('discord.js');
const musicManager = require('../../events/erela')


module.exports = {
    name: 'loop',
    description: 'Lặp lại 1 bài hát',
    aliases: ['l'],
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
            if (player.trackRepeat) {
                player.setTrackRepeat(false)
                message.channel.send(new MessageEmbed().setDescription(`:repeat: Lặp lại 1 bài hát \`tắt\``).setColor('RANDOM'));
            } else {
                player.setTrackRepeat(true)
                message.channel.send(new MessageEmbed().setDescription(`:repeat: Lặp lại 1 bài hát \`bật\``).setColor('RANDOM'));
            }
        } catch (error) {
            console.log(error)
            message.channel.send(new MessageEmbed()
                .setDescription(`Đã xảy ra lỗi, vui lòng thử lại sau`)
                .setColor('RANDOM'));
        }
    }
}