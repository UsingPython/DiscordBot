import { Command } from "../typings";
import logger from "../logger";

const Slap: Command = {
  name: "slap",
  description: "Slap someone with a large trout!",
  args: true,
  guildOnly: true,
  usage: "<@Playername>",
  cooldown: 5,
  aliases: [],
  execute(message, args) {
    const author = message.author;
    const botId = "<@719512910979661836>";
    if (author.toString() === args[0]) {
      message.channel
        .send(`Why do you want to slap yourself, ${author.toString()}?`)
        .catch((err) => logger.error(err));
      return;
    }
    if (args[0] === botId) {
      message.channel.send("Nope!").catch((err) => logger.error(err));
      message.channel
        .send(
          `${botId} slaps ${author.toString()} around a bit with a large trout!`
        )
        .catch((err) => logger.error(err));
      return;
    }
    message.channel
      .send(
        `${message.author.toString()} slaps ${
          args[0]
        } around a bit with a large trout!`
      )
      .catch((err) => logger.error(err));
  },
};

export default Slap;
