const { JSONSchemaDB } = require('@tfagaming/jsondb');
const { time, wait } = require('aqify.js');
const colors = require('colors');
const config = require("./config.js");
const projectVersion = require('./package.json').version || "v0.0.0";

const {
    Client,
    GatewayIntentBits,
    Partials,
    REST,
    Routes,
    ChannelType,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    Collection
} = require('discord.js');
const { readdirSync } = require('fs');

const client = new Client({
    intents: [
        Object.keys(GatewayIntentBits)
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.GuildMember,
        Partials.User
    ],
    presence: {
        activities: [{
            name: "DM me to create a mail!",
            type: 1,
            url: "https://twitch.tv/discord"
        }]
    },
    shards: "auto"
});

const db = {
    bans: new JSONSchemaDB('./JSON/bans.json', { autoIncrementId: true, uneditableId: true }),
    mails: new JSONSchemaDB('./JSON/mails.json', { autoIncrementId: true, uneditableId: true })
};

module.exports = { db };

console.log(`
███╗░░░███╗░█████╗░██████╗░███╗░░░███╗░█████╗░██╗██╗░░░░░
████╗░████║██╔══██╗██╔══██╗████╗░████║██╔══██╗██║██║░░░░░
██╔████╔██║██║░░██║██║░░██║██╔████╔██║███████║██║██║░░░░░
██║╚██╔╝██║██║░░██║██║░░██║██║╚██╔╝██║██╔══██║██║██║░░░░░
██║░╚═╝░██║╚█████╔╝██████╔╝██║░╚═╝░██║██║░░██║██║███████╗
╚═╝░░░░░╚═╝░╚════╝░╚═════╝░╚═╝░░░░░╚═╝╚═╝░░╚═╝╚═╝╚══════╝
`.underline.blue + `version ${projectVersion}, by T.F.A#7524.
`.underline.cyan);

require('http').createServer((_req, res) => res.end('The express site is ready.') && console.log('[EXPRESS] Express is ready!'.green)).listen(3030);

client.commands = new Collection();

client.login(config.client.token || process.env.CLIENT_TOKEN).catch((e) => {
    console.error('[ERROR] Unable to connect to the bot, this might be an invalid token or missing required intents!\n', e);
});

for (const file of readdirSync('./commands/').filter((f) => f.endsWith('.js'))) {
    const module = require('./commands/' + file);

    if (!module || !module.data || !module.run) continue;

    client.commands.set(module.data?.name, module);

    console.log(`[HANDLER] Loaded a new command: ${file}`.blue);
};

const rest = new REST({ version: '10' }).setToken(config.client.token || process.env.CLIENT_TOKEN);

(async () => {
    try {
        console.log('[HANDLER] Started refreshing application (/) commands.'.brightYellow);

        const commands = [];

        client.commands.forEach((module) => {
            commands.push(module.data);
        });

        await rest.put(Routes.applicationGuildCommands(config.client.id, config.modmail.guildId), { body: commands });

        console.log('[HANDLER] Successfully reloaded application (/) commands.'.brightGreen);
    } catch (e) {
        console.error(e);
    };
})();

client.once('ready', async () => {
    console.log(`[READY] ${client.user.tag} is up and ready to go!`.brightGreen);

    const guild = client.guilds.cache.get(config.modmail.guildId);

    if (!guild) {
        console.error('[ERROR] The provided guild is invalid, or probably valid but I\'m not there.'.red);

        return process.exit();
    };
});

client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        command.run(client, interaction, config);
    } catch (e) {
        console.error(`[ERROR] There is an error has been occured.`.red);
        console.log(e);
    };
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const guild = client.guilds.cache.get(config.modmail.guildId);
<<<<<<< HEAD
=======
    await guild.members.fetch();
    if (!guild) {
        console.error('[CRASH] The provided guild is invalid.'.red);

        return process.exit();
    };
