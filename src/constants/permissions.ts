import type { GuildMember } from "discord.js";
import config from "../config";
import getTokens from "./tokens";

export enum PermissionLevel {
  None,
  Premium,
  Admin,
  Owner,
}

export function getPermissionLevel(member: GuildMember): PermissionLevel {
  if (config.owner === member.id) return PermissionLevel.Owner;
  if (config.admins.includes(member.id)) return PermissionLevel.Admin;
  if (getTokens(member)) return PermissionLevel.Premium;
  return PermissionLevel.None;
}
