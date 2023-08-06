const { EmbedBuilder } = require("discord.js");
const { eventshandler, db } = require("..");
const config = require("../config");

module.exports = new eventshandler.event({
    event: 'interactionCreate',
    run: async (client, interaction) => {

        if (!interaction.isButton()) return;

        switch (interaction.customId) {
            case 'close': {
                const guild = client.guilds.cache.get(config.modmail.guildId);
                const category = guild.channels.cache.find((v) => v.id === config.modmail.categoryId || v.name === 'ModMail');

                if (interaction.channel.parentId !== category.id) return;

                await interaction.reply({
                    content: 'Please wait...',
                    ephemeral: true
                });

                const data = db.mails.findOne((v) => v.channelId === interaction.channelId);

                await interaction.channel.delete();

                const user = client.users.cache.get(data?.userId);

                if (!user) return;

                await user.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Your mail has been closed.')
                            .setDescription(`**${interaction.user.displayName}** has closed your mail since it's marked as completed. Thank you for using our support!`)
                            .setFooter({
                                text: `${interaction.guild.name} devs`
                            })
                    ]
                }).catch(null);

                break;
            };
        };

    }
});