const { EmbedBuilder } = require('@discordjs/builders');
const { t } = require('i18next');

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

  if (!guild) throw t('global.error.guild');

  if (!member) throw t('global.error.member');

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
        ? t('global.embed.footer', {
            botUsername: client.user.username,
            pageNumber: i + 1,
            totalPages: arr.length,
          })
        : client.user.username,
      iconURL: client.user.displayAvatarURL(),
    });
};
