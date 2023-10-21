const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { commandshandler, db } = require("..");

module.exports = new commandshandler.command({
    type: 1,
    structure: new SlashCommandBuilder()
        .setName('modmail')
        .setDescription('ModMail manager.')
        .addSubcommand((sub) =>
            sub.setName('ban')
                .setDescription('Ban a user from using ModMail.')
                .addUserOption((opt) =>
                    opt.setName('user')
                        .setDescription('The user to ban.')
                        .setRequired(true)
                )
                .addStringOption((opt) =>
                    opt.setName('reason')
                        .setDescription('The reason of the ban.')
                        .setRequired(false)
                )
        )
        .addSubcommand((sub) =>
            sub.setName('unban')
                .setDescription('Unban a user from using ModMail.')
                .addUserOption((opt) =>
                    opt.setName('user')
                        .setDescription('The user to unban.')
                        .setRequired(true)
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    run: async (client, interaction) => {

        const { options } = interaction;

        switch (options.getSubcommand()) {
            case 'ban': {
                const user = options.getUser('user', true);
                const reason = options.getString('reason') || 'No reason was provided';

                const count = await db.select('bans', { userId: user.id });

                if (count.length > 0) {
                    await interaction.reply({
                        content: 'That user is banned already.',
                        ephemeral: true
                    });

                    return;
                };

                await db.insert('bans', {
                    userId: user.id,
                    guildId: interaction.guild.id,
                    reason: reason
                });

                await interaction.reply({
                    content: 'That user has been banned successfully.',
                    ephemeral: true
                });

                break;
            };

            case 'unban': {
                const user = options.getUser('user', true);

                const count = await db.select('bans', { userId: user.id });

                if (count.length <= 0) {
                    await interaction.reply({
                        content: 'That user is not banned already.',
                        ephemeral: true
                    });

                    return;
                };

                await db.delete('bans', { userId: user.id });

                await interaction.reply({
                    content: 'That user has been unbanned successfully.',
                    ephemeral: true
                });

                break;
            };
        };

    }
});