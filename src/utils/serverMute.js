const {
  bold,
  ChannelType,
  Colors,
  inlineCode,
  EmbedBuilder,
} = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const { Pagination } = require('pagination.djs');

/**
 *
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @param {String} subcommand
 * @returns {Promise<import('discord.js').Message<Boolean>>} The interaction message response.
 */
module.exports = async (interaction, subcommand) => {
  const { client, guild, options, user } = interaction;

  /** @type {import('discord.js').GuildMember} */
  const member = options.getMember('member');
  const channelType = options.getInteger('channel_type');

  if (subcommand !== 'list' && !member.manageable) {
    return interaction.editReply({
      content: `You don't have appropiate permissions to ${
        subcommand === 'apply' || subcommand === 'temp' ? 'mute' : 'unmute'
      } ${member}.`,
    });
  }

  if (subcommand !== 'list' && member.id === user.id) {
    return interaction.editReply({
      content: `You can't ${
        subcommand === 'apply' || subcommand === 'temp' ? 'mute' : 'unmute'
      } yourself.`,
    });
  }

  switch (subcommand) {
    case 'apply':
      switch (channelType) {
        case ChannelType.GuildText:
          return applyOrRemoveRole({ interaction });

        case ChannelType.GuildVoice:
          return createVoiceMute({ interaction });

        default:
          return applyOrRemoveRole({ interaction, all: true }).then(() =>
            createVoiceMute({ interaction, all: true }),
          );
      }

    case 'temp':
      switch (channelType) {
        case ChannelType.GuildText:
          return applyOrRemoveRole({ interaction, isTemporary: true });

        case ChannelType.GuildVoice:
          return createVoiceMute({ interaction, isTemporary: true });

        default:
          return applyOrRemoveRole({
            interaction,
            all: true,
            isTemporary: true,
          }).then(() =>
            createVoiceMute({ interaction, all: true, isTemporary: true }),
          );
      }

    case 'cease':
      switch (channelType) {
        case ChannelType.GuildText:
          return applyOrRemoveRole({ interaction, type: 'remove' });

        case ChannelType.GuildVoice:
          return createVoiceMute({ interaction, type: 'remove' });

        default:
          return applyOrRemoveRole({
            interaction,
            type: 'remove',
            all: true,
          }).then(() =>
            createVoiceMute({ interaction, type: 'remove', all: true }),
          );
      }

    case 'list': {
      const embed = new EmbedBuilder()
        .setColor(guild.members.me.displayHexColor)
        .setTimestamp(Date.now())
        .setFooter({
          text: client.user.username,
          iconURL: client.user.displayAvatarURL({
            dynamic: true,
          }),
        });

      const textMutedMembers = guild.members.cache.filter((m) =>
        m.roles.cache.find((role) => role.name.toLowerCase() === 'muted'),
      );

      const voiceMutedMembers = guild.members.cache.filter(
        (m) => m.voice.serverMute,
      );

      const mutedMembers = guild.members.cache.filter(
        (m) =>
          m.roles.cache.find((role) => role.name.toLowerCase() === 'muted') &&
          m.voice.serverMute,
      );

      switch (channelType) {
        case ChannelType.GuildText: {
          if (!textMutedMembers.size) {
            return interaction.editReply({
              content: 'No one muted in text channels.',
            });
          }

          const descriptions = [...textMutedMembers.values()].map(
            (textMutedMember, index) =>
              `${bold(`${index + 1}.`)} ${textMutedMember} (${
                textMutedMember.user.username
              })`,
          );

          if (textMutedMembers.size > 10) {
            const pagination = new Pagination(interaction, {
              limit: 10,
            });

            pagination.setColor(guild.members.me.displayHexColor);
            pagination.setTimestamp(Date.now());
            pagination.setFooter({
              text: `${client.user.username} | Page {pageNumber} of {totalPages}`,
              iconURL: client.user.displayAvatarURL({
                dynamic: true,
              }),
            });
            pagination.setAuthor({
              name: `🔇 Muted Members from Text Channels (${textMutedMembers.size})`,
            });
            pagination.setDescriptions(descriptions);

            return pagination.render();
          }

          embed.setAuthor({
            name: `🔇 Muted Members from Text Channels (${textMutedMembers.size})`,
          });
          embed.setDescription(descriptions.join('\n'));

          return interaction.editReply({ embeds: [embed] });
        }

        case ChannelType.GuildVoice: {
          if (!voiceMutedMembers.size) {
            return interaction.editReply({
              content: 'No one muted in voice channels.',
            });
          }

          const descriptions = [...voiceMutedMembers.values()].map(
            (voiceMutedMember, index) =>
              `${bold(`${index + 1}.`)} ${voiceMutedMember} (${
                voiceMutedMember.user.username
              })`,
          );

          if (voiceMutedMembers.size > 10) {
            const pagination = new Pagination(interaction, {
              limit: 10,
            });

            pagination.setColor(guild.members.me.displayHexColor);
            pagination.setTimestamp(Date.now());
            pagination.setFooter({
              text: `${client.user.username} | Page {pageNumber} of {totalPages}`,
              iconURL: client.user.displayAvatarURL({
                dynamic: true,
              }),
            });
            pagination.setAuthor({
              name: `🔇 Muted Members from Voice Channels (${voiceMutedMembers.size})`,
            });
            pagination.setDescriptions(descriptions);

            return pagination.render();
          }

          embed.setAuthor({
            name: `🔇 Muted Members from Voice Channels (${voiceMutedMembers.size})`,
          });
          embed.setDescription(descriptions.join('\n'));

          return interaction.editReply({ embeds: [embed] });
        }

        default: {
          if (!textMutedMembers.size && !voiceMutedMembers.size) {
            return interaction.editReply({
              content: `No one muted in ${bold(guild)}.`,
            });
          }

          const descriptions = [...mutedMembers.values()].map(
            (mutedMember, index) =>
              `${bold(`${index + 1}.`)} ${mutedMember} (${
                mutedMember.user.username
              })`,
          );

          if (mutedMembers.size > 10) {
            const pagination = new Pagination(interaction, {
              limit: 1,
            });

            pagination.setColor(guild.members.me.displayHexColor);
            pagination.setTimestamp(Date.now());
            pagination.setFooter({
              text: `${client.user.username} | Page {pageNumber} of {totalPages}`,
              iconURL: client.user.displayAvatarURL({
                dynamic: true,
              }),
            });
            pagination.setAuthor({
              name: `🔇 Muted Members from ${guild} (${mutedMembers.size})`,
            });
            pagination.setDescriptions(descriptions);

            return pagination.render();
          }

          embed.setAuthor({
            name: `🔇 Muted Members from ${guild} (${mutedMembers.size})`,
          });
          embed.setDescription(descriptions.join('\n'));

          return interaction.editReply({ embeds: [embed] });
        }
      }
    }
  }
};

