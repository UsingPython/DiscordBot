import Test from "./test";

const mockMsgSend = jest.fn().mockResolvedValue({});

import { Client, Message, TextChannel } from "discord.js";

jest.mock("discord.js", () => {
  return {
    Message: jest.fn().mockImplementation(() => {
      return {
        channel: {
          send: mockMsgSend,
        },
      };
    }),
  };
});

describe("Test command", () => {
  let msg: Message;

  beforeEach(() => {
    mockMsgSend.mockClear();
    msg = new Message(
      ({} as unknown) as Client,
      {},
      ("" as unknown) as TextChannel
    );
  });

  it("should execute command", async () => {
    expect.assertions(1);
    await Test.execute(msg, ["test"]);
    expect(mockMsgSend).toHaveBeenCalledWith("Testing...works!");
  });

  it("should throw error if no args", async () => {
    expect.assertions(1);
    await expect(Test.execute(msg, [])).rejects.toEqual(
      new Error("Args undefined")
    );
  });
});
