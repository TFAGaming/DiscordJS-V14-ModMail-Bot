module.exports = {
    client: {
        token: '', // ← Your bot token (.env IS RECOMMENDED)
        id: '' // ← Your bot ID
    },
    modmail: {
        guildId: '', // ← Your server ID
        categoryId: '', // ← The modmail category ID
        staffRoles: [''], // ← The modmail staff roles IDs
        mentionStaffRolesOnNewMail: true // ← Mention staff roles when there is a new mail?
    },
    logs: {
        webhookURL: '' // ← The logging webhook URL (OPTIONAL) (.env IS RECOMMENDED)
    }
};