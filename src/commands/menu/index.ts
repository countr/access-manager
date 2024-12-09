import type { ApplicationCommandType, Awaitable, GuildMember, UserContextMenuCommandInteraction } from "discord.js";
import type { PermissionLevel } from "../../constants/permissions";

// expandable for message menu commands as well, if we want that in the future

interface UserMenuCommand {
  execute(interaction: UserContextMenuCommandInteraction<"cached">, target: GuildMember, confidentialAccess: boolean): Awaitable<void>;
  type: ApplicationCommandType.User;
}

export type ContextMenuCommand = {
  permissionLevel?: Exclude<PermissionLevel, PermissionLevel.None>;
} & UserMenuCommand;
