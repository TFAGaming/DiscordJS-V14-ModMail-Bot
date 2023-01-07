const fs = require("node:fs");
const path = require("node:path");
const { QuickDB } = require("quick.db");
const colors = require("colors");
const ms = require("ms");
const db = new QuickDB();
const config = require("./config.js");
const projectVersion = require("./package.json").version || "Unknown";
// const Enmap = require('enmap');
const {
  Client,
  Collection,
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
  codeBlock,
} = require("discord.js");

// Creating a new client:
const client = new Client({
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
    Partials.User,
  ],
  presence: {
    activities: [
      {
        name: "DM Me for ModMail!",
        type: 1,
        url: "https://twitch.tv/discord",
      },
    ],
  },
  shards: "auto",
});

module.exports = client;

// Host the bot:
require("http")
  .createServer((req, res) => res.end("Ready."))
  .listen(3030);

// Cool message logger: (DO NOT REMOVE T.F.A#7524, YOU'VE BEEN WARNED.)
const asciiText =
  `
███╗░░░███╗░█████╗░██████╗░███╗░░░███╗░█████╗░██╗██╗░░░░░
████╗░████║██╔══██╗██╔══██╗████╗░████║██╔══██╗██║██║░░░░░
██╔████╔██║██║░░██║██║░░██║██╔████╔██║███████║██║██║░░░░░
██║╚██╔╝██║██║░░██║██║░░██║██║╚██╔╝██║██╔══██║██║██║░░░░░
██║░╚═╝░██║╚█████╔╝██████╔╝██║░╚═╝░██║██║░░██║██║███████╗
╚═╝░░░░░╚═╝░╚════╝░╚═════╝░╚═╝░░░░░╚═╝╚═╝░░╚═╝╚═╝╚══════╝
`.underline.blue +
  `Version ${projectVersion} By T.F.A#7524.
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
  console.warn(
    "[WARN] Use the slash command /setup to fix this problem without using the config.js file."
      .red
  );
}

if (!config.Modmail.INTERACTION_COMMAND_PERMISSIONS) {
  console.error(
    "[ERROR] You need to provide at least one permission for the slash commands handler!"
      .red
  );
  return process.exit();
}

// Commands Handler

const commands = [];
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
  commands.push(command.data.toJSON());
}

// Events Handler

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

const rest = new REST({ version: "10" }).setToken(
  process.env.TOKEN || config.Client.TOKEN
);

(async () => {
  try {
    console.log(
      "[HANDLER] Started refreshing application (/) commands.".brightYellow
    );

    await rest.put(
      Routes.applicationGuildCommands(
        config.Client.ID,
        config.Handler.GUILD_ID
      ),
      { body: commands }
    );

    console.log(
      "[HANDLER] Successfully reloaded application (/) commands.".brightGreen
    );
  } catch (error) {
    console.error(error);
  }
})();

// Login to the bot:
client.login(AuthentificationToken).catch(console.log);

// If there is an error, this handlers it.
process.on("unhandledRejection", (reason, promise) => {
  console.error(
    "[ANTI-CRASH] An error has occured and been successfully handled: [unhandledRejection]"
      .red
  );
  console.error(promise, reason);
});

process.on("uncaughtException", (err, origin) => {
  console.error(
    "[ANTI-CRASH] An error has occured and been successfully handled: [uncaughtException]"
      .red
  );
  console.error(err, origin);
});

process.on("uncaughtExceptionMonitor", (err, origin) => {
  console.error(
    "[ANTI-CRASH] An error has occured and been successfully handled: [uncaughtExceptionMonitor]"
      .red
  );
  console.error(err, origin);
});

/*
 * DiscordJS-V14-ModMail-Bot
 * Yet Another Discord ModMail Bot made with discord.js v14, built on Repl.it and coded by T.F.A#7524.
 * Developer: T.F.A#7524
 * Support server: dsc.gg/codingdevelopment
 * Please DO NOT remove these lines, these are the credits to the developer.
 * Sharing this project without giving credits to me (T.F.A) ends in a Copyright warning. (©)
 */
