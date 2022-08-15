<p align="center">
	<img src="https://media.discordapp.net/attachments/1006491186875338823/1008812120080658493/V14_Handler_3.png?width=960&height=540" height="200" style="float: left; margin: 0px 10px 15px 1px;"/> <a style="font-size: 20px"> <a style="font-size: 30px"><br>
	<img src="https://img.shields.io/github/v/release/discordjs/discord.js?label=Discord.js Current Version:&logo=npm&style=for-the-badge">
</p>

<p align="center">
    <a style="font-size:15px;font-family:verdana"><b>GitHub Repository Statistics/Info:</b></a><br>
    <img src="https://img.shields.io/github/release/TFAGaming/DiscordJS-V14-ModMail-Bot?label=Release&logo=files">
    <img src="https://img.shields.io/github/forks/TFAGaming/DiscordJS-V14-ModMail-Bot?label=Forks&color=lime&logo=githubactions&logoColor=lime">
    <img src="https://img.shields.io/github/stars/TFAGaming/DiscordJS-V14-ModMail-Bot?label=Stars&color=yellow&logo=reverbnation&logoColor=yellow">
    <img src="https://img.shields.io/github/license/TFAGaming/DiscordJS-V14-ModMail-Bot?label=License&color=808080&logo=gitbook&logoColor=808080">
    <img src="https://img.shields.io/github/issues/TFAGaming/DiscordJS-V14-ModMail-Bot?label=Issues&color=red&logo=ifixit&logoColor=red">
    <br>
    <a style="font-size:15px;font-family:verdana"><b>Discord Server:</b></a><br>
    <a href="https://discord.gg/bGNRZcnwWy">
        <img src="https://img.shields.io/discord/918611797194465280.svg?label=Discord%20Server:&logo=discord&color=5865F2"><br>
    </a>
    <a style="font-size:15px;font-family:verdana"><b>Language:</b></a><br>
    <img src="https://img.shields.io/badge/JavaScript-100000?label=Made%20with:&style=flat&logo=javascript&color=yellow">
    <br>
    <a style="font-size:15px;font-family:verdana"><b>Fork/Download For:</b></a><br>
    <a href="https://replit.com/github/TFAGaming/DiscordJS-V14-ModMail-Bot">
        <img src="https://img.shields.io/badge/Repl.it-100000?label=Fork%20on:&style=flat&logo=replit&color=808080&logoColor=white">
    </a>
    <a href="https://github.com/TFAGaming/DiscordJS-V14-ModMail-Bot/fork">
        <img src="https://img.shields.io/badge/GitHub-100000?label=Fork%20on:&style=flat&logo=github&color=808080">
    </a>
</p>

# DiscordJS V14 ModMail Bot - Introduction:
A Discord bot project made with the npm package discord.js version 14 and it's job to manage mails on a server, and this project includes only one Database: Quick.db. **Project made with ❤ by T.F.A#7524.**<br>
You can click on the star (⭐️) button above this repository if you liked this project! Thank you all. 🙏

# How to setup:
### - Requirements:

• **Node.js v16.9.0 or above.** <a href="https://nodejs.org/en/"><img src="https://img.shields.io/badge/v16.9.0-100000?style=flat&logo=node.js&label=Node.js&color=blue&logoColor=lime"></a><br>
• **Discord.js v14.2.0 or above**. <a href="https://www.npmjs.com/package/discord.js"><img src="https://img.shields.io/badge/v14.2.0-100000?style=flat&logo=npm&label=Discord.js&color=blue"></a>

