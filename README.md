<p align="center">
    <a style="font-size:15px;font-family:verdana"><b>GitHub Repository statistics:</b></a><br>
    <img src="https://img.shields.io/github/forks/TFAGaming/DiscordJS-V14-ModMail-Bot?label=Forks&color=lime&logo=githubactions&logoColor=lime">
    <img src="https://img.shields.io/github/stars/TFAGaming/DiscordJS-V14-ModMail-Bot?label=Stars&color=yellow&logo=reverbnation&logoColor=yellow">
    <img src="https://img.shields.io/github/license/TFAGaming/DiscordJS-V14-ModMail-Bot?label=License&color=808080&logo=gitbook&logoColor=808080">
    <img src="https://img.shields.io/github/issues/TFAGaming/DiscordJS-V14-ModMail-Bot?label=Issues&color=red&logo=ifixit&logoColor=red">
    <br>
    <a style="font-size:15px;font-family:verdana"><b>Discord:</b></a><br>
    <a href="https://discord.gg/bGNRZcnwWy">
        <img src="https://img.shields.io/discord/918611797194465280.svg?label=Discord%20server&logo=discord&color=5865F2"><br>
    </a>
    <a style="font-size:15px;font-family:verdana"><b>Fork/Download for:</b></a><br>
    <a href="https://replit.com/github/TFAGaming/DiscordJS-V14-ModMail-Bot">
        <img src="https://img.shields.io/badge/Repl.it-100000?label=Fork%20on&style=flat&logo=replit&color=808080&logoColor=white">
    </a>
    <a href="https://github.com/TFAGaming/DiscordJS-V14-ModMail-Bot/fork">
        <img src="https://img.shields.io/badge/GitHub-100000?label=Fork%20on&style=flat&logo=github&color=808080">
    </a>
    <a href="https://github.com/TFAGaming/DiscordJS-V14-ModMail-Bot/archive/refs/heads/main.zip">
        <img src="https://img.shields.io/badge/.zip-100000?label=Download%20source&logo=files&color=blue">
    </a>
</p>

# DiscordJS-V14-ModMail-Bot
A Discord bot project made with the npm package discord.js version 14 and it's job to manage mails on a server, and this project includes only one JSON database.

**Project made with ❤ by T.F.A#7524.**

Did you liked my project? You can click on the star (⭐️) button above this repository, thank you! 🙏

# Features
- Simple to use.
- Easy to setup.
- Powerful with errors handler.

# Preview

DMing the bot:<br>
<img src="https://media.discordapp.net/attachments/1111644651036876822/1121556887905779836/2023-06-22_22_41_31-TypeScript_Bot_-_Discord.png">

The new mail channel:<br>
<img src="https://media.discordapp.net/attachments/1111644651036876822/1121556888853692528/2023-06-22_22_44_26-849413565487382578___The_unverified_bots_gang_-_Discord.png?width=742&height=676">

Receiving the messages in DMs:<br>
<img src="https://media.discordapp.net/attachments/1111644651036876822/1121556888157442090/2023-06-22_22_44_08-TypeScript_Bot_-_Discord.png">

Closing the mail (by staff):<br>
<img src="https://media.discordapp.net/attachments/1111644651036876822/1121557698824130570/2023-06-22_22_49_26-TypeScript_Bot_-_Discord.png">

# Setup
## Requirements:
- [Node.js](https://nodejs.org/en/): v16.9.0 or above.
- [discord.js](https://www.npmjs.com/package/discord.js): v14.11.0 or above.
- [aqify.js](https://www.npmjs.com/package/aqify.js) (my package): v1.8.0 or above.
- [tfa-jsonmap](https://www.npmjs.com/package/tfa-jsonmap) (my package): v1.3.0 or above.
- [colors](https://www.npmjs.com/package/ms): any version.

Run the following commands:

```
npm init -y
npm i discord.js aqify.js tfa-jsonmap colors
```

## Creating a new client and inviting the bot:
1. Go to [Discord Developer Portal](https://discord.com/developers) and then go to **Applications**.
2. Create a new application and choose it's name.
3. Put your application's avatar (not important).
4. Go to **Bot** section and turn your application into a bot.
5. Scroll down and enable the three disabled `Privileged Gateaway Intents` intents.
6. Go to **OAuth2** > **URL Generator**. Select the scopes `bot` and `application.commands`, and then scroll down to **Bot Permissions**, select `Administrator` (For all guild permissions). Copy the link that is generated below, open a new browser tab, paste the URL, choose a server where your bot will be in, verify yourself that you are not a robot, and you're done!

> **Warning**
> Your bot **must** have the `Administrator` permission on your server and **above** to all the server roles.

## Setup your project on Repl.it:
This is the `config.js` structure. Rename the `example.config.js` to `config.js`, and then replace each property's value with it's required type (the current value in the codeblock below).

(I made this table for literally new beginners in JavaScript)
| Type | Value |
| ---- | ----- |
| string | `''` or `""` |
| string[] | `['']` or `[""]` | 
| boolean | `true` or `false` |

```ts
module.exports = {
  client: {
    token: string, // <= Your bot token (DO NOT USE IN REPLIT)
    id: string // <= Your bot ID
  },

  modmail: {
    guildId: string, // <= Your server ID
    categoryId: string, // <= The modmail category ID
    staffRoles: string[], // <= The modmail staff roles IDs
    mentionStaffRolesOnNewMail: boolean // <= Mention staff roles when there is a new mail?
  }
};
```

1. Go to [repl.it](https://www.replit.com) site and register a new account (If you are new on the site).
2. Fork the project by clicking on the badge above this guide **Fork For: Replit**.
3. Click on **Import from GitHub** and wait for Replit to import the repository to your project.
4. Type `node index.js`, `node .`, or `npm run start` in the Run button configuration, and then click on **Done**.
5. Go to the file `config.js` and fill all the empty values of variables:
6. Go to **Environment Secret Variables** (Located at your left-down screen with a 🔒 icon). This feature avoids attackers from accessing your secrets, passwords... etc. Create a key with the value of `CLIENT_TOKEN`, and the key's value is your bot token. Click on **Add new secret** if you're done.<br>
7. Click on the green button on top of your screen **► Run** to start running your project.<br>
8. Enjoy! =)

## Setup your project on Visual Studio Code:
1. Download the source.
2. Unzip the downloaded .zip file.
3. Open VSCode, and select the folder that you have unzipped.
4. Go to the file `config.js` and fill all the empty values of variables (codeblock is above).
5. Go to terminal and run `node .`, `node index.js`, or `npm run start`.
6. Enjoy! =)

# Something doesn't work here...
You can create an issue on this repository and I will respond to your opened issue(s) as fast as possible. I'm always busy, so please wait for me to respond to your issues.

### **Copyright © T.F.A 7524 - Development, 2020-2023**

### Contact me!
<a href='https://www.youtube.com/c/TFA7524' target="_blank">
    <img alt='YouTube' src='https://img.shields.io/badge/YouTube-100000?style=social&logo=YouTube&logoColor=FF0000&labelColor=000000&color=EAE9E9'/>
</a>
<a href='https://dsc.gg/codingdevelopment' target="_blank">
    <img alt='Discord' src='https://img.shields.io/badge/Discord-100000?style=social&logo=Discord&logoColor=5865F2&labelColor=000000&color=EAE9E9'/>
