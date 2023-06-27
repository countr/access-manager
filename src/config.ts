import type { CacheWithLimitsOptions, Snowflake } from "discord.js";
import "dotenv/config";

const roles: Record<Snowflake, number> = {};
for (const [key, value] of Object.entries(process.env)) if (key.startsWith("ROLE_") && value) roles[key.slice(5)] = parseInt(value, 10);

// export config as a constant value
export default {
  client: {
    token: String(process.env["BOT_TOKEN"]),
    caches: {
      ApplicationCommandManager: 0,
      BaseGuildEmojiManager: 0,
      GuildEmojiManager: 0,
      GuildMemberManager: { maxSize: 0, keepOverLimit: member => member.id === process.env["BOT_ID"] },
      GuildBanManager: 0,
      GuildInviteManager: 0,
      GuildScheduledEventManager: 0,
      GuildStickerManager: 0,
      MessageManager: 0,
      PresenceManager: 0,
      ReactionManager: 0,
      ReactionUserManager: 0,
      StageInstanceManager: 0,
      ThreadManager: 0,
      ThreadMemberManager: 0,
      UserManager: { maxSize: 0, keepOverLimit: user => user.id === process.env["BOT_ID"] },
      VoiceStateManager: 0,
    } as CacheWithLimitsOptions,
  },
  databaseUri: String(process.env["DATABASE_URI"]),

  roles,

  owner: process.env["OWNER"] ?? "",
  admins: (process.env["ADMINS"] ?? "").split(","),
  guild: String(process.env["GUILD"]),

  color: parseInt(process.env["COLOR_PRIMARY"] ?? "BD4632", 16),

  access: {
    // 30 seconds -- interval it will renew each access entry
    interval: 30_000,
    // 3 days -- how much time a user can have access before it expires
    expireGrace: 259_200_000,
    // 30 days -- how much time the access entry stays in the database before it's deleted
    cleanGrace: 2_592_000_000,
  },
} as const;
