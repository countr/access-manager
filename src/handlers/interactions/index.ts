import { readdir } from "fs/promises";
import { join } from "path";
import type { ApplicationCommandData, ApplicationCommandSubCommandData, ApplicationCommandSubGroupData, Client } from "discord.js";
import { ApplicationCommandOptionType, ApplicationCommandType, InteractionType } from "discord.js";
import type { ChatInputCommand } from "../../commands/chatInput";
import type { ContextMenuCommand } from "../../commands/menu";
import config from "../../config";
import chatInputCommandHandler from "./chatInputCommands";
import contextMenuCommandHandler from "./contextMenuCommands";

export default async function interactionsHandler(client: Client<true>): Promise<void> {
  await client.guilds.cache.get(config.guild)!.commands.set([
    ...await nestCommands("../../commands/chatInput", "CHAT_INPUT"),
    ...await nestCommands("../../commands/menu", "MENU"),
  ]);

  client.on("interactionCreate", interaction => {
    if (!interaction.inCachedGuild()) return;

    if (interaction.type === InteractionType.ApplicationCommand) {
      if (interaction.isChatInputCommand()) void chatInputCommandHandler(interaction);
      if (interaction.isContextMenuCommand()) void contextMenuCommandHandler(interaction);
    }
  });
}

async function nestCommands(relativePath: string, type: "CHAT_INPUT" | "MENU"): Promise<ApplicationCommandData[]> {
  const files = await readdir(join(__dirname, relativePath));
  const arr: ApplicationCommandData[] = [];
  for (const fileName of files.filter(file => !file.startsWith("_") && file !== "index.js")) {
    if (type === "MENU") {
      const { default: command } = await import(`${relativePath}/${fileName}`) as { default: ContextMenuCommand };
      arr.push({
        name: fileName.split(".")[0]!,
        type: command.type,
      });
    }

    if (type === "CHAT_INPUT") {
      if (fileName.includes(".")) {
        const { default: command } = await import(`${relativePath}/${fileName}`) as { default: ChatInputCommand };
        arr.push({
          name: fileName.split(".")[0]!,
          type: ApplicationCommandType.ChatInput,
          description: command.description,
          ...command.options && { options: command.options },
        });
      } else {
        const subCommands = await (async function nestSubCommands(relativeSubPath: string) {
          const subFiles = await readdir(join(__dirname, relativeSubPath));
          const subArr: Array<ApplicationCommandSubCommandData | ApplicationCommandSubGroupData> = [];
          for (const subFileName of subFiles.filter(file => !file.startsWith("_"))) {
            if (subFileName.includes(".")) {
              const { default: command } = await import(`${relativeSubPath}/${subFileName}`) as { default: ChatInputCommand };
              subArr.push({
                type: ApplicationCommandOptionType.Subcommand,
                name: subFileName.split(".")[0]!,
                description: command.description,
                options: command.options ?? [],
              });
            } else {
              subArr.push({
                type: ApplicationCommandOptionType.SubcommandGroup,
                name: subFileName,
                description: "Sub-command",
                options: await nestSubCommands(join(relativeSubPath, subFileName)) as never,
              });
            }
          }
          return subArr;
        })(`${relativePath}/${fileName}`);
        arr.push({
          name: fileName,
          type: ApplicationCommandType.ChatInput,
          description: "Sub-command",
          options: subCommands,
        });
      }
    }
  }

  return arr;
}
