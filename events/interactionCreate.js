const { EmbedBuilder } = require("discord.js");
const { eventshandler, collection } = require("..");
const config = require("../config");

module.exports = new eventshandler.event({
    event: 'interactionCreate',
    run: async (client, interaction) => {

        if (interaction.customId === "review") {
            const selectedValue = interaction.values[0];
            const channel = client.channels.cache.get(config.modmail.reviewChannelId);
            console.log(interaction);
            await channel.send({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Review")
                  .setDescription(
                    `The Support was ratet with ${selectedValue}⭐ star/s.`
                  )
                  .setColor("Blurple")
                  .addFields(
                    {
                      name: "Customer",
                      value: `<@${interaction.user.id}>`,
                      inline: false,
                    },
                    {
                      name: "Date",
                      value: `${new Date().toLocaleDateString()}`,
                      inline: true,
                    },
                    {
                      name: "Time",
                      value: `${new Date().toLocaleTimeString()}`,
                      inline: true,
                    }
                  )
                  .setTimestamp()
                  .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                  .setFooter({
                    text: `Rated from ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL(),
                  }),
              ],
            });
            await interaction.reply({
              content: "Thanks for your Rating!",
              ephemeral: true,
            });
        }

        if (!interaction.isChatInputCommand()) return;

        const command = collection.commands.get(interaction.commandName);
        
        if (!command || command.type !== 1) return;

        try {
            command.run(client, interaction);
        } catch (e) {
            console.error(e);
        };

    }
});