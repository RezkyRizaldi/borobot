const axios = require('axios').default;
const { bold, codeBlock, SlashCommandBuilder } = require('discord.js');

const { generateEmbed } = require('../../utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('game')
    .setDescription('🎮 games command.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('brainteaser')
        .setDescription('🧠 Play a brain teaser game.'),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('caklontong')
        .setDescription('👨‍🎓 Play a Cak Lontong quiz game.'),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('dadjokes')
        .setDescription('😂 Play a dad jokes game.'),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('guessword')
        .setDescription('🔤 Play a guess the word game.'),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('tebakgambar')
        .setDescription('🖼️ Play a Tebak Gambar game.'),
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('whoami').setDescription('❓ Play a Who am I game.'),
    ),
  type: 'Chat Input',

  /**
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    /** @type {{ channel: ?import('discord.js').BaseGuildTextChannel, options: Omit<import('discord.js').CommandInteractionOptionResolver<import('discord.js').CacheType>, 'getMessage' | 'getFocused'> }} */
    const { channel, options } = interaction;

    await interaction.deferReply();

    if (!channel) throw "Channel doesn't exist.";

    const baseURL = 'https://api.lolhuman.xyz/api';

    const embed = generateEmbed({ interaction });

    return {
      brainteaser: async () => {
        /** @type {{ data: { result: import('../../constants/types').BrainTeaser } }} */
        const {
          data: {
            result: { pertanyaan, jawaban },
          },
        } = await axios.get(
          `${baseURL}/tebak/asahotak?apikey=${process.env.LOLHUMAN_API_KEY}`,
        );

        embed
          .setAuthor({ name: '🎮 Brain Teaser Game' })
          .setDescription(`${pertanyaan}${codeBlock('(15s remaining)')}`);

        const message = await interaction.editReply({ embeds: [embed] });

        /**
         *
         * @param {import('discord.js').Message} msg
         * @returns Boolean value of the filtered interaction.
         */
        const filter = (msg) =>
          msg.content.toLowerCase() === jawaban.toLowerCase();

        let time = 15000;

        /** @type {NodeJS.Timer|null} */
        let interval = null;
        const checkMessage = () => {
          switch (true) {
            case time <= 0:
              clearInterval(interval);

              embed.setDescription(`The answer is: ${bold(jawaban)}`);

              return message.edit({ embeds: [embed] });

            case filter(channel.lastMessage):
              clearInterval(interval);

              embed.setDescription(
                `Congratulations! Your answer is correct\nThe answer is: ${bold(
                  jawaban,
                )}`,
              );

              return message.edit({ embeds: [embed] });

            default:
              time -= 1000;

              embed.setDescription(
                `${pertanyaan}${codeBlock(`(${time / 1000}s remaining)`)}`,
              );

              return message.edit({ embeds: [embed] });
          }
        };

        interval = setInterval(async () => await checkMessage(), 1000);

        return channel
          .awaitMessages({
            filter,
            time,
            max: 1,
            errors: ['time'],
          })
          .then((messages) =>
            setTimeout(async () => await messages.first().delete(), 1000),
          );
      },
      caklontong: async () => {
        /** @type {{ data: { result: import('../../constants/types').CakLontong } }} */
        const {
          data: {
            result: { answer, information, question },
          },
        } = await axios.get(
          `${baseURL}/tebak/caklontong2?apikey=${process.env.LOLHUMAN_API_KEY}`,
        );

        embed
          .setAuthor({ name: '🎮 Cak Lontong Quiz Game' })
          .setDescription(`${question}${codeBlock('(60s remaining)')}`);

        const message = await interaction.editReply({ embeds: [embed] });

        /**
         *
         * @param {import('discord.js').Message} msg
         * @returns Boolean value of the filtered interaction.
         */
        const filter = (msg) =>
          msg.content.toLowerCase() === answer.toLowerCase();

        let time = 60000;

        /** @type {NodeJS.Timer|null} */
        let interval = null;
        const checkMessage = () => {
          switch (true) {
            case time <= 0:
              clearInterval(interval);

              embed.setDescription(
                `The answer is: ${bold(answer)}\nReason: ${information}`,
              );

              return message.edit({ embeds: [embed] });

            case filter(channel.lastMessage):
              clearInterval(interval);

              embed.setDescription(
                `Congratulations! Your answer is correct\nThe answer is: ${bold(
                  answer,
                )}\nReason: ${information}`,
              );

              return message.edit({ embeds: [embed] });

            default:
              time -= 1000;

              embed.setDescription(
                `${question}${codeBlock(`(${time / 1000}s remaining)`)}`,
              );

              return message.edit({ embeds: [embed] });
          }
        };

        interval = setInterval(async () => await checkMessage(), 1000);

        return channel
          .awaitMessages({
            filter,
            time,
            max: 1,
            errors: ['time'],
          })
          .then((messages) =>
            setTimeout(async () => await messages.first().delete(), 1000),
          );
      },
      dadjokes: async () => {
        /** @type {{ data: { result: import('../../constants/types').DadJoke } }} */
        const {
          data: {
            result: { answer, question },
          },
        } = await axios.get(
          `${baseURL}/tebak/jenaka?apikey=${process.env.LOLHUMAN_API_KEY}`,
        );

        embed
          .setAuthor({ name: '🎮 Dad Jokes Game' })
          .setDescription(`${question}${codeBlock('(15s remaining)')}`);

        const message = await interaction.editReply({ embeds: [embed] });

        /**
         *
         * @param {import('discord.js').Message} msg
         * @returns Boolean value of the filtered interaction.
         */
        const filter = (msg) =>
          msg.content.toLowerCase() === answer.toLowerCase();

        let time = 15000;

        /** @type {NodeJS.Timer|null} */
        let interval = null;
        const checkMessage = () => {
          switch (true) {
            case time <= 0:
              clearInterval(interval);

              embed.setDescription(`The answer is: ${bold(answer)}`);

              return message.edit({ embeds: [embed] });

            case filter(channel.lastMessage):
              clearInterval(interval);

              embed.setDescription(
                `Congratulations! Your answer is correct\nThe answer is: ${bold(
                  answer,
                )}`,
              );

              return message.edit({ embeds: [embed] });

            default:
              time -= 1000;

              embed.setDescription(
                `${question}${codeBlock(`(${time / 1000}s remaining)`)}`,
              );

              return message.edit({ embeds: [embed] });
          }
        };

        interval = setInterval(async () => await checkMessage(), 1000);

        return channel
          .awaitMessages({
            filter,
            time,
            max: 1,
            errors: ['time'],
          })
          .then((messages) =>
            setTimeout(async () => await messages.first().delete(), 1000),
          );
      },
      guessword: async () => {
        /** @type {{ data: { result: import('../../constants/types').GuessWord } }} */
        const {
          data: {
            result: { jawaban, pertanyaan },
          },
        } = await axios.get(
          `${baseURL}/tebak/kata?apikey=${process.env.LOLHUMAN_API_KEY}`,
        );

        embed
          .setAuthor({ name: '🎮 Guess The Word Game' })
          .setDescription(`${pertanyaan}${codeBlock('(15s remaining)')}`);

        const message = await interaction.editReply({ embeds: [embed] });

        /**
         *
         * @param {import('discord.js').Message} msg
         * @returns Boolean value of the filtered interaction.
         */
        const filter = (msg) =>
          msg.content.toLowerCase() === jawaban.toLowerCase();

        let time = 15000;

        /** @type {NodeJS.Timer|null} */
        let interval = null;
        const checkMessage = () => {
          switch (true) {
            case time <= 0:
              clearInterval(interval);

              embed.setDescription(`The answer is: ${bold(jawaban)}`);

              return message.edit({ embeds: [embed] });

            case filter(channel.lastMessage):
              clearInterval(interval);

              embed.setDescription(
                `Congratulations! Your answer is correct\nThe answer is: ${bold(
                  jawaban,
                )}`,
              );

              return message.edit({ embeds: [embed] });

            default:
              time -= 1000;

              embed.setDescription(
                `${pertanyaan}${codeBlock(`(${time / 1000}s remaining)`)}`,
              );

              return message.edit({ embeds: [embed] });
          }
        };

        interval = setInterval(async () => await checkMessage(), 1000);

        return channel
          .awaitMessages({
            filter,
            time,
            max: 1,
            errors: ['time'],
          })
          .then((messages) =>
            setTimeout(async () => await messages.first().delete(), 1000),
          );
      },
      tebakgambar: async () => {
        /** @type {{ data: { result: import('../../constants/types').TebakGambar } }} */
        const {
          data: {
            result: { answer, image },
          },
        } = await axios.get(
          `${baseURL}/tebak/gambar?apikey=${process.env.LOLHUMAN_API_KEY}`,
        );

        embed
          .setAuthor({
            name: 'Tebak Gambar Game',
            iconURL:
              'https://upload.wikimedia.org/wikipedia/commons/4/48/Logo_Tebak_Gambar.png',
          })
          .setImage(image)
          .setDescription(codeBlock('(30s remaining)'));

        const message = await interaction.editReply({ embeds: [embed] });

        /**
         *
         * @param {import('discord.js').Message} msg
         * @returns Boolean value of the filtered interaction.
         */
        const filter = (msg) =>
          msg.content.toLowerCase() === answer.toLowerCase();

        let time = 30000;

        /** @type {NodeJS.Timer|null} */
        let interval = null;
        const checkMessage = () => {
          switch (true) {
            case time <= 0:
              clearInterval(interval);

              embed.setDescription(`The answer is: ${bold(answer)}`);

              return message.edit({ embeds: [embed] });

            case filter(channel.lastMessage):
              clearInterval(interval);

              embed.setDescription(
                `Congratulations! Your answer is correct\nThe answer is: ${bold(
                  answer,
                )}`,
              );

              return message.edit({ embeds: [embed] });

            default:
              time -= 1000;

              embed.setDescription(codeBlock(`(${time / 1000}s remaining)`));

              return message.edit({ embeds: [embed] });
          }
        };

        interval = setInterval(async () => await checkMessage(), 1000);

        return channel
          .awaitMessages({
            filter,
            time,
            max: 1,
            errors: ['time'],
          })
          .then((messages) =>
            setTimeout(async () => await messages.first().delete(), 1000),
          );
      },
      whoami: async () => {
        /** @type {{ data: { result: import('../../constants/types').WhoAmI } }} */
        const {
          data: {
            result: { answer, question },
          },
        } = await axios.get(
          `${baseURL}/tebak/siapaaku?apikey=${process.env.LOLHUMAN_API_KEY}`,
        );

        embed
          .setAuthor({ name: '🎮 Who Am I Game' })
          .setDescription(`${question}${codeBlock('(15s remaining)')}`);

        const message = await interaction.editReply({ embeds: [embed] });

        /**
         *
         * @param {import('discord.js').Message} msg
         * @returns Boolean value of the filtered interaction.
         */
        const filter = (msg) =>
          msg.content.toLowerCase() === answer.toLowerCase();

        let time = 15000;

        /** @type {NodeJS.Timer|null} */
        let interval = null;
        const checkMessage = () => {
          switch (true) {
            case time <= 0:
              clearInterval(interval);

              embed.setDescription(`The answer is: ${bold(answer)}`);

              return message.edit({ embeds: [embed] });

            case filter(channel.lastMessage):
              clearInterval(interval);

              embed.setDescription(
                `Congratulations! Your answer is correct\nThe answer is: ${bold(
                  answer,
                )}`,
              );

              return message.edit({ embeds: [embed] });

            default:
              time -= 1000;

              embed.setDescription(
                `${question}${codeBlock(`(${time / 1000}s remaining)`)}`,
              );

              return message.edit({ embeds: [embed] });
          }
        };

        interval = setInterval(async () => await checkMessage(), 1000);

        return channel
          .awaitMessages({
            filter,
            time,
            max: 1,
            errors: ['time'],
          })
          .then((messages) =>
            setTimeout(async () => await messages.first().delete(), 1000),
          );
      },
    }[options.getSubcommand()]();
  },
};
