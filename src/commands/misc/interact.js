const AnimeImages = require('anime-images-api');
const axios = require('axios').default;
const { SlashCommandBuilder } = require('discord.js');
const nekoClient = require('nekos.life');

const { generateAttachmentFromBuffer, generateEmbed } = require('../../utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('interact')
    .setDescription('🎉 Interact command.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('bite')
        .setDescription('😬 Interact member with a random biting image/gif.')
        .addUserOption((option) =>
          option
            .setName('target')
            .setDescription('👤 The target member to bite.')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('blush')
        .setDescription('😳 Interact member with a random blushing image/gif.')
        .addUserOption((option) =>
          option
            .setName('target')
            .setDescription('👤 The target member to blush.')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('bonk')
        .setDescription('💥 Interact member with a random bonking image/gif.')
        .addUserOption((option) =>
          option
            .setName('target')
            .setDescription('👤 The target member to bonk.')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('cuddle')
        .setDescription('😍 Interact member with a random cuddling image/gif.')
        .addUserOption((option) =>
          option
            .setName('target')
            .setDescription('👤 The target member to cuddle.')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('feed')
        .setDescription('🧑‍🍼 Interact member with a random feeding image/gif.')
        .addUserOption((option) =>
          option
            .setName('target')
            .setDescription('👤 The target member to feed.')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('hug')
        .setDescription('🤗 Interact member with a random hugging image/gif.')
        .addUserOption((option) =>
          option
            .setName('target')
            .setDescription('👤 The target member to hug.')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('kill')
        .setDescription('⚰️ Interact member with a random killing gif.')
        .addUserOption((option) =>
          option
            .setName('target')
            .setDescription('👤 The target member to kill.')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('kiss')
        .setDescription('😘 Interact member with a random kissing image/gif.')
        .addUserOption((option) =>
          option
            .setName('target')
            .setDescription('👤 The target member to kiss.')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('lick')
        .setDescription('👅 Interact member with a random licking image/gif.')
        .addUserOption((option) =>
          option
            .setName('target')
            .setDescription('👤 The target member to lick.')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('pat')
        .setDescription('🖐️ Interact member with a random patting image/gif.')
        .addUserOption((option) =>
          option
            .setName('target')
            .setDescription('👤 The target member to pat.')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('punch')
        .setDescription('👊 Interact member with a random punching gif.')
        .addUserOption((option) =>
          option
            .setName('target')
            .setDescription('👤 The target member to punch.')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('slap')
        .setDescription('🤚 Interact member with a random slapping image/gif.')
        .addUserOption((option) =>
          option
            .setName('target')
            .setDescription('👤 The target member to slap.')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('smug')
        .setDescription('😏 Interact member with a random smugging image/gif.')
        .addUserOption((option) =>
          option
            .setName('target')
            .setDescription('👤 The target member to smug.')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('tickle')
        .setDescription('👉 Interact member with a random tickle image/gif.')
        .addUserOption((option) =>
          option
            .setName('target')
            .setDescription('👤 The target member to tickle.')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('wink')
        .setDescription('😉 Interact member with a random winking gif.')
        .addUserOption((option) =>
          option
            .setName('target')
            .setDescription('👤 The target member to wink.')
            .setRequired(true),
        ),
    ),
  type: 'Chat Input',

  /**
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    /** @type {{ member: ?import('discord.js').GuildMember, options: Omit<import('discord.js').CommandInteractionOptionResolver<import('discord.js').CacheType>, 'getMessage' | 'getFocused'> }} */
    const { member, options } = interaction;

    await interaction.deferReply();

    /** @type {?import('discord.js').GuildMember} */
    const target = options.getMember('target');

    if (!member || !target) throw "Member doesn't exist.";

    const embed = generateEmbed({ interaction, type: 'target', target });

    const images = new AnimeImages();
    const neko = new nekoClient();

    return {
      bite: async () => {
        /** @type {{ data: ArrayBuffer }} */
        const { data: buffer } = await axios.get(
          `https://api.lolhuman.xyz/api/random/bite?apikey=${process.env.LOLHUMAN_API_KEY}`,
          { responseType: 'arraybuffer' },
        );

        const img = await generateAttachmentFromBuffer({
          buffer,
          fileName: 'bite',
          fileDesc: 'biting Image',
        });

        embed
          .setImage(`attachment://${img.name}`)
          .setDescription(`${member} has hugged ${target}!`);

        await interaction.editReply({ embeds: [embed], files: [img] });
      },
      blush: async () => {
        /** @type {{ data: ArrayBuffer }} */
        const { data: buffer } = await axios.get(
          `https://api.lolhuman.xyz/api/random/blush?apikey=${process.env.LOLHUMAN_API_KEY}`,
          { responseType: 'arraybuffer' },
        );

        const img = await generateAttachmentFromBuffer({
          buffer,
          fileName: 'blush',
          fileDesc: 'Blushing Image',
        });

        embed
          .setImage(`attachment://${img.name}`)
          .setDescription(`${member} has hugged ${target}!`);

        await interaction.editReply({ embeds: [embed], files: [img] });
      },
      bonk: async () => {
        /** @type {{ data: ArrayBuffer }} */
        const { data: buffer } = await axios.get(
          `https://api.lolhuman.xyz/api/random/bonk?apikey=${process.env.LOLHUMAN_API_KEY}`,
          { responseType: 'arraybuffer' },
        );

        const img = await generateAttachmentFromBuffer({
          buffer,
          fileName: 'bonk',
          fileDesc: 'Bonking Image',
        });

        embed
          .setImage(`attachment://${img.name}`)
          .setDescription(`${member} has hugged ${target}!`);

        await interaction.editReply({ embeds: [embed], files: [img] });
      },
      cuddle: async () => {
        const { url } = await neko.cuddle();

        /** @type {{ image: String }} */
        const { image } = await images.sfw.cuddle();
        const imgArr = [url, image];
        const cuddle = imgArr[Math.floor(Math.random() * imgArr.length)];

        embed.setImage(cuddle).setDescription(`${member} cuddles ${target}!`);

        await interaction.editReply({ embeds: [embed] });
      },
      feed: async () => {
        const { url } = await neko.feed();

        embed.setImage(url).setDescription(`${member} feeding ${target}!`);

        await interaction.editReply({ embeds: [embed] });
      },
      hug: async () => {
        const { url } = await neko.hug();

        /** @type {{ image: String }} */
        const { image } = await images.sfw.hug();
        const imgArr = [url, image];
        const hug = imgArr[Math.floor(Math.random() * imgArr.length)];

        embed.setImage(hug).setDescription(`${member} has hugged ${target}!`);

        await interaction.editReply({ embeds: [embed] });
      },
      lick: async () => {
        /** @type {{ data: ArrayBuffer }} */
        const { data: buffer } = await axios.get(
          `https://api.lolhuman.xyz/api/random/lick?apikey=${process.env.LOLHUMAN_API_KEY}`,
          { responseType: 'arraybuffer' },
        );

        const img = await generateAttachmentFromBuffer({
          buffer,
          fileName: 'lick',
          fileDesc: 'Licking Image',
        });

        embed
          .setImage(`attachment://${img.name}`)
          .setDescription(`${member} has hugged ${target}!`);

        await interaction.editReply({ embeds: [embed], files: [img] });
      },
      kill: async () => {
        /** @type {{ image: String }} */
        const { image } = await images.sfw.kill();

        embed
          .setImage(image)
          .setDescription(`${target} has been killed by ${member}!`);

        await interaction.editReply({ embeds: [embed] });
      },
      kiss: async () => {
        const { url } = await neko.kiss();

        /** @type {{ image: String }} */
        const { image } = await images.sfw.kiss();
        const imgArr = [url, image];
        const kiss = imgArr[Math.floor(Math.random() * imgArr.length)];

        embed.setImage(kiss).setDescription(`${member} is kissing ${target}!`);

        await interaction.editReply({ embeds: [embed] });
      },
      pat: async () => {
        const { url } = await neko.pat();

        /** @type {{ image: String }} */
        const { image } = await images.sfw.pat();
        const imgArr = [url, image];
        const pat = imgArr[Math.floor(Math.random() * imgArr.length)];

        embed
          .setImage(pat)
          .setDescription(`${member} is giving a pat for ${target}!`);

        await interaction.editReply({ embeds: [embed] });
      },
      punch: async () => {
        /** @type {{ image: String }} */
        const { image } = await images.sfw.punch();

        embed
          .setImage(image)
          .setDescription(`${member} has punched ${target}!`);

        await interaction.editReply({ embeds: [embed] });
      },
      slap: async () => {
        const { url } = await neko.slap();

        /** @type {{ image: String }} */
        const { image } = await images.sfw.slap();
        const imgArr = [url, image];
        const slap = imgArr[Math.floor(Math.random() * imgArr.length)];

        embed.setImage(slap).setDescription(`${member} has slapped ${target}!`);

        await interaction.editReply({ embeds: [embed] });
      },
      smug: async () => {
        const { url } = await neko.smug();

        embed.setImage(url).setDescription(`${member} smugged ${target}!`);

        await interaction.editReply({ embeds: [embed] });
      },
      tickle: async () => {
        const { url } = await neko.tickle();

        embed.setImage(url);
        embed.setDescription(`${member} tickled ${target}!`);

        await interaction.editReply({ embeds: [embed] });
      },
      wink: async () => {
        /** @type {{ image: String }} */
        const { image } = await images.sfw.wink();

        embed
          .setImage(image)
          .setDescription(`${member} is giving a wink for ${target}!`);

        await interaction.editReply({ embeds: [embed] });
      },
    }[options.getSubcommand()]();
  },
};
