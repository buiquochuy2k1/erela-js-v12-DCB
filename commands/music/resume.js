const { Client, Message, MessageEmbed } = require('discord.js');
const musicManager = require('../../events/erela')
const config = require('../../config.json')


module.exports = {
    name: 'resume',
    description: 'Tiếp tục bài hát đã dừng trước đó',
    aliases: [''],
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
            if (player.playing) return message.channel.send(new MessageEmbed().setDescription(":notes: | **Nhạc đang được phát. Không thể lệnh này!**").setColor('RANDOM'));
            player.pause(false);
            const embed = new MessageEmbed().setAuthor(`Đã tiếp tục phát nhạc!`, config.IconURL).setColor("RANDOM").setDescription(`Dùng lệnh \`${config.prefix}pause\` để dừng chơi nhạc tạm thời!`);
            await message.channel.send(embed);
            await message.react("✅");
        } catch (error) {
            message.channel.send(new MessageEmbed()
                .setDescription(`Đã xảy ra lỗi, vui lòng thử lại sau`)
                .setColor('RANDOM'));
        }
    }
}