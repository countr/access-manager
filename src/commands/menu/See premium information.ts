import { ApplicationCommandType } from "discord.js";
import type { ContextMenuCommand } from ".";
import { PermissionLevel } from "../../constants/permissions";
import config from "../../config";

const command: ContextMenuCommand = {
  type: ApplicationCommandType.User,
  permissionLevel: PermissionLevel.None,
  execute(interaction, target, document, tokens, confidentialAccess) {
    if (!document) return void interaction.reply({ content: "❌ This user does not have access to Countr Premium.", ephemeral: true });

    return void interaction.reply({
      embeds: [
        {
          author: {
            name: `${target.user.tag} • Premium Information`,
            // eslint-disable-next-line camelcase
            icon_url: target.displayAvatarURL({ size: 32 }),
          },
          color: config.color,
          fields: [
            { name: "Servers", value: `**${document.guildIds.length}/${tokens} servers with Premium:** ${confidentialAccess ? `\n${document.guildIds.map(guildId => `• \`${guildId}\``).join("\n")}` : "*(confidential)*"}`, inline: true },
            { name: "Scheduled expiration", value: tokens ? "*Not scheduled (user still has access)*" : `<t:${Math.floor(document.expires.getTime() / 1000)}:R>`, inline: true },
          ],
        },
      ],
      ephemeral: true,
    });
  },
};

export default { ...command } as ContextMenuCommand;
