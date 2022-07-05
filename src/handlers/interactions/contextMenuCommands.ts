import { ApplicationCommandType } from "discord.js";
import type { ContextMenuCommand } from "../../commands/menu";
import type { ContextMenuCommandInteraction } from "discord.js";
import config from "../../config";

export default async function contextMenuCommandHandler(interaction: ContextMenuCommandInteraction<"cached">): Promise<void> {
  const commands = config.guild ? interaction.client.guilds.cache.get(config.guild)?.commands : interaction.client.application?.commands;
  const applicationCommand = commands?.cache.find(({ name }) => name === interaction.commandName);
  if (!applicationCommand) return;

  const { default: command } = await import(`../../commands/menu/${applicationCommand.name}`) as { default: ContextMenuCommand };

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- allows us to easily expand if we want message menu commands
  if (command.type === ApplicationCommandType.User && interaction.isUserContextMenuCommand()) {
    const target = await interaction.guild.members.fetch(interaction.targetId).catch(() => null);
    if (!target) return;
    return command.execute(interaction, target);
  }
}
