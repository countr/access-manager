import { PermissionLevel, getPermissionLevel } from "../../constants/permissions";
import { Access } from "../../database/models/Access";
import type { ChatInputCommand } from "../../commands/chatInput";
import type { ChatInputCommandInteraction } from "discord.js";
import config from "../../config";
import { getTokens } from "../../constants/tokens";
import { inspect } from "util";
import { mainLogger } from "../../utils/logger/main";

export default async function chatInputCommandHandler(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
  try {
    const { default: command } = await import(`../../commands/chatInput/${[
      interaction.commandName,
      interaction.options.getSubcommandGroup(false),
      interaction.options.getSubcommand(false),
    ].filter(Boolean).join("/")}`) as { default: ChatInputCommand };

    const permissionLevel = getPermissionLevel(interaction.member);
    if (permissionLevel < (command.permissionLevel ?? PermissionLevel.None)) return void interaction.reply({ content: "❌ You don't have access to do this.", ephemeral: true });

    const document = await Access.findOne({ userId: interaction.user.id }) ?? new Access({ userId: interaction.user.id });
    if (permissionLevel >= PermissionLevel.Premium) document.expires = new Date(Date.now() + config.access.expireGrace);

    return await command.execute(interaction, document as never, getTokens(interaction.member));
  } catch (err) {
    mainLogger.error(`Failed to run command ${interaction.commandName}: ${inspect(err)}`);
  }
}
