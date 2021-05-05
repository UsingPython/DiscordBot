import { Client, Message, TextChannel } from "discord.js";
import Search from "./search";

import { validateVoiceChannel, searchQuery } from "../utils/music";

// Discord mocks
const mockEmit = jest.fn();
const mockMsgSend = jest.fn().mockImplementation(() => {
  return {
    delete: mockMsgDelete,
    awaitReactions: mockMsgAwaitReactions,
  };
});
const mockMsgDelete = jest.fn().mockResolvedValue({});
const mockMsgAwaitReactions = jest.fn().mockImplementation(() => {
  return {
    first: jest.fn().mockImplementation(() => {
      return {
        emoji: {
          name: "1️⃣",
        },
      };
    }),
  };
});
const mockEmbedColorSet = jest.fn().mockReturnValue({});
const mockTitleSet = jest.fn().mockReturnValue({});
const mockFooterSet = jest.fn().mockReturnValue({});
const mockFieldAdd = jest.fn().mockReturnValue({});

// Music utils mocks
let mockValidateVoiceResponse: boolean;
let mockRequestSongInfoResponse: {} | null;
let mockSearchQueryResponse: null | any[];
let mockFilterSearchReactionsResponse: boolean;

jest.mock("discord.js", () => {
  return {
    Message: jest.fn().mockImplementation(() => {
      return {
        client: {
          emit: mockEmit,
        },
        channel: {
          send: mockMsgSend,
        },
        member: {
          voice: {
            channel: {
              guild: {
                id: "1",
              },
            },
          },
        },
      };
    }),
    MessageEmbed: jest.fn().mockImplementation(() => {
      return {
        setColor: mockEmbedColorSet,
        setTitle: mockTitleSet,
        setFooter: mockFooterSet,
        addField: mockFieldAdd,
      };
    }),
  };
});

jest.mock("../utils/music", () => {
  return {
    validateVoiceChannel: jest.fn().mockImplementation(() => {
      return mockValidateVoiceResponse;
    }),
    requestSongInfo: jest.fn().mockImplementation(() => {
      return mockRequestSongInfoResponse;
    }),
    searchQuery: jest.fn().mockImplementation(() => {
      return mockSearchQueryResponse;
    }),
    searchReactions: [
      "1️⃣",
      "2️⃣",
      "3️⃣",
      "4️⃣",
      "5️⃣",
      "6️⃣",
      "7️⃣",
      "8️⃣",
      "9️⃣",
      "🔟",
    ],
    filterSearchReactions: jest.fn().mockImplementation(() => {
      return mockFilterSearchReactionsResponse;
    }),
  };
});

describe("Search command", () => {
  let msg: Message;

  beforeEach(() => {
    // Clear Mocks
    mockEmit.mockClear();
    mockMsgSend.mockClear();
    mockMsgDelete.mockClear();
    mockMsgAwaitReactions.mockClear();
    mockFieldAdd.mockClear();
    mockEmbedColorSet.mockClear();
    mockTitleSet.mockClear();
    mockFooterSet.mockClear();

    // Reset mock responses
    mockValidateVoiceResponse = true;
    mockSearchQueryResponse = [
      {
        title: "TestTitle",
        description: "TestDescription",
        url: "TestUrl",
      },
    ];
    mockFilterSearchReactionsResponse = true;
    mockRequestSongInfoResponse = {};

    mockEmit.mockClear();
    mockMsgSend.mockClear();
    msg = new Message(
      ({} as unknown) as Client,
      {},
      ("" as unknown) as TextChannel
    );
  });

  it("should execute command and emit 'addSong' event", async () => {
    expect.assertions(10);

    await Search.execute(msg, []);

    expect(validateVoiceChannel).toHaveBeenCalled();
    expect(searchQuery).toHaveBeenCalledWith([]);
    expect(mockEmbedColorSet).toHaveBeenCalledWith("#db6923");
    expect(mockTitleSet).toHaveBeenCalledWith("Top 10 search results");
    expect(mockFooterSet).toHaveBeenCalledWith(
      "React with a number to choose your song."
    );
    expect(mockFieldAdd).toHaveBeenCalled();
    expect(mockMsgSend).toHaveBeenCalledTimes(1);
    expect(mockMsgAwaitReactions).toHaveBeenCalled();
    expect(mockMsgDelete).toHaveBeenCalled();
    expect(mockEmit).toHaveBeenCalled();
  });

  it("should execute command and send message if video info empty", async () => {
    expect.assertions(9);

    mockRequestSongInfoResponse = null;

    await Search.execute(msg, []);

    expect(validateVoiceChannel).toHaveBeenCalled();
    expect(searchQuery).toHaveBeenCalledWith([]);
    expect(mockEmbedColorSet).toHaveBeenCalledWith("#db6923");
    expect(mockTitleSet).toHaveBeenCalledWith("Top 10 search results");
    expect(mockFooterSet).toHaveBeenCalledWith(
      "React with a number to choose your song."
    );
    expect(mockFieldAdd).toHaveBeenCalled();
    expect(mockMsgSend).toHaveBeenCalledTimes(2);
    expect(mockMsgAwaitReactions).toHaveBeenCalled();
    expect(mockMsgDelete).toHaveBeenCalled();
  });

  it("should execute command and throw error video url undefined", async () => {
    expect.assertions(10);

    mockSearchQueryResponse = [
      {
        title: "TestTitle",
        description: "TestDescription",
        url: null,
      },
    ];

    await expect(Search.execute(msg, [])).rejects.toEqual(
      new Error("Url of video is undefined")
    );
    expect(validateVoiceChannel).toHaveBeenCalled();
    expect(searchQuery).toHaveBeenCalledWith([]);
    expect(mockEmbedColorSet).toHaveBeenCalledWith("#db6923");
    expect(mockTitleSet).toHaveBeenCalledWith("Top 10 search results");
    expect(mockFooterSet).toHaveBeenCalledWith(
      "React with a number to choose your song."
    );
    expect(mockFieldAdd).toHaveBeenCalled();
    expect(mockMsgSend).toHaveBeenCalledTimes(1);
    expect(mockMsgAwaitReactions).toHaveBeenCalled();
    expect(mockMsgDelete).toHaveBeenCalled();
  });

  it("should execute command and do nothing if voice channel is not valid", async () => {
    expect.assertions(1);
    mockValidateVoiceResponse = false;

    await Search.execute(msg, []);

    expect(validateVoiceChannel).toHaveBeenCalled();
  });

  it("should execute command and handle empty top10 videos", async () => {
    expect.assertions(3);
    mockSearchQueryResponse = null;

    await Search.execute(msg, []);

    expect(validateVoiceChannel).toHaveBeenCalled();
    expect(searchQuery).toHaveBeenCalledWith([]);
    expect(mockMsgSend).toHaveBeenCalledWith(
      "Upps, the shit just hit the fan! :poop: :dash:"
    );
  });
});
