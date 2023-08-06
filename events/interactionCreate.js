const { eventshandler, collection } = require("..");

module.exports = new eventshandler.event({
    event: 'interactionCreate',
    run: async (client, interaction) => {

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