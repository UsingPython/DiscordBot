import { Server } from ".prisma/client";
import { User } from ".prisma/client";
import { Prisma } from ".prisma/client";
import { PrismaClient } from ".prisma/client";

export default class Database {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createServer(serverInput: Prisma.ServerCreateInput): Promise<Server> {
    return await this.prisma.server.create({ data: serverInput });
  }

  async getUniqueServer(
    serverUniquePayload: Prisma.ServerWhereUniqueInput
  ): Promise<Server | null> {
    return await this.prisma.server.findUnique({ where: serverUniquePayload });
  }

  async getServers(serverPayload: Prisma.ServerWhereInput): Promise<Server[]> {
    return await this.prisma.server.findMany({ where: serverPayload });
  }

  async createUser(userInput: Prisma.UserCreateInput): Promise<User> {
    return await this.prisma.user.create({ data: userInput });
  }

  async getUniqueUser(
    userUniquePayload: Prisma.UserWhereUniqueInput
  ): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: userUniquePayload });
  }

  async getUsers(userPayload: Prisma.UserWhereInput): Promise<User[]> {
    return await this.prisma.user.findMany({ where: userPayload });
  }
}
