import type { ChatInputCommandInteraction } from "discord.js";
import { inspect } from "util";
import type { ChatInputCommand } from "../../commands/chatInput";
import config from "../../config";
import { getPermissionLevel, PermissionLevel } from "../../constants/permissions";
import { Access } from "../../database/models/Access";
import { legacyImportDefault } from "../../utils/import";
import mainLogger from "../../utils/logger/main";

export default async function chatInputCommandHandler(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
  try {
    const command = await legacyImportDefault<ChatInputCommand>(require.resolve(`../../commands/chatInput/${[
      interaction.commandName,
      interaction.options.getSubcommandGroup(false),
      interaction.options.getSubcommand(false),
    ].filter(Boolean).join("/")}`));

    const permissionLevel = getPermissionLevel(interaction.member);
    if (permissionLevel < (command.permissionLevel ?? PermissionLevel.None)) return void interaction.reply({ content: "❌ You don't have access to do this.", ephemeral: true });

    const document = await Access.findOne({ userId: interaction.user.id }) ?? new Access({ userId: interaction.user.id });
    if (permissionLevel >= PermissionLevel.Premium) document.expires = new Date(Date.now() + config.access.expireGrace);

    return await command.execute(interaction);
  } catch (err) {
    mainLogger.error(`Failed to run command ${interaction.commandName}: ${inspect(err)}`);
  }
}
