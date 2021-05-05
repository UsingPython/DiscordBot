import { MessageEmbed } from "discord.js";
import { Command } from "../typings";
import cmd from "../commands";
import { Role } from ".prisma/client";

const Help: Command = {
  name: "help",
  description: "List all of my commands.",
  args: false,
  cooldown: 5,
  usage: "",
  aliases: ["commands"],
  guildOnly: false,
  permission: Role.MEMBER,
  execute: async (message, args): Promise<void> => {
    const embed = new MessageEmbed()
      .setColor("#008000")
      .setTitle("A list of all commands");
    let position = 1;
    for (const key in cmd) {
      if (Object.prototype.hasOwnProperty.call(cmd, key)) {
        const element = cmd[key];
        if (element == null)
          throw new Error(`Command with name "${element}" is undefined`);
        embed.addField(
          `${position}. ${element.description}`,
          `${element.name} ${element.usage}\ncooldown: ${element.cooldown} ${
            element.aliases.length === 0
              ? ""
              : `\naliases: ${element.aliases.join(", ")}`
          }`
        );
        position = position + 1;
      }
    }
    await message.channel.send(
      `I send you a DM with a list of my commands, @${message.author.toString()}`
    );
    await message.author.send(embed);
  },
};

export default Help;
