const { bold, ChannelType, Colors, inlineCode } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

/**
 *
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @param {String} subcommand
 * @returns {Promise<import('discord.js').Message<Boolean>>} The interaction message response.
 */
module.exports = async (interaction, subcommand) => {
  const { options, user } = interaction;

  /** @type {import('discord.js').GuildMember} */
  const member = options.getMember('member');
  const channelType = options.getInteger('channel_type');

  if (member.id === user.id) {
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

      await m
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

      if (isTemporary) {
        await wait(duration);

        await voice.setMute(
          false,
          'server mute temporary duration has passed.',
        );

        await member
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
