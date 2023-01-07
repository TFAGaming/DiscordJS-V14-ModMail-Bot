const { SlashCommandBuilder } = require("discord.js");
const client = require("../index.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    interaction
      .reply({
        content: `${client.ws.ping} ms!`,
      })
      .catch(() => {});
  },
};
