import type { Awaitable, ChatInputCommandInteraction, ApplicationCommandSubCommand } from "discord.js";
import type { PermissionLevel } from "../../constants/permissions";


type ApplicationCommandAllowedOptions = Exclude<ApplicationCommandSubCommand["options"], undefined>[number];

export interface ChatInputCommand {
  description: string;
  options?: [ApplicationCommandAllowedOptions, ...ApplicationCommandAllowedOptions[]];
  permissionLevel?: Exclude<PermissionLevel, PermissionLevel.None>;
  execute(interaction: ChatInputCommandInteraction<"cached">): Awaitable<void>;
}
