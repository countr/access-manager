module.exports = {
  description: "Give Premium access to a server so you can add the Premium bot",
  options: [
    {
      type: "STRING",
      name: "server_id",
      description: "The server ID of the server you want to give access to the Premium bot",
      required: true
    }
  ]
};

const { CommandInteraction } = require("discord.js"), config = require("../../../../config"), { calculate } = require("../../../constants/tokens"), Access = require("../../../database/access");

module.exports.execute = (interaction = new CommandInteraction, { server_id }) => Access.findOne({ user: interaction.user.id }).then(async access => {
  if (!access) access = new Access({ user: interaction.user.id, expires: Date.now() + config.access.expire_grace });
  if (access.servers.includes(server_id)) return interaction.reply({ content: "❌ This server is already added to your list of servers with access.", ephemeral: true });

  const tokens = calculate(interaction.member);
  if (access.servers.length >= tokens) return interaction.reply({ content: `❌ You can't add more than ${tokens == 1 ? "**1** server" :`**${tokens}** servers`}.`, ephemeral: true });

  access.servers.push(server_id);
  access.save();

  return interaction.reply({ content: `✅ Added server with ID \`${server_id}\` to your list of servers with access.`, ephemeral: true });
});