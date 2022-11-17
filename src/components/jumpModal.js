const { bold, inlineCode } = require('discord.js');

module.exports = {
  data: {
    name: 'jumpModal',
  },

  /**
   *
   * @param {import('discord.js').ModalSubmitInteraction} interaction
   */
  async execute(interaction) {
    await interaction
      .deferReply({ ephemeral: true, fetchReply: true })
      .then(async (message) => {
        const inputValue = interaction.fields.getTextInputValue('jumpInput');

        /** @type {{ client: { paginations: import('discord.js').Collection<String, import('pagination.djs').Pagination> }}} */
        const {
          client: { paginations },
        } = interaction;

        const pagination = paginations.get(message.interaction.id);

        if (!/^\d+$/.test(inputValue)) {
          return interaction.editReply({
            content: `Please insert a number value between 1 and ${pagination.totalPages}.`,
          });
        }

        const pageNumber = Number(inputValue);

        if (pageNumber < 1) {
          await interaction.editReply({
            content: `Successfully set the page number to ${bold(
              1,
            )}, please select the ${inlineCode(
              pageNumber > pagination.currentPage
                ? pagination.buttons.next.data.disabled.valueOf() === true
                  ? pagination.buttonInfo.prev.emoji
                  : pagination.buttonInfo.next.emoji
                : pagination.buttons.prev.data.disabled.valueOf() === true
                ? pagination.buttonInfo.next.emoji
                : pagination.buttonInfo.prev.emoji,
            )} button.`,
          });

          return pagination.goToPage(
            pageNumber > pagination.currentPage
              ? pagination.buttons.next.data.disabled.valueOf() === true
                ? 2
                : 0
              : pagination.buttons.prev.data.disabled.valueOf() === true
              ? 0
              : 2,
          );
        }

        if (pageNumber > pagination.totalPages) {
          await interaction.editReply({
            content: `Successfully set the page number to ${bold(
              pagination.totalPages,
            )}, please select the ${inlineCode(
              pageNumber > pagination.currentPage
                ? pagination.buttons.next.data.disabled.valueOf() === true
                  ? pagination.buttonInfo.prev.emoji
                  : pagination.buttonInfo.next.emoji
                : pagination.buttons.prev.data.disabled.valueOf() === true
                ? pagination.buttonInfo.next.emoji
                : pagination.buttonInfo.prev.emoji,
            )} button.`,
          });

          return pagination.goToPage(
            pageNumber > pagination.currentPage
              ? pagination.buttons.next.data.disabled.valueOf() === true
                ? pagination.totalPages + 1
                : pagination.totalPages - 1
              : pagination.buttons.prev.data.disabled.valueOf() === true
              ? pagination.totalPages - 1
              : pagination.totalPages + 1,
          );
        }

        await interaction.editReply({
          content: `Successfully set the page number to ${bold(
            pageNumber,
          )}, please select the ${inlineCode(
            pageNumber > pagination.currentPage
              ? pagination.buttons.next.data.disabled.valueOf() === true
                ? pagination.buttonInfo.prev.emoji
                : pagination.buttonInfo.next.emoji
              : pagination.buttons.prev.data.disabled.valueOf() === true
              ? pagination.buttonInfo.next.emoji
              : pagination.buttonInfo.prev.emoji,
          )} button.`,
        });

        return pagination.goToPage(
          pageNumber > pagination.currentPage
            ? pagination.buttons.next.data.disabled.valueOf() === true
              ? pageNumber + 1
              : pageNumber - 1
            : pagination.buttons.prev.data.disabled.valueOf() === true
            ? pageNumber - 1
            : pageNumber + 1,
        );
      });
  },
};
