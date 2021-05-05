import { Role } from ".prisma/client";
import { Command } from "../typings";
import * as music from "../utils/music";

const Pause: Command = {
  name: "pause",
  description: "Pause all songs in the queue!",
  args: false,
  cooldown: 10,
  usage: "",
  aliases: [""],
  guildOnly: true,
  permission: Role.MEMBER,
  execute: async (message, args): Promise<void> => {
    const voiceChannelUser = message.member?.voice.channel;
    if (music.validateVoiceChannel(message)) {
      message.client.emit("pauseSong", voiceChannelUser?.guild.id, message);
    }
  },
};

export default Pause;
