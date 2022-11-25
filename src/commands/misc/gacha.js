const AnimeImages = require('anime-images-api');
const axios = require('axios');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const nekoClient = require('nekos.life');

const { waifuChoices } = require('../../constants');
const { generateAttachmentFromBuffer } = require('../../utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('generate')
    .setDescription('💫 Test your luck command.')
    .addSubcommand((subcommand) =>
      subcommand.setName('loli').setDescription('👰‍♀️ Gacha for a loli.'),
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('milf').setDescription('👰‍♀️ Gacha for a milf.'),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('waifu')
        .setDescription('👰‍♀️ Gacha for a waifu.')
        .addStringOption((option) =>
          option
            .setName('type')
            .setDescription('🖼️ The image type to generate.')
            .setRequired(true)
            .addChoices(...waifuChoices),
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

    const embed = new EmbedBuilder()
      .setColor(member.displayHexColor)
      .setTimestamp(Date.now())
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      });

    const images = new AnimeImages();
    const neko = new nekoClient();

    switch (options.getSubcommand()) {
      case 'loli': {
        /** @type {{ data: ArrayBuffer }} */
        const { data: buffer } = await axios.get(
          `https://api.lolhuman.xyz/api/random/loli?apikey=${process.env.LOLHUMAN_API_KEY}`,
          { responseType: 'arraybuffer' },
        );

        const img = await generateAttachmentFromBuffer({
          buffer,
          fileName: 'loli',
          fileDesc: 'Loli Image',
        });

        embed
          .setAuthor({
            name: `${member.user.username} Got a Loli`,
            iconURL: member.displayAvatarURL({ dynamic: true }),
          })
          .setImage(`attachment://${img.name}`);

        return interaction.editReply({ embeds: [embed], files: [img] });
      }

      case 'milf': {
        /** @type {{ data: ArrayBuffer }} */
        const { data: buffer } = await axios.get(
          `https://api.lolhuman.xyz/api/random/nsfw/milf?apikey=${process.env.LOLHUMAN_API_KEY}`,
          { responseType: 'arraybuffer' },
        );

        const img = await generateAttachmentFromBuffer({
          buffer,
          fileName: 'milf',
          fileDesc: 'Milf Image',
        });

        embed
          .setAuthor({
            name: `${member.user.username} Got a Milf`,
            iconURL: member.displayAvatarURL({ dynamic: true }),
          })
          .setImage(`attachment://${img.name}`);

        return interaction.editReply({ embeds: [embed], files: [img] });
      }

      case 'waifu':
        {
          const type = options.getString('type', true);

          switch (type) {
            case 'image': {
              /** @type {{ data: { url: String } }} */
              const {
                data: { url },
              } = await axios.get('https://api.waifu.pics/sfw/waifu');

              embed
                .setAuthor({
                  name: `${member.user.username} Got a Waifu`,
                  iconURL: member.displayAvatarURL({ dynamic: true }),
                })
                .setImage(url);

              return interaction.editReply({ embeds: [embed] });
            }

            case 'pfp': {
              const { url } = await neko.avatar();

              /** @type {{ image: String }} */
              const { image } = await images.sfw.waifu();
              const imgArr = [url, image];
              const pfp = imgArr[Math.floor(Math.random() * imgArr.length)];

              embed.setAuthor({
                name: `${member.user.username} Got a Waifu`,
                iconURL: member.displayAvatarURL({ dynamic: true }),
              });
              embed.setImage(pfp);

              return interaction.editReply({ embeds: [embed] });
            }

            case 'wallpaper': {
              const { url } = await neko.wallpaper();

              embed
                .setAuthor({
                  name: `${member.user.username} Got a Waifu`,
                  iconURL: member.displayAvatarURL({ dynamic: true }),
                })
                .setImage(url);

              return interaction.editReply({ embeds: [embed] });
            }
          }
        }
        break;
    }
  },
};
