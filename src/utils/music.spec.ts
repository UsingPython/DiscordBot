import {
  Client,
  Message,
  MessageReaction,
  TextChannel,
  User,
} from "discord.js";
import {
  filterSearchReactions,
  searchReactions,
  validateVoiceChannel,
} from "./music";

const mockPermissionsForChannel = jest.fn();
const mockMsgSend = jest.fn();
const mockClientUser: string | null = "UserObj";

jest.mock("discord.js", () => {
  return {
    Message: jest.fn().mockImplementation(() => {
      return {
        member: {
          voice: {
            channel: {
              permissionsFor: mockPermissionsForChannel,
            },
          },
        },
        channel: {
          send: mockMsgSend,
        },
        client: {
          user: mockClientUser,
        },
      };
    }),
  };
});

describe("Music utils", () => {
  let msg: Message;

  beforeEach(() => {
    mockPermissionsForChannel.mockClear();
    mockMsgSend.mockClear();
    msg = new Message(
      ({} as unknown) as Client,
      {},
      ("" as unknown) as TextChannel
    );
  });

  it("should find reaction in array", () => {
    const filterRes = filterSearchReactions(
      ({
        emoji: {
          name: searchReactions[0],
        },
      } as unknown) as MessageReaction,
      ({} as unknown) as User
    );
    expect(filterRes).toBe(true);
  });

  it("should not find reaction in array", () => {
    const filterRes = filterSearchReactions(
      ({
        emoji: {
          name: "RandomReaction",
        },
      } as unknown) as MessageReaction,
      ({} as unknown) as User
    );
    expect(filterRes).toBe(false);
  });

  it("should return true on valid voice channel", () => {
    expect.assertions(2);
    mockPermissionsForChannel.mockReturnValueOnce({ has: () => true });
    const isChannelValid = validateVoiceChannel(msg);

    expect(isChannelValid).toBe(true);
    expect(mockPermissionsForChannel).toHaveBeenCalledWith(mockClientUser);
  });

  it("should return false on invalid voice channel", () => {
    expect.assertions(3);
    mockPermissionsForChannel.mockReturnValueOnce({ has: () => false });
    mockMsgSend.mockResolvedValueOnce({});
    const isChannelValid = validateVoiceChannel(msg);

    expect(isChannelValid).toBe(false);
    expect(mockPermissionsForChannel).toBeCalledWith(mockClientUser);
    expect(mockMsgSend).toHaveBeenCalledWith(
      "I need the permissions to join and speak in your voice channel!"
    );
  });
});
