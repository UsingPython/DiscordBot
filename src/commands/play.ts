import { Command, QueueSong } from "../typings";
import * as music from "../utils/music";
import { Role } from ".prisma/client";

const Play: Command = {
  name: "play",
  description: "Play a song from youtube by URL.",
  args: true,
  cooldown: 10,
  usage: "<youtube-video-url>",
  aliases: [],
  guildOnly: true,
  permission: Role.MEMBER,
  execute: async (message, args): Promise<void> => {
    const voiceChannelUser = message.member?.voice.channel;

    if (music.validateVoiceChannel(message)) {
      const videoInfo = await music.requestSongInfo(message, args);
      if (videoInfo == null) {
        await message.channel.send("Invalid Youtube-Link!");
      } else {
        const serverQueue: QueueSong = {
          textChannel: message.channel,
          voiceChannel: voiceChannelUser,
          connection: null,
          songs: [],
          volume: 5,
          playing: false,
        };
        serverQueue.songs.push(videoInfo);
        message.client.emit(
          "addSong",
          serverQueue,
          voiceChannelUser?.guild.id,
          message
        );
      }
    }
  },
};

export default Play;
