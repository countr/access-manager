module.exports = {
  description: "Remove Premium access from a server",
  options: [
    {
      type: "STRING",
      name: "server_id",
      description: "The server ID of the server you want to remove access from the Premium bot",
      required: true
    }
  ]
};

const { CommandInteraction } = require("discord.js"), config = require("../../../../config"), Access = require("../../../database/access");

module.exports.execute = (interaction = new CommandInteraction, { server_id }) => Access.findOne({ user: interaction.user.id }).then(async access => {
  if (!access) access = new Access({ user: interaction.user.id, expires: Date.now() + config.access.expire_grace });
  if (!access.servers.includes(server_id)) return interaction.reply({ content: "❌ This server does not already have access.", ephemeral: true });

  access.servers.pull(server_id);
  access.save();

  return interaction.reply({ content: `✅ Removed server with ID \`${server_id}\` from your list of servers with access.`, ephemeral: true });
});