>>>>>>> 228b30ed2adc50b268c49e470f1bcda5aecf6f8d

    const category = guild.channels.cache.find((cat) => cat.id === config.modmail.categoryId || cat.name === "ModMail");

    await guild.members.fetch();

    const channel = guild.channels.cache.find((x) => x.id === db.mails.findOne((v) => v.author === message.author.id)?.channelId && x.parentId === category.id);

    if (message.channel.type == ChannelType.DM) {
        const banCheck = db.bans.findOne((v) => v.userId === message.author.id);

        if (banCheck) {
            await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`You are banned from using the modmail with the reason below:\n> ${banCheck.reason}`)
                        .setFooter({
                            text: `Ban ID: ${banCheck.id}`
                        })
                        .setColor('Red')
                ],
                ephemeral: true
            });

            return;
        };

        if (!category) return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription("The system is not ready yet. Please contact the server administrators to fix this problem.")
                    .setColor("Red")
            ]
        });

        if (!channel) {
            const channel = await guild.channels.create({
                name: message.author.username,
                type: ChannelType.GuildText,
                parent: category,
                topic: `A mail channel created by ${message.author.tag}. ${time(Date.now(), 'D')} (${time(Date.now(), 'R')})`
            }).catch(() => { });

            db.mails.set({ author: message.author.id, channelId: channel.id });

            let embedDM = new EmbedBuilder()
                .setTitle("Mail created")
                .setDescription(`Your mail has been successfully created with these details below:`)
                .addFields(
                    { name: "Message", value: `${message.content.substring(0, 1000) || "[Probably a media/embed message was sent instead of a message]"}` }
                )
                .setColor('Green')
                .setFooter({ text: "Click on \"Close\" button to close this mail." })

            if (message.attachments.size) {
                embedDM.setImage(message.attachments.map(img => img)[0].proxyURL);
            };

            await message.reply({
                embeds: [
                    embedDM
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

            let embed = new EmbedBuilder()
                .setTitle("New mail")
                .addFields(
                    { name: "User", value: `${message.author.username} (\`${message.author.id}\`)` },
                    { name: "Message", value: `${message.content.substring(0, 1000) || "[Probably a media/embed message was sent instead of a message]"}` },
                    { name: "Created on", value: `${time(Date.now())} (${time(Date.now(), 'R')})` },
                )
                .setColor('Blue')

            if (message.attachments.size) {
                embed.setImage(message.attachments.map(img => img)[0].proxyURL);
            };

            const roles = [];

            if (config.modmail.staffRoles) {
                config.modmail.staffRoles.forEach((role) => {
                    const roleFetched = guild.roles.cache.get(role);
                    if (!roleFetched) return;

                    roles.push(roleFetched);
                });
            };

            await channel.send({
                content: config.modmail.mentionStaffRolesOnNewMail ? roles.map((r) => `<@&${r?.id}>`).join(', ') : undefined,
                embeds: [
                    embed
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

            if (message.attachments.size > 1) {
                await message.reply({
                    content: '⚠️ Unable to add more than one image in single embed, only the first one was added.'
                }).then(async (sent) => {
                    await wait(5000);

                    await sent.delete().catch(() => { });
                });
            };

        } else {
            let embed = new EmbedBuilder()
                .setAuthor({ name: `${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setDescription(message.content.substring(0, 4000) || null)
                .setColor('Green');

            if (message.attachments.size) embed.setImage(message.attachments.map(img => img)[0].proxyURL);

            await message.react("📨").catch(() => { });

            await channel.send({
                embeds: [
                    embed
                ]
            });

            if (message.attachments.size > 1) {
                await message.reply({
                    content: '⚠️ Unable to add more than one image in single embed, only the first one was added.'
                }).then(async (sent) => {
                    await wait(5000);

                    await sent.delete().catch(() => { });
                });
            };
        };

    } else if (message.channel.type === ChannelType.GuildText) {
        if (!category) return;
        if (message.channel.parentId !== category.id) return;

        const requestedUserMail = guild.members.cache.find((x) => x.user.id === db.mails.findOne((v) => v.channelId === message.channelId)?.author);

        let embed = new EmbedBuilder()
            .setAuthor({ name: `${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setDescription(message.content.substring(0, 4000) || null)
            .setColor('Blurple');

        if (message.attachments.size) embed.setImage(message.attachments.map(img => img)[0].proxyURL);

        if (!requestedUserMail) {
            await message.reply({
                content: '⚠️ The author of the mail was not found! You can close this mail.'
            });

            return;
        };

        await message.react("📨").catch(() => { });

        await requestedUserMail.send({
            embeds: [
                embed
            ]
        });

        if (message.attachments.size > 1) {
            await message.reply({
                content: '⚠️ Unable to add more than one image in single embed, only the first one was added.'
            }).then(async (sent) => {
                await wait(5000);

                await sent.delete().catch(() => { });
            });
        };
    }
});

client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton()) {
        const ID = interaction.customId;

        if (ID == "close_channel") {
            const modal = new ModalBuilder()
                .setCustomId('modal_close')
                .setTitle('Closing mail')
                .addComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId('modal_close_variable_reason')
                                .setLabel("Reason of closing the mail.")
                                .setStyle(TextInputStyle.Short)
                                .setRequired(false)
                        )
                );

            await interaction.showModal(modal).catch(() => { });
        };

        if (ID == "close_dm") {
            const guild = client.guilds.cache.get(config.modmail.guildId);
            const category = guild.channels.cache.find((cat) => cat.id === config.modmail.categoryId || cat.name === "ModMail");

            const channelRECHECK = guild.channels.cache.find(x => x.id === db.mails.findOne((v) => v.author === interaction.user.id)?.channelId && x.parentId === category.id);

            if (!channelRECHECK) {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(`Already closed by a staff member or by you.`)
                            .setColor('Yellow')
                    ],
                    ephemeral: true
                });

                return;
            };

            await channelRECHECK.delete()
                .catch(() => { })
                .then(async (ch) => {
                    if (!ch) return;

                    await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('Mail closed')
                                .setDescription(`Your mail has been successfully closed by you.`)
                                .setColor('Green')
                        ],
                    }).catch(() => { });
                });
        };

        return;
    };

    if (interaction.isModalSubmit()) {
        const ID = interaction.customId;

        if (ID == "modal_close") {
            const guild = client.guilds.cache.get(config.modmail.guildId);

            const requestedUserMail = guild.members.cache.find((x) => x.user.id === db.mails.findOne((v) => v.channelId === interaction.channelId)?.author);

            const reason = interaction.fields.getTextInputValue('modal_close_variable_reason') || "No reason was provided";

            await interaction.deferReply({ ephemeral: true });

            await wait(1250);

            db.mails.findOneAndDelete((v) => v.channelId === interaction.channelId);

            return interaction.channel.delete()
                .catch(() => { })
                .then(async (ch) => {
                    if (!ch) return;

                    if (!requestedUserMail) return;

                    await requestedUserMail.send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('Mail closed')
                                .setDescription(`Your mail has been closed by a staff.\n> ${reason}`)
                                .setColor('Blurple')
                        ]
                    }).catch(() => { });
                });
        } else return;
    } else return;
});

