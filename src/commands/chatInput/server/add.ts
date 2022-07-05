import { ApplicationCommandOptionType } from "discord.js";
import type { ChatInputCommand } from "..";
import { PermissionLevel } from "../../../constants/permissions";
import { getOrCreateAccess } from "../../../database";
import { getTokens } from "../../../constants/tokens";

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
  async execute(interaction) {
    const serverId = interaction.options.getString("server_id", true);

    const access = await getOrCreateAccess(interaction.user.id);
    const tokens = getTokens(interaction.member);

    if (access.guildIds.includes(serverId)) return void interaction.reply({ content: "❌ This server is already added to your list of servers with access.", ephemeral: true });
    if (access.guildIds.length >= tokens) return void interaction.reply({ content: `❌ You can't add more than ${tokens === 1 ? "**1** server" : `**${tokens}** servers`}.`, ephemeral: true });

    access.guildIds.push(serverId);
    void access.save();

    return void interaction.reply({ content: `✅ Added server with ID \`${serverId}\` to your list of servers with access.`, ephemeral: true });
  },
};

export default { ...command } as ChatInputCommand;
