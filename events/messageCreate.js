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
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const config = require("../config.js");
const client = require("../index.js");

module.exports = {
  name: "messageCreate",
  async execute(message) {
    if (message.author.bot) return;
    const guild = client.guilds.cache.get(config.Handler.GUILD_ID);

    if (!guild) {
      console.error("[CRASH] Guild is not valid.".red);
      return process.exit();
    }

    const category = guild.channels.cache.find(
      (CAT) => CAT.id === config.Handler.CATEGORY_ID || CAT.name === "ModMail"
    );

    const channel = guild.channels.cache.find(
      (x) => x.name === message.author.id && x.parentId === category.id
    );

    const bannedUserCheck = await db.get(
      `banned_guild_${config.Handler.GUILD_ID}_user_${message.author.id}`
    );

    // If the message in a DM channel:
    if (message.channel.type == ChannelType.DM) {
      if (bannedUserCheck) {
        const reason = await db.get(
          `banned_guild_${config.Handler.GUILD_ID}_user_${message.author.id}_reason`
        );

        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Mail Creation Failed:")
              .setDescription(
                `Sorry, we couldn\'t create a mail for you because you are ${bold(
                  "banned"
                )} from using the modmail system!`
              )
              .addFields({ name: "Reason of the ban", value: italic(reason) }),
          ],
        });
      }

      if (!category)
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription("The system is not ready yet.")
              .setColor("Red"),
          ],
        });

      // The Modmail system:
      if (!channel) {
        let embedDM = new EmbedBuilder()
          .setTitle("Mail Creation:")
          .setDescription(
            `Your mail has been successfully created with these details below:`
          )
          .addFields({
            name: "Message",
            value: `${
              message.content ||
              italic(
                "(No message was sent, probably a media/embed message was sent, or an error)"
              )
            }`,
          })
          .setColor("Green")
          .setFooter({
            text: 'You can click on "Close" button to close this mail.',
          });

        if (message.attachments.size) {
          embedDM.setImage(message.attachments.map((img) => img)[0].proxyURL);
          embedDM.addFields({
            name: "Media(s)",
            value: italic("(Below this message line)"),
          });
        }

        message.reply({
          embeds: [embedDM],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("close_button_created_mail_dm")
                .setLabel("Close")
                .setStyle(ButtonStyle.Secondary)
            ),
          ],
        });

        const channel = await guild.channels
          .create({
            name: message.author.id,
            type: ChannelType.GuildText,
            parent: category,
            topic: `A Mail channel created by ${message.author.tag} for requesting help or something else.`,
          })
          .catch(console.log);

        let embed = new EmbedBuilder()
          .setTitle("New Mail Created:")
          .addFields(
            {
              name: "User",
              value: `${message.author.tag} (\`${message.author.id}\`)`,
            },
            {
              name: "Message",
              value: `${
                message.content.substr(0, 4096) ||
                italic(
                  "(No message was sent, probably a media/embed message was sent, or an error)"
                )
              }`,
            },
            { name: "Created on", value: `${new Date().toLocaleString()}` }
          )
          .setColor("Blue");

        if (message.attachments.size) {
          embed.setImage(message.attachments.map((img) => img)[0].proxyURL);
          embed.addFields({
            name: "Media(s)",
            value: italic("(Below this message line)"),
          });
        }

        const ROLES_TO_MENTION = [];
        config.Modmail.MAIL_MANAGER_ROLES.forEach((role) => {
          if (!config.Modmail.MAIL_MANAGER_ROLES || !role)
            return ROLES_TO_MENTION.push("[ERROR: No roles were provided]");
          if (
            config.Modmail.MENTION_MANAGER_ROLES_WHEN_NEW_MAIL_CREATED == false
          )
            return;

          const ROLE = guild.roles.cache.get(role);
          if (!ROLE) return;
          ROLES_TO_MENTION.push(ROLE);
        });

        return channel
          .send({
            content: config.Modmail.MENTION_MANAGER_ROLES_WHEN_NEW_MAIL_CREATED
              ? ROLES_TO_MENTION.join(", ")
              : "** **",
            embeds: [embed],
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("close_button_created_mail_channel")
                  .setLabel("Close")
                  .setStyle(ButtonStyle.Danger)
              ),
            ],
          })
          .then(async (sent) => {
            sent.pin().catch(() => {});
          });
      } else {
        let embed = new EmbedBuilder()
          .setAuthor({
            name: `${message.author.tag}`,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(
            message.content.substr(0, 4096) ||
              italic(
                "(No message was sent, probably a media/embed message was sent, or an error)"
              )
          )
          .setColor("Green");

        if (message.attachments.size)
          embed.setImage(message.attachments.map((img) => img)[0].proxyURL);

        message.react("📨").catch(() => {});

        return channel.send({
          embeds: [embed],
        });
      }

      // If the message is in the modmail category:
    } else if (message.channel.type === ChannelType.GuildText) {
      if (!category) return;

      if (message.channel.parentId === category.id) {
        const requestedUserMail = guild.members.cache.get(message.channel.name);

        let embed = new EmbedBuilder()
          .setAuthor({
            name: `${message.author.tag}`,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(
            message.content.substr(0, 4096) ||
              italic(
                "(No message was sent, probably a media/embed message was sent, or an error)"
              )
          )
          .setColor("Red");

        if (message.attachments.size)
          embed.setImage(message.attachments.map((img) => img)[0].proxyURL);

        message.react("📨").catch(() => {});

        return requestedUserMail
          .send({
            embeds: [embed],
          })
          .catch(() => {});
      } else return;
    }
  },
};
