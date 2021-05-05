import { MessageEmbed } from "discord.js";
import { Command, QueueSong } from "../typings";
import * as music from "../utils/music";
import { Role } from ".prisma/client";

const Search: Command = {
  name: "search",
  description: "Search a video on YouTube by the given query.",
  args: true,
  cooldown: 10,
  usage: "<search-query>",
  aliases: [],
  guildOnly: true,
  permission: Role.MEMBER,
  execute: async (message, args): Promise<void> => {
    const voiceChannelUser = message.member?.voice.channel;

    if (music.validateVoiceChannel(message)) {
      // Search YouTube by args
      const videoTop10 = await music.searchQuery(args);
      if (videoTop10 == null) {
        await message.channel.send(
          "Upps, the shit just hit the fan! :poop: :dash:"
        );
      } else {
        // Create Top10 results Message
        const embed = new MessageEmbed();
        embed.setColor("#db6923");
        embed.setTitle("Top 10 search results");
        embed.setFooter("React with a number to choose your song.");
        for (let i = 0; i < videoTop10.length; i++) {
          const videoEntry = videoTop10[i];
          if (videoEntry != null) {
            embed.addField(
              `${music.searchReactions[i]}. ${videoEntry.title}`,
              `${videoEntry.description}`
            );
          }
        }
        // Send Message and handle reactions
        const embedMessage = await message.channel.send(embed);
        // Remove List after 70 seconds
        const deleteTimeout = setTimeout(async () => {
          await embedMessage.delete();
        }, 70000);
        // Wait for a valid reaction
        const awaitedReactions = await embedMessage.awaitReactions(
          music.filterSearchReactions,
          { max: 1, time: 60000, errors: ["time"] }
        );
        const emojiIndex = music.searchReactions.indexOf(
          awaitedReactions.first()?.emoji.name ?? ""
        );
        if (emojiIndex >= 0) {
          // Delete Search-result Message, request song info and play or add to queue
          await embedMessage.delete();
          clearTimeout(deleteTimeout);
          const choosedVideoUrl = videoTop10[emojiIndex]?.url;
          if (choosedVideoUrl == null)
            throw new Error("Url of video is undefined");
          const videoInfo = await music.requestSongInfo(message, [
            choosedVideoUrl,
          ]);
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
        } else {
          await message.channel.send(
            "I don't know what to do with this reaction!"
          );
        }
      }
    }
  },
};

export default Search;
