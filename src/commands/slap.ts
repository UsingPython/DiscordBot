import { Command } from "../typings";
import logger from "../logger";
import { Role } from ".prisma/client";

const Slap: Command = {
  name: "slap",
  description: "Slap someone with a large trout!",
  args: true,
  guildOnly: true,
  usage: "<@Playername>",
  cooldown: 5,
  aliases: [],
  permission: Role.MEMBER,
  execute: async (message, args): Promise<void> => {
    const author = message.author;
    // TODO: Set botId programmatically
    const botId = "<@719512910979661836>";
    const slapTarget = args[0];
    if (slapTarget == null) throw new Error("Args undefined");
    if (author.toString() === slapTarget) {
      await message.channel.send(
        `Why do you want to slap yourself, ${author.toString()}?`
      );
      return;
    }
    if (slapTarget === botId) {
      await message.channel.send("Nope!");
      await message.channel.send(
        `${botId} slaps ${author.toString()} around a bit with a large trout!`
      );
      return;
    }
    await message.channel.send(
      `${author.toString()} slaps ${slapTarget} around a bit with a large trout!`
    );
  },
};

export default Slap;
