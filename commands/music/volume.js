const { Client, Message, MessageEmbed } = require('discord.js');
const musicManager = require('../../events/erela')


module.exports = {
    name: 'volume',
    description: 'Điều chỉnh âm lượng của BOT',
    aliases: ['vl'],
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
            if (!args[0]) return message.channel.send(new MessageEmbed().setDescription(`🔉 | Âm thanh hiện tại \`${player.volume}\`.`).setColor('RANDOM'));
            if (!parseInt(args[0])) return message.channel.send(new MessageEmbed().setDescription(`🔉 **Hãy chọn 1 con số phù hợp** \`1 - 100\``).setColor('RANDOM'));
            let vol = parseInt(args[0]);
            await message.channel.send(new MessageEmbed().setDescription(`🔉 **Đã chỉnh âm lượng thành** \`${vol}\``).setColor('RANDOM'));
            player.setVolume(vol);
        } catch (error) {
            console.log(error)
            message.channel.send(new MessageEmbed()
                .setDescription(`Đã xảy ra lỗi, vui lòng thử lại sau`)
                .setColor('RANDOM'));
        }
    }
}