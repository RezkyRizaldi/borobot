/**
 *
 * @param {String} name
 * @returns {String} The formatted Minecraft name.
 */
module.exports = (name) => {
  switch (true) {
    case name.includes('lazuli') && !name.endsWith('lazuli'):
      return name.replace('lazuli_', '');

    case name.includes('block_of'): {
      const filteredArr = name.split('_').filter((item) => item !== 'of');

      filteredArr.push(filteredArr.splice(filteredArr.indexOf('block'), 1)[0]);

      return filteredArr.join('_');
    }

    case name.endsWith('block'):
      return name.replace('_block', '');

    case name.includes('with'): {
      const filteredArr = name.split('_').filter((item) => item !== 'with');

      filteredArr.push(filteredArr.shift());

      return filteredArr.join('_');
    }

    case name.startsWith('potted'):
      return `${name}_bush`;

    case name.startsWith('curse_of'): {
      const filteredArr = name.split('_').filter((item) => item !== 'of');

      filteredArr.push(filteredArr.shift());

      return filteredArr.join('_');
    }

    case name.startsWith('thrown'):
      return name.replace('thrown_', '');

    case name.startsWith('raw'):
      return name.replace('raw_', '');
  }

  return name === 'wheat_crops'
    ? 'wheat'
    : name === 'redstone_repeater'
    ? 'repeater'
    : name === 'vines'
    ? 'vine'
    : name === 'bamboo_shoot'
    ? 'bamboo_sapling'
    : name === 'sweeping_edge'
    ? 'sweeping'
    : name === 'primed_tnt'
    ? 'tnt'
    : name === 'steak'
    ? 'beef'
    : name;
};
