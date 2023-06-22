const { SlashCommandBuilder, Client, ChatInputCommandInteraction, PermissionFlagsBits, ChannelType } = require("discord.js");
const { ButtonsConfirmBuilder, SendMethod, time } = require('aqify.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Setup the modmail system.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction, config) => {

        const guild = client.guilds.cache.get(config.modmail.guildId);
        const category = guild.channels.cache.find((cat) => cat.id === config.modmail.categoryId || cat.name === "ModMail");

        if (category) {
            const confirm = new ButtonsConfirmBuilder(interaction, {
                time: 15000,
                on: {
                    yes: async (i) => {
                        await i.deferReply({ ephemeral: true });

                        await category.delete().catch(() => { });

                        const permissions = [
                            {
                                id: guild.roles.everyone,
                                deny: [PermissionFlagsBits.ViewChannel],
                            }
                        ];

                        if (config.modmail.staffRoles) {
                            config.modmail.staffRoles.forEach((role) => {
                                const roleFetched = guild.roles.cache.get(role);
                                if (!roleFetched) return;

                                permissions.push({
                                    id: roleFetched.id,
                                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AddReactions],
                                });
                            });
                        };

                        const channel = await guild.channels.create({
                            name: "ModMail",
                            type: ChannelType.GuildCategory,
                            permissionOverwrites: permissions
                        }).catch(() => { });

                        await i.followUp({
                            content: `Successfully created a new category for the modmail system!\n> Roles permissions overwrites: ${config.modmail.staffRoles?.length > 0 ? config.modmail.staffRoles.map((r) => `<@&${r}>`).join(', ') : '[No roles]'}\n> Permissions: **Send Messages**, **View Channel**, **Attach Files**.`,
                            ephemeral: true
                        }).catch(() => { });
                    },
                    no: async (i) => {
                        await i.reply({
                            content: 'Cancelled.',
                            ephemeral: true
                        });
                    }
                }
            });

            await confirm.send(SendMethod.Reply, {
                home: {
                    content: `There is a category channel already exists, are you sure that you want to replace it?\nThis request expires in: ${time(Date.now() + 15000, 'R')}.`
                },
                onEnd: {
                    content: 'Ended.'
                },
                onNotAuthor: (i) => {
                    i.reply({ content: 'You are not the author.' });
                },
                disableButtonsOnEnd: true
            });

            return;
        } else {
            await interaction.deferReply();

            const permissions = [
                {
                    id: guild.roles.everyone,
                    deny: [PermissionFlagsBits.ViewChannel],
                }
            ];

            if (config.modmail.staffRoles) {
                config.modmail.staffRoles.forEach((role) => {
                    const roleFetched = guild.roles.cache.get(role);
                    if (!roleFetched) return;

                    permissions.push({
                        id: roleFetched.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AddReactions],
                    });
                });
            };

            const channel = await guild.channels.create({
                name: "ModMail",
                type: ChannelType.GuildCategory,
                permissionOverwrites: permissions
            }).catch(() => { });

            await interaction.followUp({
                content: `Successfully created a new category for the modmail system!\n> Roles permissions overwrites: ${config.modmail.staffRoles?.length > 0 ? config.modmail.staffRoles.map((r) => `<@&${r}>`).join(', ') : '[No roles]'}\n> Permissions: **Send Messages**, **View Channel**, **Attach Files**.`,
                ephemeral: true
            }).catch(() => { });

            return;
        };

    }
};