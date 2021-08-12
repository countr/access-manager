const { Client } = require("discord.js"), Access = require("../database/access"), config = require("../../config"), { calculate } = require("../constants/tokens");

module.exports = (client = new Client) => setInterval(() => client.guilds.cache.get(config.guild).members.fetch().then(members => {
  members.filter(m => calculate(m)).forEach(member => {
    Access.findOne({ user: member.id }).then(access => {
      if (!access) access = new Access({ user: member.id });
      access.expires = Date.now() + config.access.expire_grace;
      access.servers.length = Math.min(access.servers.length, calculate(member)); // not more than whatever they have access to
      access.save();
    });
  });
}), config.access.interval);

setTimeout(() =>
  setInterval(() =>
    Access.find({ expires: { $lt: Date.now() - config.access.clean_grace } }).then(accesses =>
      accesses.forEach(access => access.delete())
    ), config.access.interval
  ), config.access.interval / 2); // alternate between checking members and clearing out expired ones