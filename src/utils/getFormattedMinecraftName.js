/**
 *
 * @param {String} name
 * @returns {String} The formatted Minecraft name.
 */
module.exports = (name) =>
  name.includes('lazuli') && !name.endsWith('lazuli')
    ? name.replace('lazuli_', '')
    : name === 'block_of_lapis_lazuli'
    ? 'lapis_block'
    : name === 'block_of_gold'
    ? 'gold_block'
    : name === 'block_of_iron'
    ? 'iron_block'
    : name === 'block_of_diamond'
    ? 'diamond_block'
    : name === 'wheat_crops'
    ? 'wheat'
    : name === 'redstone_repeater'
    ? 'repeater'
    : name === 'vines'
    ? 'vine'
    : name === 'block_of_emerald'
    ? 'emerald_block'
    : name === 'block_of_redstone'
    ? 'redstone_block'
    : name === 'redstone_comparator'
    ? 'comparator'
    : name === 'block_of_quartz'
    ? 'quartz_block'
    : name === 'block_of_coal'
    ? 'coal_block'
    : name === 'smooth_quartz_block'
    ? 'smooth_quartz'
    : name === 'bamboo_shoot'
    ? 'bamboo_sapling'
    : name === 'jigsaw_block'
    ? 'jigsaw'
    : name === 'block_of_netherite'
    ? 'netherite_block'
    : name === 'cake_with_candle'
    ? 'candle_cake'
    : name === 'cake_with_white_candle'
    ? 'white_candle_cake'
    : name === 'cake_with_orange_candle'
    ? 'orange_candle_cake'
    : name === 'cake_with_magenta_candle'
    ? 'magenta_candle_cake'
    : name === 'cake_with_light_blue_candle'
    ? 'light_blue_candle_cake'
    : name === 'cake_with_yellow_candle'
    ? 'yellow_candle_cake'
    : name === 'cake_with_lime_candle'
    ? 'lime_candle_cake'
    : name === 'cake_with_pink_candle'
    ? 'pink_candle_cake'
    : name === 'cake_with_gray_candle'
    ? 'gray_candle_cake'
    : name === 'cake_with_light_gray_candle'
    ? 'light_gray_candle_cake'
    : name === 'cake_with_cyan_candle'
    ? 'cyan_candle_cake'
    : name === 'cake_with_purple_candle'
    ? 'purple_candle_cake'
    : name === 'cake_with_blue_candle'
    ? 'blue_candle_cake'
    : name === 'cake_with_brown_candle'
    ? 'brown_candle_cake'
    : name === 'cake_with_green_candle'
    ? 'green_candle_cake'
    : name === 'cake_with_red_candle'
    ? 'red_candle_cake'
    : name === 'cake_with_black_candle'
    ? 'black_candle_cake'
    : name === 'block_of_amethyst'
    ? 'amethyst_block'
    : name === 'block_of_copper'
    ? 'copper_block'
    : name === 'waxed_block_of_copper'
    ? 'waxed_copper_block'
    : name === 'block_of_raw_iron'
    ? 'raw_iron_block'
    : name === 'block_of_raw_copper'
    ? 'raw_copper_block'
    : name === 'block_of_raw_gold'
    ? 'raw_gold_block'
    : name === 'potted_azalea'
    ? 'potted_azalea_bush'
    : name === 'potted_flowering_azalea'
    ? 'potted_flowering_azalea_bush'
    : name === 'curse_of_binding'
    ? 'binding_curse'
    : name === 'sweeping_edge'
    ? 'sweeping'
    : name === 'curse_of_vanishing'
    ? 'vanishing_curse'
    : name === 'boat_with_chest'
    ? 'chest_boat'
    : name === 'minecart_with_chest'
    ? 'chest_minecart'
    : name === 'minecart_with_command_block'
    ? 'command_block_minecart'
    : name === 'minecart_with_furnace'
    ? 'furnace_minecart'
    : name === 'minecart_with_hopper'
    ? 'hopper_minecart'
    : name === 'minecart_with_spawner'
    ? 'spawner_minecart'
    : name === 'minecart_with_tnt'
    ? 'tnt_minecart'
    : name === 'primed_tnt'
    ? 'tnt'
    : name === 'thrown_egg'
    ? 'egg'
    : name === 'thrown_ender_pearl'
    ? 'ender_pearl'
    : name === 'thrown_bottle_o_enchanting'
    ? 'experience_bottle'
    : name;
