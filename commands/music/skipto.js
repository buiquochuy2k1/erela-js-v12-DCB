const { Client, Message, MessageEmbed } = require('discord.js');
const musicManager = require('../../events/erela')
const config = require('../../config.json')

module.exports = {
    name: 'skipto',
    description: 'Nhảy đến bài hát bạn muốn trong danh sách chờ',
    aliases: [""],
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

        const player = musicManager.create({
            guild: message.guild.id,
            voiceChannel: message.member.voice.channel.id,
            textChannel: message.channel.id,
            selfDeafen: false,
        });

        try {
            if (!player) return message.channel.send(new MessageEmbed().setDescription("❌ | **Không có bài nào đang được phát...**").setColor('RANDOM'));

            if (!args[0]) return message.channel.send(new MessageEmbed().setDescription(`**Dùng lệnh**: \`${config.prefix}skipto [number]\``).setColor('RANDOM'));
            if (Number(args[0]) > player.queue.size) return message.channel.send(new MessageEmbed().setDescription(`❌ | Bài này không có trong danh sách chờ! Vui lòng thử lại!`).setColor('RANDOM'));

            player.queue.remove(0, Number(args[0]) - 1);
            player.stop();
            const embed = new MessageEmbed().setAuthor(`Đã skip!`, config.IconURL).setColor("RANDOM").setDescription(`⏭ Đã skip \`${Number(args[0] - 1)}\` bài hát trong danh sách chờ`);
            await message.channel.send(embed);
            await message.react("✅");
        } catch (error) {
            message.channel.send(new MessageEmbed()
                .setDescription(`Đã xảy ra lỗi, vui lòng thử lại sau`)
                .setColor('RANDOM'));
        }
    }
}