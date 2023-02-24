const { QuickDB } = require('quick.db');
const colors = require('colors');
const ms = require('ms');
const db = new QuickDB();
const config = require("./config.js");
const projectVersion = require('./package.json').version || "Unknown";
// const Enmap = require('enmap');
const {
  Client,
  GatewayIntentBits,
  PermissionFlagsBits,
  PermissionsBitField,
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
  InteractionType,
  bold,
  italic,
  codeBlock
} = require('discord.js');

// Creating a new client:
const client = new Client(
  {
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildIntegrations,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildMessageTyping,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.DirectMessageReactions,
      GatewayIntentBits.DirectMessageTyping,
      GatewayIntentBits.MessageContent,
    ],
    partials: [
      Partials.Message,
      Partials.Channel,
      Partials.GuildMember,
      Partials.GuildScheduledEvent,
      Partials.User
    ],
    presence: {
      activities: [{
        name: "DM Me for ModMail!",
        type: 1,
        url: "https://twitch.tv/discord"
      }]
    },
    shards: "auto"
  }
);

// Host the bot:
require('http')
  .createServer((req, res) => res.end('Ready.'))
  .listen(3030);

// Cool message logger:
const asciiText = `
███╗░░░███╗░█████╗░██████╗░███╗░░░███╗░█████╗░██╗██╗░░░░░
████╗░████║██╔══██╗██╔══██╗████╗░████║██╔══██╗██║██║░░░░░
██╔████╔██║██║░░██║██║░░██║██╔████╔██║███████║██║██║░░░░░
██║╚██╔╝██║██║░░██║██║░░██║██║╚██╔╝██║██╔══██║██║██║░░░░░
██║░╚═╝░██║╚█████╔╝██████╔╝██║░╚═╝░██║██║░░██║██║███████╗
╚═╝░░░░░╚═╝░╚════╝░╚═════╝░╚═╝░░░░░╚═╝╚═╝░░╚═╝╚═╝╚══════╝
`.underline.blue + `Version ${projectVersion} By T.F.A#7524.
`.underline.cyan;

console.log(asciiText);

// Variables checker:
const AuthentificationToken = config.Client.TOKEN || process.env.TOKEN;

if (!AuthentificationToken) {
  console.error("[ERROR] You need to provide your bot token!".red);
  return process.exit();
}

if (!config.Client.ID) {
  console.error("[ERROR] You need to provide your bot ID!".red);
  return process.exit();
}

if (!config.Handler.GUILD_ID) {
  console.error("[ERROR] You need to provide your server ID!".red);
  return process.exit();
}

if (!config.Handler.CATEGORY_ID) {
  console.warn("[WARN] You should to provide the modmail category ID!".red);
  console.warn("[WARN] Use the slash command /setup to fix this problem without using the config.js file.".red);
}

if (!config.Modmail.INTERACTION_COMMAND_PERMISSIONS) {
  console.error("[ERROR] You need to provide at least one permission for the slash commands handler!".red);
  return process.exit();
};

// Creating some slash commands:
const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },

  {
    name: 'help',
    description: 'Replies with the help menu.'
  },

  {
    name: 'commands',
    description: 'Replies with a list of available commands.'
  },

  {
    name: 'ban',
    description: 'Ban a user from using the modmail system.',
    options: [
      {
        name: "user",
        description: "The user to ban.",
        type: 6, // Guild "USER" type.
        required: true
      },
      {
        name: "reason",
        description: "The reason for the ban.",
        type: 3 // "STRING" type.
      }
    ]
  },

  {
    name: 'unban',
    description: 'Unban a user from using the modmail system.',
    options: [
      {
        name: "user",
        description: "The user to unban.",
        type: 6, // Guild "USER" type.
        required: true
      }
    ]
  },

  {
    name: 'setup',
    description: 'Setup the mail caterogy system.'
  }
];

// Slash commands handler:
const rest = new REST({ version: '10' })
  .setToken(process.env.TOKEN || config.Client.TOKEN);

(async () => {
  try {
    console.log('[HANDLER] Started refreshing application (/) commands.'.brightYellow);

    await rest.put(
      Routes.applicationGuildCommands(config.Client.ID, config.Handler.GUILD_ID), { body: commands }
    );

    console.log('[HANDLER] Successfully reloaded application (/) commands.'.brightGreen);
  } catch (error) {
    console.error(error);
  }
})();

