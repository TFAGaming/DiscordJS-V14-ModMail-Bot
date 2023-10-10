const { EmbedBuilder, AttachmentBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder} = require("discord.js");
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

                const transcriptMessages = [];

                const messages = await interaction.channel.messages.fetch();

                for (const message of messages.values()) {
                    if (message.embeds && message.author.id === client.user.id) {
                        transcriptMessages.push(`[${new Date(message.createdTimestamp).toLocaleString()}] ${message.embeds[0]?.author?.name}: ${(message.embeds[0]?.description || message.embeds[0]?.image?.proxyURL || '[Error: Unable to fetch message content]')} ${message.attachments?.size > 0 ? message.attachments.map((v) => v.proxyURL).join(' ') : ''}`);
                    } else if ((message.content || message.attachments?.size) && message.author.bot === false) {
                        transcriptMessages.push(`[${new Date(message.createdTimestamp).toLocaleString()}] ${message.author.displayName}: ${message.content} ${message.attachments?.size > 0 ? message.attachments.map((v) => v.proxyURL).join(' ') : ''}`);
                    } else continue;
                };

                transcriptMessages.reverse();
                
                // This will remove the first messages when the mail is created. Do not touch this to avoid errors.
                transcriptMessages.shift();
                transcriptMessages.shift();

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

                await user.send({
                    content: 'Mail messages history:',
                    files: [
                        new AttachmentBuilder(
                            Buffer.from(transcriptMessages.join('\n'), 'utf-8'), { name: 'history.txt' }
                        )
                    ]
                }).catch(null);

                const review = new StringSelectMenuBuilder()
                .setCustomId('review')
                .setPlaceholder('Please rout our support!')
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel('⭐')
                        .setValue('1')
                        .setDescription('1 Star'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('⭐⭐')
                        .setValue('2')
                        .setDescription('2 Stars'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('⭐⭐⭐')
                        .setValue('3')
                        .setDescription('3 Stars'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('⭐⭐⭐⭐')
                        .setValue('4')
                        .setDescription('4 Stars'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('⭐⭐⭐⭐⭐')
                        .setValue('5')
                        .setDescription('5 Stars')
                );

                const row = new ActionRowBuilder()
                    .addComponents(review);


                break;
            };
        };

    }
});