import type { Client } from "discord.js";
import config from "../config";
import getTokens from "../constants/tokens";
import { Access } from "../database/models/Access";

export default function accessHandler(client: Client<true>): void {
  const guild = client.guilds.cache.get(config.guild)!;

  setInterval(() => void Access.find().then(async documents => {
    for (const document of documents) {
      const member = await guild.members.fetch(document.userId).catch(() => null);
      const tokens = member ? getTokens(member) : 0;
      if (tokens) {
        document.expires = new Date(Date.now() + config.access.expireGrace);
        document.guildIds.length = Math.min(document.guildIds.length, tokens);
        await document.save();
      } else if (document.expires < new Date()) {
        await document.deleteOne();
      }
    }
  }), config.access.interval);
}
