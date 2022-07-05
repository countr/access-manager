import type { ApplicationCommandAutocompleteOption, ApplicationCommandChannelOptionData, ApplicationCommandChoicesData, ApplicationCommandNonOptionsData, ApplicationCommandNumericOptionData, Awaitable, ChatInputCommandInteraction } from "discord.js";
import type { AccessDocument } from "../../database/models/Access";
import type { PermissionLevel } from "../../constants/permissions";

type ApplicationCommandAllowedOptions =
  | ApplicationCommandAutocompleteOption
  | ApplicationCommandChannelOptionData
  | ApplicationCommandChoicesData
  | ApplicationCommandNonOptionsData
  | ApplicationCommandNumericOptionData
;

export type ChatInputCommand = {
  description: string;
  options?: [ApplicationCommandAllowedOptions, ...ApplicationCommandAllowedOptions[]];
} & (
  | {
    permissionLevel: Omit<PermissionLevel, "None">;
    execute(interaction: ChatInputCommandInteraction<"cached">, document: AccessDocument, tokens: number): Awaitable<void>;
  }
  | {
    permissionLevel: PermissionLevel.None;
    execute(interaction: ChatInputCommandInteraction<"cached">, document: null, tokens: number): Awaitable<void>;
  }
);
