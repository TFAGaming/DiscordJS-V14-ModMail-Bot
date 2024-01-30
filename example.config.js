module.exports = {
    client: {
        token: '', // ← Your bot token (.env IS RECOMMENDED)
        id: '1201796495196831745' // ← Your bot ID
    },
    modmail: {
        guildId: '1172018453222268981', // ← Your server ID
        categoryId: '1201578799737868428', // ← The modmail category ID
        staffRoles: ['1200916028507557998'], // ← The modmail staff roles IDs
        mentionStaffRolesOnNewMail: true // ← Mention staff roles when there is a new mail?
    },
    logs: {
        webhookURL: '' // ← The logging webhook URL (OPTIONAL) (.env IS RECOMMENDED)
    }
};
