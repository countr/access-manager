const { ContextMenuInteraction } = require("discord.js"), config = require("../../../config"), { calculate } = require("../../constants/tokens"), Access = require("../../database/access");

module.exports.execute = (interaction = new ContextMenuInteraction) => Access.findOne({ user: interaction.targetId }).then(async access => {
  if (!access) return interaction.reply({ content: "❌ This user does not have access to Countr Premium.", ephemeral: true });

  const member = await interaction.guild.members.fetch(interaction.targetId), tokens = member ? calculate(member) : 0;
  return interaction.reply({ embeds: [{
    color: config.color,
    title: "Premium Information",
    fields: [
      { name: "Servers", value: `**${access.servers.length}/${tokens} servers with Premium**\n${access.servers.map(s => `• \`${s}\``).join("\n")}`, inline: true },
      { name: "Scheduled expiration", value: tokens ? "Not scheduled (user still has access)" : `<t:${Math.floor(access.expires / 1000)}:R>`, inline: true }
    ]
  }], ephemeral: true });
});