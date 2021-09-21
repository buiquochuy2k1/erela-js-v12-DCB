const { Client, Message, MessageEmbed } = require('discord.js');
const musicManager = require('../../events/erela')
const config = require('../../config.json')

module.exports = {
    name: 'pause',
    description: 'Dừng phát nhạc tạm thời',
    aliases: ['s', "stop"],
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
            if (player.paused) return message.channel.send(new MessageEmbed().setDescription(":notes: | **Đã dừng phát nhạc tạm thời rồi. Không thể dùng lại!**").setColor('RANDOM'));
            player.pause(true);
            const embed = new MessageEmbed().setAuthor(`Đã dừng!`, config.IconURL).setColor("RANDOM").setDescription(`Dùng lệnh \`${config.prefix}resume\` để tiếp tục chơi nhạc!`);
            await message.channel.send(embed);
            await message.react("✅");
        } catch (error) {
            message.channel.send(new MessageEmbed()
                .setDescription(`Đã xảy ra lỗi, vui lòng thử lại sau`)
                .setColor('RANDOM'));
        }
    }
}