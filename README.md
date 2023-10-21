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
- Transcript system.
- Webhook logging system.

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

## Requirements:

- [Node.js](https://nodejs.org/en/): version 16.9.0 or above.
- [discord.js](https://www.npmjs.com/package/discord.js): version 14.13.0 or above.
- [horizon-handler](https://www.npmjs.com/package/horizon-handler) (my package): version 1.6.0 or above.
- [@tfadev/easy-sqlite](https://www.npmjs.com/package/@tfadev/easy-sqlite) (my package): version 1.0.1 or above.
- [colors](https://www.npmjs.com/package/ms): any version.

## Setup the project:

To run the project, follow these steps:

1. Download and unzip the source code.
2. Open Visual Studio Code and select the unzipped folder as your workspace.
3. Use `npm init -y` and then `npm i`.
4. Fill in the empty values in the `config.js` file with the required information, you can use `.env` file for more security. Obtain your bot token from the [Discord Developer Portal](https://discord.com/developers).
5. Open the terminal in Visual Studio Code and run `node index.js`, `node .`, or `npm run start`.
6. Enjoy! =)

### Logging Discord webhook:
Create a new integration for a text channel (which is webhook, for sure), and copy it's URL and use it in `config.js` or `.env`. It's just a simple logging system, whichs logs the newly created mail and closed mails.

## Need Assistance?

If you encounter any issues or have questions about this project, please create an issue on this repository. I will respond to your inquiries as quickly as possible. Your feedback is valuable and helps improve the project.

## Contributors
Thank you to all the people who contributed to **DiscordJS-V14-ModMail-Bot**!

<img src="https://contrib.rocks/image?repo=TFAGaming/DiscordJS-V14-ModMail-Bot">

## License
The **MIT** License.