### - Creating a new client and inviting the bot:
• 1- Go to [Discord Developer Portal](https://discord.com/developers) and then go to `Applications`. <br>
• 2- Create a new application and choose it's name. <br>
• 3- Put your application's avatar (not important).<br>
• 4- Go to `Bot` section and turn your application into a bot. <br>
• 5- Scroll down and enable the three disabled `Privileged Gateaway Intents` intents (`PRESENCE INTENT`, `SERVER MEMBERS INTENT`, and `MESSAGE CONTENT INTENT`).<br>
• 6- Go to `OAuth2` section, and then `URL Generator`. Select the scopes `bot` and `application.commands`, and then scroll down to **Bot Permissions**, select `Administrator` (For all guild permissions). Copy the link that is generated below, open a new browser tab, paste the URL, choose a server where your bot will be in, verify yourself that you are not a robot, and Done!

### - Setup your project on ___Repl.it___:
• 1- Go to [Replit](https://www.replit.com) site and register a new account (If you are new on the site).<br>
• 2- Fork the project by clicking on the badge above this guide `Fork For: Replit`.<br>
• 3- Click on `Import from GitHub` and wait for Replit to import the repository to your project.<br>
• 4- Type `node index.js` or `node .` in the Run button configuration, and then press `Done`.<br>
• 5- Go to the file `config.js` and fill all the empty values of variables. Here's a guide below:
```js
module.exports = {
	Client: {
		// Your bot token (PLEASE READ THE WARNING BELOW):
		TOKEN: "",
		// Your bot ID:
		ID: "989650107009990698"
	},
	
	Handler: {
		// Your server ID for the ModMail:
		GUILD_ID: "949620901291368458",
		// The category ID for the ModMails:
		CATEGORY_ID: "999994847047987250"
	},

	Modmail: {
		// The slash commands permissions ("ManageMessages", "ManageServer"... etc)
		INTERACTION_COMMAND_PERMISSIONS: ['Administrator']
	}
};
```

> ⚠️ **WARNING:** Make sure to not use the variable `TOKEN` in the file `config.js`! Attackers can use your bot in anytime they want! **Follow the step #6 to keep these secrets in a safe place.**
> You can use this variable in Visual Studio Code because VSCode is private IDE and nobody can see your secrets, only you can see it.

• 6- Go to `Environment Secret Variables` (Located at your left screen with a 🔒 icon). This feature from Replit avoid attackers from accessing your secrets. Use the key as a variable, and the value is the variable's value. The key for your bot token is `TOKEN`, and the value is your bot token. After finishing this, click on `Add new secret`.<br>
• 7- Click on the green button on top of your screen `► Run` to start running your project.<br>
• 8- Enjoy! =)

# Usage:
### - How to ban/unban someone from using ModMail:
#### Ban a user:
Go to any text channel and press on your keyboard the slash key (`/`). You have to see your bot in the list that is going to show you. Click on your bot profile and select the `/ban` command. These commands are called **Slash commands**. Here's a picture below:<br>
<img src="https://media.discordapp.net/attachments/1006491186875338823/1008817730683687033/2022-08-15_20_20_39-pics.png">

The usage for the command is: `/ban [user] (reason)`.

#### Unban a user:
Do the same thing like the ban command, but use the command `/unban`. The usage for the command is: `/unban [user]`.

### - ModMail system:
#### Create a mail:
Go to your server members list (Located at your right screen on Discord), right click on your bot profile and click on `Message`. Type anything in the DM (Direct Message) with your bot, and your bot should respond that a mail has been successfully created. Go back to your server and check the channels in the category of ModMails, click on the created channel and start communicate. You can upload images and videos, it also works!
#### Delete a mail:
Do **not** delete a mail channel by right clicking on the mail channel and then on `Delete channel`. Use the slash command `/close` on the mail to close the mail, so the user who created the mail will receive in his DMs that his mail has been successfully closed. The usage of the command is: `/close (reason)`.

# Something doesn't work here...
There are a lot of issues happens with some users. You can create an issue on this repository and I will respond to your opened issue(s) as fast as possible. I'm always busy, so please wait for me to respond to your issues.

# Credits are required? (©)
Forking this repository and sharing it again without giving credits to me (T.F.A) is **not acceptable**. You **can** remove the credits in some embed messages or in bot status, but **not** in the main files like README.md, index.js... If you want to make a video about this repository, ask firstly to me and then I will give you the permissions to record, else, bypassing by without asking permissions will ends in a copyright warning.

### Contact me!
<a href='https://www.youtube.com/c/TFA7524' target="_blank">
    <img alt='YouTube' src='https://img.shields.io/badge/YouTube-100000?style=social&logo=YouTube&logoColor=FF0000&labelColor=000000&color=EAE9E9'/>
</a>
<a href='https://dsc.gg/codingdevelopment' target="_blank">
    <img alt='Discord' src='https://img.shields.io/badge/Discord-100000?style=social&logo=Discord&logoColor=5865F2&labelColor=000000&color=EAE9E9'/>
