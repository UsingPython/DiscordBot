import { Command } from "../typings";
import { Role } from ".prisma/client";

const Ping: Command = {
  name: "ping",
  description: "Ping-Pong!",
  cooldown: 5,
  usage: "",
  args: false,
  aliases: [],
  guildOnly: false,
  permission: Role.MEMBER,
  execute: async (message, args): Promise<void> => {
    message.channel.send("Pong");
  },
};

export default Ping;
