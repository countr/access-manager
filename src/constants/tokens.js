const { GuildMember } = require("discord.js"), config = require("../../config");

module.exports.calculate = (member = new GuildMember) => {
  if (config.owner == member.id) return 1;
  return member.roles.cache.map(r => r.id).map(r => config.roles[r] || 0).reduce((a, b) => a + b);
};