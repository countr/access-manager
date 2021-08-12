const { GuildMember } = require("discord.js"), config = require("../../config");

module.exports.ladder = {
  "ALL": 0,
  "PREMIUM": 1,
  "OWNER": 2,
  "NONE": 3
};

module.exports.getPermissionLevel = (member = new GuildMember) => {
  if (config.owner == member.id) return 2;
  if (Object.keys(config.roles).find(r => member.roles.cache.has(r))) return 1;
  return 0;
};