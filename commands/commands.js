const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("commands")
    .setDescription("Replies with a list of available commands."),
  async execute(interaction) {
    const client = require("../index.js");
    const commands = [
      {
        name: "ping",
        description: "Replies with Pong!",
      },

      {
        name: "help",
        description: "Replies with the help menu.",
      },

      {
        name: "commands",
        description: "Replies with a list of available commands.",
      },

      {
        name: "ban",
        description: "Ban a user from using the modmail system.",
      },

      {
        name: "unban",
        description: "Unban a user from using the modmail system.",
      },

      {
        name: "setup",
        description: "Setup the mail caterogy system.",
      },
    ];

    const totalCommands = [];

    commands.forEach((cmd) => {
      let arrayOfCommands = new Object();

      arrayOfCommands = {
        name: "/" + cmd.name,
        value: cmd.description,
      };

      totalCommands.push(arrayOfCommands);
    });

    return interaction
      .reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: client.user.tag,
              iconURL: client.user.displayAvatarURL({
                dynamic: true,
              }),
            })
            .setTitle("List of available commands:")
            .addFields(totalCommands),
        ],
      })
      .catch(() => {});
  },
};
