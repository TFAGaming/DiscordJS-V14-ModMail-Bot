const { eventshandler, db } = require("..");

module.exports = new eventshandler.event({
    event: 'channelDelete',
    run: async (client, channel) => {

        if (channel.type !== 0) return;

        db.mails.findOneAndDelete((v) => v.channelId === channel.id);
        
    }
});