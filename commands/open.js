const { SlashCommandBuilder, Client, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require("discord.js");
const { time } = require("aqify.js");
const { db } = require('../index');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('open')
        .setDescription('Open a mail with a user.')
        .addUserOption((o) =>
            o.setName('user')
                .setDescription('The user to contact with.')
                .setRequired(true)
        ),
    /**
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction, config) => {

        const user = interaction.options.getUser('user', true);

        const guild = client.guilds.cache.get(config.modmail.guildId);

        if (!guild) {
            console.error('[CRASH] The provided guild is invalid.'.red);

            return process.exit();
        };

        const category = guild.channels.cache.find((cat) => cat.id === config.modmail.categoryId || cat.name === "ModMail");

        const channel = guild.channels.cache.find((x) => x.name === user.id && x.parentId === category.id);

        if (channel) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`There is a mail already created for/by that user.`)
                        .setColor('Red')
                ],
                ephemeral: true
            });

            return;
        };

        if (db.has(user.id)) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`That user is banned from using the modmail with the reason below:\n> ${db.get(message.author.id)}`)
                        .setColor('Red')
                ],
                ephemeral: true
            });

            return;
        };

        if (!category) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`The modmail system is not ready yet.`)
                        .setColor('Red')
                ],
                ephemeral: true
            });

            return;
        };

        await interaction.deferReply({ ephemeral: true });

        const mailchannel = await guild.channels.create({
            name: user.id,
            type: ChannelType.GuildText,
            parent: category,
            topic: `A Mail channel created by ${interaction.user.tag} to contact with ${user.tag} since ${new Date().toLocaleString()}.`
        }).catch(() => { });

        await user.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle('New mail')
                    .setDescription('A staff member wants to contact with you, you can start to communicate by sending messages here.')
                    .setColor('Yellow')
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('close_dm')
                            .setLabel('Close')
                            .setStyle(ButtonStyle.Secondary),
                    )
            ]
        });

        await mailchannel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("New mail")
                    .addFields(
                        { name: "User", value: `${interaction.user.tag} (\`${interaction.user.id}\`)` },
                        { name: "Target", value: `${user.tag} (\`${user.id}\`)` },
                        { name: "Created on", value: `${time(Date.now())} (${time(Date.now(), 'R')})` },
                    )
                    .setColor('Blue')
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('close_channel')
                            .setLabel('Close')
                            .setStyle(ButtonStyle.Secondary),
                    )
            ]
        }).then(async (sent) => {
            sent.pin('New mail was created').catch(() => { });
        });

        await interaction.followUp({
            content: `Here is your new mail: <#${mailchannel.id}>`
        });

    }
};