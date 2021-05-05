import { Role } from ".prisma/client";
import { Command } from "../typings";
import * as music from "../utils/music";

const Purge: Command = {
  name: "purge",
  description: "Delete all songs in the queue and stop the music!",
  args: false,
  cooldown: 5,
  usage: "",
  aliases: [],
  guildOnly: true,
  permission: Role.MEMBER,
  execute: async (message, args): Promise<void> => {
    const voiceChannelUser = message.member?.voice.channel;
    if (music.validateVoiceChannel(message)) {
      message.client.emit("purgePlaylist", voiceChannelUser?.guild.id, message);
    }
  },
};

export default Purge;
