const {
  AuditLogEvent,
  bold,
  EmbedBuilder,
  Events,
  hyperlink,
  italic,
  time,
  TimestampStyles,
  WebhookClient,
} = require('discord.js');
const moment = require('moment');

const {
  applyDefaultMessageNotifications,
  applyExplicitContentFilter,
  applyNSFWLevel,
  applyVerificationLevel,
  getPreferredLocale,
} = require('../../utils');

module.exports = {
  name: Events.GuildUpdate,

  /**
   *
   * @param {import('discord.js').Guild} oldGuild
   * @param {import('discord.js').Guild} newGuild
   */
  async execute(oldGuild, newGuild) {
    const { client } = oldGuild;

    const ServerLogger = new WebhookClient({
      id: process.env.SERVER_EDIT_WEBHOOK_ID,
      token: process.env.SERVER_EDIT_WEBHOOK_TOKEN,
    });

    const editLog = await oldGuild
      .fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.GuildUpdate,
      })
      .then((audit) => audit.entries.first());

    const embed = new EmbedBuilder()
      .setColor(oldGuild.members.me?.displayHexColor ?? null)
      .setTimestamp(Date.now())
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setAuthor({
        name: `${oldGuild.icon ? '✏️ ' : ''}Server Edited`,
        iconURL: oldGuild.iconURL({ dynamic: true }) ?? undefined,
      })
      .setFields([
        {
          name: '🕒 Edited At',
          value: time(
            Math.floor(Date.now() / 1000),
            TimestampStyles.RelativeTime,
          ),
          inline: true,
        },
        { name: '📄 Reason', value: editLog.reason ?? 'No reason' },
      ]);

    if (oldGuild.afkChannelId !== newGuild.afkChannelId) {
      embed
        .setDescription(
          `${oldGuild}'s server inactive channel was ${bold('edited')} by ${
            editLog.executor
          }.`,
        )
        .spliceFields(
          0,
          0,
          {
            name: '🕒 Before',
            value: oldGuild.afkChannel
              ? `${oldGuild.afkChannel}`
              : italic('None'),
            inline: true,
          },
          {
            name: '🕒 After',
            value: newGuild.afkChannel
              ? `${newGuild.afkChannel}`
              : italic('None'),
            inline: true,
          },
        );

      await ServerLogger.send({ embeds: [embed] });
    }

    if (oldGuild.afkTimeout !== newGuild.afkTimeout) {
      embed
        .setDescription(
          `${oldGuild}'s server inactive channel was ${bold('edited')} by ${
            editLog.executor
          }.`,
        )
        .spliceFields(
          0,
          0,
          {
            name: '🕒 Before',
            value: moment.duration(oldGuild.afkTimeout).humanize(),
            inline: true,
          },
          {
            name: '🕒 After',
            value: moment.duration(newGuild.afkTimeout).humanize(),
            inline: true,
          },
        );

      await ServerLogger.send({ embeds: [embed] });
    }

    if (oldGuild.banner !== newGuild.banner) {
      embed
        .setDescription(
          `${oldGuild}'s server banner was ${bold('edited')} by ${
            editLog.executor
          }.`,
        )
        .spliceFields(
          0,
          0,
          {
            name: '🕒 Before',
            value: oldGuild.banner
              ? hyperlink('Old banner', oldGuild.bannerURL({ dynamic: true }))
              : italic('None'),
            inline: true,
          },
          {
            name: '🕒 After',
            value: newGuild.banner
              ? hyperlink('New banner', newGuild.bannerURL({ dynamic: true }))
              : italic('None'),
            inline: true,
          },
        );

      await ServerLogger.send({ embeds: [embed] });
    }

    if (
      oldGuild.defaultMessageNotifications !==
      newGuild.defaultMessageNotifications
    ) {
      embed
        .setDescription(
          `${oldGuild}'s server default messages notification was ${bold(
            'edited',
          )} by ${editLog.executor}.`,
        )
        .spliceFields(
          0,
          0,
          {
            name: '🕒 Before',
            value: applyDefaultMessageNotifications(
              oldGuild.defaultMessageNotifications,
            ),
            inline: true,
          },
          {
            name: '🕒 After',
            value: applyDefaultMessageNotifications(
              newGuild.defaultMessageNotifications,
            ),
            inline: true,
          },
        );

      await ServerLogger.send({ embeds: [embed] });
    }

    if (oldGuild.description !== newGuild.description) {
      embed
        .setDescription(
          `${oldGuild}'s server description was ${bold('edited')} by ${
            editLog.executor
          }.`,
        )
        .spliceFields(
          0,
          0,
          {
            name: '🕒 Before',
            value: oldGuild.description ?? italic('None'),
            inline: true,
          },
          {
            name: '🕒 After',
            value: newGuild.description ?? italic('None'),
            inline: true,
          },
        );

      await ServerLogger.send({ embeds: [embed] });
    }

    if (oldGuild.explicitContentFilter !== newGuild.explicitContentFilter) {
      embed
        .setDescription(
          `${oldGuild}'s server explicit media content filter was ${bold(
            'edited',
          )} by ${editLog.executor}.`,
        )
        .spliceFields(
          0,
          0,
          {
            name: '🕒 Before',
            value: applyExplicitContentFilter(oldGuild.explicitContentFilter),
            inline: true,
          },
          {
            name: '🕒 After',
            value: applyExplicitContentFilter(newGuild.explicitContentFilter),
            inline: true,
          },
        );

      await ServerLogger.send({ embeds: [embed] });
    }

    if (oldGuild.icon !== newGuild.icon) {
      embed
        .setDescription(
          `${oldGuild}'s server icon was ${bold('edited')} by ${
            editLog.executor
          }.`,
        )
        .spliceFields(
          0,
          0,
          {
            name: '🕒 Before',
            value: oldGuild.icon
              ? oldGuild.iconURL({ dynamic: true })
              : italic('None'),
            inline: true,
          },
          {
            name: '🕒 After',
            value: newGuild.icon
              ? newGuild.iconURL({ dynamic: true })
              : italic('None'),
            inline: true,
          },
        );

      await ServerLogger.send({ embeds: [embed] });
    }

    if (oldGuild.name !== newGuild.name) {
      embed
        .setDescription(
          `${oldGuild}'s server name was ${bold('edited')} by ${
            editLog.executor
          }.`,
        )
        .spliceFields(
          0,
          0,
          { name: '🕒 Before', value: oldGuild.name, inline: true },
          { name: '🕒 After', value: newGuild.name, inline: true },
        );

      await ServerLogger.send({ embeds: [embed] });
    }

    if (oldGuild.nsfwLevel !== newGuild.nsfwLevel) {
      embed
        .setDescription(
          `${oldGuild}'s server NSFW level was ${bold('edited')} by ${
            editLog.executor
          }.`,
        )
        .spliceFields(
          0,
          0,
          {
            name: '🕒 Before',
            value: applyNSFWLevel(oldGuild.nsfwLevel),
            inline: true,
          },
          {
            name: '🕒 After',
            value: applyNSFWLevel(newGuild.nsfwLevel),
            inline: true,
          },
        );

      await ServerLogger.send({ embeds: [embed] });
    }

    if (oldGuild.preferredLocale !== newGuild.preferredLocale) {
      embed
        .setDescription(
          `${oldGuild}'s server primary language was ${bold('edited')} by ${
            editLog.executor
          }.`,
        )
        .spliceFields(
          0,
          0,
          {
            name: '🕒 Before',
            value: getPreferredLocale(oldGuild.preferredLocale),
            inline: true,
          },
          {
            name: '🕒 After',
            value: getPreferredLocale(newGuild.preferredLocale),
            inline: true,
          },
        );

      await ServerLogger.send({ embeds: [embed] });
    }

    if (oldGuild.publicUpdatesChannelId !== newGuild.publicUpdatesChannelId) {
      embed
        .setDescription(
          `${oldGuild}'s server community updates channel was ${bold(
            'edited',
          )} by ${editLog.executor}.`,
        )
        .spliceFields(
          0,
          0,
          {
            name: '🕒 Before',
            value: oldGuild.publicUpdatesChannel
              ? `${oldGuild.publicUpdatesChannel}`
              : italic('None'),
            inline: true,
          },
          {
            name: '🕒 After',
            value: newGuild.publicUpdatesChannel
              ? `${newGuild.publicUpdatesChannel}`
              : italic('None'),
            inline: true,
          },
        );

      await ServerLogger.send({ embeds: [embed] });
    }

    if (oldGuild.rulesChannelId !== newGuild.rulesChannelId) {
      embed
        .setDescription(
          `${oldGuild}'s server rules channel was ${bold('edited')} by ${
            editLog.executor
          }.`,
        )
        .spliceFields(
          0,
          0,
          {
            name: '🕒 Before',
            value: oldGuild.rulesChannel
              ? `${oldGuild.rulesChannel}`
              : italic('None'),
            inline: true,
          },
          {
            name: '🕒 After',
            value: newGuild.rulesChannel
              ? `${newGuild.rulesChannel}`
              : italic('None'),
            inline: true,
          },
        );

      await ServerLogger.send({ embeds: [embed] });
    }

    if (oldGuild.systemChannelId !== newGuild.systemChannelId) {
      embed
        .setDescription(
          `${oldGuild}'s server system channel was ${bold('edited')} by ${
            editLog.executor
          }.`,
        )
        .spliceFields(
          0,
          0,
          {
            name: '🕒 Before',
            value: oldGuild.systemChannel
              ? `${oldGuild.systemChannel}`
              : italic('None'),
            inline: true,
          },
          {
            name: '🕒 After',
            value: newGuild.systemChannel
              ? `${newGuild.systemChannel}`
              : italic('None'),
            inline: true,
          },
        );

      await ServerLogger.send({ embeds: [embed] });
    }

    if (oldGuild.verificationLevel !== newGuild.verificationLevel) {
      embed
        .setDescription(
          `${oldGuild}'s server verification level was ${bold('edited')} by ${
            editLog.executor
          }.`,
        )
        .spliceFields(
          0,
          0,
          {
            name: '🕒 Before',
            value: applyVerificationLevel(oldGuild.verificationLevel),
            inline: true,
          },
          {
            name: '🕒 After',
            value: applyVerificationLevel(newGuild.verificationLevel),
            inline: true,
          },
        );

      await ServerLogger.send({ embeds: [embed] });
    }

    if (oldGuild.widgetChannelId !== newGuild.widgetChannelId) {
      embed
        .setDescription(
          `${oldGuild}'s server system channel was ${bold('edited')} by ${
            editLog.executor
          }.`,
        )
        .spliceFields(
          0,
          0,
          {
            name: '🕒 Before',
            value: oldGuild.widgetChannel
              ? `${oldGuild.widgetChannel}`
              : italic('None'),
            inline: true,
          },
          {
            name: '🕒 After',
            value: newGuild.widgetChannel
              ? `${newGuild.widgetChannel}`
              : italic('None'),
            inline: true,
          },
        );

      await ServerLogger.send({ embeds: [embed] });
    }
  },
};
