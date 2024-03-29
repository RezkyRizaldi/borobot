const {
  bold,
  ChannelType,
  Colors,
  inlineCode,
  OverwriteType,
} = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

const generateEmbed = require('./generateEmbed');
const generatePagination = require('./generatePagination');

/**
 *
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
const findOrCreateRole = async (interaction) => {
  const { guild } = interaction;

  if (!guild) throw "Guild doesn't exists.";

  const memberRole = guild.roles.cache.find(
    (role) => role.id === process.env.MEMBER_ROLE_ID,
  );

  const mutedRole = guild.roles.cache.find(
    (role) => role.name.toLowerCase() === 'muted',
  );

  /** @type {{ channels: { cache: import('discord.js').Collection<String, import('discord.js').BaseGuildTextChannel> } */
  const {
    channels: { cache: baseGuildTextChannels },
  } = guild;

  if (!mutedRole) {
    const role = await guild.roles.create({
      name: 'Muted',
      color: Colors.NotQuiteBlack,
      reason: 'servermute command setup.',
      hoist: false,
      mentionable: false,
      position: memberRole ? memberRole.position + 1 : 1,
      permissions: [],
    });

    baseGuildTextChannels
      .filter(
        (channel) =>
          channel.type !== ChannelType.GuildCategory &&
          channel.type !== ChannelType.GuildVoice &&
          channel.type !== ChannelType.GuildStageVoice,
      )
      .map(async (channel) => {
        if (!channel.parent) {
          await channel.permissionOverwrites.create(
            mutedRole,
            {
              SendMessages: false,
              AddReactions: false,
              CreatePublicThreads: false,
              CreatePrivateThreads: false,
              SendMessagesInThreads: false,
              Speak: false,
            },
            { type: OverwriteType.Role, reason: 'servermute command setup.' },
          );
        }

        /** @type {import('discord.js').CategoryChannel} */
        const categoryChannel =
          await channel.parent.permissionOverwrites.create(
            mutedRole,
            {
              SendMessages: false,
              AddReactions: false,
              CreatePublicThreads: false,
              CreatePrivateThreads: false,
              SendMessagesInThreads: false,
              Speak: false,
            },
            { type: OverwriteType.Role, reason: 'servermute command setup.' },
          );

        categoryChannel.children.cache.map(
          async (c) => await c.lockPermissions(),
        );
      });

    return role;
  }

  baseGuildTextChannels
    .filter(
      (channel) =>
        channel.type !== ChannelType.GuildCategory &&
        channel.type !== ChannelType.GuildVoice &&
        channel.type !== ChannelType.GuildStageVoice &&
        channel.type !== ChannelType.AnnouncementThread &&
        channel.type !== ChannelType.PrivateThread &&
        channel.type !== ChannelType.PublicThread,
    )
    .map(async (channel) => {
      if (!channel.parent) {
        await channel.permissionOverwrites.create(
          mutedRole,
          {
            SendMessages: false,
            AddReactions: false,
            CreatePublicThreads: false,
            CreatePrivateThreads: false,
            SendMessagesInThreads: false,
            Speak: false,
          },
          { type: OverwriteType.Role, reason: 'servermute command setup.' },
        );
      }

      /** @type {import('discord.js').CategoryChannel} */
      const categoryChannel = await channel.parent.permissionOverwrites.create(
        mutedRole,
        {
          SendMessages: false,
          AddReactions: false,
          CreatePublicThreads: false,
          CreatePrivateThreads: false,
          SendMessagesInThreads: false,
          Speak: false,
        },
        { type: OverwriteType.Role, reason: 'servermute command setup.' },
      );

      categoryChannel.children.cache.map(
        async (c) => await c.lockPermissions(),
      );
    });

  return Promise.resolve(mutedRole);
};

/**
 *
 * @param {{ interaction: import('discord.js').ChatInputCommandInteraction, type?: String, isTemporary?: Boolean, all?: Boolean }} data
 */
