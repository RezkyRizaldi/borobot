const { ButtonBuilder, ButtonStyle } = require('discord.js');
const { t } = require('i18next');
const { Pagination } = require('pagination.djs');

/**
 *
 * @param {{ interaction: import('discord.js').ChatInputCommandInteraction, limit: Number|undefined, attachments: (import('discord.js').AttachmentBuilder | import('discord.js').Attachment | import('discord.js').BufferResolvable | import('stream').Stream | import('discord.js').JSONEncodable<import('discord.js').APIAttachment> | import('discord.js').AttachmentPayload)[]|undefined }}
 */
module.exports = ({ interaction, limit = 5, attachments }) => {
  /** @type {{ client: import('@/constants/types').Client, guild: ?import('discord.js').Guild }} */
  const { client, guild } = interaction;

  if (!guild) throw t('global.error.guild');

  const { paginations } = client;

  const pagination = new Pagination(interaction, { limit, attachments })
    .setColor(guild.members.me?.displayColor ?? null)
    .setTimestamp(Date.now());

  if (limit) {
    pagination.setFooter({
      text: t('global.pagination.footer', {
        botUsername: client.user.username,
      }),
      iconURL: client.user.displayAvatarURL(),
    });
  }

  pagination.buttons = {
    ...pagination.buttons,
    extra: new ButtonBuilder()
      .setCustomId('jump')
      .setEmoji('↕️')
      .setDisabled(false)
      .setStyle(ButtonStyle.Secondary),
  };

  paginations.set(pagination.interaction.id, pagination);

  return pagination;
};
