import Skip from "./skip";
import { Client, Message, TextChannel } from "discord.js";

const mockEmit = jest.fn();

jest.mock("discord.js", () => {
  return {
    Message: jest.fn().mockImplementation(() => {
      return {
        client: {
          emit: mockEmit,
        },
      };
    }),
  };
});

jest.mock("../utils/music", () => {
  return {
    validateVoiceChannel: jest.fn().mockReturnValue(true),
  };
});

describe("Skip command", () => {
  let msg: Message;

  beforeEach(() => {
    mockEmit.mockClear();
    msg = new Message(
      ({} as unknown) as Client,
      {},
      ("" as unknown) as TextChannel
    );
  });

  it("should execute command", async () => {
    expect.assertions(1);
    await Skip.execute(msg, []);
    expect(mockEmit).toHaveBeenCalled();
  });
});
