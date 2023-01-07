const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const config = require("../config.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban a user from using the modmail system.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to ban.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const user = interaction.options.get("user").value;

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.resolve(
          config.Modmail.INTERACTION_COMMAND_PERMISSIONS || []
        )
      )
    )
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Missing Permissions:")
            .setDescription(
              `Sorry, I can't let you to use this command because you need ${bold(
                config.Modmail.INTERACTION_COMMAND_PERMISSIONS.join(", ")
              )} permissions!`
            )
            .setColor("Red"),
        ],
        ephemeral: true,
      });

    const bannedCheck = await db.get(
      `banned_guild_${config.Handler.GUILD_ID}_user_${user}`
    );

    if (!bannedCheck)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`That user is already unbanned.`)
            .setColor("Red"),
        ],
        ephemeral: true,
      });

    await db.delete(`banned_guild_${config.Handler.GUILD_ID}_user_${user}`);
    await db.delete(
      `banned_guild_${config.Handler.GUILD_ID}_user_${user}_reason`
    );

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(`That user has been successfully unbanned.`)
          .setColor("Green"),
      ],
      ephemeral: true,
    });
  },
};
