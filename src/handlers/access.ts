import type { Client } from "discord.js";
import config from "../config";
import getTokens from "../constants/tokens";
import { Access } from "../database/models/Access";

export default function accessHandler(client: Client<true>): void {
  const guild = client.guilds.cache.get(config.guild)!;

  setInterval(() => void Access.find().then(async documents => {
    for (const document of documents) {
      if (document.expires.getTime() < Date.now() - config.access.cleanGrace) await document.delete();
      else {
        const member = await guild.members.fetch(document.userId).catch(() => null);
        if (member) {
          const tokens = getTokens(member);
          if (tokens) {
            document.expires = new Date(Date.now() + config.access.expireGrace);
            document.guildIds.length = Math.min(document.guildIds.length, tokens);
            await document.save();
          }
        }
      }
    }
  }), config.access.interval);
}
