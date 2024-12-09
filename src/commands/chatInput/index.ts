import type { ApplicationCommandSubCommand, Awaitable, ChatInputCommandInteraction } from "discord.js";
import type { PermissionLevel } from "../../constants/permissions";


type ApplicationCommandAllowedOptions = Exclude<ApplicationCommandSubCommand["options"], undefined>[number];

export interface ChatInputCommand {
  description: string;
  execute(interaction: ChatInputCommandInteraction<"cached">): Awaitable<void>;
  options?: [ApplicationCommandAllowedOptions, ...ApplicationCommandAllowedOptions[]];
  permissionLevel?: Exclude<PermissionLevel, PermissionLevel.None>;
}
