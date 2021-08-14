module.exports = {
  client: { // make an application at https://discord.com/developers/applications and turn it into a bot. fill in these values
    id: "",
    secret: "",
    token: ""
  },
  database_uri: "mongodb://", // mongo database uri. should be the same as what the main bot uses, for example what Countr uses. 

  // discord Ids, see https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID- for info on how to obtain them
  guild: "", // for slash commands
  owner: "", // your discord id

  color: 0xBD4632, // main embed color. prefix with 0x for hex, for example 0x00FF00 = green

  roles: {
    "123456789012345678": 3, // role with ID 123456789012345678 gets access to 3 servers
  },

  // express port, used for pinging the service. filling it with "null" will disable the webserver.
  port: 5000,

  // the access handler, refreshing the access entries
  access: {
    interval: 30000, // interval it will renew each access entry
    expire_grace: 259200000, // 3 days // how much time a user can have access before it expires
    clean_grace: 2592000000, // 30 days // how much time the access entry stays in the database before it is removed
  }
};