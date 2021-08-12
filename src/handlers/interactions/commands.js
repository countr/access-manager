const { CommandInteraction } = require("discord.js"), config = require("../../../config"), { getPermissionLevel, ladder } = require("../../constants/permissions"), permissions = require("../../commands/slash/_permissions.json");

module.exports = (interaction = new CommandInteraction) => {
  const
    command = interaction.client.guilds.cache.get(config.guild).commands.cache.find(c => c.name == interaction.commandName),
    permissionLevel = getPermissionLevel(interaction.member);
  
  if (permissionLevel < ladder[permissions[command.name] || "ALL"]) return interaction.reply({ content: "❌ You don't have access to do this.", ephemeral: true });

  const
    args = getSlashArgs(interaction.options.data),
    path = [
      command.name,
      ...(
        command.description == "Sub-command." ? [
          command.options.find(o => o.name == Object.keys(args)[0]).name,
          ...(
            command.options.find(o => o.name == Object.keys(args)[0]).description == "Sub-command." ? [
              command.options.find(o => o.name == Object.keys(args)[0]).options.find(o => o.name == Object.keys(Object.values(args)[0])[0]).name
            ] : []
          )
        ] : []
      )
    ],
    commandFile = require(`../../commands/slash/${path.join("/")}.js`);

  commandFile.execute(interaction, getActualSlashArgs(interaction.options.data), { permissionLevel });
};

function getSlashArgs(options) { // to get the path as well as the args
  const args = {};
  for (const o of options) args[o.name] = o.options ? getSlashArgs(o.options) : o.value;
  return args;
}

function getActualSlashArgs(options) { // sends through to the command files
  if (!options[0]) return {};
  if (options[0].options) return getActualSlashArgs(options[0].options);
  else return getSlashArgs(options);
}