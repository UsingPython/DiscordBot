import Slap from "./slap";

const mockMsgSend = jest.fn().mockResolvedValue({});
const mockAuthor = {
  toString: jest.fn(),
};

import { Client, Message, TextChannel } from "discord.js";

jest.mock("discord.js", () => {
  return {
    Message: jest.fn().mockImplementation(() => {
      return {
        channel: {
          send: mockMsgSend,
        },
        author: mockAuthor,
      };
    }),
  };
});

describe("Slap command", () => {
  let msg: Message;

  const dummyAuthor = "<@1234>";
  const botId = "<@719512910979661836>";
  const dummyUser = "<@4321>";

  beforeEach(() => {
    mockMsgSend.mockClear();
    mockAuthor.toString.mockClear();
    msg = new Message(
      ({} as unknown) as Client,
      {},
      ("" as unknown) as TextChannel
    );
  });

  it("should execute command and try to slap yourself", async () => {
    expect.assertions(1);
    mockAuthor.toString.mockReturnValue(dummyAuthor);
    await Slap.execute(msg, [dummyAuthor]);
    expect(mockMsgSend).toHaveBeenCalledWith(
      `Why do you want to slap yourself, ${dummyAuthor}?`
    );
  });

  it("should execute command and try to slap the bot", async () => {
    expect.assertions(1);
    mockAuthor.toString.mockReturnValue(dummyAuthor);
    await Slap.execute(msg, [botId]);
    expect(mockMsgSend).toHaveBeenCalledWith(
      `${botId} slaps ${dummyAuthor} around a bit with a large trout!`
    );
  });

  it("should execute command and try to slap an other user", async () => {
    expect.assertions(1);
    mockAuthor.toString.mockReturnValue(dummyAuthor);
    await Slap.execute(msg, [dummyUser]);
    expect(mockMsgSend).toHaveBeenCalledWith(
      `${dummyAuthor} slaps ${dummyUser} around a bit with a large trout!`
    );
  });

  it("should throw error if no args", async () => {
    expect.assertions(1);
    await expect(Slap.execute(msg, [])).rejects.toEqual(
      new Error("Args undefined")
    );
  });
});
