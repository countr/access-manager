const { ContextMenuInteraction } = require("discord.js"), { getPermissionLevel, ladder } = require("../../constants/permissions"), permissions = require("../../commands/user/_permissions.json");

module.exports = (interaction = new ContextMenuInteraction) => {
  const permissionLevel = getPermissionLevel(interaction.member);
  if (permissionLevel < ladder[permissions[interaction.commandName] || "ALL"]) return interaction.reply({ content: "❌ You don't have access to do this.", ephemeral: true });

  const commandFile = require(`../../commands/user/${interaction.commandName}.js`);
  commandFile.execute(interaction, { permissionLevel });
};