// Login to the bot:
client.login(AuthentificationToken)
  .catch(console.log);

// Client once it's ready:
client.once('ready', async () => {
  console.log(`[READY] ${client.user.tag} is up and ready to go.`.brightGreen);

  const guild = client.guilds.cache.get(config.Handler.GUILD_ID);

  if (!guild) {
    console.error('[CRASH] Guild is Invalid, or probably valid but I\'m not there.'.red);
    return process.exit();
  } else return;
});

// If there is an error, this handlers it.
process.on('unhandledRejection', (reason, promise) => {
  console.error("[ANTI-CRASH] An error has occured and been successfully handled: [unhandledRejection]".red);
  console.error(promise, reason);
});

process.on("uncaughtException", (err, origin) => {
  console.error("[ANTI-CRASH] An error has occured and been successfully handled: [uncaughtException]".red);
  console.error(err, origin);
});

process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.error("[ANTI-CRASH] An error has occured and been successfully handled: [uncaughtExceptionMonitor]".red);
  console.error(err, origin);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.commandName;

  // If command is "Ping":
  if (command === "ping") {
    interaction.reply(
      {
        content: `${client.ws.ping} ms!`
      }
    ).catch(() => { });

  } else if (command === "help") {

    return interaction.reply(
      {
        embeds: [
          new EmbedBuilder()
            .setAuthor(
              {
                name: client.user.tag,
                iconURL: client.user.displayAvatarURL(
                  {
                    dynamic: true
                  }
                )
              }
            )
            .setTitle("Help Menu:")
            .setDescription(`This is the help menu of the ${bold("ModMail Bot v" + projectVersion)}.`)
            .addFields(
              {
                name: "Setup the system:",
                value: "If you haven't provided the category ID in config.js file, use the slash command \`/setup\` instead."
              },
              {
                name: "Creating a new mail:",
                value: "To create a mail, DM anything to me and a Mail channel should be created automatically with your account ID. You can upload medias, they should work."
              },
              {
                name: "Closing a mail:",
                value: "If you want to close a Mail from DMs, click on the gray button \"Close\". Else, if you want to close a Mail in Text Channel, go to the Mail channel and click on the red button \"Close\". If it replies with \"This interaction failed\", use the slash command \`/close\` instead."
              },
              {
                name: "Ban/Unban a user from using the ModMail system.",
                value: "To ban a user, use the slash command \`/ban\`. Else, use the slash command \`/unban\`."
              },
              {
                name: "Am I allowed to share this code?",
                value: "Unfortunately, you are not allowed to reshare this code from T.F.A 7524. Please DM him and ask the permission to share, else you will get a copyright warning from him. Thanks :)"
              }
            )
            .setColor('Blue')
            .setFooter(
              {
                text: "Developed by: T.F.A#7524"
              }
            )
        ],
        ephemeral: true
      }
    ).catch(() => { });

    // If command is "Commands":
  } else if (command === "commands") {
    const totalCommands = [];

    commands.forEach((cmd) => {
      let arrayOfCommands = new Object();

      arrayOfCommands = {
        name: "/" + cmd.name,
        value: cmd.description
      };

      totalCommands.push(arrayOfCommands);
    });

    return interaction.reply(
      {
        embeds: [
          new EmbedBuilder()
            .setAuthor(
              {
                name: client.user.tag,
                iconURL: client.user.displayAvatarURL(
                  {
                    dynamic: true
                  }
                )
              }
            )
            .setTitle("List of available commands:")
            .addFields(totalCommands)
        ]
      }
    ).catch(() => { });

    // If command is "Ban":
  } else if (command === "ban") {
    const user = interaction.options.get('user').value;

    let reason = interaction.options.get('reason');
    let correctReason;

    if (!reason) correctReason = 'No reason was provided.';
    if (reason) correctReason = reason.value;

    if (!interaction.member.permissions.has(
      PermissionsBitField.resolve(config.Modmail.INTERACTION_COMMAND_PERMISSIONS || []))
    ) return interaction.reply(
      {
        embeds: [
          new EmbedBuilder()
            .setTitle('Missing Permissions:')
            .setDescription(`Sorry, I can't let you to use this command because you need ${bold(config.Modmail.INTERACTION_COMMAND_PERMISSIONS.join(', '))} permissions!`)
            .setColor('Red')
        ],
        ephemeral: true
      }
    );

    const bannedCheck = await db.get(`banned_guild_${config.Handler.GUILD_ID}_user_${user}`);

    if (bannedCheck) return interaction.reply(
      {
        embeds: [
          new EmbedBuilder()
            .setDescription(`That user is already banned.`)
            .setColor('Red')
        ],
        ephemeral: true
      }
    );

    await db.add(`banned_guild_${config.Handler.GUILD_ID}_user_${user}`, 1);
    await db.set(`banned_guild_${config.Handler.GUILD_ID}_user_${user}_reason`, correctReason);

    return interaction.reply(
      {
        embeds: [
          new EmbedBuilder()
            .setDescription(`That user has been successfully banned. Reason: ${bold(correctReason)}`)
            .setColor('Green')
        ],
        ephemeral: true
      }
    );

    // If command is "Unban":
  } else if (command === "unban") {
    const user = interaction.options.get('user').value;

    if (!interaction.member.permissions.has(
      PermissionsBitField.resolve(config.Modmail.INTERACTION_COMMAND_PERMISSIONS || []))
    ) return interaction.reply(
      {
        embeds: [
          new EmbedBuilder()
            .setTitle('Missing Permissions:')
            .setDescription(`Sorry, I can't let you to use this command because you need ${bold(config.Modmail.INTERACTION_COMMAND_PERMISSIONS.join(', '))} permissions!`)
            .setColor('Red')
        ],
        ephemeral: true
      }
    );

    const bannedCheck = await db.get(`banned_guild_${config.Handler.GUILD_ID}_user_${user}`);

    if (!bannedCheck) return interaction.reply(
      {
        embeds: [
          new EmbedBuilder()
            .setDescription(`That user is already unbanned.`)
            .setColor('Red')
        ],
        ephemeral: true
      }
    );

    await db.delete(`banned_guild_${config.Handler.GUILD_ID}_user_${user}`);
    await db.delete(`banned_guild_${config.Handler.GUILD_ID}_user_${user}_reason`);

    return interaction.reply(
      {
        embeds: [
          new EmbedBuilder()
            .setDescription(`That user has been successfully unbanned.`)
            .setColor('Green')
        ],
        ephemeral: true
      }
    );

    // If command is "Setup":
  } else if (command === "setup") {
    if (!interaction.member.permissions.has(
      PermissionsBitField.resolve(config.Modmail.INTERACTION_COMMAND_PERMISSIONS || []))
    ) return interaction.reply(
      {
        embeds: [
          new EmbedBuilder()
            .setTitle('Missing Permissions:')
            .setDescription(`Sorry, I can't let you to use this command because you need ${bold(config.Modmail.INTERACTION_COMMAND_PERMISSIONS.join(', '))} permissions!`)
            .setColor('Red')
        ],
        ephemeral: true
      }
    );

    const guild = client.guilds.cache.get(config.Handler.GUILD_ID);
    const category = guild.channels.cache.find(CAT => CAT.id === config.Handler.CATEGORY_ID || CAT.name === "ModMail");

    // If category is found:
    if (category) {
      interaction.reply(
        {
          embeds: [
            new EmbedBuilder()
              .setDescription(`There is already a modmail category named "ModMail". Replace the old category by a new category?\n\n:warning: If you click on **Replace**, all the mails text channels will be outside of category.`)
              .setColor('Red')
              .setFooter(
                {
                  text: "This request expires in 10 seconds, buttons won't respond to your actions after 10 seconds."
                }
              )
          ],
          components: [
            new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setCustomId('replace_button_channel_yes')
                  .setLabel('Replace')
                  .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                  .setCustomId('replace_button_channel_no')
                  .setLabel('No')
                  .setStyle(ButtonStyle.Danger),
              )
          ],
          ephemeral: true
        }
      ).catch(() => { });

      const collectorREPLACE_CHANNEL = interaction.channel.createMessageComponentCollector({
        time: 10000
      });

      collectorREPLACE_CHANNEL.on('collect', async (i) => {
        const ID = i.customId;

        if (ID == "replace_button_channel_yes") {
          i.update(
            {
              embeds: [
                new EmbedBuilder()
                  .setDescription(`Creating a new category... This may take a while!`)
                  .setColor('Yellow')
              ],
              components: [
                new ActionRowBuilder()
                  .addComponents(
                    new ButtonBuilder()
                      .setCustomId('replace_button_channel_yes')
                      .setLabel('Replace')
                      .setStyle(ButtonStyle.Success)
                      .setDisabled(true),
                    new ButtonBuilder()
                      .setCustomId('replace_button_channel_no')
                      .setLabel('No')
                      .setStyle(ButtonStyle.Danger)
                      .setDisabled(true),
                  )
              ]
            }
          ).catch(() => { });

          await category.delete()
            .catch(() => { });

          const channel = await guild.channels.create({
            name: "ModMail",
            type: ChannelType.GuildCategory,
            permissionOverwrites: [
              {
                id: guild.roles.everyone,
                deny: [PermissionFlagsBits.ViewChannel],
              },
            ]
          }).catch(console.log);

          let roles = [];

          if (config.Modmail.MAIL_MANAGER_ROLES) {
            config.Modmail.MAIL_MANAGER_ROLES.forEach(async (role) => {
              const roleFetched = guild.roles.cache.get(role);
              if (!roleFetched) return roles.push('[INVALID ROLE]');

              roles.push(roleFetched);

              await channel.permissionOverwrites.create(roleFetched.id, {
                SendMessages: true,
                ViewChannel: true,
                AttachFiles: true
              })
            });
          } else {
            roles.push("No roles were added to config.js file");
          }

          interaction.editReply(
            {
              embeds: [
                new EmbedBuilder()
                  .setDescription(`Done, successfully created a mail category named **ModMail**.`)
                  .addFields(
                    { name: "Roles", value: roles.join(', ') + "." }
                  )
                  .setFooter(
                    {
                      text: "WARN: Please check the roles in the category channel, errors could happen in anytime."
                    }
                  )
                  .setColor('Green')
              ]
            }
          ).catch(() => { });

          return collectorREPLACE_CHANNEL.stop();
        } else if (ID == "replace_button_channel_no") {
          i.update(
            {
              embeds: [
                new EmbedBuilder()
                  .setDescription(`Cancelled.`)
                  .setFooter(
                    {
                      text: "You can now click on \"Dismiss message\" below this embed message."
                    }
                  )
                  .setColor('Green')
              ],
              components: [
                new ActionRowBuilder()
                  .addComponents(
                    new ButtonBuilder()
                      .setCustomId('replace_button_channel_yes')
                      .setLabel('Replace')
                      .setStyle(ButtonStyle.Success)
                      .setDisabled(true),
                    new ButtonBuilder()
                      .setCustomId('replace_button_channel_no')
                      .setLabel('No')
                      .setStyle(ButtonStyle.Danger)
                      .setDisabled(true),
                  )
              ],
            }
          ).catch(() => { });

          return collectorREPLACE_CHANNEL.stop();
        } else return;
      })

      // If category is not found:
    } else {
      interaction.reply(
        {
          embeds: [
            new EmbedBuilder()
              .setDescription(`Creating a new category... This may take a while!`)
              .setColor('Yellow')
          ]
        }
      ).catch(() => { });

      const channel = await guild.channels.create({
        name: "ModMail",
        type: ChannelType.GuildCategory,
        permissionOverwrites: [
          {
            id: guild.roles.everyone,
            deny: [PermissionFlagsBits.ViewChannel],
          },
        ]
      }).catch(console.log);

      let roles = [];

      if (config.Modmail.MAIL_MANAGER_ROLES) {
        config.Modmail.MAIL_MANAGER_ROLES.forEach(async (role) => {
          const roleFetched = guild.roles.cache.get(role);
          if (!roleFetched) return roles.push('[INVALID ROLE]');

          roles.push(roleFetched);

          await channel.permissionOverwrites.create(roleFetched.id, {
            SendMessages: true,
            ViewChannel: true,
            AttachFiles: true
          })
        });
      } else {
        roles.push("No roles were added to config.js file.");
      }

      return interaction.editReply(
        {
          embeds: [
            new EmbedBuilder()
              .setDescription(`Done, successfully created a mail category named **ModMail**.`)
              .addFields(
                { name: "Roles", value: roles.join(', ') + "." }
              )
              .setFooter(
                {
                  text: "WARN: Please check the roles in the category channel, errors could happen in anytime."
                }
              )
              .setColor('Green')
          ]
        }
      ).catch(() => { });
    }

  } else return;
});

