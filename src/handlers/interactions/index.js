const { Client, Interaction } = require("discord.js"), commandHandler = require("./commands"), contextMenuHandler = require("./contextMenus"), fs = require("fs"), { join } = require("path"), permissions = {...require("../../commands/slash/_permissions.json"), ...require("../../commands/user/_permissions.json")}, { ladder } = require("../../constants/permissions"), config = require("../../../config");

module.exports = async (client = new Client) => {
  const guild = client.guilds.cache.get(config.guild);
  guild.commands.set([
    ...(await nestCommands("../../commands/slash")).map(c => { c.type = 1; return c; }), // slash commands has type 1
    ...(await nestCommands("../../commands/user")).map(c => { c.type = 2; delete c.description; return c; }) // user commands has type 2, and description is removed
  ].map(c => { c.defaultPermission = permissions[c.name] ? false : true; return c; })) // set default permission for all commands
    .then(commands => guild.commands.permissions.set({ fullPermissions: commands.map(({ name, id }) => ({ id, permissions: getPermissions(permissions[name]) })) })); // set permissions for all commands

  client.on("interactionCreate", async (interaction = new Interaction) => {
    if (interaction.member.partial) interaction.member = await interaction.member.fetch(); // fetch members if they're partial
    if (interaction.isCommand()) return commandHandler(interaction);
    if (interaction.isContextMenu()) return contextMenuHandler(interaction);
  });
};

function nestCommands(relativePath, layer = 0) {
  return new Promise(resolve => fs.readdir(join(__dirname, relativePath), async (err, files) => {
    if (err) return console.log(err);
    const arr = [];
    for (const file of files) {
      if (file.endsWith(".js")) {
        const { description = "No description", options = [] } = require(`${relativePath}/${file}`);
        arr.push({ name: file.split(".")[0], description, options, type: 1 });
      } else if (!file.includes(".")) {
        const options = await nestCommands(`${relativePath}/${file}`, layer + 1);
        arr.push({ name: file, description: "Sub-command.", options, type: 2 });
      }
    }
    if (layer == 0) arr.forEach(c => { delete c.type; });
    resolve(arr);
  }));
}

function getPermissions(permission = "ALL") {
  const ranking = ladder[permission] || 3, permissions = [];
  if (ranking != 0) {
    if (ranking <= 2) permissions.push({
      type: "USER",
      id: config.owner,
      permission: true
    });
    if (ranking <= 1) Object.keys(config.roles).forEach(role => permissions.push({
      type: "ROLE",
      id: role,
      permission: true
    }));
  }
  return permissions;
}

