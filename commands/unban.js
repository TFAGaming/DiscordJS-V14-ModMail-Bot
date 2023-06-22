const { SlashCommandBuilder, Client, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { db } = require('../index');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a user from using the modmail system.')
        .addUserOption((o) =>
            o.setName('user')
                .setDescription('The user to unban.')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    /**
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {

        const user = interaction.options.getUser('user', true);

        if (!db.has(user.id)) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`That user is already unbanned.`)
                        .setColor('Red')
                ],
                ephemeral: true
            });

            return;
        };

        db.delete(user.id);

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`That user has been successfully unbanned.`)
                    .setColor('Green')
            ],
            ephemeral: true
        });

    }
};