// ModMail System:
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const guild = client.guilds.cache.get(config.Handler.GUILD_ID);

  if (!guild) {
    console.error('[CRASH] Guild is not valid.'.red);
    return process.exit();
  }

  const category = guild.channels.cache.find(CAT => CAT.id === config.Handler.CATEGORY_ID || CAT.name === "ModMail");

  const channel = guild.channels.cache.find(
    x => x.name === message.author.id && x.parentId === category.id
  );

  const bannedUserCheck = await db.get(`banned_guild_${config.Handler.GUILD_ID}_user_${message.author.id}`);

  // If the message in a DM channel:
  if (message.channel.type == ChannelType.DM) {
    if (bannedUserCheck) {
      const reason = await db.get(`banned_guild_${config.Handler.GUILD_ID}_user_${message.author.id}_reason`);

      return message.reply(
        {
          embeds: [
            new EmbedBuilder()
              .setTitle("Mail Creation Failed:")
              .setDescription(`Sorry, we couldn\'t create a mail for you because you are ${bold('banned')} from using the modmail system!`)
              .addFields(
                { name: 'Reason of the ban', value: italic(reason) }
              )
          ]
        }
      );
    };

    if (!category) return message.reply(
      {
        embeds: [
          new EmbedBuilder()
            .setDescription("The system is not ready yet.")
            .setColor("Red")
        ]
      }
    );

    // The Modmail system:
    if (!channel) {
      let embedDM = new EmbedBuilder()
        .setTitle("Mail Creation:")
        .setDescription(`Your mail has been successfully created with these details below:`)
        .addFields(
          { name: "Message", value: `${message.content || italic("(No message was sent, probably a media/embed message was sent, or an error)")}` }
        )
        .setColor('Green')
        .setFooter(
          {
            text: "You can click on \"Close\" button to close this mail."
          }
        )

      if (message.attachments.size) {
        embedDM.setImage(message.attachments.map(img => img)[0].proxyURL);
        embedDM.addFields(
          { name: "Media(s)", value: italic("(Below this message line)") }
        )
      };
      
      message.reply(
        {
          embeds: [
            embedDM
          ],
          components: [
            new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setCustomId('close_button_created_mail_dm')
                  .setLabel('Close')
                  .setStyle(ButtonStyle.Secondary),
              )
          ]
        }
      );

      const channel = await guild.channels.create({
        name: message.author.id,
        type: ChannelType.GuildText,
        parent: category,
        topic: `A Mail channel created by ${message.author.tag} for requesting help or something else.`
      }).catch(console.log);

      let embed = new EmbedBuilder()
        .setTitle("New Mail Created:")
        .addFields(
          { name: "User", value: `${message.author.tag} (\`${message.author.id}\`)` },
          { name: "Message", value: `${message.content.substr(0, 4096) || italic("(No message was sent, probably a media/embed message was sent, or an error)")}` },
          { name: "Created on", value: `${new Date().toLocaleString()}` },
        )
        .setColor('Blue')

      if (message.attachments.size) {
        embed.setImage(message.attachments.map(img => img)[0].proxyURL);
        embed.addFields(
          { name: "Media(s)", value: italic("(Below this message line)") }
        )
      };

      const ROLES_TO_MENTION = [];
      config.Modmail.MAIL_MANAGER_ROLES.forEach((role) => {
        if (!config.Modmail.MAIL_MANAGER_ROLES || !role) return ROLES_TO_MENTION.push('[ERROR: No roles were provided]')
        if (config.Modmail.MENTION_MANAGER_ROLES_WHEN_NEW_MAIL_CREATED == false) return;

        const ROLE = guild.roles.cache.get(role);
        if (!ROLE) return;
        ROLES_TO_MENTION.push(ROLE);
      });

      return channel.send(
        {
          content: config.Modmail.MENTION_MANAGER_ROLES_WHEN_NEW_MAIL_CREATED ? ROLES_TO_MENTION.join(', ') : "** **",
          embeds: [
            embed
          ],
          components: [
            new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setCustomId('close_button_created_mail_channel')
                  .setLabel('Close')
                  .setStyle(ButtonStyle.Danger),
              )
          ]
        }
      ).then(async (sent) => {
        sent.pin()
          .catch(() => { });
      });

    } else {
      let embed = new EmbedBuilder()
        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setDescription(message.content.substr(0, 4096) || italic("(No message was sent, probably a media/embed message was sent, or an error)"))
        .setColor('Green');

      if (message.attachments.size) embed.setImage(message.attachments.map(img => img)[0].proxyURL);

      message.react("📨")
        .catch(() => { });

      return channel.send(
        {
          embeds: [
            embed
          ]
        }
      );
    }

    // If the message is in the modmail category:
  } else if (message.channel.type === ChannelType.GuildText) {
    if (!category) return;

    if (message.channel.parentId === category.id) {
      const requestedUserMail = guild.members.cache.get(message.channel.name);

      let embed = new EmbedBuilder()
        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setDescription(message.content.substr(0, 4096) || italic("(No message was sent, probably a media/embed message was sent, or an error)"))
        .setColor('Red');

      if (message.attachments.size) embed.setImage(message.attachments.map(img => img)[0].proxyURL);

      message.react("📨")
        .catch(() => { });

      return requestedUserMail.send(
        {
          embeds: [
            embed
          ]
        }
      ).catch(() => { });
    } else return;
  }
});

