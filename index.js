const { QuickDB } = require('quick.db');
const colors = require('colors');
const ms = require('ms');
const db = new QuickDB();
const config = require("./config.js");
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
  bold,
  italic
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
    }
  }
);

// Host the bot:
require('http')
  .createServer((req, res) => res.end('Ready.'))
  .listen(3030);

// Cool message logger: (DO NOT REMOVE T.F.A#7524, YOU'VE BEEN WARNED.)
const asciiText = `
███╗░░░███╗░█████╗░██████╗░███╗░░░███╗░█████╗░██╗██╗░░░░░
████╗░████║██╔══██╗██╔══██╗████╗░████║██╔══██╗██║██║░░░░░
██╔████╔██║██║░░██║██║░░██║██╔████╔██║███████║██║██║░░░░░
██║╚██╔╝██║██║░░██║██║░░██║██║╚██╔╝██║██╔══██║██║██║░░░░░
██║░╚═╝░██║╚█████╔╝██████╔╝██║░╚═╝░██║██║░░██║██║███████╗
╚═╝░░░░░╚═╝░╚════╝░╚═════╝░╚═╝░░░░░╚═╝╚═╝░░╚═╝╚═╝╚══════╝
Version 5.0.0 ALPHA By T.F.A#7524.
`.underline.red;

console.log(asciiText);

// Variables checker:
const AuthentificationToken = process.env.TOKEN || config.Client.TOKEN;

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
  console.error("[ERROR] You need to provide the modmail category ID!".red);
  return process.exit();
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
    name: 'close',
    description: 'Close a created mail.',
    options: [
      {
        name: "reason",
        description: "The reason for closing the mail.",
        type: 3 // "STRING" type.
      }
    ]
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
});

// If there is an error, this handlers it.
process.on('unhandledRejection', async (err, promise) => {
  console.warn("[ERROR] An error has occured and been successfully handled: ".red + err, promise);
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
    );
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

    // If command is "Close":
  } else if (command === "close") {
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

    const guild = client.guilds.cache.get(config.Handler.GUILD_ID);
    const category = guild.channels.cache.get(config.Handler.CATEGORY_ID);

    if (interaction.channel.parentId === category.id) {
      const requestedUserMail = guild.members.cache.get(interaction.channel.name);

      await interaction.channel.delete().catch(console.log);

      requestedUserMail.send(
        {
          embeds: [
            new EmbedBuilder()
              .setTitle('Mail Closed:')
              .setDescription(`Your mail has been successfully closed by a staff member.`)
              .addFields(
                { name: "Reason", value: `${italic(correctReason)}` }
              )
              .setColor('Green')
          ]
        }
      )
    } else {
      return interaction.reply(
        {
          embeds: [
            new EmbedBuilder()
              .setDescription(`Sorry, but you can't use this command here. This command works only in the modmail category channel!`)
              .setColor('Red')
          ],
          ephemeral: true
        }
      );
    }
  } else return;
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const guild = client.guilds.cache.get(config.Handler.GUILD_ID);
  const category = guild.channels.cache.get(config.Handler.CATEGORY_ID);

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
    }

    // The Modmail system:
    if (!channel) {
      let embedDM = new EmbedBuilder()
        .setTitle("Mail Creation:")
        .setDescription(`Your mail has been successfully created with these details below:`)
        .addFields(
          { name: "Message", value: `${message.content || italic("(No message was sent, probably a media/embed message was sent, or an error)")}` }
        )
        .setColor('Green');

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
          ]
        }
      );

      const channel = await guild.channels.create({
        name: message.author.id,
        type: ChannelType.GuildText,
        parent: category,
        permissionOverwrites: [
          {
            id: guild.roles.everyone,
            deny: [PermissionFlagsBits.ViewChannel],
          },
        ],
      }).catch(console.log);

      let embed = new EmbedBuilder()
        .setTitle("New Mail Created:")
        .addFields(
          { name: "User", value: `${message.author.tag} (${message.author.id})` },
          { name: "Message", value: `${message.content || italic("(No message was sent, probably a media/embed message was sent, or an error)")}` },
          { name: "Created on", value: `${new Date().toLocaleString()}` },
        )
        .setColor('Blue');

      if (message.attachments.size) {
        embed.setImage(message.attachments.map(img => img)[0].proxyURL);
        embed.addFields(
          { name: "Media(s)", value: italic("(Below this message line)") }
        )
      };

      return channel.send(
        {
          embeds: [
            embed
          ]
        }
      );

    } else {
      let embed = new EmbedBuilder()
        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setDescription(message.content || italic("(No message was sent, probably a media/embed message was sent, or an error)"))
        .setColor('Green');

      if (message.attachments.size) embed.setImage(message.attachments.map(img => img)[0].proxyURL);

      message.react("📨").catch(() => { });

      channel.send(
        {
          embeds: [
            embed
          ]
        }
      );

    }

    // If the message is in the modmail category:
  } else if (message.channel.type === ChannelType.GuildText) {
    if (message.channel.parentId === category.id) {
      const requestedUserMail = guild.members.cache.get(message.channel.name);

      let embed = new EmbedBuilder()
        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setDescription(message.content || italic("(No message was sent, probably a media/embed message was sent, or an error)"))
        .setColor('Red');

      if (message.attachments.size) embed.setImage(message.attachments.map(img => img)[0].proxyURL);

      message.react("📨").catch(() => { });

      requestedUserMail.send(
        {
          embeds: [
            embed
          ]
        }
      );
    } else {
      return;
    }
  }
});

/*
* DiscordJS-V14-ModMail-Bot
* Yet Another Discord ModMail Bot made with discord.js v14, built on Repl.it and coded by T.F.A#7524.
* Developer: T.F.A#7524
* Support server: dsc.gg/codingdevelopment
* Please DO NOT remove these lines, these are the credits to the developer.
* Sharing this project without giving credits to me (T.F.A) ends in a Copyright warning. (©)
*/
