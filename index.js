const { JSONSchemaDB } = require('@tfagaming/jsondb');
const { time, wait } = require('./functions');
const { CommandsHandler, EventsHandler } = require('horizon-handler');
require('colors');
const config = require("./config.js");
const projectVersion = require('./package.json').version || "v0.0.0";
const { readdirSync } = require('fs');
require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    Partials,
    Collection
} = require('discord.js');

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
    bans: new JSONSchemaDB('./JSON/bans.json', {
        automaticId: true,
        uneditableId: true
    }),
    mails: new JSONSchemaDB('./JSON/mails.json', {
        automaticId: true,
        uneditableId: true
    })
};

const collection = {
    commands: new Collection()
};

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

client.login(config.client.token || process.env.CLIENT_TOKEN).catch((e) => {
    console.error('[ERROR] Unable to connect to the bot, this might be an invalid token or missing required intents!\n', e);
});

const commandshandler = new CommandsHandler('./commands/', false);
const eventshandler = new EventsHandler('./events/', false);

module.exports = {
    client,
    db,
    collection,
    commandshandler,
    eventshandler
};

(async () => {
    await commandshandler.load(collection.commands, (file) => `Loaded new command: ${file}`.green);

    await eventshandler.load(client, (file) => `Loaded new event: ${file}`.green);
})();

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
