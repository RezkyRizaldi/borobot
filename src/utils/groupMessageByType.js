const getMessageType = require('./getMessageType');

/**
 *
 * @param {import('discord.js').Message[][]} arr
 * @returns {import('discord.js').Message[][][]} Array of array messages grouped by its type.
 */
module.exports = (arr) => {
  arr.forEach((sub_arr, index) => {
    const collector = {};

    sub_arr.forEach((item) => {
      const groupItem = getMessageType(item);

      collector[groupItem] = collector[groupItem] || [];
      collector[groupItem].push(item);
    });

    arr[index] = Object.values(collector);
  });

  return arr;
};
