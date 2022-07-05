import { Access } from "./models/Access";
import type { AccessDocument } from "./models/Access";
import type { Snowflake } from "discord.js";

export async function getAccess(userId: Snowflake): Promise<AccessDocument | null> {
  return Access.findOne({ userId });
}

export async function getOrCreateAccess(userId: Snowflake): Promise<AccessDocument> {
  return await getAccess(userId) ?? new Access({ userId });
}

export async function addServer(userId: Snowflake, guildId: Snowflake): Promise<boolean> {
  const document = await getOrCreateAccess(userId);
  if (document.guildIds.includes(guildId)) return false;
  document.guildIds.push(guildId);
  await document.save();
  return true;
}

export async function removeServer(userId: Snowflake, guildId: Snowflake): Promise<boolean> {
  const document = await getOrCreateAccess(userId);
  if (!document.guildIds.includes(guildId)) return false;
  document.guildIds = document.guildIds.filter(id => id !== guildId);
  await document.save();
  return true;
}
