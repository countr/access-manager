import type { GuildMember } from "discord.js";
import config from "../config";

export default function getTokens(member: GuildMember): number {
  if (config.owner === member.id) return Infinity;
  return member.roles.cache.map(role => config.roles[role.id] ?? 0).reduce((a, b) => a + b, 0);
}
