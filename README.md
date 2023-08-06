<!--
<p align="center">
    <a href="https://github.com/TFAGaming/DiscordJS-V14-ModMail-Bot">
        <img src="https://img.shields.io/github/forks/TFAGaming/DiscordJS-V14-ModMail-Bot?label=Forks&color=lime&logo=githubactions&logoColor=lime" alt="Forks">
    </a>
    <a href="https://github.com/TFAGaming/DiscordJS-V14-ModMail-Bot/stargazers">
        <img src="https://img.shields.io/github/stars/TFAGaming/DiscordJS-V14-ModMail-Bot?label=Stars&color=yellow&logo=reverbnation&logoColor=yellow" alt="Stars">
    </a>
    <a href="https://github.com/TFAGaming/DiscordJS-V14-ModMail-Bot/blob/main/LICENSE">
        <img src="https://img.shields.io/github/license/TFAGaming/DiscordJS-V14-ModMail-Bot?label=License&color=808080&logo=gitbook&logoColor=808080" alt="License">
    </a>
    <a href="https://github.com/TFAGaming/DiscordJS-V14-ModMail-Bot/issues">
        <img src="https://img.shields.io/github/issues/TFAGaming/DiscordJS-V14-ModMail-Bot?label=Issues&color=red&logo=ifixit&logoColor=red" alt="Issues">
    </a>
</p>
-->

# DiscordJS-V14-ModMail-Bot

Welcome to DiscordJS-V14-ModMail-Bot, a Discord bot project developed using the powerful npm package discord.js version 14. This bot is designed to efficiently manage modmail on a server, utilizing a single JSON database for seamless communication.

If you find this project useful, please show your support by clicking the star (⭐️) button above this repository. Thank you! 🙏

# Features

- Easy to use and set up.
- Simplifies the management of modmail.
- Robust error handling for a smooth experience.

<!--
# Preview

Messaging the bot:<br>
<img src="https://media.discordapp.net/attachments/1111644651036876822/1121556887905779836/2023-06-22_22_41_31-TypeScript_Bot_-_Discord.png" alt="Bot DM Preview">

New mail channel:<br>
<img src="https://media.discordapp.net/attachments/1111644651036876822/1121556888853692528/2023-06-22_22_44_26-849413565487382578___The_unverified_bots_gang_-_Discord.png?width=742&height=676" alt="New Mail Channel Preview">

Receiving messages in DMs:<br>
<img src="https://media.discordapp.net/attachments/1111644651036876822/1121556888157442090/2023-06-22_22_44_08-TypeScript_Bot_-_Discord.png" alt="Receiving Messages Preview">

Closing a mail (by staff):<br>
<img src="https://media.discordapp.net/attachments/1111644651036876822/1121557698824130570/2023-06-22_22_49_26-TypeScript_Bot_-_Discord.png" alt="Closing Mail Preview">
-->

# Setup

## Requirements:

- [Node.js](https://nodejs.org/en/): version 16.9.0 or above.
- [discord.js](https://www.npmjs.com/package/discord.js): version 14.12.0 or above.
- [horizon-handler](https://www.npmjs.com/package/horizon-handler) (my package): version 1.1.0 or above.
- [@tfagaming/jsondb](https://www.npmjs.com/package/@tfagaming/jsondb) (my package): version 1.2.1 or above.
- [colors](https://www.npmjs.com/package/ms): any version.

To set up the project, follow these steps:

1. Run `npm init -y` in your terminal to initialize a new project.
2. Install the required packages by running `npm i discord.js aqify.js tfa-jsonmap colors`.
3. Create a `config.js` file using the provided `example.config.js` as a template.
4. Fill in the empty values in the `config.js` file with the required information.

> **Warning**
> If you're using repl.it, use `process.env.CLIENT_TOKEN` as your bot token in `config.js`, and then create a new key in **Secrets** named **CLIENT_TOKEN** with the value of your bot token.
> ```ts
> client: {
>     token: process.env.CLIENT_TOKEN,
>     id: ...
> }, ...
> ```

5. Obtain your bot token from the [Discord Developer Portal](https://discord.com/developers) and add it to the `config.js` file.
6. Configure the necessary settings for your bot, such as the guild ID, category ID for modmail, staff roles, and whether to mention staff roles for new mail notifications.
7. Start the bot by running `node index.js`, `node .`, or `npm run start` in your terminal.

## Running on Replit:

To run the project on Replit, follow these additional steps:

1. Create an account on [replit.com](https://www.replit.com) (if you don't have one already).
2. Fork this project by clicking on the **Fork For: Replit** badge.
3. Click on **Import from GitHub** and wait for Replit to import the repository.
4. Configure the Run button to execute the appropriate command (`node index.js`, `node .`, or `npm run start`).
5. Fill in the required values in the `config.js` file.
6. Set up environment secret variables for your bot token by going to **Environment Secret Variables** and adding a key with the name `CLIENT_TOKEN` and the corresponding bot token as the value.
7. Click on the green **Run** button to start your bot.

## Running on Visual Studio Code:

To run the project on Visual Studio Code, follow these additional steps:

1. Download and unzip the source code.
2. Open Visual Studio Code and select the unzipped folder as your workspace.
3. Fill in the required values in the `config.js`

file. 4. Open the terminal in Visual Studio Code and run `node index.js`, `node .`, or `npm run start`. 5. Enjoy! =)

## Need Assistance?

If you encounter any issues or have questions about this project, please create an issue on this repository. I will respond to your inquiries as quickly as possible. Your feedback is valuable and helps improve the project.

## Contributors
<img src="https://contrib.rocks/image?repo=TFAGaming/DiscordJS-V14-ModMail-Bot">

## License
MIT