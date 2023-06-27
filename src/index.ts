import { inspect } from "util";
import { Client, IntentsBitField, Options, Partials } from "discord.js";
import config from "./config";
import { connection } from "./database";
import accessHandler from "./handlers/access";
import interactionsHandler from "./handlers/interactions";
import discordLogger from "./utils/logger/discord";
import mainLogger from "./utils/logger/main";

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
  ],
  makeCache: Options.cacheWithLimits(config.client.caches),
  partials: [
    Partials.Channel,
    Partials.GuildMember,
    Partials.GuildScheduledEvent,
    Partials.Message,
    Partials.Reaction,
    Partials.ThreadMember,
    Partials.User,
  ],
  presence: { status: "dnd" },
  rest: { userAgentAppendix: "Countr (countr.xyz)" },
});

client.once("ready", async trueClient => {
  mainLogger.info(`Ready as ${trueClient.user.tag}!`);

  await client.guilds.fetch(config.guild);

  accessHandler(trueClient);
  void interactionsHandler(trueClient);
});

// discord debug logging
client
  .on("cacheSweep", message => void discordLogger.debug(message))
  .on("debug", info => void discordLogger.debug(info))
  .on("error", error => void discordLogger.error(`Cluster errored. ${inspect(error)}`))
  .on("rateLimit", rateLimitData => void discordLogger.warn(`Rate limit ${JSON.stringify(rateLimitData)}`))
  .on("ready", () => void discordLogger.info("All shards have been connected."))
  .on("shardDisconnect", (_, id) => void discordLogger.warn(`Shard ${id} disconnected.`))
  .on("shardError", (error, id) => void discordLogger.error(`Shard ${id} errored. ${inspect(error)}`))
  .on("shardReady", id => void discordLogger.info(`Shard ${id} is ready.`))
  .on("shardReconnecting", id => void discordLogger.warn(`Shard ${id} is reconnecting.`))
  .on("shardResume", (id, replayed) => void discordLogger.info(`Shard ${id} resumed. ${replayed} events replayed.`))
  .on("warn", info => void discordLogger.warn(info));

void connection.then(() => {
  mainLogger.info("Connected to database");
  void client.login(config.client.token);
});
