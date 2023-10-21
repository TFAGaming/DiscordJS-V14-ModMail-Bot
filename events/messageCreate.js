const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, roleMention } = require("discord.js");
const { eventshandler, db, webhookClient } = require("..");
const config = require("../config");
const { time, permissionsCalculator } = require("../functions");

const set = new Set();

module.exports = new eventshandler.event({
    event: 'messageCreate',
    run: async (client, message) => {

        if (message.author.bot) return;

        const guild = client.guilds.cache.get(config.modmail.guildId);
        const category = guild.channels.cache.find((v) => v.id === config.modmail.categoryId || v.name === 'ModMail');

        await guild.members.fetch();

        if (message.guild) {
            if (message.channel.parentId !== category.id) return;

            const data = (await db.select('mails', { channelId: message.channelId }))[0];

            const user = guild.members.cache.get(data?.authorId);

            if (!user) {
                await message.reply({
                    content: 'The author of the mail was not found, you can delete this ticket.'
                });

                return;
            };

            const perms = permissionsCalculator(message.member);

            const embed = new EmbedBuilder()
                .setAuthor({
                    name: message.author.displayName + ` [${perms}]`,
                    iconURL: message.author.displayAvatarURL()
                })
                .setDescription(message.content?.length > 0 ? message.content : null)
                .setColor('Blurple');

            if (message.attachments?.size) {
                const imageAttachment = message.attachments.find(attachment => attachment.contentType.startsWith('image/'));

                if (imageAttachment) {
                    embed.setImage(imageAttachment.proxyURL);
                } else {
                    message.attachments.forEach(attachment => {
                        user.send({ files: [attachment] });
                    });
                };
            };

            await user.send({
                embeds: [
                    embed
                ]
            }).catch(async () => {
                await message.reply({
                    content: 'The user has their DMs closed, or they blocked me!'
                });
            });

            await message.react('📨').catch(null);
        } else {
            const bannedCheckr = (await db.select('bans', { userId: message.author.id }))[0];

            if (bannedCheckr) {
                await message.reply({
                    content: 'You are currently banned for using the ModMail system.\n\n**Reason**: ' + bannedCheckr?.reason || 'No reason was provided.'
                });

                return;
            };

            const data = (await db.select('mails', { authorId: message.author.id }))[0];

            const channel = guild.channels.cache.find((channel) => channel.id === data?.channelId);

            if (!channel) {
                if (set.has(message.author.id)) {
                    await message.reply({
                        content: 'There is a currently request waiting for your response, please wait until it expires.'
                    });

                    return;
                };

                const buttons = [
                    new ButtonBuilder()
                        .setCustomId('create')
                        .setLabel('Create')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('cancel')
                        .setLabel('Cancel')
                        .setStyle(ButtonStyle.Secondary)
                ];

                set.add(message.author.id);

                const sent = await message.reply({
                    content: `You\'re about to create a new mail with the details from the replied message, are you sure about that?\nYou have 15 seconds to select one of the buttons below. (${time(Date.now() + 15000, 'R')})`,
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                buttons
                            )
                    ]
                });

                const collector = message.channel.createMessageComponentCollector({
                    time: 15000,
                    filter: (i) => i.user.id === message.author.id
                });

                collector.on('collect', async (i) => {
                    collector.stop();

                    set.delete(message.author.id);

                    switch (i.customId) {
                        case 'create': {
                            const permissions = [
                                {
                                    id: guild.roles.everyone.id,
                                    deny: ['ViewChannel']
                                }
                            ];

                            for (const role of config.modmail.staffRoles) {
                                const fetched = guild.roles.cache.get(role);

                                if (fetched) permissions.push({
                                    id: role,
                                    allow: ['ViewChannel', 'SendMessages', 'AttachFiles']
                                });
                            };

                            const newchannel = await guild.channels.create({
                                name: message.author.displayName,
                                nsfw: false,
                                type: 0,
                                parent: category.id,
                                permissionOverwrites: permissions
                            });

                            await db.insert('mails', {
                                authorId: message.author.id,
                                channelId: newchannel.id,
                                guildId: guild.id,
                            });

                            await sent.edit({
                                content: null,
                                embeds: [
                                    new EmbedBuilder()
                                        .setTitle(`${guild.name} - ModMail`)
                                        .setDescription('Thank you for creating a new mail, a staff member should respond to your ticket any time soon!')
                                        .setFooter({
                                            text: '© T.F.A 7524, https://www.github.com/TFAGaming/DiscordJS-V14-ModMail-Bot'
                                        })
                                        .setColor('Blurple')
                                ],
                                components: []
                            });

                            await i.reply({
                                content: 'Your mail has been successfully created!',
                                ephemeral: true
                            });

                            const embed = new EmbedBuilder()
                                .setTitle(`New mail`)
                                .addFields(
                                    {
                                        name: `Author`,
                                        value: `${message.author.displayName} (\`${message.author.id}\`)`
                                    },
                                    {
                                        name: `Message`,
                                        value: `${message.content?.length > 0 ? message.content : '(None)'}`
                                    }
                                )
                                .setColor('Blurple');

                            if (message.attachments?.size) {
                                const imageAttachment = message.attachments.find(attachment => attachment.contentType.startsWith('image/'));
                                if (imageAttachment) {
                                    embed.setImage(imageAttachment.proxyURL);
                                } else {
                                    message.attachments.forEach(attachment => {
                                        newchannel.send({ files: [attachment] });
                                    });
                                };
                            };

                            await newchannel.send({
                                content: config.modmail.mentionStaffRolesOnNewMail ? config.modmail.staffRoles.map((v) => roleMention(v)).join(', ') : null,
                                embeds: [
                                    embed
                                ],
                                components: [
                                    new ActionRowBuilder()
                                        .addComponents(
                                            new ButtonBuilder()
                                                .setCustomId('close')
                                                .setLabel('Close mail')
                                                .setStyle(ButtonStyle.Primary)
                                        )
                                ]
                            }).then(async (sent) => await sent.pin());
                            
                            if (webhookClient === null) return;

                            await webhookClient.send({
                                embeds: [
                                    new EmbedBuilder()
                                        .setTitle('New mail created')
                                        .setDescription(`<@${message.author.id || '000000000000000000'}>'s mail has been created.\n\n**Executed by**: ${message.author.displayName} (${message.author.toString()})\n**Date**: ${time(Date.now(), 'f')} (${time(Date.now(), 'R')})`)
                                        .setFooter({ text: guild.name + '\'s  logging system' })
                                        .setColor('Green')
                                ]
                            });

                            break;
                        };

                        case 'cancel': {
                            await i.reply({
                                content: 'The request has been cancelled.',
                                ephemeral: true
                            });

                            await sent.edit({
                                components: [
                                    new ActionRowBuilder()
                                        .addComponents(
                                            buttons.map((v) =>
                                                v.setStyle(ButtonStyle.Secondary)
                                                    .setDisabled(true)
                                            )
                                        )
                                ]
                            });

                            break;
                        };
                    };
                });

                collector.on('end', async () => {
                    if (collector.endReason === 'time') {
                        set.delete(message.author.id);

                        await sent.edit({
                            components: [
                                new ActionRowBuilder()
                                    .addComponents(
                                        buttons.map((v) =>
                                            v.setStyle(ButtonStyle.Secondary)
                                                .setDisabled(true)
                                        )
                                    )
                            ]
                        });
                    };
                });

            } else {
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: message.author.displayName,
                        iconURL: message.author.displayAvatarURL()
                    })
                    .setDescription(message.content?.length > 0 ? message.content : null)
                    .setColor('Blurple');

                if (message.attachments?.size) {
                    const imageAttachment = message.attachments.find(attachment => attachment.contentType.startsWith('image/'));
                    if (imageAttachment) {
                        embed.setImage(imageAttachment.proxyURL);
                    } else {
                        message.attachments.forEach(attachment => {
                            channel.send({ files: [attachment] });
                        });
                    }
                }

                await channel.send({
                    embeds: [
                        embed
                    ]
                }).catch(null);

                await message.react('📨');
            };
        };

    }
});