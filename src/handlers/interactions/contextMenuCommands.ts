import type { ContextMenuCommandInteraction } from "discord.js";
import { ApplicationCommandType } from "discord.js";
import type { ContextMenuCommand } from "../../commands/menu";
import config from "../../config";
import { PermissionLevel, getPermissionLevel } from "../../constants/permissions";
import { legacyImportDefault } from "../../utils/import";

export default async function contextMenuCommandHandler(interaction: ContextMenuCommandInteraction<"cached">): Promise<void> {
  const commands = config.guild ? interaction.client.guilds.cache.get(config.guild)?.commands : interaction.client.application.commands;
  const applicationCommand = commands?.cache.find(({ name }) => name === interaction.commandName);
  if (!applicationCommand) return;

  const command = await legacyImportDefault<ContextMenuCommand>(require.resolve(`../../commands/menu/${applicationCommand.name}`));

  const permissionLevel = getPermissionLevel(interaction.member);
  if (permissionLevel < (command.permissionLevel ?? PermissionLevel.None)) return void interaction.reply({ content: "❌ You don't have access to do this.", ephemeral: true });

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- allows us to easily expand if we want message menu commands
  if (command.type === ApplicationCommandType.User && interaction.isUserContextMenuCommand()) {
    const target = await interaction.guild.members.fetch(interaction.targetId).catch(() => null);
    if (!target) return;

    return command.execute(interaction, target, interaction.user.id === target.id || permissionLevel >= PermissionLevel.Admin);
  }
}
