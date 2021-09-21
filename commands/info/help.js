const { MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");
const prefix = require("../../config.json").prefix;

module.exports = {
        name: "help",
        aliases: ['h', 'trogiup'],
        description: "Toàn bộ lệnh hỗ trợ của mình ❤",

        run: async(client, message, args) => {


                const roleColor =
                    message.guild.me.displayHexColor === "#000000" ?
                    "#ffffff" :
                    message.guild.me.displayHexColor;

                if (!args[0]) {
                    let categories = [];
                    const hiddendir = ["hidden"]
                    const dirEmojis = {
                        info: "<a:info:871372812324073478> - ",
                        music: "🎶 - ",
                    }
                    readdirSync("./commands/").forEach((dir) => {
                        if (hiddendir.includes(dir)) return;
                        const editedName = `${dirEmojis[dir]} ${dir.toUpperCase()}`
                        const commands = readdirSync(`./commands/${dir}/`).filter((file) =>
                            file.endsWith(".js")
                        );

                        const cmds = commands.map((command) => {
                            let file = require(`../../commands/${dir}/${command}`);

                            if (!file.name) return "Không có lệnh.";

                            let name = file.name.replace(".js", "");

                            return `\`${name}\``;
                        });

                        let data = new Object();

                        data = {
                            name: editedName,
                            value: cmds.length === 0 ? "Đang cập nhật...." : cmds.join(" "),
                        };

                        categories.push(data);
                    });

                    const embed = new MessageEmbed()
                        .setTitle("📬 Đây là toàn bộ cách sử dụng tôi")
                        .addFields(categories)
                        .setDescription(
                            `Sử dụng \`${prefix}help\` để mở bảng hướng dẫn và thêm lệnh cần hướng dẫn ở sau. Ví dụ: \`${prefix}help ban\`.`
                        )
                        .setFooter(
                            `Yêu cầu bởi ${message.author.tag}`,
                            message.author.displayAvatarURL({ dynamic: true })
                        )
                        .setTimestamp()
                        .setColor(roleColor);
                    return message.channel.send(embed)
                } else {
                    const command =
                        client.commands.get(args[0].toLowerCase()) ||
                        client.commands.find(
                            (c) => c.aliases && c.aliases.includes(args[0].toLowerCase())
                        );

                    if (!command) {
                        const embed = new MessageEmbed()
                            .setTitle(`Lệnh không hợp lệ! Sử dụng \`${prefix}help\` để xem tất cả lệnh của mình!`)
                            .setColor("FF0000");
                        return message.channel.send(embed);
                    }

                    const embed = new MessageEmbed()
                        .setTitle("Chi tiết lệnh:")
                        .addField("PREFIX:", `\`${prefix}\``)
                        .addField(
                            "COMMAND:",
                            command.name ? `\`${command.name}\`` : "Không có lệnh này."
                        )
                        .addField(
                            "ALIASES:",
                            command.aliases ?
                            `\`${command.aliases.join("` `")}\``
            : "Không có từ đồng nghĩa cho lệnh này."
        )
        .addField(
          "USAGE:",
          command.usage
            ? `\`${prefix}${command.name} ${command.usage}\``
            : `\`${prefix}${command.name}\``
        )
        .addField(
          "DESCRIPTION:",
          command.description
            ? command.description
            : "Không có chú thích."
        )
        .setFooter(
          `Yêu cầu bởi ${message.author.tag}`,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setTimestamp()
        .setColor(roleColor);
      return message.channel.send(embed);
    }
  },
};