client.on('channelDelete', async (channel) => {
    if (channel.parentId === channel.guild.channels.cache.find((cat) => cat.id === config.modmail.categoryId || cat.name === "ModMail")?.id) {
        const author = client.users.cache.get(db.mails.findOne((v) => v.channelId === channel.id)?.author);

        db.mails.findOneAndDelete((v) => v.channelId === channel.id);

        if (author) {
            await wait(3000); // => We need the embedded message to be sent first.

            await author.send({
                content: '**Mail Deleted**: Your mail has been deleted, please do not said any message in case you want to create another mail.\nThank you for using our modmail system! - ' + channel.guild.name + ' devs.'
            });
        };
    };
});

process.on('unhandledRejection', (reason, promise) => {
    console.error("[ANTI-CRASH] An error has occured and been successfully handled: [unhandledRejection]".red);
    console.error(promise, reason);
});

process.on("uncaughtException", (err, origin) => {
    console.error("[ANTI-CRASH] An error has occured and been successfully handled: [uncaughtException]".red);
    console.error(err, origin);
});

/*
* DiscordJS-V14-ModMail-Bot v7
* Yet Another Discord ModMail Bot made with discord.js v14, built on VSCode and coded by T.F.A#7524.
* Developer: T.F.A#7524
* Support server: https://discord.gg/E6VFACWu5V
* Please DO NOT remove these lines, these are the credits to the developer.
* Sharing this project without giving credits to me (T.F.A) ends in a Copyright warning. (©)
*/