/**
 *
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @returns {Promise<import('discord.js').Role>} The muted role.
 */
const findOrCreateRole = async (interaction) => {
  const { guild } = interaction;

  const memberRole = guild.roles.cache.find(
    (role) => role.id === process.env.MEMBER_ROLE_ID,
  );

  const mutedRole = guild.roles.cache.find(
    (role) => role.name.toLowerCase() === 'muted',
  );

  if (!mutedRole) {
    return guild.roles
      .create({
        name: 'Muted',
        color: Colors.NotQuiteBlack,
        reason: 'servermute command setup.',
        hoist: false,
        mentionable: false,
        position: memberRole ? memberRole.position + 1 : 1,
        permissions: [],
      })
      .then(async (role) => {
        guild.channels.cache
          .filter((channel) => channel.type === ChannelType.GuildText)
          .map(
            async (channel) =>
              await channel.permissionOverwrites.create(role, {
                SendMessages: false,
                AddReactions: false,
                CreatePublicThreads: false,
                CreatePrivateThreads: false,
                SendMessagesInThreads: false,
                Speak: false,
              }),
          );

        return role;
      });
  }

  return new Promise((resolve) => {
    resolve(mutedRole);
  });
};

/**
 *
 * @param {{ interaction: import('discord.js').ChatInputCommandInteraction, type?: String, isTemporary?: Boolean, all?: Boolean }} data
 * @returns {Promise<import('discord.js').Message<Boolean>>} The interaction message responses.
 */
