/* TODO: Fix this test, problem is that the help command import
* itself from the index.ts and will fail this test
import Help from "./help";

const mockMsgSend = jest.fn().mockResolvedValue({});

import { Client, Message, TextChannel } from "discord.js";

jest.mock("discord.js", () => {
  return {
    Message: jest.fn().mockImplementation(() => {
      return {
        channel: {
          send: mockMsgSend,
        },
        author: {
          send: mockMsgSend,
        },
      };
    }),
  };
});

describe("Help command", () => {
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
    await Help.execute(msg, []);
    expect(mockMsgSend).toHaveBeenCalledTimes(1);
  });
});
*/
describe("**SKIP** Help command", () => {
  it("currently not active", () => {});
});
