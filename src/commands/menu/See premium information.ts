import { ApplicationCommandType } from "discord.js";
import type { ContextMenuCommand } from ".";
import config from "../../config";
import { getAccess } from "../../database";
import { getTokens } from "../../constants/tokens";

const command: ContextMenuCommand = {
  type: ApplicationCommandType.User,
  async execute(interaction, target, confidentialAccess) {
    const access = await getAccess(target.id);
    if (!access) return void interaction.reply({ content: "❌ This user does not have access to Countr Premium.", ephemeral: true });

    const tokens = getTokens(target);

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
            { name: "Servers", value: `**${access.guildIds.length}/${tokens} servers with Premium:** ${confidentialAccess ? `\n${access.guildIds.map(guildId => `• \`${guildId}\``).join("\n")}` : "*(confidential)*"}`, inline: true },
            { name: "Scheduled expiration", value: tokens ? "*Not scheduled (user still has access)*" : `<t:${Math.floor(access.expires.getTime() / 1000)}:R>`, inline: true },
          ],
        },
      ],
      ephemeral: true,
    });
  },
};

export default { ...command } as ContextMenuCommand;
