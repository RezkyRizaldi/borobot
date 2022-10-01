const { PermissionFlagsBits, PermissionsBitField } = require('discord.js');

/**
 *
 * @param {PermissionFlagsBits} permission
 * @returns {String} The application command permission.
 */
module.exports = (permission) => {
  return {
    [PermissionsBitField.Default]: 'Default',
    [PermissionFlagsBits.AddReactions]: 'Add Reactions',
    [PermissionFlagsBits.Administrator]: 'Administrator',
    [PermissionFlagsBits.AttachFiles]: 'Attach Files',
    [PermissionFlagsBits.BanMembers]: 'Ban Members',
    [PermissionFlagsBits.ChangeNickname]: 'Change Nickname',
    [PermissionFlagsBits.Connect]: 'Connect',
    [PermissionFlagsBits.CreateInstantInvite]: 'Create Insant Invite',
    [PermissionFlagsBits.CreatePrivateThreads]: 'Create Private Threads',
    [PermissionFlagsBits.CreatePublicThreads]: 'Create Public Threads',
    [PermissionFlagsBits.DeafenMembers]: 'Deafen Members',
    [PermissionFlagsBits.EmbedLinks]: 'Embed Links',
    [PermissionFlagsBits.KickMembers]: 'Kick Members',
    [PermissionFlagsBits.ManageChannels]: 'Manage Channels',
    [PermissionFlagsBits.ManageEmojisAndStickers]: 'Manage Emojis and Stickers',
    [PermissionFlagsBits.ManageEvents]: 'Manage Events',
    [PermissionFlagsBits.ManageGuild]: 'Manage Guild',
    [PermissionFlagsBits.ManageMessages]: 'Manage Messages',
    [PermissionFlagsBits.ManageNicknames]: 'Manage Nicknames',
    [PermissionFlagsBits.ManageRoles]: 'Manage Roles',
    [PermissionFlagsBits.ManageThreads]: 'Manage Threads',
    [PermissionFlagsBits.ManageWebhooks]: 'Manage Webhooks',
    [PermissionFlagsBits.MentionEveryone]: 'Mention Everyone',
    [PermissionFlagsBits.ModerateMembers]: 'Moderate Members',
    [PermissionFlagsBits.MoveMembers]: 'Move Members',
    [PermissionFlagsBits.MuteMembers]: 'Mute Members',
    [PermissionFlagsBits.PrioritySpeaker]: 'Priority Speaker',
    [PermissionFlagsBits.ReadMessageHistory]: 'Read Message History',
    [PermissionFlagsBits.RequestToSpeak]: 'Request To Speak',
    [PermissionFlagsBits.SendMessages]: 'Send Messages',
    [PermissionFlagsBits.SendMessagesInThreads]: 'Send Messages in Threads',
    [PermissionFlagsBits.SendTTSMessages]: 'Send TTS Messages',
    [PermissionFlagsBits.Speak]: 'Speak',
    [PermissionFlagsBits.Stream]: 'Stream',
    [PermissionFlagsBits.UseApplicationCommands]: 'Use Application Commands',
    [PermissionFlagsBits.UseEmbeddedActivities]: 'Use Embedded Avtivities',
    [PermissionFlagsBits.UseExternalEmojis]: 'Use External Emojis',
    [PermissionFlagsBits.UseExternalStickers]: 'Use External Stickers',
    [PermissionFlagsBits.UseVAD]: 'Use VAD',
    [PermissionFlagsBits.ViewAuditLog]: 'View Audit Log',
    [PermissionFlagsBits.ViewChannel]: 'View Channel',
    [PermissionFlagsBits.ViewGuildInsights]: 'View Guild Insights',
  }[permission];
};
