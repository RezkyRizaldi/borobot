const { EmbedBuilder } = require('@discordjs/builders');

/**
 *
 * @param {{ interaction: import('discord.js').ChatInputCommandInteraction, type?: 'member'|'client'|'target', loop: Boolean, i: Number|undefined, arr: any[]|undefined, target: import('discord.js').GuildMember }}
 */
module.exports = ({
  interaction,
  type = 'client',
  loop = false,
  i,
  arr,
  target,
}) => {
  /** @type {{ client: import('discord.js').Client<true>, guild: ?import('discord.js').Guild, member: ?import('discord.js').GuildMember }} */
  const { client, guild, member } = interaction;

  if (!guild) throw "Guld doesn't exist.";

  if (!member) throw "Member doesn't exist.";

  return new EmbedBuilder()
    .setColor(
      type === 'client'
        ? guild.members.me?.displayColor ?? null
        : type === 'member'
        ? member.displayColor
        : target.displayColor,
    )
    .setTimestamp(Date.now())
    .setFooter({
      text: loop
        ? `${client.user.username} | Page ${i + 1} of ${arr.length}`
        : client.user.username,
      iconURL: client.user.displayAvatarURL(),
    });
};