const applyOrRemoveRole = async ({
  interaction,
  type = 'apply',
  isTemporary = false,
  all = false,
}) => {
  const { guild, options } = interaction;

  if (!guild) throw "Guild doesn't exists.";

  /** @type {import('discord.js').GuildMember} */
  const member = options.getMember('member');
  const reason = options.getString('reason') ?? 'No reason';
  const { roles, voice } = member;

  const muted =
    type === 'apply'
      ? roles.cache.find((role) => role.name.toLowerCase() === 'muted')
      : !roles.cache.find((role) => role.name.toLowerCase() === 'muted');

  if (muted) {
    throw `${member} ${
      type === 'apply' ? 'is already' : "isn't"
    } being muted from ${all ? bold(guild) : 'text channels'}.`;
  }

  const role = await findOrCreateRole(interaction);

  if (all && !voice.channel) {
    await interaction.followUp({
      content: `${member} is not connected to a voice channel.`,
      ephemeral: true,
    });
  }

  if (type === 'apply') {
    const duration = options.getInteger('duration', isTemporary);

    await roles.add(role, reason);

    await interaction.editReply({
      content: `Successfully ${bold('muted')} ${member} from ${
        all ? bold(guild) : 'text channels'
      }${
        isTemporary ? ` for ${inlineCode(`${duration / 1000} seconds`)}` : ''
      }.`,
    });

    if (!member.user.bot) {
      await member
        .send({
          content: `You have been ${bold('muted')} from ${bold(
            guild,
          )} for ${inlineCode(reason)}.`,
        })
        .catch(
          async () =>
            await interaction.followUp({
              content: `Could not send a DM to ${member}.`,
              ephemeral: true,
            }),
        );
    }

    if (isTemporary) {
      await wait(duration);

      await roles.remove(role, 'server mute temporary duration has passed.');

      if (!member.user.bot) {
        await member
          .send({
            content: `Congratulations! You have been ${bold(
              'unmuted',
            )} from ${bold(guild)} for ${inlineCode(
              'server mute duration has passed',
            )}.`,
          })
          .catch(
            async () =>
              await interaction.followUp({
                content: `Could not send a DM to ${member}.`,
                ephemeral: true,
              }),
          );
      }

      return;
    }

    return;
  }

  if (!role) throw `No one is being muted in ${bold(guild)}.`;

  await roles.remove(role, reason);

  if (!member.user.bot) {
    await member
      .send({
        content: `Congratulations! You have been ${bold('unmuted')} from ${bold(
          guild,
        )} for ${inlineCode(reason)}.`,
      })
      .catch(
        async () =>
          await interaction.followUp({
            content: `Could not send a DM to ${member}.`,
            ephemeral: true,
          }),
      );
  }

  await interaction.editReply({
    content: `Successfully ${bold('unmuted')} ${member} from ${
      all ? bold(guild) : 'text channels'
    }.`,
  });
};

/**
 *
 * @param {{ interaction: import('discord.js').ChatInputCommandInteraction, type?: String, isTemporary?: Boolean, all?: Boolean }} data
 */
const createVoiceMute = async ({
  interaction,
  type = 'apply',
  isTemporary = false,
  all = false,
}) => {
  const { guild, options } = interaction;

  if (!guild) throw "Guild doesn't exists.";

  /** @type {import('discord.js').GuildMember} */
  const member = options.getMember('member');
  const reason = options.getString('reason') ?? 'No reason';
  const { voice } = member;

  if (!all && !voice.channel) {
    throw `${member} is not connected to a voice channel.`;
  }

  const muted = type === 'apply' ? voice.serverMute : !voice.serverMute;

  if (muted) {
    throw `${member} ${
      type === 'apply' ? 'is already' : "isn't"
    } being muted from ${all ? bold(guild) : 'voice channels'}.`;
  }

  if (type === 'apply') {
    const duration = options.getInteger('duration', isTemporary);

    await voice.setMute(true, reason);

    await interaction.editReply({
      content: `Successfully ${bold('muted')} ${member} from ${
        all ? bold(guild) : 'voice channels'
      }${
        isTemporary ? ` for ${inlineCode(`${duration / 1000} seconds`)}` : ''
      }.`,
    });

    if (!member.user.bot) {
      await member
        .send({
          content: `You have been ${bold('muted')} from ${bold(
            guild,
          )} for ${inlineCode(reason)}.`,
        })
        .catch(
          async () =>
            await interaction.followUp({
              content: `Could not send a DM to ${member}.`,
              ephemeral: true,
            }),
        );
    }

    if (isTemporary) {
      await wait(duration);

      await voice.setMute(false, 'server mute temporary duration has passed.');

      if (!member.user.bot) {
        await member
          .send({
            content: `Congratulations! You have been ${bold(
              'unmuted',
            )} from ${bold(guild)} for ${inlineCode(
              'server mute duration has passed',
            )}.`,
          })
          .catch(
            async () =>
              await interaction.followUp({
                content: `Could not send a DM to ${member}.`,
                ephemeral: true,
              }),
          );
      }

      return;
    }
  }

  await voice.setMute(false, reason);

  await interaction.editReply({
    content: `Successfully ${bold('unmuted')} ${member} from ${
      all ? bold(guild) : 'voice channels'
    }.`,
  });
};

/**
 *
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @param {String} subcommand
 */
