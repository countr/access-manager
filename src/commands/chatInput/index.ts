import type { ApplicationCommandAutocompleteOption, ApplicationCommandChannelOptionData, ApplicationCommandChoicesData, ApplicationCommandNonOptionsData, ApplicationCommandNumericOptionData, Awaitable, ChatInputCommandInteraction } from "discord.js";
import type { PermissionLevel } from "../../constants/permissions";

type ApplicationCommandAllowedOptions =
  | ApplicationCommandAutocompleteOption
  | ApplicationCommandChannelOptionData
  | ApplicationCommandChoicesData
  | ApplicationCommandNonOptionsData
  | ApplicationCommandNumericOptionData
;

export interface ChatInputCommand {
  description: string;
  options?: [ApplicationCommandAllowedOptions, ...ApplicationCommandAllowedOptions[]];
  permissionLevel?: Exclude<PermissionLevel, PermissionLevel.None>;
  execute(interaction: ChatInputCommandInteraction<"cached">): Awaitable<void>;
}
