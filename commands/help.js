const { EmbedBuilder, SlashCommandBuilder, bold } = require("discord.js");
const client = require("../index.js");
const projectVersion = require('../package.json').version || "Unknown";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Replies with the help menu."),
  async execute(interaction) {
    return interaction
      .reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: client.user.tag,
              iconURL: client.user.displayAvatarURL({
                dynamic: true,
              }),
            })
            .setTitle("Help Menu:")
            .setDescription(
              `This is the help menu of the ${bold(
                "ModMail Bot v" + projectVersion
              )}.`
            )
            .addFields(
              {
                name: "Setup the system:",
                value:
                  "If you haven't provided the category ID in config.js file, use the slash command `/setup` instead.",
              },
              {
                name: "Creating a new mail:",
                value:
                  "To create a mail, DM anything to me and a Mail channel should be created automatically with your account ID. You can upload medias, they should work.",
              },
              {
                name: "Closing a mail:",
                value:
                  'If you want to close a Mail from DMs, click on the gray button "Close". Else, if you want to close a Mail in Text Channel, go to the Mail channel and click on the red button "Close". If it replies with "This interaction failed", use the slash command `/close` instead.',
              },
              {
                name: "Ban/Unban a user from using the ModMail system.",
                value:
                  "To ban a user, use the slash command `/ban`. Else, use the slash command `/unban`.",
              },
              {
                name: "Am I allowed to share this code?",
                value:
                  "Unfortunately, you are not allowed to reshare this code from T.F.A 7524. Please DM him and ask the permission to share, else you will get a copyright warning from him. Thanks :)",
              }
            )
            .setColor("Blue")
            .setFooter({
              text: "Developed by: T.F.A#7524",
            }),
        ],
        ephemeral: true,
      })
      .catch(() => {});
  },
};
