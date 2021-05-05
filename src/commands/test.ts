import { Command } from "../typings";
import { Role } from ".prisma/client";

const Test: Command = {
  name: "test",
  description: "Test the Bot!",
  args: true,
  usage: "<randomString>",
  guildOnly: false,
  cooldown: 5,
  aliases: [],
  permission: Role.MEMBER,
  execute: async (message, args): Promise<void> => {
    if (args[0] == null) throw new Error("Args undefined");
    message.channel.send("Testing...works!");
  },
};

export default Test;