module.exports = async (interaction, subcommand) => {
  const { guild, options, user } = interaction;

  if (!guild) throw "Guild doesn't exists.";

  /** @type {import('discord.js').GuildMember} */
  const member = options.getMember('member');
  const channelType = options.getInteger('channel_type', true);

  if (subcommand !== 'list' && !member.manageable) {
    throw `You don't have appropiate permissions to ${
      subcommand === 'apply' || subcommand === 'temp' ? 'mute' : 'unmute'
    } ${member}.`;
  }

  if (subcommand !== 'list' && member.id === user.id) {
    throw `You can't ${
      subcommand === 'apply' || subcommand === 'temp' ? 'mute' : 'unmute'
    } yourself.`;
  }

  await {
    apply: async () => {
      const type = {
        [ChannelType.GuildText]: async () =>
          await applyOrRemoveRole({ interaction }),
        [ChannelType.GuildVoice]: async () =>
          await createVoiceMute({ interaction }),
        default: async () => {
          await applyOrRemoveRole({ interaction, all: true });

          await createVoiceMute({ interaction, all: true });
        },
      };

      await (type[channelType] || type['default'])();
    },
    temp: async () => {
      const type = {
        [ChannelType.GuildText]: async () =>
          await applyOrRemoveRole({ interaction, isTemporary: true }),
        [ChannelType.GuildVoice]: async () =>
          await createVoiceMute({ interaction, isTemporary: true }),
        default: async () => {
          await applyOrRemoveRole({
            interaction,
            all: true,
            isTemporary: true,
          });

          await createVoiceMute({ interaction, all: true, isTemporary: true });
        },
      };

      await (type[channelType] || type['default'])();
    },
    cease: async () => {
      const type = {
        [ChannelType.GuildText]: async () =>
          await applyOrRemoveRole({ interaction, type: 'remove' }),
        [ChannelType.GuildVoice]: async () =>
          await createVoiceMute({ interaction, type: 'remove' }),
        default: async () => {
          await applyOrRemoveRole({
            interaction,
            type: 'remove',
            all: true,
          });

          await createVoiceMute({ interaction, type: 'remove', all: true });
        },
      };

      await (type[channelType] || type['default'])();
    },
    list: async () => {
      const embed = generateEmbed({ interaction });
      const mutedRole = guild.roles.cache.find(
        (role) => role.name.toLowerCase() === 'muted',
      );

      if (!mutedRole) {
        throw `Can't find role with name ${inlineCode('muted')}.`;
      }

      const textMutedMembers = guild.members.cache.filter(
        (m) => m.id === mutedRole.id,
      );
      const voiceMutedMembers = guild.members.cache.filter(
        (m) => m.voice.serverMute,
      );
      const mutedMembers = guild.members.cache.filter(
        (m) => m.id === mutedRole.id && m.voice.serverMute,
      );
      const type = {
        [ChannelType.GuildText]: async () => {
          if (!textMutedMembers.size) {
            throw 'No one muted in text channels.';
          }

          const descriptions = [...textMutedMembers.values()].map(
            (textMutedMember, i) =>
              `${bold(`${i + 1}.`)} ${textMutedMember} (${
                textMutedMember.user.username
              })`,
          );

          if (textMutedMembers.size > 10) {
            return await generatePagination({ interaction, limit: 10 })
              .setAuthor({
                name: `🔇 Muted Members from Text Channels (${textMutedMembers.size.toLocaleString()})`,
              })
              .setDescriptions(descriptions)
              .render();
          }

          embed
            .setAuthor({
              name: `🔇 Muted Members from Text Channels (${textMutedMembers.size.toLocaleString()})`,
            })
            .setDescription(descriptions.join('\n'));

          return await interaction.editReply({ embeds: [embed] });
        },
        [ChannelType.GuildVoice]: async () => {
          if (!voiceMutedMembers.size) {
            throw 'No one muted in voice channels.';
          }

          const descriptions = [...voiceMutedMembers.values()].map(
            (voiceMutedMember, i) =>
              `${bold(`${i + 1}.`)} ${voiceMutedMember} (${
                voiceMutedMember.user.username
              })`,
          );

          if (voiceMutedMembers.size > 10) {
            return await generatePagination({ interaction, limit: 10 })
              .setAuthor({
                name: `🔇 Muted Members from Voice Channels (${voiceMutedMembers.size.toLocaleString()})`,
              })
              .setDescriptions(descriptions)
              .render();
          }

          embed
            .setAuthor({
              name: `🔇 Muted Members from Voice Channels (${voiceMutedMembers.size.toLocaleString()})`,
            })
            .setDescription(descriptions.join('\n'));

          return await interaction.editReply({ embeds: [embed] });
        },
        default: async () => {
          if (!mutedMembers.size) {
            throw `No one muted in ${bold(guild)}.`;
          }

          const descriptions = [...mutedMembers.values()].map(
            (mutedMember, i) =>
              `${bold(`${i + 1}.`)} ${mutedMember} (${
                mutedMember.user.username
              })`,
          );

          if (mutedMembers.size > 10) {
            return await generatePagination({ interaction, limit: 10 })
              .setAuthor({
                name: `🔇 Muted Members from ${guild} (${mutedMembers.size.toLocaleString()})`,
              })
              .setDescriptions(descriptions)
              .render();
          }

          embed
            .setAuthor({
              name: `🔇 Muted Members from ${guild} (${mutedMembers.size.toLocaleString()})`,
            })
            .setDescription(descriptions.join('\n'));

          return await interaction.editReply({ embeds: [embed] });
        },
      };

      await (type[channelType] || type['default'])();
    },
  }[subcommand]();
};
