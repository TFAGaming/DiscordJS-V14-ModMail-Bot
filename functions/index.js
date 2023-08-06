const { GuildMember } = require("discord.js");

/**
 * @param {number} ms
 */
const wait = (ms) => {
    return new Promise((res) => setTimeout(res, ms));
};

/**
 * @param {number} ms
 * @param {import("discord.js").TimestampStylesString} style
 */
const time = (ms, style) => {
    return `<t:${Math.floor(ms / 1000)}${style ? `:${style}>` : '>'}`;
};

/**
 * @param {GuildMember} member 
 */
const permissionsCalculator = (member) => {
    let final = '';

    if (member.permissions.has('SendMessages')) {
        final = 'Member';
    };
    
    if (member.permissions.has('BanMembers') || member.permissions.has('KickMembers')) {
        final = 'Moderator';
    };
    
    if (member.permissions.has('ManageGuild')) {
        final = 'Manager';
    };
    
    if (member.permissions.has('Administrator')) {
        final = 'Administrator';
    };
    
    if (member.user.id === member.guild.ownerId) {
        final = 'Owner';
    };

    return final;
};

module.exports = {
    wait,
    time,
    permissionsCalculator
};