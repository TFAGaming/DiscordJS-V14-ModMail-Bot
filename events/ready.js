const { eventshandler, commandshandler } = require("..");

module.exports = new eventshandler.event({
    event: 'ready',
    once: true,
    run: async (_, client) => {

        console.log('Logged in as: ' + client.user.displayName);

        await commandshandler.deploy(client, {
            REST: {
                version: '10'
            }
        });

    }
});