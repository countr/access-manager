import type { ApplicationCommandType, Awaitable, GuildMember, UserContextMenuCommandInteraction } from "discord.js";
import type { AccessDocument } from "../../database/models/Access";
import type { PermissionLevel } from "../../constants/permissions";

// expandable for message menu commands as well, if we want that in the future

interface UserMenuCommand {
  type: ApplicationCommandType.User;
  execute(interaction: UserContextMenuCommandInteraction<"cached">, target: GuildMember, document: AccessDocument | null, tokens: number, confidentialAccess: boolean): Awaitable<void>;
}

export type ContextMenuCommand = UserMenuCommand & {
  permissionLevel?: Omit<PermissionLevel, PermissionLevel.None>;
};
