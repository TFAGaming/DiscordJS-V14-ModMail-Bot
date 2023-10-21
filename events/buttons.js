const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { eventshandler, db, webhookClient } = require("..");
const config = require("../config");
const { time } = require("../functions");

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
                
                // This will remove the first messages when the mail is created, do not touch this to avoid future errors.
                transcriptMessages.shift();
                transcriptMessages.shift();

                const data = (await db.select('mails', { channelId: interaction.channelId }))[0];

                await interaction.channel.delete();

                const user = client.users.cache.get(data?.authorId);

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

                if (!webhookClient) break;

                await webhookClient.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Mail closed')
                            .setDescription(`<@${data?.authorId || '000000000000000000'}>'s mail has been closed by a staff.\n\n**Executed by**: ${interaction.user.displayName} (${interaction.user.toString()})\n**Date**: ${time(Date.now(), 'f')} (${time(Date.now(), 'R')})`)
                            .setFooter({ text: interaction.guild.name + '\'s  logging system' })
                            .setColor('Red')
                    ]
                });

                break;
            };
        };

    }
});