import { Client, Message, TextChannel } from "discord.js";
import Play from "./play";

import { validateVoiceChannel, requestSongInfo } from "../utils/music";

// Discord mocks
const mockEmit = jest.fn();
const mockMsgSend = jest.fn().mockResolvedValue({});

// Music utils mocks
let mockValidateVoiceResponse: boolean;
let mockRequestSongInfoResponse: {} | null;

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
  };
});

describe("Play command", () => {
  let msg: Message;

  beforeEach(() => {
    mockValidateVoiceResponse = true;
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
    expect.assertions(3);

    await Play.execute(msg, []);

    expect(validateVoiceChannel).toHaveBeenCalled();
    expect(requestSongInfo).toHaveBeenCalledWith(msg, []);
    expect(mockEmit).toHaveBeenCalled();
  });

  it("should execute command and handle empty videoInfo", async () => {
    expect.assertions(3);
    mockRequestSongInfoResponse = null;

    await Play.execute(msg, []);

    expect(validateVoiceChannel).toHaveBeenCalled();
    expect(requestSongInfo).toHaveBeenCalledWith(msg, []);
    expect(mockMsgSend).toHaveBeenCalledWith("Invalid Youtube-Link!");
  });

  it("should execute command and do nothing if voice channel is not valid", async () => {
    expect.assertions(1);
    mockValidateVoiceResponse = false;

    await Play.execute(msg, []);

    expect(validateVoiceChannel).toHaveBeenCalled();
  });
});
