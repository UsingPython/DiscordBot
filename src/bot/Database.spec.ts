import Database from "./Database";
import { Server } from ".prisma/client";
import { User } from ".prisma/client";
import { Prisma } from ".prisma/client";

jest.mock(".prisma/client", () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        server: {
          create: jest.fn(() => dummyServer),
          findUnique: jest.fn(() => dummyServer),
          findMany: jest.fn(() => [dummyServer]),
        },
        user: {
          create: jest.fn(() => dummyUser),
          findUnique: jest.fn(() => dummyUser),
          findMany: jest.fn(() => [dummyUser]),
        },
      };
    }),
  };
});

const dummyInputServer: Prisma.ServerCreateInput = {
  name: "test",
  discordId: 1234,
};

const dummyServer: Server = {
  id: 1,
  name: "test",
  discordId: 1212,
  prefix: "!",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const dummyInputUser: Prisma.UserCreateInput = {
  discordId: 1234,
  name: "test",
  server: {
    connect: {
      id: 1,
    },
  },
};

const dummyUser: User = {
  id: 2,
  discordId: 2323,
  name: "test1",
  role: "ADMIN",
  createdAt: new Date(),
  updatedAt: new Date(),
  serverId: 1,
};

describe("Database", () => {
  let db: Database;

  beforeEach(() => {
    db = new Database();
  });

  it("should initiate database class", () => {
    expect(db).toBeInstanceOf(Database);
  });

  it("should create Server in Database", async () => {
    expect.assertions(6);
    const server = await db.createServer(dummyInputServer);
    expect(server.id).toBe(dummyServer.id);
    expect(server.name).toBe(dummyServer.name);
    expect(server.discordId).toBe(dummyServer.discordId);
    expect(server.prefix).toBe(dummyServer.prefix);
    expect(server.createdAt).toBe(dummyServer.createdAt);
    expect(server.updatedAt).toBe(dummyServer.updatedAt);
  });

  it("should find unique Server in Database", async () => {
    expect.assertions(7);
    const server = await db.getUniqueServer({ discordId: 123, id: 1 });
    expect(server).toBeTruthy();
    expect(server?.id).toBe(dummyServer.id);
    expect(server?.name).toBe(dummyServer.name);
    expect(server?.discordId).toBe(dummyServer.discordId);
    expect(server?.prefix).toBe(dummyServer.prefix);
    expect(server?.createdAt).toBe(dummyServer.createdAt);
    expect(server?.updatedAt).toBe(dummyServer.updatedAt);
  });

  it("should find multiple Servers in Database", async () => {
    expect.assertions(7);
    const server = await db.getServers({ prefix: "!" });
    expect(server.length).toBeGreaterThan(0);
    expect(server[0]?.id).toBe(dummyServer.id);
    expect(server[0]?.name).toBe(dummyServer.name);
    expect(server[0]?.discordId).toBe(dummyServer.discordId);
    expect(server[0]?.prefix).toBe(dummyServer.prefix);
    expect(server[0]?.createdAt).toBe(dummyServer.createdAt);
    expect(server[0]?.updatedAt).toBe(dummyServer.updatedAt);
  });

  it("should create User in Database", async () => {
    expect.assertions(7);
    const user = await db.createUser(dummyInputUser);
    expect(user.id).toBe(dummyUser.id);
    expect(user.name).toBe(dummyUser.name);
    expect(user.discordId).toBe(dummyUser.discordId);
    expect(user.role).toBe(dummyUser.role);
    expect(user.createdAt).toBe(dummyUser.createdAt);
    expect(user.updatedAt).toBe(dummyUser.updatedAt);
    expect(user.serverId).toBe(dummyUser.serverId);
  });

  it("should find unique User in Database", async () => {
    expect.assertions(8);
    const user = await db.getUniqueUser({ discordId: 123, id: 1 });
    expect(user).toBeTruthy();
    expect(user?.id).toBe(dummyUser.id);
    expect(user?.name).toBe(dummyUser.name);
    expect(user?.discordId).toBe(dummyUser.discordId);
    expect(user?.role).toBe(dummyUser.role);
    expect(user?.createdAt).toBe(dummyUser.createdAt);
    expect(user?.updatedAt).toBe(dummyUser.updatedAt);
    expect(user?.serverId).toBe(dummyUser.serverId);
  });

  it("should find multiple Users in Database", async () => {
    expect.assertions(8);
    const user = await db.getUsers({ name: "test" });
    expect(user.length).toBeGreaterThan(0);
    expect(user[0]?.id).toBe(dummyUser.id);
    expect(user[0]?.name).toBe(dummyUser.name);
    expect(user[0]?.discordId).toBe(dummyUser.discordId);
    expect(user[0]?.role).toBe(dummyUser.role);
    expect(user[0]?.createdAt).toBe(dummyUser.createdAt);
    expect(user[0]?.updatedAt).toBe(dummyUser.updatedAt);
    expect(user[0]?.serverId).toBe(dummyUser.serverId);
  });
});
