import { Command } from "../typings";
import logger from "../logger";
import { Role } from ".prisma/client";

function fib(n: number): number {
  const phi = (1 + Math.sqrt(5)) / 2;
  const asymp = Math.pow(phi, n) / Math.sqrt(5);
  return Math.round(asymp);
}

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
    if (args[0] == null) throw new Error("Args undefined");
    const inputNumber = parseFloat(args[0]);
    if (!isNaN(inputNumber)) {
      await message.channel.send(fib(inputNumber));
    } else {
      await message.channel.send(`Is \`${args[0]}\` really a valid number?`);
    }
  },
};

export default Fib;