const applyOrRemoveRole = async ({
  interaction,
  type = 'apply',
  isTemporary = false,
  all = false,
}) => {
  const { guild, options } = interaction;

  /** @type {import('discord.js').GuildMember} */
  const member = options.getMember('member');
  const duration = options.getInteger('duration');
  const reason = options.getString('reason') ?? 'No reason';
  const { roles, voice } = member;

  const muted =
    type === 'apply'
      ? roles.cache.find((role) => role.name.toLowerCase() === 'muted')
      : !roles.cache.find((role) => role.name.toLowerCase() === 'muted');

  if (muted) {
    return interaction.editReply({
      content: `${member} ${
        type === 'apply' ? 'is already' : "isn't"
      } being muted from ${all ? bold(guild) : 'text channels'}.`,
    });
  }

  return findOrCreateRole(interaction).then(async (role) => {
    if (type === 'apply') {
      return roles.add(role, reason).then(async (m) => {
        await interaction.editReply({
          content: `Successfully ${bold('muted')} ${m} from ${
            all ? bold(guild) : 'text channels'
          }${
            isTemporary
              ? ` for ${inlineCode(`${duration / 1000} seconds`)}`
              : ''
          }.`,
        });

        if (!member.user.bot) {
          await member
            .send({
              content: `You have been ${bold('muted')} from ${bold(
                guild,
              )} for ${inlineCode(reason)}.`,
            })
            .catch(async (err) => {
              console.error(err);

              await interaction.followUp({
                content: `Could not send a DM to ${member}.`,
                ephemeral: true,
              });
            });
        }

        if (isTemporary) {
          if (all && !voice.serverMute) {
            await interaction.followUp({
              content: `${member} is not connected to a voice channel.`,
              ephemeral: true,
            });
          }

          await wait(duration);

          await roles.remove(
            role,
            'server mute temporary duration has passed.',
          );

          if (!member.user.bot) {
            return member
              .send({
                content: `Congratulations! You have been ${bold(
                  'unmuted',
                )} from ${bold(guild)} for ${inlineCode(
                  'server mute duration has passed',
                )}.`,
              })
              .catch(async (err) => {
                console.error(err);

                await interaction.followUp({
                  content: `Could not send a DM to ${member}.`,
                  ephemeral: true,
                });
              });
          }
        }
      });
    }

    if (!role) {
      return interaction.editReply({
        content: `No one is being muted in ${bold(guild)}.`,
      });
    }

    return roles.remove(role, reason).then(async (m) => {
      await interaction.editReply({
        content: `Successfully ${bold('unmuted')} ${m} from ${
          all ? bold(guild) : 'text channels'
        }.`,
      });

      if (!m.user.bot) {
        return m
          .send({
            content: `Congratulations! You have been ${bold(
              'unmuted',
            )} from ${bold(guild)} for ${inlineCode(reason)}.`,
          })
          .catch(async (err) => {
            console.error(err);

            await interaction.followUp({
              content: `Could not send a DM to ${m}.`,
              ephemeral: true,
            });
          });
      }
    });
  });
};

/**
 *
 * @param {{ interaction: import('discord.js').ChatInputCommandInteraction, type?: String, isTemporary?: Boolean, all?: Boolean }} data
 * @returns {Promise<import('discord.js').Message<Boolean>>} The interaction message responses.
 */
const createVoiceMute = async ({
  interaction,
  type = 'apply',
  isTemporary = false,
  all = false,
}) => {
  const { guild, options } = interaction;

  /** @type {import('discord.js').GuildMember} */
  const member = options.getMember('member');
  const duration = options.getInteger('duration');
  const reason = options.getString('reason') ?? 'No reason';
  const { voice } = member;

  if (!voice.channel) {
    if (all && !isTemporary) {
      return interaction.followUp({
        content: `${member} is not connected to a voice channel.`,
        ephemeral: true,
      });
    }

    return interaction.editReply({
      content: `${member} is not connected to a voice channel.`,
    });
  }

  const muted = type === 'apply' ? voice.serverMute : !voice.serverMute;

  if (muted) {
    return interaction.editReply({
      content: `${member} ${
        type === 'apply' ? 'is already' : "isn't"
      } being muted from ${all ? bold(guild) : 'voice channels'}.`,
    });
  }

  if (type === 'apply') {
    return voice.setMute(true, reason).then(async (m) => {
      await interaction.editReply({
        content: `Successfully ${bold('muted')} ${m} from ${
          all ? bold(guild) : 'voice channels'
        }${
          isTemporary ? ` for ${inlineCode(`${duration / 1000} seconds`)}` : ''
        }.`,
      });

      if (!m.user.bot) {
        await m
          .send({
            content: `You have been ${bold('muted')} from ${bold(
              guild,
            )} for ${inlineCode(reason)}.`,
          })
          .catch(async (err) => {
            console.error(err);

            await interaction.followUp({
              content: `Could not send a DM to ${m}.`,
              ephemeral: true,
            });
          });
      }

      if (isTemporary) {
        await wait(duration);

        await voice.setMute(
          false,
          'server mute temporary duration has passed.',
        );

        if (!m.user.bot) {
          return member
            .send({
              content: `Congratulations! You have been ${bold(
                'unmuted',
              )} from ${bold(guild)} for ${inlineCode(
                'server mute duration has passed',
              )}.`,
            })
            .catch(async (err) => {
              console.error(err);

              await interaction.followUp({
                content: `Could not send a DM to ${member}.`,
                ephemeral: true,
              });
            });
        }
      }
    });
  }

  return voice.setMute(false, reason).then(async (m) => {
    await interaction.editReply({
      content: `Successfully ${bold('unmuted')} ${m} from ${
        all ? bold(guild) : 'voice channels'
      }.`,
    });
  });
};
