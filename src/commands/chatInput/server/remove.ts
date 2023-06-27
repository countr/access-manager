import { ApplicationCommandOptionType } from "discord.js";
import type { ChatInputCommand } from "..";
import { PermissionLevel } from "../../../constants/permissions";
import { getAccess } from "../../../database";

const command: ChatInputCommand = {
  description: "Remove Premium access from a server",
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: "server_id",
      description: "The server ID of the server you want to remove access from the Premium bot",
      required: true,
    },
  ],
  permissionLevel: PermissionLevel.Premium,
  async execute(interaction) {
    const serverId = interaction.options.getString("server_id", true);

    const access = await getAccess(interaction.user.id);
    if (!access?.guildIds.includes(serverId)) return void interaction.reply({ content: "❌ This server does not already have access.", ephemeral: true });

    access.guildIds = access.guildIds.filter(guildId => guildId !== serverId);
    void access.save();

    return void interaction.reply({ content: `✅ Removed server with ID \`${serverId}\` from your list of servers with access.`, ephemeral: true });
  },
};

export default { ...command } as ChatInputCommand;
