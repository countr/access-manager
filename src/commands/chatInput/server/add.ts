import { ApplicationCommandOptionType } from "discord.js";
import type { ChatInputCommand } from "..";
import { PermissionLevel } from "../../../constants/permissions";

const command: ChatInputCommand = {
  description: "Give Premium access to a server so you can add the Premium bot",
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: "server_id",
      description: "The server ID of the server you want to give access to the Premium bot",
      required: true,
    },
  ],
  permissionLevel: PermissionLevel.Premium,
  execute(interaction, document, tokens) {
    const serverId = interaction.options.getString("server_id", true);

    if (document.guildIds.includes(serverId)) return void interaction.reply({ content: "❌ This server is already added to your list of servers with access.", ephemeral: true });
    if (document.guildIds.length >= tokens) return void interaction.reply({ content: `❌ You can't add more than ${tokens === 1 ? "**1** server" : `**${tokens}** servers`}.`, ephemeral: true });

    document.guildIds.push(serverId);
    void document.save();

    return void interaction.reply({ content: `✅ Added server with ID \`${serverId}\` to your list of servers with access.`, ephemeral: true });
  },
};

export default { ...command } as ChatInputCommand;
