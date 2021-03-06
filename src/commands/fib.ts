import { Command } from "../typings";
import { Role } from ".prisma/client";
import { CommandArgsError } from "../errors/command";
import messageContent from "../message-content";

function fib(n: number): number {
  const phi = (1 + Math.sqrt(5)) / 2;
  const asymp = Math.pow(phi, n) / Math.sqrt(5);
  return Math.round(asymp);
}

/**
 * Command to calculate the nth position in the fibonacci series
 */
const Fib: Command = {
  name: "fib",
  description: "Calculate the nth Number in the Fibonacci Series",
  args: true,
  usage: "<n>",
  guildOnly: true,
  cooldown: 2,
  aliases: [],
  permission: Role.MEMBER,
  execute: async (message, args): Promise<void> => {
    if (args[0] == null) throw new CommandArgsError("Args undefined");
    const inputNumber = parseFloat(args[0]);
    if (!isNaN(inputNumber)) {
      await message.channel.send(fib(inputNumber));
    } else {
      await message.channel.send(messageContent.command.fibFail(args[0]));
    }
  },
};

export default Fib;
