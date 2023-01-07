const colors = require('colors');
const config = require("../config.js");

module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log(
      `[READY] ${client.user.tag} is up and ready to go.`.brightGreen
    );

    const guild = client.guilds.cache.get(config.Handler.GUILD_ID);

    if (!guild) {
      console.error(
        "[CRASH] Guild is Invalid, or probably valid but I'm not there.".red
      );
      return process.exit();
    } else return;
  },
};
