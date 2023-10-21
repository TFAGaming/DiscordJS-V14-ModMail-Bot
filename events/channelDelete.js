const { eventshandler, db } = require("..");
const config = require('../config');

module.exports = new eventshandler.event({
    event: 'channelDelete',
    run: async (client, channel) => {

        const guild = client.guilds.cache.get(config.modmail.guildId);
        const category = guild.channels.cache.find((v) => v.id === config.modmail.categoryId || v.name === 'ModMail');

        if (channel.type !== 0 && channel.parentId !== category.id) return;

        await db.delete('mails', { channelId: channel.id });

    }
});