// Buttons & Modals Handler:
client.on('interactionCreate', async (interaction) => {

  // BUTTONS:
  if (interaction.isButton()) {
    const ID = interaction.customId;

    // Close Button in Text channels:
    if (ID == "close_button_created_mail_channel") {
      const modal = new ModalBuilder()
        .setCustomId('modal_close')
        .setTitle('Closing Mail:');

      const REASON_TEXT_INPUT = new TextInputBuilder()
        .setCustomId('modal_close_variable_reason')
        .setLabel("Reason of closing the mail.")
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

      const ACTION_ROW = new ActionRowBuilder()
        .addComponents(REASON_TEXT_INPUT);

      modal.addComponents(ACTION_ROW);

      await interaction.showModal(modal)
        .catch(() => { });

      // Close Button in DMs:
    } else if (ID == "close_button_created_mail_dm") {
      const guild = client.guilds.cache.get(config.Handler.GUILD_ID);

      const category = guild.channels.cache.find(CAT => CAT.id === config.Handler.CATEGORY_ID || CAT.name === "ModMail");

      const channelRECHECK = guild.channels.cache.find(
        x => x.name === interaction.user.id && x.parentId === category.id
      );

      if (!channelRECHECK) return interaction.reply(
        {
          embeds: [
            new EmbedBuilder()
              .setDescription(`Already closed by a staff member or by you.`)
              .setColor('Yellow')
          ],
          ephemeral: true
        }
      );

      await channelRECHECK.delete()
        .catch(() => { })
        .then(async (ch) => {
          if (!ch) return; // THIS IS 101% IMPORTANT. IF YOU REMOVE THIS LINE, THE "Mail Closed" EMBED WILL DUPLICATES IN USERS DMS. (1, and then 2, 3, 4, 5 until Infinity)

          return interaction.reply(
            {
              embeds: [
                new EmbedBuilder()
                  .setTitle('Mail Closed:')
                  .setDescription(`Your mail has been successfully closed.`)
                  .setColor('Green')
              ]
            }
          ).catch(() => { });
        });
    } else return;

    // MODALS:
  } else if (interaction.type === InteractionType.ModalSubmit) {
    const ID = interaction.customId;

    if (ID == "modal_close") {
      const guild = client.guilds.cache.get(config.Handler.GUILD_ID);

      const requestedUserMail = guild.members.cache.get(interaction.channel.name);

      let reason = interaction.fields.getTextInputValue('modal_close_variable_reason');
      if (!reason) reason = "No reason was provided.";

      interaction.reply(
        {
          content: "Closing..."
        }
      ).catch(() => { });

      return interaction.channel.delete()
        .catch(() => { })
        .then(async (ch) => {
          if (!ch) return; // THIS IS 101% IMPORTANT. IF YOU REMOVE THIS LINE, THE "Mail Closed" EMBED WILL DUPLICATES IN USERS DMS. (1, and then 2, 3, 4, 5 until Infinity)

          return await requestedUserMail.send(
            {
              embeds: [
                new EmbedBuilder()
                  .setTitle('Mail Closed:')
                  .setDescription(`Your mail has been successfully closed.`)
                  .addFields(
                    { name: "Reason", value: `${italic(reason)}` }
                  )
                  .setColor('Green')
              ]
            }
          ).catch(() => { });
        });
    } else return;
  } else return;
});

/*
* DiscordJS-V14-ModMail-Bot
* Yet Another Discord ModMail Bot made with discord.js v14, built on Repl.it and coded by T.F.A#7524.
* Developer: T.F.A#7524
* Support server: dsc.gg/codingdevelopment
* Please DO NOT remove these lines, these are the credits to the developer.
* Sharing this project without giving credits to me (T.F.A) ends in a Copyright warning. (©)
*/
