module.exports = {
  client: {
    id: "",
    secret: "",
    token: ""
  },
  database_uri: "mongodb://",

  guild: "", // for slash commands
  owner: "",
  color: 0xBD4632,

  roles: {
    "role_id": 123, // role gets 123 servers
  },

  port: 5000,

  access: {
    interval: 30000,
    expire_grace: 259200000, // 3 days
    clean_grace: 2592000000, // 30 days
  }
};