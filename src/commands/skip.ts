import { Role } from ".prisma/client";
import { Command } from "../typings";
import * as music from "../utils/music";

const Skip: Command = {
  name: "skip",
  description: "Skip to the next song in the queue!",
  args: false,
  cooldown: 10,
  usage: "",
  aliases: [],
  guildOnly: true,
  permission: Role.MEMBER,
  execute: async (message, args): Promise<void> => {
    const voiceChannelUser = message.member?.voice.channel;
    if (music.validateVoiceChannel(message)) {
      message.client.emit("skipSong", voiceChannelUser?.guild.id, message);
    }
  },
};

export default Skip;
