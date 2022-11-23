const AnimeImages = require('anime-images-api');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const nekoClient = require('nekos.life');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('interact')
    .setDescription('🎉 Interact command.')
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
    /** @type {{ client: import('discord.js').Client<true>, member: ?import('discord.js').GuildMember, options: Omit<import('discord.js').CommandInteractionOptionResolver<import('discord.js').CacheType>, 'getMessage' | 'getFocused'> }} */
    const { client, member, options } = interaction;

    await interaction.deferReply();

    if (!member) throw "Member doesn't exist.";

    const embed = new EmbedBuilder().setTimestamp(Date.now()).setFooter({
      text: client.user.username,
      iconURL: client.user.displayAvatarURL({ dynamic: true }),
    });

    /** @type {?import('discord.js').GuildMember} */
    const target = options.getMember('target');
    const images = new AnimeImages();
    const neko = new nekoClient();

    switch (options.getSubcommand()) {
      case 'hug': {
        if (!target) throw "Member doesn't exist.";

        const { url } = await neko.hug();

        /** @type {{ image: String }} */
        const { image } = await images.sfw.hug();
        const imgArr = [url, image];
        const hug = imgArr[Math.floor(Math.random() * imgArr.length)];

        embed
          .setColor(target.displayHexColor)
          .setImage(hug)
          .setDescription(`${member} has hugged ${target}!`);

        return interaction.editReply({ embeds: [embed] });
      }

      case 'kiss': {
        if (!target) throw "Member doesn't exist.";

        const { url } = await neko.kiss();

        /** @type {{ image: String }} */
        const { image } = await images.sfw.kiss();
        const imgArr = [url, image];
        const kiss = imgArr[Math.floor(Math.random() * imgArr.length)];

        embed
          .setColor(target.displayHexColor)
          .setImage(kiss)
          .setDescription(`${member} is kissing ${target}!`);

        return interaction.editReply({ embeds: [embed] });
      }

      case 'slap': {
        if (!target) throw "Member doesn't exist.";

        const { url } = await neko.slap();

        /** @type {{ image: String }} */
        const { image } = await images.sfw.slap();
        const imgArr = [url, image];
        const slap = imgArr[Math.floor(Math.random() * imgArr.length)];

        embed
          .setColor(target.displayHexColor)
          .setImage(slap)
          .setDescription(`${member} has slapped ${target}!`);

        return interaction.editReply({ embeds: [embed] });
      }

      case 'punch': {
        if (!target) throw "Member doesn't exist.";

        /** @type {{ image: String }} */
        const { image } = await images.sfw.punch();

        embed
          .setColor(target.displayHexColor)
          .setImage(image)
          .setDescription(`${member} has punched ${target}!`);

        return interaction.editReply({ embeds: [embed] });
      }

      case 'wink': {
        if (!target) throw "Member doesn't exist.";

        /** @type {{ image: String }} */
        const { image } = await images.sfw.wink();

        embed
          .setColor(target.displayHexColor)
          .setImage(image)
          .setDescription(`${member} is giving a wink for ${target}!`);

        return interaction.editReply({ embeds: [embed] });
      }

      case 'pat': {
        if (!target) throw "Member doesn't exist.";

        const { url } = await neko.pat();

        /** @type {{ image: String }} */
        const { image } = await images.sfw.pat();
        const imgArr = [url, image];
        const pat = imgArr[Math.floor(Math.random() * imgArr.length)];

        embed
          .setColor(target.displayHexColor)
          .setImage(pat)
          .setDescription(`${member} is giving a pat for ${target}!`);

        return interaction.editReply({ embeds: [embed] });
      }

      case 'kill': {
        if (!target) throw "Member doesn't exist.";

        /** @type {{ image: String }} */
        const { image } = await images.sfw.kill();

        embed
          .setColor(target.displayHexColor)
          .setImage(image)
          .setDescription(`${target} has been killed by ${member}!`);

        return interaction.editReply({ embeds: [embed] });
      }

      case 'cuddle': {
        if (!target) throw "Member doesn't exist.";

        const { url } = await neko.cuddle();

        /** @type {{ image: String }} */
        const { image } = await images.sfw.cuddle();
        const imgArr = [url, image];
        const cuddle = imgArr[Math.floor(Math.random() * imgArr.length)];

        embed
          .setColor(target.displayHexColor)
          .setImage(cuddle)
          .setDescription(`${member} cuddles ${target}!`);

        return interaction.editReply({ embeds: [embed] });
      }

      case 'tickle': {
        if (!target) throw "Member doesn't exist.";

        const { url } = await neko.tickle();

        embed.setColor(target.displayHexColor);
        embed.setImage(url);
        embed.setDescription(`${member} tickled ${target}!`);

        return interaction.editReply({ embeds: [embed] });
      }

      case 'feed': {
        if (!target) throw "Member doesn't exist.";

        const { url } = await neko.feed();

        embed
          .setColor(target.displayHexColor)
          .setImage(url)
          .setDescription(`${member} feeding ${target}!`);

        return interaction.editReply({ embeds: [embed] });
      }

      case 'smug': {
        if (!target) throw "Member doesn't exist.";

        const { url } = await neko.smug();

        embed
          .setColor(target.displayHexColor)
          .setImage(url)
          .setDescription(`${member} smugged ${target}!`);

        return interaction.editReply({ embeds: [embed] });
      }
    }
  },
};
