const { SlashCommandBuilder } = require("discord.js");
const { commandshandler } = require("..");

module.exports = new commandshandler.command({
    type: 1,
    structure: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    run: async (client, interaction) => {

        await interaction.reply({
            content: `**Pong**! ${Math.round(client.ws.ping)}ms`
        });

    }
});