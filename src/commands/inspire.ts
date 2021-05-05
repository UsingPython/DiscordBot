import axios from "axios";
import { Command } from "../typings";
import logger from "../logger";
import { Role } from ".prisma/client";

const Inspire: Command = {
  name: "inspire",
  description: "Say something really inspiring!",
  args: false,
  cooldown: 10,
  usage: "",
  aliases: [],
  guildOnly: false,
  permission: Role.MEMBER,
  execute: async (message, args): Promise<void> => {
    const inspireResult = await axios.get(
      "https://inspirobot.me/api?generate=true"
    );
    await message.channel.send(inspireResult.data);
  },
};

export default Inspire;
