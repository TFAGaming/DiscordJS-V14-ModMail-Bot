const { SlashCommandBuilder, Client, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Show the help guide.'),
    
    /**
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {

        const totalCommands = [];

        client.commands.forEach((cmd) => {
            totalCommands.push(`\`/${cmd.data.name}\`: ${cmd.data.description}`);
        });

        const commandList = totalCommands.length > 0 ? totalCommands.join('\n') : 'No commands available';

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
                    .setTitle("List of available commands")
                    .setDescription(commandList)
                    .setColor('Blurple')
            ]
        }).catch((error) => {
            console.error('Failed to send help message:', error);
        });

    }
};
