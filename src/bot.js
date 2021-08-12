const
  { Client, Constants: { PartialTypes: { USER, CHANNEL, GUILD_MEMBER, MESSAGE, REACTION } }, Intents: { FLAGS: { GUILDS, GUILD_MEMBERS, GUILD_MESSAGES } } } = require("discord.js"),
  config = require("../config"),
  interactionsHandler = require("./handlers/interactions"),
  accessHandler = require("./handlers/access"),
  client = new Client({
    partials: [ USER, CHANNEL, GUILD_MEMBER, MESSAGE, REACTION ],
    userAgentSuffix: [ "https://countr.xyz", "https://promise.solutions" ],
    presence: {
      status: "online",
      activities: [{
        type: "LISTENING",
        name: "access requests"
      }]
    },
    intents: [ GUILDS, GUILD_MEMBERS, GUILD_MESSAGES ]
  }),
  db = require("./database");

client.on("ready", async () => {
  console.log(`Ready as ${client.user.tag}!`);

  await client.guilds.fetch(config.guild);
  
  interactionsHandler(client);
  accessHandler(client);
});
  
client.on("messageCreate", async message => {
  if (message.content.match(`^<@!?${client.user.id}>`)) return message.react("👋");
});

db.connection.then(() => client.login(config.client.token));

require("./utils/express"); // express server for pings