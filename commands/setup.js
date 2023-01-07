const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  EmbedBuilder,
  PermissionsBitField,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require("discord.js");
const config = require("../config.js");
const client = require("../index.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Setup the mail caterogy system."),
  async execute(interaction) {
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

    const guild = client.guilds.cache.get(config.Handler.GUILD_ID);
    const category = guild.channels.cache.find(
      (CAT) => CAT.id === config.Handler.CATEGORY_ID || CAT.name === "ModMail"
    );
    // If category is found:
    if (category) {
      await interaction
        .reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `There is already a modmail category named "ModMail". Replace the old category by a new category?\n\n:warning: If you click on **Replace**, all the mails text channels will be outside of category.`
              )
              .setColor("Red")
              .setFooter({
                text: "This request expires in 10 seconds, buttons won't respond to your actions after 10 seconds.",
              }),
          ],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("replace_button_channel_yes")
                .setLabel("Replace")
                .setStyle(ButtonStyle.Success),
              new ButtonBuilder()
                .setCustomId("replace_button_channel_no")
                .setLabel("No")
                .setStyle(ButtonStyle.Danger)
            ),
          ],
          ephemeral: true,
        })
        .catch(() => {});

      const collectorREPLACE_CHANNEL =
        interaction.channel.createMessageComponentCollector({
          time: 10000,
        });

      collectorREPLACE_CHANNEL.on("collect", async (i) => {
        const ID = i.customId;

        if (ID == "replace_button_channel_yes") {
          i.update({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `Creating a new category... This may take a while!`
                )
                .setColor("Yellow"),
            ],
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("replace_button_channel_yes")
                  .setLabel("Replace")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("replace_button_channel_no")
                  .setLabel("No")
                  .setStyle(ButtonStyle.Danger)
                  .setDisabled(true)
              ),
            ],
          }).catch(() => {});

          await category.delete().catch(() => {});

          const channel = await guild.channels
            .create({
              name: "ModMail",
              type: ChannelType.GuildCategory,
              permissionOverwrites: [
                {
                  id: guild.roles.everyone,
                  deny: [PermissionFlagsBits.ViewChannel],
                },
              ],
            })
            .catch(console.log);

          let roles = [];

          if (config.Modmail.MAIL_MANAGER_ROLES) {
            config.Modmail.MAIL_MANAGER_ROLES.forEach(async (role) => {
              const roleFetched = guild.roles.cache.get(role);
              if (!roleFetched) return roles.push("[INVALID ROLE]");

              roles.push(roleFetched);

              await channel.permissionOverwrites.create(roleFetched.id, {
                SendMessages: true,
                ViewChannel: true,
                AttachFiles: true,
              });
            });
          } else {
            roles.push("No roles were added to config.js file");
          }

          interaction
            .editReply({
              embeds: [
                new EmbedBuilder()
                  .setDescription(
                    `Done, successfully created a mail category named **ModMail**.`
                  )
                  .addFields({ name: "Roles", value: roles.join(", ") + "." })
                  .setFooter({
                    text: "WARN: Please check the roles in the category channel, errors could happen in anytime.",
                  })
                  .setColor("Green"),
              ],
            })
            .catch(() => {});

          return collectorREPLACE_CHANNEL.stop();
        } else if (ID == "replace_button_channel_no") {
          i.update({
            embeds: [
              new EmbedBuilder()
                .setDescription(`Cancelled.`)
                .setFooter({
                  text: 'You can now click on "Dismiss message" below this embed message.',
                })
                .setColor("Green"),
            ],
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("replace_button_channel_yes")
                  .setLabel("Replace")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("replace_button_channel_no")
                  .setLabel("No")
                  .setStyle(ButtonStyle.Danger)
                  .setDisabled(true)
              ),
            ],
          }).catch(() => {});

          return collectorREPLACE_CHANNEL.stop();
        } else return;
      });

      // If category is not found:
    } else {
      await interaction
        .reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `Creating a new category... This may take a while!`
              )
              .setColor("Yellow"),
          ],
        })
        .catch(() => {});

      const channel = await guild.channels
        .create({
          name: "ModMail",
          type: ChannelType.GuildCategory,
          permissionOverwrites: [
            {
              id: guild.roles.everyone,
              deny: [PermissionFlagsBits.ViewChannel],
            },
          ],
        })
        .catch(console.log);

      let roles = [];

      if (config.Modmail.MAIL_MANAGER_ROLES) {
        config.Modmail.MAIL_MANAGER_ROLES.forEach(async (role) => {
          const roleFetched = guild.roles.cache.get(role);
          if (!roleFetched) return roles.push("[INVALID ROLE]");

          roles.push(roleFetched);

          await channel.permissionOverwrites.create(roleFetched.id, {
            SendMessages: true,
            ViewChannel: true,
            AttachFiles: true,
          });
        });
      } else {
        roles.push("No roles were added to config.js file.");
      }

      return interaction
        .editReply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `Done, successfully created a mail category named **ModMail**.`
              )
              .addFields({ name: "Roles", value: roles.join(", ") + "." })
              .setFooter({
                text: "WARN: Please check the roles in the category channel, errors could happen in anytime.",
              })
              .setColor("Green"),
          ],
        })
        .catch(() => {});
    }
  },
};
