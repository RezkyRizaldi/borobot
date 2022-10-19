const crypto = require('crypto');

/**
 *
 * @param {String} fileName
 * @param {String} baseURL
 * @param {String} [type=undefined]
 * @returns {String} The WIkia URL format
 */
module.exports = (fileName, baseURL, type = undefined) => {
  const formattedFileName = fileName.replace(/ /g, '_');
  const md5 = crypto.createHash('md5').update(formattedFileName).digest('hex');
  const md5First = md5.substring(0, 1);
  const md5Second = md5.substring(0, 2);

  if (baseURL.slice(-1) !== '/') baseURL += '/';

  const url = `${baseURL}${md5First}/${md5Second}/${encodeURIComponent(
    formattedFileName,
  )}`;

  switch (true) {
    // Genshin Impact
    case url.includes('/Ayato'):
      return url
        .replace('/f/fd', '/a/a2')
        .replace('Character_Ayato_Thumb', 'Character_Kamisato_Ayato_Thumb');

    // Minecraft Java Edition
    case url.includes('/Air'):
      return url
        .replace('/5/5f', '/4/47')
        .replace('Air', encodeURIComponent('Air_(shown)_JE2'));

    case url.includes('/Polished_Granite'):
      return url
        .replace('/d/d6', '/c/c5')
        .replace('Polished_Granite', 'Polished_Granite_JE2_BE2');

    case url.includes('/Polished_Andesite'):
      return url
        .replace('/c/cb', '/2/21')
        .replace('Polished_Andesite', 'Polished_Andesite_JE2_BE2');

    case url.includes('/Grass_Block'):
      return url
        .replace('/c/c7', '/9/93')
        .replace('Grass_Block', 'Grass_Block_JE7_BE6');

    case url.includes('/Spruce_Planks'):
      return url
        .replace('/2/2c', '/d/d4')
        .replace('Spruce_Planks', 'Spruce_Planks_JE4_BE2');

    case url.includes('/Jungle_Planks'):
      return url
        .replace('/c/c0', '/0/06')
        .replace('Jungle_Planks', 'Jungle_Planks_JE3_BE2');

    case url.includes('/Dark_Oak_Planks'):
      return url
        .replace('/c/c6', '/f/fe')
        .replace('Dark_Oak_Planks', 'Dark_Oak_Planks_JE3_BE2');

    case url.includes('/Mangrove_Planks'):
      return url
        .replace('/9/93', '/4/44')
        .replace('Mangrove_Planks', 'Mangrove_Planks_JE1_BE1');

    case url.includes('/Oak_Sapling'):
      return url
        .replace('/4/43', '/1/1c')
        .replace('Oak_Sapling', 'Oak_Sapling_JE14');

    case url.includes('/Spruce_Sapling'):
      return url
        .replace('/6/6a', '/5/54')
        .replace('Spruce_Sapling', 'Spruce_Sapling_JE7_BE2');

    case url.includes('/Birch_Sapling'):
      return url
        .replace('/a/ab', '/1/1a')
        .replace('Birch_Sapling', 'Birch_Sapling_JE7_BE2');

    case url.includes('/Jungle_Sapling'):
      return url
        .replace('/8/8d', '/7/70')
        .replace('Jungle_Sapling', 'Jungle_Sapling_JE7_BE2');

    case url.includes('/Acacia_Sapling'):
      return url
        .replace('/8/8a', '/0/0f')
        .replace('Acacia_Sapling', 'Acacia_Sapling_JE7_BE2');

    case url.includes('/Dark_Oak_Sapling'):
      return url
        .replace('/2/2f', '/e/e7')
        .replace('Dark_Oak_Sapling', 'Dark_Oak_Sapling_JE7_BE2');

    case url.includes('/Mangrove_Propagule'):
      return url
        .replace('/6/6e', '/e/ed')
        .replace('Mangrove_Propagule', 'Mangrove_Propagule_JE1_BE1');

    case url.includes('/Bedrock'):
      return url
        .replace('/e/ee', '/6/68')
        .replace('Bedrock', 'Bedrock_JE2_BE2');

    case url.includes('/Water'):
      if (type === 'pc') {
        return url.replace('/9/9d', '/0/09').replace('Water', 'Water_JE16');
      }

      return url.replace('/9/9d', '/4/43').replace('Water', 'Water_BE');

    case url.includes('/Lava'):
      if (type === 'pc') {
        return url
          .replace('/2/27', '/f/f5')
          .replace('Lava', 'Lava_JE14')
          .replace('.png', '.gif');
      }

      return url
        .replace('/2/27', '/f/f1')
        .replace('Lava', 'Lava_BE4')
        .replace('.png', '.gif');

    case url.includes('/Sand'):
      return url.replace('/a/a7', '/7/71').replace('Sand', 'Sand_JE5_BE3');

    case url.includes('/Red_Sand'):
      return url
        .replace('/f/f4', '/3/36')
        .replace('Red_Sand', 'Red_Sand_JE3_BE2');

    case url.includes('/Gravel'):
      return url.replace('/9/9a', '/9/9d').replace('Gravel', 'Gravel_JE5_BE4');

    case url.includes('/Gold_Ore'):
      return url
        .replace('/f/f7', '/1/18')
        .replace('Gold_Ore', 'Gold_Ore_JE7_BE4');

    case url.includes('/Deepslate_Gold_Ore'):
      return url
        .replace('/f/ff', '/1/1d')
        .replace('Deepslate_Gold_Ore', 'Deepslate_Gold_Ore_JE2_BE1');

    case url.includes('/Iron_Ore'):
      return url
        .replace('/8/87', '/1/19')
        .replace('Iron_Ore', 'Iron_Ore_JE6_BE4');

    case url.includes('/Deepslate_Iron_Ore'):
      return url
        .replace('/c/ca', '/4/48')
        .replace('Deepslate_Iron_Ore', 'Deepslate_Iron_Ore_JE2_BE1');

    case url.includes('/Coal_Ore'):
      return url
        .replace('/f/f3', '/4/48')
        .replace('Coal_Ore', 'Coal_Ore_JE5_BE4');

    case url.includes('/Deepslate_Coal_Ore'):
      return url
        .replace('/2/2e', '/0/0b')
        .replace('Deepslate_Coal_Ore', 'Deepslate_Coal_Ore_JE1_BE2');

    case url.includes('/Nether_Gold_Ore'):
      return url
        .replace('/8/86', '/6/62')
        .replace('Nether_Gold_Ore', 'Nether_Gold_Ore_JE2_BE1');

    case url.includes('/Oak_Log'):
      return url
        .replace('/6/61', '/e/e9')
        .replace('Oak_Log', encodeURIComponent('Oak_Log_(UD)_JE5_BE3'));

    case url.includes('/Spruce_Log'):
      return url
        .replace('/b/b9', '/f/f1')
        .replace('Spruce_Log', encodeURIComponent('Spruce_Log_(UD)_JE5_BE3'));

    case url.includes('/Birch_Log'):
      return url
        .replace('/d/d7', '/d/db')
        .replace('Birch_Log', encodeURIComponent('Birch_Log_(UD)_JE5_BE3'));

    case url.includes('/Jungle_Log'):
      return url
        .replace('/6/66', '/2/2a')
        .replace('Jungle_Log', encodeURIComponent('Jungle_Log_(UD)_JE6_BE3'));

    case url.includes('/Dark_Oak_Log'):
      return url
        .replace('/2/20', '/4/46')
        .replace('Dark_Oak_Log', encodeURIComponent('Dark_Oak_Log_(UD)_JE6'));

    case url.includes('/Mangrove_Log'):
      return url
        .replace('/0/04', '/1/1e')
        .replace(
          'Mangrove_Log',
          encodeURIComponent('Mangrove_Log_(UD)_JE1_BE1'),
        );

    case url.includes('//Mangrove_Roots'):
      return url
        .replace('/c/ca', '/4/42')
        .replace('Mangrove_Roots', 'Mangrove_Roots_JE2');

    case url.includes('//Muddy_Mangrove_Roots'):
      return url
        .replace('/1/1c', '/5/5c')
        .replace('Muddy_Mangrove_Roots', 'Muddy_Mangrove_Roots_JE1_BE1');

    case url.includes('/Stripped_Spruce_Log'):
      return url
        .replace('/a/a8', '/0/09')
        .replace(
          'Stripped_Spruce_Log',
          encodeURIComponent('Stripped_Spruce_Log_(UD)_JE2'),
        );

    case url.includes('/Stripped_Birch_Log'):
      return url
        .replace('/2/28', '/7/7d')
        .replace(
          'Stripped_Birch_Log',
          encodeURIComponent('Stripped_Birch_Log_(UD)_JE2_BE2'),
        );
    case url.includes('/Stripped_Jungle_Log'):
      return url
        .replace('/e/ef', '/b/b4')
        .replace(
          'Stripped_Jungle_Log',
          encodeURIComponent('Stripped_Jungle_Log_(UD)_JE4_BE3'),
        );

    case url.includes('/Stripped_Acacia_Log'):
      return url
        .replace('/7/79', '/3/3b')
        .replace(
          'Stripped_Acacia_Log',
          encodeURIComponent('Stripped_Acacia_Log_(UD)_JE2_BE2'),
        );

    case url.includes('/Stripped_Dark_Oak_Log'):
      return url
        .replace('/2/2d', '/1/1d')
        .replace(
          'Stripped_Dark_Oak_Log',
          encodeURIComponent('Stripped_Dark_Oak_Log_(UD)_JE4'),
        );

    case url.includes('/Stripped_Oak_Log'):
      return url
        .replace('/a/a2', '/e/eb')
        .replace(
          'Stripped_Oak_Log',
          encodeURIComponent('Stripped_Oak_Log_(UD)_JE2_BE2'),
        );

    case url.includes('/Stripped_Mangrove_Log'):
      return url
        .replace('/b/b0', '/5/56')
        .replace(
          'Stripped_Mangrove_Log',
          encodeURIComponent('Stripped_Mangrove_Log_(UD)_JE1_BE1'),
        );

    case url.includes('/Oak_Wood'):
      return url
        .replace('/9/9c', '/1/1d')
        .replace('Oak_Wood', encodeURIComponent('Oak_Wood_(UD)_JE5_BE2'));

    case url.includes('/Spruce_Wood'):
      return url
        .replace('/e/ec', '/2/25')
        .replace('Spruce_Wood', encodeURIComponent('Spruce_Wood_(UD)_JE5_BE2'));

    case url.includes('/Birch_Wood'):
      return url
        .replace('/e/e3', '/3/3a')
        .replace('Birch_Wood', encodeURIComponent('Birch_Wood_(UD)_JE5_BE2'));

    case url.includes('/Jungle_Wood'):
      return url
        .replace('/5/56', '/c/c4')
        .replace('Jungle_Wood', encodeURIComponent('Jungle_Wood_(UD)_JE4_BE2'));

    case url.includes('/Dark_Oak_Wood'):
      return url
        .replace('/6/61', '/5/5c')
        .replace(
          'Dark_Oak_Wood',
          encodeURIComponent('Dark_Oak_Wood_(UD)_JE5_BE2'),
        );

    case url.includes('/Mangrove_Wood'):
      return url
        .replace('/e/e8', '/9/98')
        .replace(
          'Mangrove_Wood',
          encodeURIComponent('Dark_Oak_Wood_(UD)_JE1_BE1'),
        );

    case url.includes('/Stripped_Oak_Wood'):
      return url
        .replace('/c/ca', '/6/60')
        .replace(
          'Stripped_Oak_Wood',
          encodeURIComponent('Stripped_Oak_Wood_(UD)_JE1_BE1'),
        );

    case url.includes('/Stripped_Spruce_Wood'):
      return url
        .replace('/9/92', '/2/2b')
        .replace(
          'Stripped_Spruce_Wood',
          encodeURIComponent('Stripped_Spruce_Wood_(UD)_JE1_BE1'),
        );

    case url.includes('/Stripped_Birch_Wood'):
      return url
        .replace('/9/91', '/7/78')
        .replace(
          'Stripped_Birch_Wood',
          encodeURIComponent('Stripped_Birch_Wood_(UD)_JE1_BE1'),
        );

    case url.includes('/Stripped_Jungle_Wood'):
      return url
        .replace('/7/75', '/2/20')
        .replace(
          'Stripped_Jungle_Wood',
          encodeURIComponent('Stripped_Jungle_Wood_(UD)_JE4_BE2'),
        );

    case url.includes('/Stripped_Acacia_Wood'):
      return url
        .replace('/3/38', '/2/24')
        .replace(
          'Stripped_Acacia_Wood',
          encodeURIComponent('Stripped_Acacia_Wood_(UD)_JE4_BE2'),
        );

    case url.includes('/Stripped_Dark_Oak_Wood'):
      return url
        .replace('/b/b7', '/a/a3')
        .replace(
          'Stripped_Dark_Oak_Wood',
          encodeURIComponent('Stripped_Dark_Oak_Wood_(UD)_JE5_BE2'),
        );

    case url.includes('/Stripped_Mangrove_Wood'):
      return url
        .replace('/9/9c', '/a/a8')
        .replace(
          'Stripped_Mangrove_Wood',
          encodeURIComponent('Stripped_Mangrove_Wood_(UD)_JE1_BE1'),
        );

    case url.includes('/Oak_Leaves') && type === 'bedrock':
      return url
        .replace('/6/6d', '/0/09')
        .replace('Oak_Leaves', 'Oak_Leaves_BE5');

    case url.includes('/Spruce_Leaves') && type === 'bedrock':
      return url
        .replace('/0/02', '/3/3e')
        .replace('Spruce_Leaves', 'Spruce_Leaves_BE3');

    case url.includes('/Birch_Leaves') && type === 'bedrock':
      return url
        .replace('/0/05', '/2/20')
        .replace('Birch_Leaves', 'Birch_Leaves_BE4');

    case url.includes('/Jungle_Leaves') && type === 'bedrock':
      return url
        .replace('/c/c5', '/f/fe')
        .replace('Jungle_Leaves', 'Jungle_Leaves_BE5');

    case url.includes('/Acacia_Leaves') && type === 'bedrock':
      return url
        .replace('/2/27', '/3/31')
        .replace('Acacia_Leaves', 'Acacia_Leaves_BE2');

    case url.includes('/Dark_Oak_Leaves') && type === 'bedrock':
      return url
        .replace('/2/22', '/0/0d')
        .replace('Dark_Oak_Leaves', 'Dark_Oak_Leaves_BE2');

    case url.includes('/Mangrove_Leaves'):
      if (type === 'pc') {
        return url
          .replace('/7/7a', '/5/5a')
          .replace('Mangrove_Leaves', 'Mangrove_Leaves_JE2');
      }

      return url
        .replace('/7/7a', '/e/e3')
        .replace('Mangrove_Leaves', 'Mangrove_Leaves_BE1');

    case url.includes('/Azalea_Leaves') && type === 'bedrock':
      return url
        .replace('/7/76', '/c/cb')
        .replace('Azalea_Leaves', 'Azalea_Leaves_BE1');

    case url.includes('/Flowering_Azalea_Leaves') && type === 'bedrock':
      return url
        .replace('/4/4a', '/e/e6')
        .replace('Flowering_Azalea_Leaves', 'Flowering_Azalea_Leaves_BE1');

    case url.includes('/Sponge'):
      return url.replace('/a/a0', '/f/f7').replace('Sponge', 'Sponge_JE3_BE3');

    case url.includes('/Wet_Sponge'):
      return url
        .replace('/4/4d', '/7/70')
        .replace('Wet_Sponge', 'Wet_Sponge_JE2_BE2');

    case url.includes('/Glass'):
      return url.replace('/1/15', '/3/3e').replace('Glass', 'Glass_JE4_BE2');

    case url.includes('/Lapis_Lazuli_Ore'):
      return url
        .replace('/c/c3', '/e/ea')
        .replace('Lapis_Lazuli_Ore', 'Lapis_Lazuli_Ore_JE4_BE4');

    case url.includes('/Deepslate_Lapis_Lazuli_Ore'):
      return url
        .replace('/7/71', '/9/94')
        .replace(
          'Deepslate_Lapis_Lazuli_Ore',
          'Deepslate_Lapis_Lazuli_Ore_JE3_BE2',
        );

    case url.includes('/Block_of_Lapis_Lazuli'):
      return url
        .replace('/6/6a', '/5/55')
        .replace('Block_of_Lapis_Lazuli', 'Block_of_Lapis_Lazuli_JE3_BE3');

    case url.includes('/Dispenser'):
      if (type === 'pc') {
        return url
          .replace('/a/a6', '/3/32')
          .replace('Dispenser', encodeURIComponent('Dispenser_(S)_JE4'));
      }

      return url
        .replace('/a/a6', '/6/62')
        .replace('Dispenser', encodeURIComponent('Dispenser_(S)_BE2'));

    case url.includes('/Sandstone'):
      return url
        .replace('/d/d6', '/9/95')
        .replace('Sandstone', 'Sandstone_JE6_BE3');

    case url.includes('/Chiseled_Sandstone'):
      return url
        .replace('/7/71', '/d/d9')
        .replace('Chiseled_Sandstone', 'Chiseled_Sandstone_JE5_BE2');

    case url.includes('/Cut_Sandstone'):
      return url
        .replace('/e/e6', '/9/91')
        .replace('Cut_Sandstone', 'Cut_Sandstone_JE5_BE2');

    case url.includes('/Note_Block'):
      return url
        .replace('/9/9b', '/1/18')
        .replace('Note_Block', 'Note_Block_JE2_BE2');

    case url.includes('/White_Bed'):
      return url
        .replace('/7/76', '/1/1a')
        .replace('White_Bed', 'White_Bed_JE3_BE3');

    case url.includes('/Red_Bed'):
      return url
        .replace('/6/6e', '/b/b5')
        .replace('Red_Bed', encodeURIComponent('Red_Bed_(N)_JE5'));

    case url.includes('/Powered_Rail'):
      return url
        .replace('/6/67', '/d/d0')
        .replace(
          'Powered_Rail',
          encodeURIComponent('Powered_Rail_(NS)_JE2_BE2'),
        );

    case url.includes('/Detector_Rail'):
      return url
        .replace('/9/9e', '/5/5e')
        .replace(
          'Detector_Rail',
          encodeURIComponent('Detector_Rail_(NS)_JE2_BE2'),
        );

    case url.includes('/Sticky_Piston'):
      if (type === 'pc') {
        return url
          .replace('/e/e1', '/b/be')
          .replace('Sticky_Piston', encodeURIComponent('Sticky_Piston_(U)_JE3'))
          .replace('png', 'gif');
      }

      return url
        .replace('/e/e1', '/b/bb')
        .replace('Sticky_Piston', encodeURIComponent('Sticky_Piston_(U)_BE'))
        .replace('png', 'gif');

    case url.includes('/Cobweb'):
      return url.replace('/4/48', '/9/98').replace('Cobweb', 'Cobweb_JE5');

    case url.includes('/Grass'):
      return url.replace('/c/c5', '/f/f4').replace('Grass', 'Grass_JE7');

    case url.includes('/Fern'):
      return url.replace('/5/5f', '/f/f9').replace('Fern', 'Fern_JE6');

    case url.includes('/Dead_Bush'):
      return url
        .replace('/1/1f', '/4/4a')
        .replace('Dead_Bush', 'Dead_Bush_JEUNK_BEUNK');

    case url.includes('/Piston'):
      if (type === 'pc') {
        return url
          .replace('/6/62', '/2/23')
          .replace('Piston', encodeURIComponent('Piston_(U)_JE3'))
          .replace('png', 'gif');
      }

      return url
        .replace('Piston', encodeURIComponent('Piston_(U)_BE'))
        .replace('png', 'gif');

    case url.includes('/Piston_Head'):
      return url
        .replace('/b/bd', '/f/f6')
        .replace('Piston_Head', encodeURIComponent('Piston_Head_(U)_JE3'));

    case url.includes('/White_Wool'):
      return url
        .replace('/0/07', '/6/66')
        .replace('White_Wool', 'White_Wool_JE2_BE2');

    case url.includes('/Orange_Wool'):
      return url
        .replace('/9/9b', '/5/57')
        .replace('Orange_Wool', 'Orange_Wool_JE3_BE3');

    case url.includes('/Magenta_Wool'):
      return url
        .replace('/3/33', '/f/ff')
        .replace('Magenta_Wool', 'Magenta_Wool_JE3_BE3');

    case url.includes('/Light_Blue_Wool'):
      return url
        .replace('/b/b7', '/3/37')
        .replace('Light_Blue_Wool', 'Light_Blue_Wool_JE3_BE3');

    case url.includes('/Yellow_Wool'):
      return url
        .replace('/1/18', '/7/74')
        .replace('Yellow_Wool', 'Yellow_Wool_JE3_BE3');

    case url.includes('/Lime_Wool'):
      return url
        .replace('/3/30', '/b/bc')
        .replace('Lime_Wool', 'Lime_Wool_JE3_BE3');

    case url.includes('/Pink_Wool'):
      return url
        .replace('/b/b6', '/7/72')
        .replace('Pink_Wool', 'Pink_Wool_JE3_BE3');

    case url.includes('/Gray_Wool'):
      return url
        .replace('/1/1c', '/7/75')
        .replace('Gray_Wool', 'Gray_Wool_JE3_BE3');

    case url.includes('/Light_Gray_Wool'):
      return url
        .replace('/a/a4', '/1/10')
        .replace('Light_Gray_Wool', 'Light_Gray_Wool_JE3_BE3');

    case url.includes('/Cyan_Wool'):
      return url
        .replace('/c/cf', '/4/4d')
        .replace('Cyan_Wool', 'Cyan_Wool_JE3_BE3');

    case url.includes('/Purple_Wool'):
      return url
        .replace('/8/83', '/a/a5')
        .replace('Purple_Wool', 'Purple_Wool_JE3_BE3');

    case url.includes('/Blue_Wool'):
      return url
        .replace('/c/ce', '/b/b4')
        .replace('Blue_Wool', 'Blue_Wool_JE3_BE3');

    case url.includes('/Brown_Wool'):
      return url
        .replace('/d/db', '/1/16')
        .replace('Brown_Wool', 'Brown_Wool_JE3_BE3');

    case url.includes('/Green_Wool'):
      return url
        .replace('/7/71', '/b/b7')
        .replace('Green_Wool', 'Green_Wool_JE3_BE3');

    case url.includes('/Red_Wool'):
      return url
        .replace('/7/70', '/4/48')
        .replace('Red_Wool', 'Red_Wool_JE3_BE3');

    case url.includes('/Black_Wool'):
      return url
        .replace('/0/05', '/3/33')
        .replace('Black_Wool', 'Black_Wool_JE3_BE3');

    case url.includes('/Dandelion'):
      return url
        .replace('/b/b1', '/2/24')
        .replace('Dandelion', 'Dandelion_JE8_BE2');

    case url.includes('/Poppy'):
      return url.replace('/3/37', '/3/3b').replace('Poppy', 'Poppy_JE8_BE2');

    case url.includes('/Blue_Orchid'):
      return url
        .replace('/6/6b', '/3/33')
        .replace('Blue_Orchid', 'Blue_Orchid_JE7_BE2');

    case url.includes('/Allium'):
      return url.replace('/2/28', '/2/2a').replace('Allium', 'Allium_JE7_BE2');

    case url.includes('/Azure_Bluet'):
      return url
        .replace('/e/ea', '/1/1a')
        .replace('Azure_Bluet', 'Azure_Bluet_JE7_BE2');

    case url.includes('/Red_Tulip'):
      return url
        .replace('/6/68', '/c/c7')
        .replace('Red_Tulip', 'Red_Tulip_JE7_BE2');

    case url.includes('/Orange_Tulip'):
      return url
        .replace('/3/35', '/4/4a')
        .replace('Orange_Tulip', 'Orange_Tulip_JE7_BE2');

    case url.includes('/White_Tulip'):
      return url
        .replace('/0/04', '/6/6a')
        .replace('White_Tulip', 'White_Tulip_JE7_BE2');

    case url.includes('/Pink_Tulip'):
      return url
        .replace('/8/80', '/c/c0')
        .replace('Pink_Tulip', 'Pink_Tulip_JE7_BE2');

    case url.includes('/Oxeye_Daisy'):
      return url
        .replace('/b/bf', '/d/d1')
        .replace('Oxeye_Daisy', 'Oxeye_Daisy_JE7_BE2');

    case url.includes('/Cornflower'):
      return url
        .replace('/d/d4', '/7/73')
        .replace('Cornflower', 'Cornflower_JE1_BE1');

    case url.includes('/Wither_Rose'):
      return url
        .replace('/6/68', '/f/fa')
        .replace('Wither_Rose', 'Wither_Rose_JE1_BE1');

    case url.includes('/Lily_of_The_Valley'):
      return url
        .replace('/6/68', '/6/60')
        .replace('Lily_of_The_Valley', 'Lily_of_The_Valley_JE1_BE1');

    case url.includes('/Brown_Mushroom'):
      return url
        .replace('/7/73', '/4/4f')
        .replace('Brown_Mushroom', 'Brown_Mushroom_JE9');

    case url.includes('/Red_Mushroom'):
      return url
        .replace('/e/e1', '/f/f2')
        .replace('Red_Mushroom', 'Red_Mushroom_JE9');

    case url.includes('/Block_of_Gold'):
      return url
        .replace('/5/5d', '/7/72')
        .replace('Block_of_Gold', 'Block_of_Gold_JE6_BE3');

    case url.includes('/Block_of_Iron'):
      return url
        .replace('/8/86', '/7/7e')
        .replace('Block_of_Iron', 'Block_of_Iron_JE4_BE3');

    case url.includes('/Bricks'):
      return url.replace('/f/ff', '/6/62').replace('Bricks', 'Bricks_JE5_BE3');

    case url.includes('/TNT'):
      return url.replace('/1/1e', '/a/a2').replace('TNT', 'TNT_JE3_BE2');

    case url.includes('/Bookshelf'):
      return url
        .replace('/f/f7', '/0/05')
        .replace('Bookshelf', 'Bookshelf_JE4_BE2');

    case url.includes('/Mossy_Cobblestone'):
      return url
        .replace('/a/af', '/1/12')
        .replace('Mossy_Cobblestone', 'Mossy_Cobblestone_JE4_BE2');

    case url.includes('/Obsidian'):
      return url
        .replace('/2/23', '/9/99')
        .replace('Obsidian', 'Obsidian_JE3_BE2');

    case url.includes('/Torch'):
      return url.replace('/b/b2', '/9/90').replace('png', 'gif');

    case url.includes('/Fire'):
      return url.replace('/3/30', '/a/a5').replace('png', 'gif');

    case url.includes('/Soul_Fire'):
      return url
        .replace('/d/dd', '/7/7e')
        .replace('Soul_Fire', 'Soul_Fire_JE1')
        .replace('png', 'gif');

    case url.includes('/Spawner'):
      return url.replace('/6/6c', '/4/40').replace('Spawner', 'Spawner_JE3');

    case url.includes('/Oak_Stairs'):
      return url
        .replace('/f/fe', '/a/a0')
        .replace('Oak_Stairs', encodeURIComponent('Oak_Stairs_(N)_JE7_BE6'));

    case url.includes('/Chest'):
      return url.replace('/b/b3', '/4/41').replace('png', 'gif');

    case url.includes('/Redstone_Wire'):
      return url
        .replace('/9/94', '/7/72')
        .replace(
          'Redstone_Wire',
          encodeURIComponent('Redstone_Wire_(NESW)_JE4'),
        );

    case url.includes('/Diamond_Ore'):
      return url
        .replace('/9/97', '/2/29')
        .replace('Diamond_Ore', 'Diamond_Ore_JE5_BE5');

    case url.includes('/Deepslate_Diamond_Ore'):
      return url
        .replace('/c/c5', '/7/73')
        .replace('Deepslate_Diamond_Ore', 'Deepslate_Diamond_Ore_JE2_BE1');

    case url.includes('/Block_of_Diamond'):
      return url
        .replace('/4/40', '/c/c8')
        .replace('Block_of_Diamond', 'Block_of_Diamond_JE5_BE3');

    case url.includes('/Crafting_Table'):
      return url
        .replace('/d/d4', '/b/b7')
        .replace('Crafting_Table', 'Crafting_Table_JE4_BE3');

    case url.includes('/Wheat_Crops'):
      return url
        .replace('/3/39', '/4/47')
        .replace('Wheat_Crops', 'Crop_states');

    case url.includes('/Farmland'):
      return url
        .replace('/a/ad', '/c/c7')
        .replace('Farmland', 'Farmland_JE4_BE6');

    case url.includes('/Furnace'):
      return url
        .replace('/0/0f', '/9/99')
        .replace('Furnace', encodeURIComponent('Furnace_(S)_JE4'));

    case url.includes('/Oak_Sign'):
      return url
        .replace('/9/98', '/7/74')
        .replace('Oak_Sign', encodeURIComponent('Oak_Sign_(0)'));

    case url.includes('/Spruce_Sign'):
      return url
        .replace('/7/76', '/0/0d')
        .replace('Spruce_Sign', encodeURIComponent('Spruce_Sign_(0)'));

    case url.includes('/Birch_Sign'):
      return url
        .replace('/b/bd', '/3/3e')
        .replace('Birch_Sign', encodeURIComponent('Birch_Sign_(0)'));

    case url.includes('/Acacia_Sign'):
      return url
        .replace('/9/9e', '/0/05')
        .replace('Acacia_Sign', encodeURIComponent('Acacia_Sign_(0)'));

    case url.includes('/Jungle_Sign'):
      return url
        .replace('/4/46', '/a/a6')
        .replace('Jungle_Sign', encodeURIComponent('Jungle_Sign_(0)'));

    case url.includes('/Dark_Oak_Sign'):
      return url
        .replace('/a/a9', '/1/1a')
        .replace('Dark_Oak_Sign', encodeURIComponent('Dark_Oak_Sign_(0)'));

    case url.includes('/Mangrove_Sign'):
      return url
        .replace('/8/83', '/7/72')
        .replace('Mangrove_Sign', 'Mangrove_Sign_JE1_BE1');

    case url.includes('/Oak_Door'):
      if (type === 'pc') {
        return url
          .replace('/4/41', '/0/0e')
          .replace('Oak_Door', 'Oak_Door_JE8');
      }

      return url.replace('/0/0a', '/0/0e').replace('Oak_Door', 'Oak_Door_BE4');

    case url.includes('/Ladder'):
      return url
        .replace('/6/63', '/f/fd')
        .replace('Ladder', encodeURIComponent('Ladder_(S)_JE4'));

    case url.includes('/Rail'):
      return url
        .replace('/1/1e', '/4/45')
        .replace('Rail', encodeURIComponent('Rail_(NS)_JE3_BE2'));

    case url.includes('/Cobblestone_Stairs'):
      return url
        .replace('/0/05', '/9/94')
        .replace(
          'Cobblestone_Stairs',
          encodeURIComponent('Cobblestone_Stairs_(N)_JE6_BE6'),
        );

    case url.includes('/Lever'):
      return url
        .replace('/c/c6', '/6/6f')
        .replace('Lever', encodeURIComponent('Powered_Wall_Lever_(S)_JE5_BE2'));

    case url.includes('/Stone_Pressure_Plate'):
      return url
        .replace('/a/a4', '/8/8d')
        .replace('Stone_Pressure_Plate', 'Stone_Pressure_Plate_JE5_BE2');

    case url.includes('/Iron_Door'):
      if (type === 'pc') {
        return url
          .replace('/1/11', '/6/69')
          .replace('Iron_Door', 'Iron_Door_JE5');
      }

      return url
        .replace('/1/11', '/b/be')
        .replace('Iron_Door', 'Iron_Door_BE6');

    case url.includes('/Oak_Pressure_Plate'):
      return url
        .replace('/c/cd', '/d/d4')
        .replace('Oak_Pressure_Plate', 'Oak_Pressure_Plate_JE5_BE2');

    case url.includes('/Spruce_Pressure_Plate'):
      return url
        .replace('/7/76', '/4/4a')
        .replace('Spruce_Pressure_Plate', 'Spruce_Pressure_Plate_JE4_BE2');

    case url.includes('/Birch_Pressure_Plate'):
      return url
        .replace('/3/38', '/3/37')
        .replace('Birch_Pressure_Plate', 'Birch_Pressure_Plate_JE3_BE2');

    case url.includes('/Acacia_Pressure_Plate'):
      return url
        .replace('/b/b4', '/e/e9')
        .replace('Acacia_Pressure_Plate', 'Acacia_Pressure_Plate_JE3_BE2');

    case url.includes('/Jungle_Pressure_Plate'):
      return url
        .replace('/b/bf', '/f/f3')
        .replace('Jungle_Pressure_Plate', 'Jungle_Pressure_Plate_JE3_BE2');

    case url.includes('/Dark_Oak_Pressure_Plate'):
      return url
        .replace('/f/fa', '/7/7a')
        .replace('Dark_Oak_Pressure_Plate', 'Dark_Oak_Pressure_Plate_JE3_BE2');

    case url.includes('/Mangrove_Pressure_Plate'):
      return url
        .replace('/3/36', '/7/75')
        .replace('Mangrove_Pressure_Plate', 'Mangrove_Pressure_Plate_JE1_BE1');

    case url.includes('/Redstone_Ore'):
      return url
        .replace('/5/56', '/c/cd')
        .replace('Redstone_Ore', 'Redstone_Ore_JE4_BE3');

    case url.includes('/Deepslate_Redstone_Ore'):
      return url
        .replace('/c/c6', '/7/70')
        .replace('Deepslate_Redstone_Ore', 'Deepslate_Redstone_Ore_JE2_BE1');

    case url.includes('/Redstone_Torch'):
      if (type === 'pc') {
        return url
          .replace('/d/da', '/7/75')
          .replace('Redstone_Torch', 'Redstone_Torch_JE4');
      }

      return url
        .replace('/d/da', '/9/9b')
        .replace('Redstone_Torch', 'Redstone_Torch_BE3');

    case url.includes('/Stone_Button'):
      return url
        .replace('/c/c0', '/f/ff')
        .replace(
          'Stone_Button',
          encodeURIComponent('Stone_Button_(S)_JE5_BE2'),
        );

    case url.includes('/Snow'):
      return url
        .replace('/4/4e', '/a/a5')
        .replace('Snow', encodeURIComponent('Snow_(layers_1)_JE3_BE3'));

    case url.includes('/Ice'):
      return url.replace('/7/77', '/e/e2').replace('Ice', 'Ice_JE2_BE3');

    case url.includes('/Snow_Block'):
      return url
        .replace('/f/fa', '/d/dc')
        .replace('Snow_Block', 'Snow_Block_JE2_BE2');

    case url.includes('/Cactus'):
      if (type === 'pc') {
        return url.replace('/a/a6', '/4/47').replace('Cactus', 'Cactus_JE4');
      }

      return url.replace('/a/a6', '/f/f3').replace('Cactus', 'Cactus_BE4');

    case url.includes('/Clay'):
      return url.replace('/a/a2', '/4/42').replace('Clay', 'Clay_JE2_BE2');

    case url.includes('/Sugar_Cane'):
      return url
        .replace('/6/67', '/4/41')
        .replace('Sugar_Cane', 'Sugar_Cane_JE2_BE2');

    case url.includes('/Jukebox'):
      return url
        .replace('/6/65', '/e/ee')
        .replace('Jukebox', 'Jukebox_JE2_BE2');

    case url.includes('/Pumpkin'):
      return url
        .replace('/6/64', '/d/db')
        .replace('Pumpkin', 'Pumpkin_JE1_BE1');

    case url.includes('/Netherrack'):
      return url
        .replace('/7/72', '/0/02')
        .replace('Netherrack', 'Netherrack_JE4_BE2');

    case url.includes('/Soul_Sand'):
      return url
        .replace('/a/a7', '/6/6d')
        .replace('Soul_Sand', 'Soul_Sand_JE2_BE2');

    case url.includes('/Soul_Soil'):
      return url
        .replace('/3/31', '/a/a9')
        .replace('Soul_Soil', 'Soul_Soil_JE1_BE1');

    case url.includes('/Basalt'):
      return url
        .replace('/2/22', '/f/f9')
        .replace('Basalt', encodeURIComponent('Basalt_(UD)_JE1_BE1'));

    case url.includes('/Polished_Basalt'):
      return url
        .replace('/0/05', '/f/fe')
        .replace(
          'Polished_Basalt',
          encodeURIComponent('Polished_Basalt_(UD)_JE1_BE1'),
        );

    case url.includes('/Soul_Torch'):
      return url.replace('/d/d8', '/6/61').replace('png', 'gif');

    case url.includes('/Glowstone'):
      if (type === 'pc') {
        return url
          .replace('/9/91', '/a/a5')
          .replace('Glowstone', 'Glowstone_JE4_BE2');
      }

      return url.replace('/9/91', '/b/ba').replace('Glowstone', 'Glowstone_BE');

    case url.includes('/Nether_Portal'):
      return url
        .replace('/3/35', '/0/03')
        .replace(
          'Nether_Portal',
          encodeURIComponent('Nether_portal_(animated)'),
        );

    case url.includes('/Carved_Pumpkin'):
      return url
        .replace('/6/6e', '/8/8e')
        .replace(
          'Carved_Pumpkin',
          encodeURIComponent('Carved_Pumpkin_(S)_JE4'),
        );

    case url.includes("/Jack_o'_Lantern"):
      if (type === 'pc') {
        return url
          .replace('/8/8d', '/6/66')
          .replace(
            "Jack_o'_Lantern",
            encodeURIComponent("Jack_o'_Lantern_(S)_JE5"),
          );
      }

      return url
        .replace('/8/8d', '/5/59')
        .replace(
          "Jack_o'_Lantern",
          encodeURIComponent("Jack_o'_Lantern_(S)_BE2"),
        );

    case url.includes('/Cake'):
      return url.replace('/f/f0', '/5/53').replace('Cake', 'Cake_JE4');

    case url.includes('/Redstone_Repeater'):
      return url
        .replace('/9/98', '/f/f0')
        .replace(
          'Redstone_Repeater',
          encodeURIComponent('Redstone_Repeater_(S)_JE5_BE2'),
        );

    case url.includes('/White_Stained_Glass'):
      return url
        .replace('/e/e0', '/8/83')
        .replace('White_Stained_Glass', 'White_Stained_Glass_JE3_BE3');

    case url.includes('/Orange_Stained_Glass'):
      return url
        .replace('/1/13', '/1/13')
        .replace('Orange_Stained_Glass', 'Orange_Stained_Glass_JE3_BE3');

    case url.includes('/Magenta_Stained_Glass'):
      return url
        .replace('/3/31', '/a/ad')
        .replace('Magenta_Stained_Glass', 'Magenta_Stained_Glass_JE3_BE3');

    case url.includes('/Light_Blue_Stained_Glass'):
      return url
        .replace('/4/40', '/2/26')
        .replace(
          'Light_Blue_Stained_Glass',
          'Light_Blue_Stained_Glass_JE3_BE3',
        );

    case url.includes('/Yellow_Stained_Glass'):
      return url
        .replace('/b/bd', '/a/af')
        .replace('Yellow_Stained_Glass', 'Yellow_Stained_Glass_JE3_BE3');

    case url.includes('/Lime_Stained_Glass'):
      return url
        .replace('/a/a1', '/7/7d')
        .replace('Lime_Stained_Glass', 'Lime_Stained_Glass_JE3_BE3');

    case url.includes('/Pink_Stained_Glass'):
      return url
        .replace('/a/ac', '/6/68')
        .replace('Pink_Stained_Glass', 'Pink_Stained_Glass_JE3_BE3');

    case url.includes('/Gray_Stained_Glass'):
      return url
        .replace('/d/d1', '/c/cd')
        .replace('Gray_Stained_Glass', 'Gray_Stained_Glass_JE3_BE3');

    case url.includes('/Light_Gray_Stained_Glass'):
      return url
        .replace('/0/0e', '/e/e2')
        .replace(
          'Light_Gray_Stained_Glass',
          'Light_Gray_Stained_Glass_JE3_BE3',
        );

    case url.includes('/Cyan_Stained_Glass'):
      return url
        .replace('/5/51', '/d/d0')
        .replace('Cyan_Stained_Glass', 'Cyan_Stained_Glass_JE3_BE3');

    case url.includes('/Purple_Stained_Glass'):
      return url
        .replace('/b/b1', '/c/ca')
        .replace('Purple_Stained_Glass', 'Purple_Stained_Glass_JE3_BE3');

    case url.includes('/Blue_Stained_Glass'):
      return url
        .replace('/4/40', '/a/a4')
        .replace('Blue_Stained_Glass', 'Blue_Stained_Glass_JE3_BE3');

    case url.includes('/Brown_Stained_Glass'):
      return url
        .replace('/7/7c', '/4/46')
        .replace('Brown_Stained_Glass', 'Brown_Stained_Glass_JE3_BE3');

    case url.includes('/Green_Stained_Glass'):
      return url
        .replace('/2/24', '/7/76')
        .replace('Green_Stained_Glass', 'Green_Stained_Glass_JE3_BE3');

    case url.includes('/Red_Stained_Glass'):
      return url
        .replace('/8/8e', '/2/2a')
        .replace('Red_Stained_Glass', 'Red_Stained_Glass_JE3_BE3');

    case url.includes('/Black_Stained_Glass'):
      return url
        .replace('/0/0f', '/3/3a')
        .replace('Black_Stained_Glass', 'Black_Stained_Glass_JE3_BE3');

    case url.includes('/Oak_Trapdoor'):
      return url
        .replace('/a/a1', '/9/91')
        .replace('Oak_Trapdoor', 'Oak_Trapdoor_JE4_BE2');

    case url.includes('/Spruce_Trapdoor'):
      return url
        .replace('/8/89', '/c/c9')
        .replace('Spruce_Trapdoor', 'Spruce_Trapdoor_JE2_BE2');

    case url.includes('/Birch_Trapdoor'):
      return url
        .replace('/4/44', '/b/b2')
        .replace('Birch_Trapdoor', 'Birch_Trapdoor_JE1_BE1');

    case url.includes('/Jungle_Trapdoor'):
      return url
        .replace('/f/ff', '/a/ae')
        .replace('Jungle_Trapdoor', 'Jungle_Trapdoor_JE1_BE1');

    case url.includes('/Acacia_Trapdoor'):
      return url
        .replace('/b/bf', '/6/63')
        .replace('Acacia_Trapdoor', 'Acacia_Trapdoor_JE1_BE1');

    case url.includes('/Dark_Oak_Trapdoor'):
      return url
        .replace('/b/b8', '/b/ba')
        .replace('Dark_Oak_Trapdoor', 'Dark_Oak_Trapdoor_JE1_BE1');

    case url.includes('/Mangrove_Trapdoor'):
      return url
        .replace('/e/ef', '/5/5e')
        .replace('Mangrove_Trapdoor', 'Mangrove_Trapdoor_JE1_BE1');

    case url.includes('/Stone_Bricks'):
      return url
        .replace('/0/01', '/5/5a')
        .replace('Stone_Bricks', 'Stone_Bricks_JE3_BE2');

    case url.includes('/Mossy_Stone_Bricks'):
      return url
        .replace('/0/01', '/3/33')
        .replace('Mossy_Stone_Bricks', 'Mossy_Stone_Bricks_JE3_BE2');

    case url.includes('/Cracked_Stone_Bricks'):
      return url
        .replace('/5/57', '/f/f1')
        .replace('Cracked_Stone_Bricks', 'Cracked_Stone_Bricks_JE3_BE2');

    case url.includes('/Chiseled_Stone_Bricks'):
      return url
        .replace('/d/d1', '/0/0b')
        .replace('Chiseled_Stone_Bricks', 'Chiseled_Stone_Bricks_JE3_BE2');

    case url.includes('/Packed_Mud'):
      return url
        .replace('/c/cb', '/6/6c')
        .replace('Packed_Mud', 'Packed_Mud_JE1_BE1');

    case url.includes('/Mud_Bricks'):
      return url
        .replace('/9/94', '/d/da')
        .replace('Mud_Bricks', 'Mud_Bricks_JE1_BE1');

    case url.includes('/Infested_Stone'):
      return url.replace('/8/8f', '/d/d4').replace('Infested_Stone', 'Stone');

    case url.includes('/Infested_Cobblestone'):
      return url
        .replace('/f/f7', '/6/67')
        .replace('Infested_Cobblestone', 'Cobblestone');

    case url.includes('/Infested_Stone_Bricks'):
      return url
        .replace('/a/a6', '/5/5a')
        .replace('Infested_Stone_Bricks', 'Stone_Bricks_JE3_BE2');

    case url.includes('/Infested_Mossy_Stone_Bricks'):
      return url
        .replace('/6/63', '/3/33')
        .replace('Infested_Mossy_Stone_Bricks', 'Mossy_Stone_Bricks_JE3_BE2');

    case url.includes('/Infested_Cracked_Stone_Bricks'):
      return url
        .replace('/f/f3', '/f/f1')
        .replace(
          'Infested_Cracked_Stone_Bricks',
          'Cracked_Stone_Bricks_JE3_BE2',
        );

    case url.includes('/Infested_Chiseled_Stone_Bricks'):
      return url
        .replace('/7/7e', '/0/0b')
        .replace(
          'Infested_Chiseled_Stone_Bricks',
          'Chiseled_Stone_Bricks_JE3_BE2',
        );

    case url.includes('/Brown_Mushroom_Block'):
      return url
        .replace('/7/7e', '/4/4c')
        .replace(
          'Brown_Mushroom_Block',
          encodeURIComponent('Brown_Mushroom_Block_(ESU)_JE2_BE2'),
        );

    case url.includes('/Red_Mushroom_Block'):
      return url
        .replace('/4/4f', '/8/8f')
        .replace(
          'Red_Mushroom_Block',
          encodeURIComponent('Red_Mushroom_Block_(ESU)_JE2_BE2'),
        );

    case url.includes('/Mushroom_Stem'):
      return url
        .replace('/4/49', '/4/4e')
        .replace(
          'Mushroom_Stem',
          encodeURIComponent('Mushroom_Stem_(ESU)_JE2_BE2'),
        );

    case url.includes('/Iron_Bars'):
      return url
        .replace('/f/f5', '/0/07')
        .replace('Iron_Bars', encodeURIComponent('Iron_Bars_(NESW)_JE3_BE2'));

    case url.includes('/Chain'):
      return url
        .replace('/a/ae', '/0/0c')
        .replace('Chain', encodeURIComponent('Chain_(UD)_JE1_BE1'));

    case url.includes('/Glass_Pane'):
      return url
        .replace('/f/fc', '/9/99')
        .replace('Glass_Pane', 'Glass_Pane_JE4_BE4');

    case url.includes('/Melon'):
      return url.replace('/1/19', '/f/f0').replace('Melon', 'Melon_JE2_BE2');

    case url.includes('/Attached_Pumpkin_Stem'):
      return url
        .replace('/4/47', '/e/e5')
        .replace(
          'Attached_Pumpkin_Stem',
          encodeURIComponent('Attached_Pumpkin_Stem_(N)_JE5'),
        );

    case url.includes('/Attached_Melon_Stem'):
      return url
        .replace('/c/cb', '/5/5e')
        .replace(
          'Attached_Melon_Stem',
          encodeURIComponent('Attached_Melon_Stem_(N)_JE5'),
        );

    case url.includes('/Pumpkin_Stem'):
      return url
        .replace('/d/da', '/2/25')
        .replace('Pumpkin_Stem', 'Pumpkin_Stem_Age_7_JE7');

    case url.includes('/Melon_Stem'):
      return url
        .replace('/0/02', '/3/39')
        .replace('Melon_Stem', 'Stem_Age_7_JE6');

    case url.includes('/Vines'):
      return url.replace('/b/b2', '/6/64').replace('Vines', 'Vines_JE2_BE2');

    case url.includes('/Glow_Lichen'):
      return url
        .replace('/a/a1', '/8/8a')
        .replace('Glow_Lichen', encodeURIComponent('Glow_Lichen_(D)_JE2'));

    case url.includes('/Oak_Fence_Gate'):
      return url
        .replace('/a/ac', '/2/2e')
        .replace('Oak_Fence_Gate', 'Oak_Fence_Gate_JE4_BE2');

    case url.includes('/Brick_Stairs'):
      return url
        .replace('/b/bf', '/2/25')
        .replace(
          'Brick_Stairs',
          encodeURIComponent('Brick_Stairs_(N)_JE5_BE2'),
        );

    case url.includes('/Stone_Brick_Stairs'):
      return url
        .replace('/8/86', '/8/87')
        .replace(
          'Stone_Brick_Stairs',
          encodeURIComponent('Stone_Brick_Stairs_(N)_JE5_BE2'),
        );

    case url.includes('/Mud_Brick_Stairs'):
      return url
        .replace('/8/8f', '/4/49')
        .replace('Mud_Brick_Stairs', 'Mud_Brick_Stairs_JE1_BE1');

    case url.includes('/Mycelium'):
      return url
        .replace('/1/15', '/f/f0')
        .replace('Mycelium', 'Mycelium_JE5_BE3');

    case url.includes('/Lily_Pad'):
      return url
        .replace('/4/43', '/9/94')
        .replace('Lily_Pad', 'Lily_Pad_JE2_BE2');

    case url.includes('/Nether_Bricks'):
      return url
        .replace('/d/d6', '/9/99')
        .replace('Nether_Bricks', 'Nether_Bricks_JE3_BE4');

    case url.includes('/Nether_Brick_Fence'):
      return url
        .replace('/3/30', '/d/dc')
        .replace('Nether_Brick_Fence', 'Nether_Brick_Fence_JE3_BE4');

    case url.includes('/Nether_Brick_Stairs'):
      return url
        .replace('/b/b2', '/c/ca')
        .replace(
          'Nether_Brick_Stairs',
          encodeURIComponent('Nether_Brick_Stairs_(N)_JE5_BE2'),
        );

    case url.includes('/Nether_Wart'):
      if (type === 'pc') {
        return url
          .replace('/4/43', '/f/fa')
          .replace('Nether_Wart', 'Nether_Wart_Age_3_JE8');
      }

      return url
        .replace('/4/43', '/4/42')
        .replace('Nether_Wart', 'Nether_Wart_Age_3_BE');

    case url.includes('/Enchanting_Table'):
      if (type === 'pc') {
        return url.replace('/e/e1', '/3/31').replace('png', 'gif');
      }

      return url
        .replace('/e/e1', '/8/8e')
        .replace('Enchanting_Table', 'Enchanting_Table_BE')
        .replace('png', 'gif');

    case url.includes('/Brewing_Stand'):
      return url
        .replace('/f/fa', '/2/28')
        .replace(
          'Brewing_Stand',
          encodeURIComponent('Brewing_Stand_(full)_JE10'),
        );

    case url.includes('/Cauldron'):
      return url.replace('/3/37', '/c/c9').replace('Cauldron', 'Cauldron_JE7');

    case url.includes('/Water_Cauldron'):
      if (type === 'pc') {
        return url
          .replace('/5/58', '/f/f6')
          .replace('Water_Cauldron', 'Water_Cauldron_JE7');
      }

      return url
        .replace('/5/58', '/4/45')
        .replace('Water_Cauldron', 'Water_Cauldron_BE2');

    case url.includes('/Lava_Cauldron'):
      return url
        .replace('/c/cc', '/5/5b')
        .replace('Lava_Cauldron', 'Lava_Cauldron_JE1');

    case url.includes('/Powder_Snow_Cauldron'):
      return url
        .replace('/7/78', '/d/df')
        .replace('Powder_Snow_Cauldron', 'Powder_Snow_Cauldron_JE1');

    case url.includes('/End_Portal_Frame'):
      return url
        .replace('/5/56', '/c/c7')
        .replace(
          'End_Portal_Frame',
          encodeURIComponent('End_Portal_Frame_(S)_JE6_BE3'),
        );

    case url.includes('/End_Stone'):
      return url
        .replace('/0/06', '/4/43')
        .replace('End_Stone', 'End_Stone_JE3_BE2');

    case url.includes('/Dragon_Egg'):
      if (type === 'pc') {
        return url
          .replace('/0/0b', '/3/38')
          .replace('Dragon_Egg', 'Dragon_Egg_JE4');
      }

      return url
        .replace('/0/0b', '/4/44')
        .replace('Dragon_Egg', 'Dragon_Egg_BE1');

    case url.includes('/Redstone_Lamp'):
      return url
        .replace('/5/54', '/3/30')
        .replace('Redstone_Lamp', 'Redstone_Lamp_JE3_BE2');

    case url.includes('/Cocoa'):
      if (type === 'pc') {
        return url
          .replace('/8/8d', '/b/b9')
          .replace('Cocoa', encodeURIComponent('Cocoa_Age_2_(S)_JE6'));
      }

      return url
        .replace('/8/8d', '/6/63')
        .replace('Cocoa', encodeURIComponent('Cocoa_Age_2_(S)_BE4'));

    case url.includes('/Sandstone_Stairs'):
      return url
        .replace('/0/01', '/8/8e')
        .replace(
          'Sandstone_Stairs',
          encodeURIComponent('Sandstone_Stairs_(N)_JE6_BE3'),
        );

    case url.includes('/Emerald_Ore'):
      return url
        .replace('/9/9f', '/a/a9')
        .replace('Emerald_Ore', 'Emerald_Ore_JE4_BE3');

    case url.includes('/Deepslate_Emerald_Ore'):
      return url
        .replace('/9/94', '/9/9c')
        .replace('Deepslate_Emerald_Ore', 'Deepslate_Emerald_Ore_JE1_BE1');

    case url.includes('/Ender_Chest'):
      return url
        .replace('/f/f0', '/d/db')
        .replace('Ender_Chest', 'Ender_Chest_JE2_BE2')
        .replace('png', 'gif');

    case url.includes('/Tripwire_Hook'):
      return url
        .replace('/c/c0', '/9/90')
        .replace(
          'Tripwire_Hook',
          encodeURIComponent('Tripwire_Hook_(S)_JE6_BE2'),
        );

    case url.includes('/Spruce_Stairs'):
      return url
        .replace('/f/fd', '/3/30')
        .replace(
          'Spruce_Stairs',
          encodeURIComponent('Spruce_Stairs_(N)_JE5_BE2'),
        );

    case url.includes('/Birch_Stairs'):
      return url
        .replace('/5/53', '/1/1a')
        .replace(
          'Birch_Stairs',
          encodeURIComponent('Birch_Stairs_(N)_JE4_BE2'),
        );

    case url.includes('/Jungle_Stairs'):
      return url
        .replace('/e/ef', '/3/39')
        .replace(
          'Jungle_Stairs',
          encodeURIComponent('Jungle_Stairs_(N)_JE4_BE2'),
        );

    case url.includes('/Command_Block'):
      return url
        .replace('/0/07', '/7/76')
        .replace('Command_Block', 'Impulse_Command_Block')
        .replace('png', 'gif');

    case url.includes('/Beacon'):
      return url.replace('/b/b3', '/2/25').replace('Beacon', 'Beacon_JE6_BE2');

    case url.includes('/Cobblestone_Wall'):
      return url
        .replace('/b/b7', '/0/0f')
        .replace('Cobblestone_Wall', 'Cobblestone_Wall_JE2_BE2');

    case url.includes('/Mossy_Cobblestone_Wall'):
      return url
        .replace('/7/79', '/a/ae')
        .replace('Mossy_Cobblestone_Wall', 'Mossy_Cobblestone_Wall_JE2_BE2');

    case url.includes('/Flower_Pot'):
      return url
        .replace('/c/cc', '/2/2a')
        .replace('Flower_Pot', 'Flower_Pot_JE3');

    case url.includes('/Potted_Oak_Sapling'):
      return url
        .replace('/d/de', '/2/2b')
        .replace('Potted_Oak_Sapling', 'Potted_Oak_Sapling_JE4');

    case url.includes('/Potted_Spruce_Sapling'):
      return url
        .replace('/0/09', '/5/52')
        .replace('Potted_Spruce_Sapling', 'Potted_Spruce_Sapling_JE4');

    case url.includes('/Potted_Birch_Sapling'):
      return url
        .replace('/9/91', '/f/fc')
        .replace('Potted_Birch_Sapling', 'Potted_Birch_Sapling_JE4');

    case url.includes('/Potted_Jungle_Sapling'):
      return url
        .replace('/8/8f', '/b/b6')
        .replace('Potted_Jungle_Sapling', 'Potted_Jungle_Sapling_JE4');

    case url.includes('/Potted_Acacia_Sapling'):
      return url
        .replace('/4/45', '/c/c2')
        .replace('Potted_Acacia_Sapling', 'Potted_Acacia_Sapling_JE4');

    case url.includes('/Potted_Dark_Oak_Sapling'):
      return url
        .replace('/2/2a', '/6/63')
        .replace('Potted_Dark_Oak_Sapling', 'Potted_Dark_Oak_Sapling_JE4');

    case url.includes('/Potted_Mangrove_Propagule'):
      return url
        .replace('/2/24', '/3/3b')
        .replace('Potted_Mangrove_Propagule', 'Potted_Mangrove_Propagule_JE1');

    case url.includes('/Potted_Fern'):
      return url
        .replace('/7/78', '/d/d8')
        .replace('Potted_Fern', 'Potted_Fern_JE4');

    case url.includes('/Potted_Dandelion'):
      return url
        .replace('/5/53', '/9/9c')
        .replace('Potted_Dandelion', 'Potted_Dandelion_JE4');

    case url.includes('/Potted_Poppy'):
      return url
        .replace('/a/ad', '/a/a6')
        .replace('Potted_Poppy', 'Potted_Poppy_JE5');

    case url.includes('/Potted_Blue_Orchid'):
      return url
        .replace('/3/35', '/7/7f')
        .replace('Potted_Blue_Orchid', 'Potted_Blue_Orchid_JE4');

    case url.includes('/Potted_Allium'):
      return url
        .replace('/4/49', '/4/43')
        .replace('Potted_Allium', 'Potted_Allium_JE4');

    case url.includes('/Potted_Azure_Bluet'):
      return url
        .replace('/4/40', '/e/e3')
        .replace('Potted_Azure_Bluet', 'Potted_Azure_Bluet_JE4');

    case url.includes('/Potted_Red_Tulip'):
      return url
        .replace('/a/ad', '/7/7b')
        .replace('Potted_Red_Tulip', 'Potted_Red_Tulip_JE4');

    case url.includes('/Potted_Orange_Tulip'):
      return url
        .replace('/9/97', '/f/f1')
        .replace('Potted_Orange_Tulip', 'Potted_Orange_Tulip_JE4');

    case url.includes('/Potted_White_Tulip'):
      return url
        .replace('/6/6f', '/e/ee')
        .replace('Potted_White_Tulip', 'Potted_White_Tulip_JE4');

    case url.includes('/Potted_Pink_Tulip'):
      return url
        .replace('/a/a1', '/7/70')
        .replace('Potted_Pink_Tulip', 'Potted_Pink_Tulip_JE4');

    case url.includes('/Potted_Oxeye_Daisy'):
      return url
        .replace('/b/b6', '/0/0a')
        .replace('Potted_Oxeye_Daisy', 'Potted_Oxeye_Daisy_JE4');

    case url.includes('/Potted_Cornflower'):
      return url
        .replace('/3/31', '/f/f0')
        .replace('Potted_Cornflower', 'Potted_Cornflower_JE4');

    case url.includes('/Potted_Lily_of_the_Valley'):
      return url
        .replace('/0/0d', '/8/86')
        .replace(
          'Potted_Lily_of_the_Valley',
          'Potted_Lily_of_the_Valley_JE1_BE1',
        );

    case url.includes('/Potted_Wither_Rose'):
      return url
        .replace('/f/fd', '/9/98')
        .replace('Potted_Wither_Rose', 'Potted_Wither_Rose_JE1_BE1');

    case url.includes('/Potted_Red_Mushroom'):
      return url
        .replace('/2/21', '/f/fe')
        .replace('Potted_Red_Mushroom', 'Potted_Red_Mushroom_JE4');

    case url.includes('/Potted_Brown_Mushroom'):
      return url
        .replace('/b/bd', '/a/aa')
        .replace('Potted_Brown_Mushroom', 'Potted_Brown_Mushroom_JE4');

    case url.includes('/Potted_Dead_Bush'):
      return url
        .replace('/7/79', '/a/ae')
        .replace('Potted_Dead_Bush', 'Potted_Dead_Bush_JE4');

    case url.includes('/Potted_Cactus'):
      return url
        .replace('/b/b7', '/1/1d')
        .replace('Potted_Cactus', 'Potted_Cactus_JE7');

    case url.includes('/Carrots'):
      if (type === 'pc') {
        return url
          .replace('/a/a3', '/2/2f')
          .replace('Carrots', 'Carrots_Age_7_JE9');
      }

      return url
        .replace('/a/a3', '/9/9b')
        .replace('Carrots', 'Carrots_Age_7_BE');

    case url.includes('/Potatoes'):
      if (type === 'pc') {
        return url
          .replace('/4/42', '/6/67')
          .replace('Potatoes', 'Potatoes_Age_7_JE8');
      }

      return url
        .replace('/4/42', '/f/f9')
        .replace('Potatoes', 'Potatoes_Age_7_BE');

    case url.includes('/Oak_Button'):
      return url
        .replace('/a/a1', '/9/94')
        .replace('Oak_Button', encodeURIComponent('Oak_Button_(S)_JE4'));

    case url.includes('/Spruce_Button'):
      return url
        .replace('/8/8c', '/a/a1')
        .replace('Spruce_Button', 'Spruce_Button_JE4_BE2');

    case url.includes('/Birch_Button'):
      return url
        .replace('/4/4e', '/4/4b')
        .replace('Birch_Button', 'Birch_Button_JE3_BE2');

    case url.includes('/Jungle_Button'):
      return url
        .replace('/f/fd', '/0/08')
        .replace('Jungle_Button', 'Jungle_Button_JE3_BE2');

    case url.includes('/Acacia_Button'):
      return url
        .replace('/4/4e', '/7/73')
        .replace('Acacia_Button', 'Acacia_Button_JE3_BE2');

    case url.includes('/Dark_Oak_Button'):
      return url
        .replace('/4/49', '/8/8a')
        .replace('Dark_Oak_Button', 'Dark_Oak_Button_JE3_BE2');

    case url.includes('/Mangrove_Button'):
      return url
        .replace('/f/fe', '/e/e4')
        .replace('Mangrove_Button', 'Mangrove_Button_JE1_BE1');

    case url.includes('/Skeleton_Skull'):
      return url
        .replace('/9/9c', '/4/4a')
        .replace('Skeleton_Skull', encodeURIComponent('Skeleton_Skull_(8)'));

    case url.includes('/Wither_Skeleton_Skull'):
      return url
        .replace('/a/ac', '/5/5d')
        .replace(
          'Wither_Skeleton_Skull',
          encodeURIComponent('Wither_Skeleton_Skull_(8)'),
        );

    case url.includes('/Zombie_Head'):
      return url
        .replace('/f/f8', '/e/e4')
        .replace('Zombie_Head', encodeURIComponent('Zombie_Head_(8)'));

    case url.includes('/Player_Head'):
      return url
        .replace('/1/13', '/5/5d')
        .replace('Player_Head', encodeURIComponent('Player_Head_(8)'));

    case url.includes('/Creeper_Head'):
      return url
        .replace('/9/97', '/e/ed')
        .replace('Creeper_Head', encodeURIComponent('Creeper_Head_(8)'));

    case url.includes('/Dragon_Head'):
      return url
        .replace('/b/b6', '/e/e0')
        .replace('Dragon_Head', encodeURIComponent('Dragon_Head_(8)'));

    case url.includes('/Anvil'):
      return url
        .replace('/d/dd', '/3/3b')
        .replace('Anvil', encodeURIComponent('Anvil_(N)_JE3'));

    case url.includes('/Chipped_Anvil'):
      return url
        .replace('/9/91', '/6/6f')
        .replace('Chipped_Anvil', encodeURIComponent('Chipped_Anvil_(N)_JE3'));

    case url.includes('/Damaged_Anvil'):
      return url
        .replace('/e/ec', '/6/62')
        .replace('Damaged_Anvil', encodeURIComponent('Damaged_Anvil_(N)_JE3'));

    case url.includes('/Trapped_Chest'):
      return url.replace('/0/07', '/e/e1').replace('png', 'gif');

    case url.includes('/Light_Weighted_Pressure_Plate'):
      return url
        .replace('/b/b1', '/5/58')
        .replace(
          'Light_Weighted_Pressure_Plate',
          'Light_Weighted_Pressure_Plate_JE3_BE2',
        );

    case url.includes('/Heavy_Weighted_Pressure_Plate'):
      return url
        .replace('/a/ac', '/6/60')
        .replace(
          'Heavy_Weighted_Pressure_Plate',
          'Heavy_Weighted_Pressure_Plate_JE3_BE2',
        );

    case url.includes('/Redstone_Comparator'):
      if (type === 'pc') {
        return url
          .replace('/e/e4', '/e/e2')
          .replace(
            'Redstone_Comparator',
            encodeURIComponent('Redstone_Comparator_(S)_JE4'),
          );
      }

      return url
        .replace('/e/e4', '/2/26')
        .replace(
          'Redstone_Comparator',
          encodeURIComponent('Redstone_Comparator_(S)_BE'),
        );

    case url.includes('/Daylight_Detector'):
      return url
        .replace('/4/49', '/e/e6')
        .replace('Daylight_Detector', 'Daylight_Detector_JE1_BE1');

    case url.includes('/Block_of_Redstone'):
      return url
        .replace('/9/9d', '/2/26')
        .replace('Block_of_Redstone', 'Block_of_Redstone_JE2_BE2');

    case url.includes('/Nether_Quartz_Ore'):
      return url
        .replace('/3/39', '/2/28')
        .replace('Nether_Quartz_Ore', 'Nether_Quartz_Ore_JE3_BE2');

    case url.includes('/Hopper'):
      if (type === 'pc') {
        return url
          .replace('/8/81', '/e/e2')
          .replace('Hopper', encodeURIComponent('Hopper_(D)_JE8'));
      }

      return url
        .replace('/8/81', '/d/d6')
        .replace('Hopper', encodeURIComponent('Hopper_(D)_BE'));

    case url.includes('/Block_of_Quartz'):
      return url
        .replace('/b/ba', '/1/1f')
        .replace('Block_of_Quartz', 'Block_of_Quartz_JE4_BE2');

    case url.includes('/Chiseled_Quartz_Block'):
      return url
        .replace('/4/45', '/2/29')
        .replace(
          'Chiseled_Quartz_Block',
          encodeURIComponent('Chiseled_Quartz_Block_(UD)_JE2_BE2'),
        );

    case url.includes('/Quartz_Pillar'):
      return url
        .replace('/1/12', '/a/a9')
        .replace(
          'Quartz_Pillar',
          encodeURIComponent('Quartz_Pillar_(UD)_JE3_BE2'),
        );

    case url.includes('/Quartz_Stairs'):
      return url
        .replace('/0/05', '/c/c7')
        .replace('Quartz_Stairs', encodeURIComponent('Quartz_Stairs_(N)_JE3'));

    case url.includes('/Activator_Rail'):
      return url
        .replace('/d/d3', '/a/a9')
        .replace(
          'Activator_Rail',
          encodeURIComponent('Activator_Rail_(NS)_JE2_BE2'),
        );

    case url.includes('/Dropper'):
      if (type === 'pc') {
        return url
          .replace('/8/8d', '/7/71')
          .replace('Dropper', encodeURIComponent('Dropper_(S)_JE3'));
      }

      return url
        .replace('/8/8d', '/b/b7')
        .replace('Dropper', encodeURIComponent('Dropper_(S)_BE2'));

    case url.includes('/White_Terracotta'):
      return url
        .replace('/c/c1', '/4/4e')
        .replace('White_Terracotta', 'White_Terracotta_JE1_BE1');

    case url.includes('/Orange_Terracotta'):
      return url
        .replace('/2/2b', '/0/07')
        .replace('Orange_Terracotta', 'Orange_Terracotta_JE1_BE1');
    case url.includes('Magenta_Terracotta'):
      return url
        .replace('/c/c6', '/c/c5')
        .replace('Magenta_Terracotta', 'Magenta_Terracotta_JE1_BE1');

    case url.includes('/Light_Blue_Terracotta'):
      return url
        .replace('/a/aa', '/0/05')
        .replace('Light_Blue_Terracotta', 'Light_Blue_Terracotta_JE1_BE1');

    case url.includes('/Yellow_Terracotta'):
      return url
        .replace('/3/31', '/f/f9')
        .replace('Yellow_Terracotta', 'Yellow_Terracotta_JE1_BE1');

    case url.includes('/Lime_Terracotta'):
      return url
        .replace('/3/36', '/0/07')
        .replace('Lime_Terracotta', 'Lime_Terracotta_JE1_BE1');

    case url.includes('/Pink_Terracotta'):
      return url
        .replace('/a/af', '/b/b7')
        .replace('Pink_Terracotta', 'Pink_Terracotta_JE1_BE1');

    case url.includes('/Gray_Terracotta'):
      return url
        .replace('/b/b2', '/a/a4')
        .replace('Gray_Terracotta', 'Gray_Terracotta_JE1_BE1');

    case url.includes('/Light_Gray_Terracotta'):
      return url
        .replace('/1/10', '/7/7e')
        .replace('Light_Gray_Terracotta', 'Light_Gray_Terracotta_JE1_BE1');

    case url.includes('/Cyan_Terracotta'):
      return url
        .replace('/5/55', '/c/c2')
        .replace('Cyan_Terracotta', 'Cyan_Terracotta_JE1_BE1');

    case url.includes('/Purple_Terracotta'):
      return url
        .replace('/3/32', '/4/4f')
        .replace('Purple_Terracotta', 'Purple_Terracotta_JE1_BE1');

    case url.includes('/Blue_Terracotta'):
      return url
        .replace('/4/4e', '/5/5b')
        .replace('Blue_Terracotta', 'Blue_Terracotta_JE1_BE1');

    case url.includes('/Brown_Terracotta'):
      return url
        .replace('/8/87', '/6/61')
        .replace('Brown_Terracotta', 'Brown_Terracotta_JE1_BE1');

    case url.includes('/Green_Terracotta'):
      return url
        .replace('/c/cf', '/7/7b')
        .replace('Green_Terracotta', 'Green_Terracotta_JE1_BE1');

    case url.includes('/Red_Terracotta'):
      return url
        .replace('/d/da', '/d/da')
        .replace('Red_Terracotta', 'Red_Terracotta_JE1_BE1');

    case url.includes('/Black_Terracotta'):
      return url
        .replace('/b/b2', '/a/a3')
        .replace('Black_Terracotta', 'Black_Terracotta_JE1_BE1');

    case url.includes('/White_Stained_Glass_Pane'):
      return url
        .replace('/6/64', '/b/b6')
        .replace(
          'White_Stained_Glass_Pane',
          'White_Stained_Glass_Pane_JE3_BE2',
        );

    case url.includes('/Orange_Stained_Glass_Pane'):
      return url
        .replace('/0/02', '/b/bf')
        .replace(
          'Orange_Stained_Glass_Pane',
          'Orange_Stained_Glass_Pane_JE3_BE2',
        );

    case url.includes('Magenta_Stained_Glass_Pane'):
      return url
        .replace('/c/ca', '/e/e8')
        .replace(
          'Magenta_Stained_Glass_Pane',
          'Magenta_Stained_Glass_Pane_JE3_BE2',
        );

    case url.includes('/Light_Blue_Stained_Glass_Pane'):
      return url
        .replace('/9/9e', '/8/8b')
        .replace(
          'Light_Blue_Stained_Glass_Pane',
          'Light_Blue_Stained_Glass_Pane_JE3_BE2',
        );

    case url.includes('/Yellow_Stained_Glass_Pane'):
      return url
        .replace('/d/d7', '/5/52')
        .replace(
          'Yellow_Stained_Glass_Pane',
          'Yellow_Stained_Glass_Pane_JE3_BE2',
        );

    case url.includes('/Lime_Stained_Glass_Pane'):
      return url
        .replace('/2/23', '/a/a5')
        .replace('Lime_Stained_Glass_Pane', 'Lime_Stained_Glass_Pane_JE3_BE2');

    case url.includes('/Pink_Stained_Glass_Pane'):
      return url
        .replace('/e/ec', '/4/4b')
        .replace('Pink_Stained_Glass_Pane', 'Pink_Stained_Glass_Pane_JE3_BE2');

    case url.includes('/Gray_Stained_Glass_Pane'):
      return url
        .replace('/5/54', '/4/4c')
        .replace('Gray_Stained_Glass_Pane', 'Gray_Stained_Glass_Pane_JE3_BE2');

    case url.includes('/Light_Gray_Stained_Glass_Pane'):
      return url
        .replace('/6/67', '/5/53')
        .replace(
          'Light_Gray_Stained_Glass_Pane',
          'Light_Gray_Stained_Glass_Pane_JE3_BE2',
        );

    case url.includes('/Cyan_Stained_Glass_Pane'):
      return url.replace(
        'Cyan_Stained_Glass_Pane',
        'Cyan_Stained_Glass_Pane_JE3_BE2',
      );

    case url.includes('/Purple_Stained_Glass_Pane'):
      return url
        .replace('/7/77', '/0/0f')
        .replace(
          'Purple_Stained_Glass_Pane',
          'Purple_Stained_Glass_Pane_JE3_BE2',
        );

    case url.includes('/Blue_Stained_Glass_Pane'):
      return url
        .replace('/3/33', '/1/18')
        .replace('Blue_Stained_Glass_Pane', 'Blue_Stained_Glass_Pane_JE3_BE2');

    case url.includes('/Brown_Stained_Glass_Pane'):
      return url
        .replace('/a/a4', '/8/80')
        .replace(
          'Brown_Stained_Glass_Pane',
          'Brown_Stained_Glass_Pane_JE3_BE2',
        );

    case url.includes('/Green_Stained_Glass_Pane'):
      return url
        .replace('/6/65', '/b/b0')
        .replace(
          'Green_Stained_Glass_Pane',
          'Green_Stained_Glass_Pane_JE3_BE2',
        );

    case url.includes('/Red_Stained_Glass_Pane'):
      return url
        .replace('/b/bd', '/8/82')
        .replace('Red_Stained_Glass_Pane', 'Red_Stained_Glass_Pane_JE3_BE2');

    case url.includes('/Black_Stained_Glass_Pane'):
      return url
        .replace('/6/60', '/1/10')
        .replace(
          'Black_Stained_Glass_Pane',
          'Black_Stained_Glass_Pane_JE3_BE2',
        );

    case url.includes('/Dark_Oak_Stairs'):
      return url
        .replace('/6/6e', '/e/ec')
        .replace(
          'Dark_Oak_Stairs',
          encodeURIComponent('Dark_Oak_Stairs_(N)_JE4_BE2'),
        );

    case url.includes('/Mangrove_Stairs'):
      return url
        .replace('/4/46', '/3/3a')
        .replace('Mangrove_Stairs', 'Mangrove_Stairs_JE1_BE1');

    case url.includes('/Slime_Block'):
      return url
        .replace('/7/72', '/b/bb')
        .replace('Slime_Block', 'Slime_Block_JE2_BE3');

    case url.includes('/Barrier'):
      return url
        .replace('/c/cc', '/9/93')
        .replace('Barrier', encodeURIComponent('Barrier_(held)_JE2_BE2'));

    case url.includes('/Iron_Trapdoor'):
      return url
        .replace('/d/d0', '/d/d3')
        .replace('Iron_Trapdoor', 'Iron_Trapdoor_JE3_BE2');

    case url.includes('/Prismarine'):
      return url
        .replace('/9/9a', '/d/d9')
        .replace('Prismarine', 'Prismarine_JE2_BE2')
        .replace('png', 'gif');

    case url.includes('/Prismarine_Bricks'):
      return url
        .replace('/c/ce', '/2/21')
        .replace('Prismarine_Bricks', 'Prismarine_Bricks_JE2_BE2');

    case url.includes('/Dark_Prismarine'):
      return url
        .replace('/9/99', '/7/79')
        .replace('Dark_Prismarine', 'Dark_Prismarine_JE2_BE2');

    case url.includes('/Prismarine_Stairs'):
      return url
        .replace('/a/a4', '/8/8d')
        .replace(
          'Prismarine_Stairs',
          encodeURIComponent('Prismarine_Stairs_(N)_JE2_BE2'),
        )
        .replace('png', 'gif');

    case url.includes('/Prismarine_Brick_Stairs'):
      return url
        .replace('/b/b0', '/3/3f')
        .replace(
          'Prismarine_Brick_Stairs',
          encodeURIComponent('Prismarine_Brick_Stairs_(N)_JE2_BE2'),
        );

    case url.includes('/Dark_Prismarine_Stairs'):
      return url
        .replace('/9/98', '/a/a6')
        .replace(
          'Dark_Prismarine_Stairs',
          encodeURIComponent('Dark_Prismarine_Stairs_(N)_JE2_BE2'),
        );

    case url.includes('/Prismarine_Slab'):
      return url
        .replace('/3/39', '/e/ec')
        .replace('Prismarine_Slab', 'Prismarine_Slab_JE2_BE2');

    case url.includes('/Prismarine_Brick_Slab'):
      return url
        .replace('/f/fd', '/8/80')
        .replace('Prismarine_Brick_Slab', 'Prismarine_Brick_Slab_JE2_BE2');

    case url.includes('/Dark_Prismarine_Slab'):
      return url
        .replace('/6/66', '/d/d6')
        .replace('Dark_Prismarine_Slab', 'Dark_Prismarine_Slab_JE2_BE2');

    case url.includes('/Sea_Lantern'):
      return url
        .replace('/b/b9', '/7/7f')
        .replace('Sea_Lantern', 'Sea_Lantern_JE1')
        .replace('png', 'gif');

    case url.includes('/Terracotta'):
      return url
        .replace('/7/77', '/e/e8')
        .replace('Terracotta', 'Terracotta_JE2_BE2');

    case url.includes('/Block_of_Coal'):
      return url
        .replace('/8/81', '/c/cc')
        .replace('Block_of_Coal', 'Block_of_Coal_JE3_BE2');

    case url.includes('/Packed_Ice'):
      return url
        .replace('/b/bd', '/7/7f')
        .replace('Packed_Ice', 'Packed_Ice_JE2_BE3');

    case url.includes('/Sunflower'):
      return url
        .replace('/8/81', '/5/53')
        .replace('Sunflower', 'Sunflower_JE2_BE2');

    case url.includes('/Lilac'):
      return url.replace('/5/5f', '/3/30').replace('Lilac', 'Lilac_JE4_BE2');

    case url.includes('/Rose_Bush'):
      return url
        .replace('/0/02', '/5/5d')
        .replace('Rose_Bush', 'Rose_Bush_JE4_BE3');

    case url.includes('/Peony'):
      return url.replace('/5/50', '/2/2b').replace('Peony', 'Peony_JE4_BE3');

    case url.includes('/Tall_Grass'):
      return url
        .replace('/0/01', '/5/53')
        .replace('Tall_Grass', 'Tall_Grass_JE4');

    case url.includes('/Large_Fern'):
      return url
        .replace('/e/e3', '/7/74')
        .replace('Large_Fern', 'Large_Fern_JE4');

    case url.includes('/Red_Sandstone'):
      return url
        .replace('/f/fc', '/4/47')
        .replace('Red_Sandstone', 'Red_Sandstone_JE4_BE2');

    case url.includes('/Chiseled_Red_Sandstone'):
      return url
        .replace('/9/9c', '/1/1c')
        .replace('Chiseled_Red_Sandstone', 'Chiseled_Red_Sandstone_JE4_BE2');

    case url.includes('/Cut_Red_Sandstone'):
      return url
        .replace('/1/1b', '/3/36')
        .replace('Cut_Red_Sandstone', 'Cut_Red_Sandstone_JE4_BE2');

    case url.includes('/Red_Sandstone_Stairs'):
      return url
        .replace('/f/fa', '/6/60')
        .replace(
          'Red_Sandstone_Stairs',
          encodeURIComponent('Red_Sandstone_Stairs_(N)_JE4_BE2'),
        );

    case url.includes('/Oak_Slab'):
      return url
        .replace('/1/1f', '/a/ac')
        .replace('Oak_Slab', 'Oak_Slab_JE5_BE2');

    case url.includes('/Spruce_Slab'):
      return url
        .replace('/b/be', '/a/a1')
        .replace('Spruce_Slab', 'Spruce_Slab_JE4_BE2');

    case url.includes('/Birch_Slab'):
      return url
        .replace('/f/fe', '/1/1b')
        .replace('Birch_Slab', 'Birch_Slab_JE3_BE2');

    case url.includes('/Jungle_Slab'):
      return url
        .replace('/e/ed', '/3/37')
        .replace('Jungle_Slab', 'Jungle_Slab_JE3_BE2');

    case url.includes('/Dark_Oak_Slab'):
      return url
        .replace('/f/fa', '/d/da')
        .replace('Dark_Oak_Slab', 'Dark_Oak_Slab_JE3_BE2');

    case url.includes('/Mangrove_Slab'):
      return url
        .replace('/b/b8', '/2/28')
        .replace('Mangrove_Slab', 'Mangrove_Slab_JE1_BE1');

    case url.includes('/Stone_Slab'):
      return url
        .replace('/0/0e', '/d/d4')
        .replace('Stone_Slab', 'Stone_Slab_JE2_BE1');

    case url.includes('/Smooth_Stone_Slab'):
      return url
        .replace('/f/f5', '/0/05')
        .replace('Smooth_Stone_Slab', 'Smooth_Stone_Slab_JE2_BE2');

    case url.includes('/Sandstone_Slab'):
      return url
        .replace('/b/bc', '/f/ff')
        .replace('Sandstone_Slab', 'Sandstone_Slab_JE5_BE2');

    case url.includes('/Cut_Sandstone_Slab'):
      return url
        .replace('/7/7a', '/3/37')
        .replace('Cut_Sandstone_Slab', 'Cut_Sandstone_Slab_JE1_BE1');

    case url.includes('/Petrified_Oak_Slab'):
      return url
        .replace('/e/ef', '/a/ac')
        .replace('Petrified_Oak_Slab', 'Oak_Slab_JE5_BE2');

    case url.includes('/Cobblestone_Slab'):
      return url
        .replace('/3/31', '/f/f5')
        .replace('Cobblestone_Slab', 'Cobblestone_Slab_JE4_BE3');

    case url.includes('/Brick_Slab'):
      return url
        .replace('/5/58', '/2/25')
        .replace('Brick_Slab', 'Brick_Slab_JE3_BE2');

    case url.includes('/Stone_Brick_Slab'):
      return url
        .replace('/2/21', '/1/18')
        .replace('Stone_Brick_Slab', 'Stone_Brick_Slab_JE3_BE2');

    case url.includes('/Mud_Brick_Slab'):
      return url
        .replace('/9/9c', '/e/e5')
        .replace('Mud_Brick_Slab', 'Mud_Brick_Slab_JE1_BE1');

    case url.includes('/Nether_Brick_Slab'):
      return url
        .replace('/5/52', '/b/b3')
        .replace('Nether_Brick_Slab', 'Nether_Brick_Slab_JE3_BE3');

    case url.includes('/Quartz_Slab'):
      return url
        .replace('/5/5e', '/7/79')
        .replace('Quartz_Slab', 'Quartz_Slab_JE3_BE2');

    case url.includes('/Red_Sandstone_Slab'):
      return url
        .replace('/4/4c', '/0/08')
        .replace('Red_Sandstone_Slab', 'Red_Sandstone_Slab_JE4_BE2');

    case url.includes('/Cut_Red_Sandstone_Slab'):
      return url
        .replace('/7/7e', '/0/0a')
        .replace('Cut_Red_Sandstone_Slab', 'Cut_Red_Sandstone_Slab_JE1_BE1');

    case url.includes('/Purpur_Slab'):
      return url
        .replace('/c/c3', '/b/b5')
        .replace('Purpur_Slab', 'Purpur_Slab_JE2_BE2');

    case url.includes('/Smooth_Stone'):
      return url
        .replace('/a/ab', '/d/d8')
        .replace('Smooth_Stone', 'Smooth_Stone_JE2_BE2');

    case url.includes('/Smooth_Quartz_Block'):
      return url
        .replace('/3/31', '/d/de')
        .replace('Smooth_Quartz_Block', 'Smooth_Quartz_Block_JE3_BE2');

    case url.includes('/Spruce_Fence_Gate'):
      return url
        .replace('/d/dc', '/3/3e')
        .replace('Spruce_Fence_Gate', 'Spruce_Fence_Gate_JE4_BE2');

    case url.includes('/Birch_Fence_Gate'):
      return url
        .replace('/f/fe', '/9/97')
        .replace('Birch_Fence_Gate', 'Birch_Fence_Gate_JE3_BE2');

    case url.includes('/Jungle_Fence_Gate'):
      return url
        .replace('/2/25', '/0/0b')
        .replace('Jungle_Fence_Gate', 'Jungle_Fence_Gate_JE3_BE2');

    case url.includes('/Acacia_Fence_Gate'):
      return url
        .replace('/b/be', '/3/3b')
        .replace('Acacia_Fence_Gate', 'Acacia_Fence_Gate_JE3_BE2');

    case url.includes('/Dark_Oak_Fence_Gate'):
      return url
        .replace('/7/7a', '/7/7a')
        .replace('Dark_Oak_Fence_Gate', 'Dark_Oak_Fence_Gate_JE3_BE2');

    case url.includes('/Mangrove_Fence_Gate'):
      return url
        .replace('/9/9e', '/5/5e')
        .replace('Mangrove_Fence_Gate', 'Mangrove_Fence_Gate_JE1_BE1');

    case url.includes('/Spruce_Fence'):
      return url
        .replace('/3/39', '/1/10')
        .replace('Spruce_Fence', 'Spruce_Fence_JE4_BE2');

    case url.includes('/Birch_Fence'):
      return url
        .replace('/3/35', '/b/b2')
        .replace('Birch_Fence', 'Birch_Fence_JE3_BE2');

    case url.includes('/Jungle_Fence'):
      return url
        .replace('/d/dc', '/2/23')
        .replace('Jungle_Fence', 'Jungle_Fence_JE3_BE2');

    case url.includes('/Acacia_Fence'):
      return url
        .replace('/e/e8', '/4/4d')
        .replace('Acacia_Fence', 'Acacia_Fence_JE3_BE2');

    case url.includes('/Dark_Oak_Fence'):
      return url
        .replace('/d/d3', '/4/48')
        .replace('Dark_Oak_Fence', 'Dark_Oak_Fence_JE3_BE2');

    case url.includes('/Mangrove_Fence'):
      return url
        .replace('/b/ba', '/7/7a')
        .replace('Mangrove_Fence', 'Mangrove_Fence_JE1_BE1');

    case url.includes('/Spruce_Door'):
      if (type === 'pc') {
        return url
          .replace('/0/01', '/2/2a')
          .replace('Spruce_Door', 'Spruce_Door_JE4');
      }

      return url
        .replace('/0/01', '/d/d2')
        .replace('Spruce_Door', 'Spruce_Door_BE2');

    case url.includes('/Birch_Door'):
      if (type === 'pc') {
        return url
          .replace('/4/43', '/4/49')
          .replace('Birch_Door', 'Birch_Door_JE4');
      }

      return url
        .replace('/4/43', '/1/11')
        .replace('Birch_Door', 'Birch_Door_BE2');

    case url.includes('/Jungle_Door'):
      if (type === 'pc') {
        return url
          .replace('/c/c5', '/7/7e')
          .replace('Jungle_Door', 'Jungle_Door_JE5');
      }

      return url
        .replace('/c/c5', '/2/20')
        .replace('Jungle_Door', 'Jungle_Door_BE2');

    case url.includes('/Acacia_Door'):
      if (type === 'pc') {
        return url
          .replace('/9/9d', '/3/32')
          .replace('Acacia_Door', 'Acacia_Door_JE5');
      }

      return url
        .replace('/9/9d', '/f/f6')
        .replace('Acacia_Door', 'Acacia_Door_BE2');

    case url.includes('/Dark_Oak_Door'):
      if (type === 'pc') {
        return url
          .replace('/3/36', '/b/b7')
          .replace('Dark_Oak_Door', 'Dark_Oak_Door_JE4');
      }

      return url
        .replace('/3/36', '/8/80')
        .replace('Dark_Oak_Door', 'Dark_Oak_Door_BE2');

    case url.includes('/Mangrove_Door'):
      return url
        .replace('/e/e3', '/d/d9')
        .replace('Mangrove_Door', 'Mangrove_Door_JE1_BE1');

    case url.includes('/End_Rod'):
      return url
        .replace('/0/0b', '/d/dc')
        .replace('End_Rod', encodeURIComponent('End_Rod_(U)_JE2_BE2'));

    case url.includes('/Chorus_Plant'):
      return url
        .replace('/1/1f', '/4/42')
        .replace('Chorus_Plant', 'Chorus_plant');

    case url.includes('/Chorus_Flower'):
      return url
        .replace('/7/73', '/c/ca')
        .replace('Chorus_Flower', 'Chorus_Flower_JE2_BE2');

    case url.includes('/Purpur_Block'):
      return url
        .replace('/f/fd', '/d/d1')
        .replace('Purpur_Block', 'Purpur_Block_JE2_BE2');

    case url.includes('/Purpur_Pillar'):
      return url
        .replace('/e/e6', '/0/0d')
        .replace(
          'Purpur_Pillar',
          encodeURIComponent('Purpur_Pillar_(UD)_JE3_BE2'),
        );

    case url.includes('/Purpur_Stairs'):
      return url
        .replace('/8/8e', '/9/96')
        .replace(
          'Purpur_Stairs',
          encodeURIComponent('Purpur_Stairs_(N)_JE2_BE2'),
        );

    case url.includes('/End_Stone_Bricks'):
      return url
        .replace('/e/ea', '/7/72')
        .replace('End_Stone_Bricks', 'End_Stone_Bricks_JE2_BE2');

    case url.includes('/Beetroots'):
      if (type === 'pc') {
        return url
          .replace('/f/f4', '/d/df')
          .replace('Beetroots', 'Beetroots_Age_3_JE3');
      }

      return url
        .replace('/f/f4', '/c/cc')
        .replace('Beetroots', 'Beetroots_Age_3_BE');

    case url.includes('/Dirt_Path'):
      return url
        .replace('/3/3a', '/6/6a')
        .replace('Dirt_Path', 'Dirt_Path_JE4_BE3');

    case url.includes('/End_Gateway'):
      return url
        .replace('/d/db', '/9/95')
        .replace('End_Gateway', 'End_gateway_JE3_BE2');

    case url.includes('/Repeating_Command_Block'):
      return url.replace('/7/7e', '/2/22').replace('png', 'gif');

    case url.includes('/Chain_Command_Block'):
      return url.replace('/8/8e', '/5/55').replace('png', 'gif');

    case url.includes('/Frosted_Ice'):
      return url
        .replace('/0/0a', '/2/2b')
        .replace('Frosted_Ice', 'Frosted_Ice_JE2_BE2');

    case url.includes('/Magma_Block'):
      return url
        .replace('/a/af', '/d/d1')
        .replace('Magma_Block', 'Magma_Block_JE2_BE2')
        .replace('png', 'gif');

    case url.includes('/Nether_Wart_Block'):
      return url
        .replace('/c/c0', '/d/d0')
        .replace('Nether_Wart_Block', 'Nether_Wart_Block_JE3');

    case url.includes('/Red_Nether_Bricks'):
      return url
        .replace('/7/78', '/9/95')
        .replace('Red_Nether_Bricks', 'Red_Nether_Bricks_JE3_BE2');

    case url.includes('/Bone_Block'):
      return url
        .replace('/0/02', '/3/37')
        .replace('Bone_Block', encodeURIComponent('Bone_Block_(UD)_JE2_BE2'));

    case url.includes('/Structure_Void'):
      return url
        .replace('/f/f7', '/b/b5')
        .replace(
          'Structure_Void',
          encodeURIComponent('Structure_Void_(shown)_JE3'),
        );

    case url.includes('/Observer'):
      return url
        .replace('/d/d3', '/3/39')
        .replace('Observer', 'Observer_JE4_BE3');

    case url.includes('/Shulker_Box'):
      return url.replace('/1/10', '/e/e5').replace('png', 'gif');

    case url.includes('/White_Glazed_Terracotta'):
      return url
        .replace('/a/a7', '/6/6b')
        .replace('White_Glazed_Terracotta', 'White_Glazed_Terracotta_JE2_BE2');

    case url.includes('/Orange_Glazed_Terracotta'):
      return url
        .replace('/0/00', '/3/3f')
        .replace(
          'Orange_Glazed_Terracotta',
          'Orange_Glazed_Terracotta_JE2_BE2',
        );

    case url.includes('/Magenta_Glazed_Terracotta'):
      return url
        .replace('/6/62', '/f/f1')
        .replace(
          'Magenta_Glazed_Terracotta',
          'Magenta_Glazed_Terracotta_JE2_BE2',
        );

    case url.includes('/Light_Blue_Glazed_Terracotta'):
      return url
        .replace('/4/4b', '/2/22')
        .replace(
          'Light_Blue_Glazed_Terracotta',
          'Light_Blue_Glazed_Terracotta_JE1_BE1',
        );

    case url.includes('/Yellow_Glazed_Terracotta'):
      return url
        .replace('/2/29', '/f/f1')
        .replace(
          'Yellow_Glazed_Terracotta',
          'Yellow_Glazed_Terracotta_JE1_BE1',
        );

    case url.includes('/Lime_Glazed_Terracotta'):
      return url
        .replace('/2/22', '/6/66')
        .replace('Lime_Glazed_Terracotta', 'Lime_Glazed_Terracotta_JE1_BE1');

    case url.includes('/Pink_Glazed_Terracotta'):
      return url
        .replace('/d/d3', '/9/94')
        .replace('Pink_Glazed_Terracotta', 'Pink_Glazed_Terracotta_JE1_BE1');

    case url.includes('/Gray_Glazed_Terracotta'):
      return url
        .replace('/c/c0', '/d/d1')
        .replace('Gray_Glazed_Terracotta', 'Gray_Glazed_Terracotta_JE1_BE1');

    case url.includes('/Light_Gray_Glazed_Terracotta'):
      return url
        .replace('/8/8e', '/a/a5')
        .replace(
          'Light_Gray_Glazed_Terracotta',
          'Light_Gray_Glazed_Terracotta_JE1_BE1',
        );

    case url.includes('/Cyan_Glazed_Terracotta'):
      return url
        .replace('/6/6c', '/1/10')
        .replace('Cyan_Glazed_Terracotta', 'Cyan_Glazed_Terracotta_JE2_BE2');

    case url.includes('/Purple_Glazed_Terracotta'):
      return url
        .replace('/e/e0', '/3/3d')
        .replace(
          'Purple_Glazed_Terracotta',
          'Purple_Glazed_Terracotta_JE1_BE1',
        );

    case url.includes('/Blue_Glazed_Terracotta'):
      return url
        .replace('/4/4c', '/8/84')
        .replace('Blue_Glazed_Terracotta', 'Blue_Glazed_Terracotta_JE1_BE1');

    case url.includes('/Brown_Glazed_Terracotta'):
      return url
        .replace('/8/88', '/f/f2')
        .replace('Brown_Glazed_Terracotta', 'Brown_Glazed_Terracotta_JE1_BE1');

    case url.includes('/Green_Glazed_Terracotta'):
      return url
        .replace('/3/38', '/8/8d')
        .replace('Green_Glazed_Terracotta', 'Green_Glazed_Terracotta_JE1_BE1');

    case url.includes('/Red_Glazed_Terracotta'):
      return url
        .replace('/a/aa', '/1/13')
        .replace('Red_Glazed_Terracotta', 'Red_Glazed_Terracotta_JE1_BE1');

    case url.includes('/Black_Glazed_Terracotta'):
      return url
        .replace('/b/b7', '/a/aa')
        .replace('Black_Glazed_Terracotta', 'Black_Glazed_Terracotta_JE1_BE1');

    case url.includes('/Kelp'):
      return url
        .replace('/1/12', '/8/8e')
        .replace('Kelp', encodeURIComponent('Kelp_(item)_JE1_BE2'));

    case url.includes('/Kelp_Plant'):
      return url
        .replace('/1/11', '/0/09')
        .replace('Kelp_Plant', 'Kelp_JE3_BE2')
        .replace('png', 'gif');

    case url.includes('/Dried_Kelp_Block'):
      return url
        .replace('/0/05', '/9/90')
        .replace('Dried_Kelp_Block', 'Dried_Kelp_Block_JE1_BE2');

    case url.includes('/Tutrle_Egg'):
      return url
        .replace('/0/0d', '/b/ba')
        .replace('Tutrle_Egg', 'Tutrle_Egg_4');

    case url.includes('/Dead_Tube_Coral_Block'):
      return url
        .replace('/a/af', '/2/26')
        .replace('Dead_Tube_Coral_Block', 'Dead_Tube_Coral_Block_JE2_BE1');

    case url.includes('/Dead_Brain_Coral_Block'):
      return url
        .replace('/8/84', '/a/a7')
        .replace('Dead_Brain_Coral_Block', 'Dead_Brain_Coral_Block_JE2_BE1');

    case url.includes('/Dead_Bubble_Coral_Block'):
      return url
        .replace('/a/a3', '/d/dd')
        .replace('Dead_Bubble_Coral_Block', 'Dead_Bubble_Coral_Block_JE1_BE1');

    case url.includes('/Dead_Fire_Coral_Block'):
      return url
        .replace('/c/c5', '/7/7d')
        .replace('Dead_Fire_Coral_Block', 'Dead_Fire_Coral_Block_JE1_BE1');

    case url.includes('/Dead_Horn_Coral_Block'):
      return url
        .replace('/a/ab', '/a/a7')
        .replace('Dead_Horn_Coral_Block', 'Dead_Horn_Coral_Block_JE2_BE1');

    case url.includes('/Tube_Coral_Block'):
      return url
        .replace('/9/95', '/4/4c')
        .replace('Tube_Coral_Block', 'Tube_Coral_Block_JE2_BE1');

    case url.includes('/Brain_Coral_Block'):
      return url
        .replace('/5/57', '/5/5e')
        .replace('Brain_Coral_Block', 'Brain_Coral_Block_JE2_BE1');

    case url.includes('/Bubble_Coral_Block'):
      return url
        .replace('/0/0a', '/6/6c')
        .replace('Bubble_Coral_Block', 'Bubble_Coral_Block_JE2_BE1');

    case url.includes('/Fire_Coral_Block'):
      return url
        .replace('/0/01', '/f/ff')
        .replace('Fire_Coral_Block', 'Fire_Coral_Block_JE2_BE1');

    case url.includes('/Horn_Coral_Block'):
      return url
        .replace('/1/10', '/4/4a')
        .replace('Horn_Coral_Block', 'Horn_Coral_Block_JE2_BE2');

    case url.includes('/Dead_Tube_Coral'):
      return url
        .replace('/0/07', '/c/cb')
        .replace('Dead_Tube_Coral', 'Dead_Tube_Coral_JE1_BE1');

    case url.includes('/Dead_Brain_Coral'):
      return url
        .replace('/3/34', '/9/9d')
        .replace('Dead_Brain_Coral', 'Dead_Brain_Coral_JE1_BE1');

    case url.includes('/Dead_Bubble_Coral'):
      return url
        .replace('/f/fb', '/e/e9')
        .replace('Dead_Bubble_Coral', 'Dead_Bubble_Coral_JE1_BE1');

    case url.includes('/Dead_Fire_Coral'):
      return url
        .replace('/f/fb', '/4/48')
        .replace('Dead_Fire_Coral', 'Dead_Fire_Coral_JE1_BE1');

    case url.includes('/Dead_Horn_Coral'):
      return url
        .replace('/9/9b', '/b/be')
        .replace('Dead_Horn_Coral', 'Dead_Horn_Coral_JE1_BE1');

    case url.includes('/Tube_Coral'):
      return url
        .replace('/f/f7', '/4/44')
        .replace('Tube_Coral', 'Tube_Coral_JE1_BE1');

    case url.includes('/Brain_Coral'):
      return url
        .replace('/2/21', '/2/26')
        .replace('Brain_Coral', 'Brain_Coral_JE1_BE1');

    case url.includes('/Bubble_Coral'):
      return url
        .replace('/7/7d', '/2/22')
        .replace('Bubble_Coral', 'Bubble_Coral_JE1_BE1');

    case url.includes('/Fire_Coral'):
      return url
        .replace('/a/a1', '/d/d3')
        .replace('Fire_Coral', 'Fire_Coral_JE2_BE1');

    case url.includes('/Horn_Coral'):
      return url
        .replace('/8/8d', '/7/75')
        .replace('Horn_Coral', 'Horn_Coral_JE1_BE1');

    case url.includes('/Dead_Tube_Coral_Fan'):
      return url
        .replace('/a/a8', '/b/b6')
        .replace('Dead_Tube_Coral_Fan', 'Dead_Tube_Coral_Fan_JE1_BE2');

    case url.includes('/Dead_Brain_Coral_Fan'):
      return url
        .replace('/2/2e', '/0/02')
        .replace('Dead_Brain_Coral_Fan', 'Dead_Brain_Coral_Fan_JE1_BE2');

    case url.includes('/Dead_Bubble_Coral_Fan'):
      return url
        .replace('/0/07', '/1/12')
        .replace('Dead_Bubble_Coral_Fan', 'Dead_Bubble_Coral_Fan_JE1_BE2');

    case url.includes('/Dead_Fire_Coral_Fan'):
      return url
        .replace('/c/ce', '/f/f8')
        .replace('Dead_Fire_Coral_Fan', 'Dead_Fire_Coral_Fan_JE1_BE2');

    case url.includes('/Dead_Horn_Coral_Fan'):
      return url
        .replace('/9/97', '/1/12')
        .replace('Dead_Horn_Coral_Fan', 'Dead_Horn_Coral_Fan_JE1_BE2');

    case url.includes('/Tube_Coral_Fan'):
      return url
        .replace('/0/06', '/8/89')
        .replace('Tube_Coral_Fan', 'Tube_Coral_Fan_JE1_BE2');

    case url.includes('/Brain_Coral_Fan'):
      return url
        .replace('/c/cd', '/6/6f')
        .replace('Brain_Coral_Fan', 'Brain_Coral_Fan_JE1_BE2');

    case url.includes('/Bubble_Coral_Fan'):
      return url
        .replace('/1/17', '/e/e5')
        .replace('Bubble_Coral_Fan', 'Bubble_Coral_Fan_JE1_BE2');

    case url.includes('/Fire_Coral_Fan'):
      return url
        .replace('/1/1b', '/8/8f')
        .replace('Fire_Coral_Fan', 'Fire_Coral_Fan_JE1_BE2');

    case url.includes('/Horn_Coral_Fan'):
      return url
        .replace('/f/fd', '/0/03')
        .replace('Horn_Coral_Fan', 'Horn_Coral_Fan_JE1_BE2');

    case url.includes('/Dead_Tube_Coral_Wall_Fan'):
      return url
        .replace('/3/3f', '/e/e7')
        .replace(
          'Dead_Tube_Coral_Wall_Fan',
          encodeURIComponent('Dead_Tube_Coral_Wall_Fan_(S)_JE1'),
        );

    case url.includes('/Dead_Brain_Coral_Wall_Fan'):
      return url
        .replace('/f/fd', '/6/68')
        .replace(
          'Dead_Brain_Coral_Wall_Fan',
          encodeURIComponent('Dead_Brain_Coral_Wall_Fan_(S)_JE1'),
        );

    case url.includes('/Dead_Bubble_Coral_Wall_Fan'):
      return url
        .replace('/4/4e', '/e/eb')
        .replace(
          'Dead_Bubble_Coral_Wall_Fan',
          encodeURIComponent('Dead_Bubble_Coral_Wall_Fan_(S)_JE1'),
        );

    case url.includes('/Dead_Fire_Coral_Wall_Fan'):
      return url
        .replace('/f/f7', '/6/62')
        .replace(
          'Dead_Fire_Coral_Wall_Fan',
          encodeURIComponent('Dead_Fire_Coral_Wall_Fan_(S)_JE1'),
        );

    case url.includes('/Dead_Horn_Coral_Wall_Fan'):
      return url
        .replace('/4/4e', '/f/f5')
        .replace(
          'Dead_Horn_Coral_Wall_Fan',
          encodeURIComponent('Dead_Horn_Coral_Wall_Fan_(S)_JE1'),
        );

    case url.includes('/Tube_Coral_Wall_Fan'):
      return url
        .replace('/b/bb', '/0/08')
        .replace(
          'Tube_Coral_Wall_Fan',
          encodeURIComponent('Tube_Coral_Wall_Fan_(S)_JE2'),
        );

    case url.includes('/Brain_Coral_Wall_Fan'):
      return url
        .replace('/2/2a', '/6/6a')
        .replace(
          'Brain_Coral_Wall_Fan',
          encodeURIComponent('Brain_Coral_Wall_Fan_(S)_JE2'),
        );

    case url.includes('/Bubble_Coral_Wall_Fan'):
      return url
        .replace('/6/6c', '/d/d5')
        .replace(
          'Bubble_Coral_Wall_Fan',
          encodeURIComponent('Bubble_Coral_Wall_Fan_(S)_JE2'),
        );

    case url.includes('/Fire_Coral_Wall_Fan'):
      return url
        .replace('/e/ee', '/8/86')
        .replace(
          'Fire_Coral_Wall_Fan',
          encodeURIComponent('Fire_Coral_Wall_Fan_(S)_JE1'),
        );

    case url.includes('/Horn_Coral_Wall_Fan'):
      return url
        .replace('/5/5f', '/a/a4')
        .replace(
          'Horn_Coral_Wall_Fan',
          encodeURIComponent('Horn_Coral_Wall_Fan_(S)_JE2'),
        );

    case url.includes('/Sea_Pickle'):
      return url
        .replace('/f/ff', '/b/b5')
        .replace('Sea_Pickle', 'Sea_Pickle_4_JE1_BE1');

    case url.includes('/Blue_Ice'):
      return url
        .replace('/0/0c', '/0/03')
        .replace('Blue_Ice', 'Blue_Ice_JE3_BE2');

    case url.includes('/Conduit'):
      if (type === 'pc') {
        return url.replace('/6/61', '/b/b9').replace('png', 'gif');
      }

      return url
        .replace('/6/61', '/a/a8')
        .replace('Conduit', 'Conduit_BE1')
        .replace('png', 'gif');

    case url.includes('/Bamboo_Shoot'):
      return url
        .replace('/f/f2', '/8/87')
        .replace('Bamboo_Shoot', 'Bamboo_Shoot_JE1_BE1');

    case url.includes('/Bamboo'):
      return url
        .replace('/2/2a', '/3/34')
        .replace('Bamboo', 'Leafless_Bamboo_JE1_BE2');

    case url.includes('/Potted_Bamboo'):
      return url
        .replace('/c/c1', '/b/b1')
        .replace('Potted_Bamboo', 'Potted_Bamboo_JE1_BE1');

    case url.includes('/Void_Air'):
      return url
        .replace('/6/68', '/4/47')
        .replace('Void_Air', encodeURIComponent('Air_(shown)_JE2'));

    case url.includes('/Cave_Air'):
      return url
        .replace('/c/cb', '/4/47')
        .replace('Cave_Air', encodeURIComponent('Air_(shown)_JE2'));

    case url.includes('/Bubble_Column'):
      return url
        .replace('/c/c2', '/e/e3')
        .replace('Bubble_Column', 'Bubble_Column_JE1_BE1');

    case url.includes('/Polished_Granite_Stairs'):
      return url
        .replace('/1/1d', '/3/35')
        .replace(
          'Polished_Granite_Stairs',
          encodeURIComponent('Polished_Granite_Stairs_(N)_JE1_BE1'),
        );

    case url.includes('/Smooth_Red_Sandstone_Stairs'):
      return url
        .replace('/d/da', '/2/22')
        .replace(
          'Smooth_Red_Sandstone_Stairs',
          encodeURIComponent('Smooth_Red_Sandstone_Stairs_(N)_JE3_BE1'),
        );

    case url.includes('/Mossy_Stone_Brick_Stairs'):
      return url
        .replace('/9/90', '/f/f1')
        .replace(
          'Mossy_Stone_Brick_Stairs',
          encodeURIComponent('Mossy_Stone_Brick_Stairs_(N)_JE2_BE1'),
        );

    case url.includes('/Polished_Diorite_Stairs'):
      return url
        .replace('/a/ab', '/0/06')
        .replace(
          'Polished_Diorite_Stairs',
          encodeURIComponent('Polished_Diorite_Stairs_(N)_JE2_BE2'),
        );

    case url.includes('/Mossy_Cobblestone_Stairs'):
      return url
        .replace('/f/f2', '/7/7a')
        .replace(
          'Mossy_Cobblestone_Stairs',
          encodeURIComponent('Mossy_Cobblestone_Stairs_(N)_JE2_BE1'),
        );

    case url.includes('/End_Stone_Brick_Stairs'):
      return url
        .replace('/7/71', '/9/93')
        .replace(
          'End_Stone_Brick_Stairs',
          encodeURIComponent('End_Stone_Brick_Stairs_(N)_JE1_BE1'),
        );

    case url.includes('/Stone_Stairs'):
      return url
        .replace('/5/5c', '/7/7a')
        .replace(
          'Stone_Stairs',
          encodeURIComponent('Stone_Stairs_(N)_JE2_BE2'),
        );

    case url.includes('/Smooth_Sandstone_Stairs'):
      return url
        .replace('/8/87', '/4/47')
        .replace(
          'Smooth_Sandstone_Stairs',
          encodeURIComponent('Smooth_Sandstone_Stairs_(N)_JE4_BE2'),
        );

    case url.includes('/Smooth_Quartz_Stairs'):
      return url
        .replace('/3/33', '/b/b4')
        .replace(
          'Smooth_Quartz_Stairs',
          encodeURIComponent('Smooth_Quartz_Stairs_(N)_JE2_BE1'),
        );

    case url.includes('/Granite_Stairs'):
      return url
        .replace('/8/8b', '/7/7f')
        .replace(
          'Granite_Stairs',
          encodeURIComponent('Granite_Stairs_(N)_JE1_BE1'),
        );

    case url.includes('/Andesite_Stairs'):
      return url
        .replace('/3/35', '/e/e0')
        .replace(
          'Andesite_Stairs',
          encodeURIComponent('Andesite_Stairs_(N)_JE2_BE1'),
        );

    case url.includes('/Red_Nether_Brick_Stairs'):
      return url
        .replace('/d/d5', '/f/f3')
        .replace(
          'Red_Nether_Brick_Stairs',
          encodeURIComponent('Red_Nether_Brick_Stairs_(N)_JE1_BE1'),
        );

    case url.includes('/Polished_Andesite_Stairs'):
      return url
        .replace('/6/68', '/0/0d')
        .replace(
          'Polished_Andesite_Stairs',
          encodeURIComponent('Polished_Andesite_Stairs_(N)_JE2_BE1'),
        );

    case url.includes('/Diorite_Stairs'):
      return url
        .replace('/b/bb', '/9/9a')
        .replace(
          'Diorite_Stairs',
          encodeURIComponent('Diorite_Stairs_(N)_JE3_BE2'),
        );

    case url.includes('/Polished_Granite_Slab'):
      return url
        .replace('/1/1d', '/3/39')
        .replace('Polished_Granite_Slab', 'Polished_Granite_Slab_JE1_BE1');

    case url.includes('/Smooth_Red_Sandstone_Slab'):
      return url
        .replace('/9/9a', '/5/56')
        .replace(
          'Smooth_Red_Sandstone_Slab',
          'Smooth_Red_Sandstone_Slab_JE3_BE2',
        );

    case url.includes('/Mossy_Stone_Brick_Slab'):
      return url
        .replace('/c/c4', '/7/7e')
        .replace('Mossy_Stone_Brick_Slab', 'Mossy_Stone_Brick_Slab_JE2_BE2');

    case url.includes('/Polished_Diorite_Slab'):
      return url
        .replace('/1/13', '/a/af')
        .replace('Polished_Diorite_Slab', 'Polished_Diorite_Slab_JE2_BE2');

    case url.includes('/Mossy_Cobblestone_Slab'):
      return url
        .replace('/9/9b', '/3/32')
        .replace('Mossy_Cobblestone_Slab', 'Mossy_Cobblestone_Slab_JE2_BE2');

    case url.includes('/End_Stone_Brick_Slab'):
      return url
        .replace('/d/df', '/d/d0')
        .replace('End_Stone_Brick_Slab', 'End_Stone_Brick_Slab_JE1_BE1');

    case url.includes('/Smooth_Sandstone_Slab'):
      return url
        .replace('/e/ef', '/8/86')
        .replace('Smooth_Sandstone_Slab', 'Smooth_Sandstone_Slab_JE3_BE2');

    case url.includes('/Smooth_Quartz_Slab'):
      return url
        .replace('/5/54', '/0/39')
        .replace('Smooth_Quartz_Slab', 'Smooth_Quartz_Slab_JE1_BE1');

    case url.includes('/Granite_Slab'):
      return url
        .replace('/3/37', '/c/cd')
        .replace('Granite_Slab', 'Granite_Slab_JE1_BE1');

    case url.includes('/Andesite_Slab'):
      return url
        .replace('/6/68', '/7/77')
        .replace('Andesite_Slab', 'Andesite_Slab_JE2_BE2');

    case url.includes('/Red_Nether_Brick_Slab'):
      return url
        .replace('/7/75', '/8/83')
        .replace('Red_Nether_Brick_Slab', 'Red_Nether_Brick_Slab_JE2_BE2');

    case url.includes('/Polished_Andesite_Slab'):
      return url
        .replace('/1/1a', '/f/f2')
        .replace('Polished_Andesite_Slab', 'Polished_Andesite_Slab_JE2_BE2');

    case url.includes('/Diorite_Slab'):
      return url
        .replace('/6/61', '/9/9f')
        .replace('Diorite_Slab', 'Diorite_Slab_JE3_BE2');

    case url.includes('/Brick_Wall'):
      return url
        .replace('/d/dd', '/c/cw')
        .replace('Brick_Wall', 'Brick_Wall_JE1_BE1');

    case url.includes('/Prismarine_Wall'):
      return url
        .replace('/c/c5', '/2/28')
        .replace('Prismarine_Wall', 'Prismarine_Wall_JE1_BE1')
        .replace('png', 'gif');

    case url.includes('/Red_Sandstone_Wall'):
      return url
        .replace('/5/54', '/0/01')
        .replace('Red_Sandstone_Wall', 'Red_Sandstone_Wall_JE2_BE1');

    case url.includes('/Mossy_Stone_Brick_Wall'):
      return url
        .replace('/e/e9', '/1/19')
        .replace('Mossy_Stone_Brick_Wall', 'Mossy_Stone_Brick_Wall_JE2_BE1');

    case url.includes('/Granite_Wall'):
      return url
        .replace('/b/bb', '/5/59')
        .replace('Granite_Wall', 'Granite_Wall_JE1_BE1');

    case url.includes('/Stone_Brick_Wall'):
      return url
        .replace('/a/a1', '/e/ee')
        .replace('Stone_Brick_Wall', 'Stone_Brick_Wall_JE2_BE1');

    case url.includes('/Mud_Brick_Wall'):
      return url
        .replace('/e/ee', '/1/1d')
        .replace('Mud_Brick_Wall', 'Mud_Brick_Wall_JE1_BE1');

    case url.includes('/Nether_Brick_Wall'):
      return url
        .replace('/3/3b', '/d/d5')
        .replace('Nether_Brick_Wall', 'Nether_Brick_Wall_JE2_BE2');

    case url.includes('/Andesite_Wall'):
      return url
        .replace('/3/36', '/4/4b')
        .replace('Andesite_Wall', 'Andesite_Wall_JE2_BE1');

    case url.includes('/Red_Nether_Brick_Wall'):
      return url
        .replace('/4/47', '/1/19')
        .replace('Red_Nether_Brick_Wall', 'Red_Nether_Brick_Wall_JE2_BE1');

    case url.includes('/Sandstone_Wall'):
      return url
        .replace('/c/ce', '/b/bc')
        .replace('Sandstone_Wall', 'Sandstone_Wall_JE2_BE1');

    case url.includes('/End_Stone_Brick_Wall'):
      return url
        .replace('/6/6f', '/7/73')
        .replace('End_Stone_Brick_Wall', 'End_Stone_Brick_Wall_JE1_BE1');

    case url.includes('/Diorite_Wall'):
      return url
        .replace('/2/22', '/a/a4')
        .replace('Diorite_Wall', 'Diorite_Wall_JE3_BE1');

    case url.includes('/Scaffolding'):
      return url
        .replace('/6/66', '/b/b7')
        .replace('Scaffolding', 'Standing_Scaffolding');

    case url.includes('/Loom'):
      return url
        .replace('/3/3b', '/d/d7')
        .replace('Loom', encodeURIComponent('Loom_(S)_JE1_BE1'));

    case url.includes('/Barrel'):
      return url
        .replace('/a/a1', '/2/21')
        .replace('Barrel', encodeURIComponent('Barrel_(U)_JE1_BE1'));

    case url.includes('/Smoker'):
      if (type === 'pc') {
        return url
          .replace('/b/ba', '/b/bf')
          .replace('Smoker', encodeURIComponent('Lit_Smoker_(S)_JE1'));
      }

      return url
        .replace('/b/ba', '/f/f9')
        .replace('Smoker', encodeURIComponent('Lit_Smoker_(S)_BE1'));

    case url.includes('/Blast_Furnace'):
      if (type === 'pc') {
        return url
          .replace('/e/ed', '/2/22')
          .replace(
            'Blast_Furnace',
            encodeURIComponent('Blast_Furnace_(S)_JE1'),
          );
      }

      return url
        .replace('/e/ed', '/d/d6')
        .replace('Blast_Furnace', encodeURIComponent('Blast_Furnace_(S)_BE1'));

    case url.includes('/Cartography_Table'):
      return url
        .replace('/3/30', '/2/22')
        .replace('Cartography_Table', 'Cartography_Table_JE3_BE2');

    case url.includes('/Fletching_Table'):
      return url
        .replace('/e/e8', '/1/17')
        .replace('Fletching_Table', 'Fletching_Table_JE2_BE1');

    case url.includes('/Grindstone'):
      return url
        .replace('/6/69', '/b/bb')
        .replace('Grindstone', encodeURIComponent('Grindstone_(floor)_(N)'));

    case url.includes('/Lectern'):
      return url
        .replace('/6/67', '/1/13')
        .replace('Lectern', encodeURIComponent('Lectern_(S)'));

    case url.includes('/Smithing_Table'):
      return url
        .replace('/a/a2', '/9/93')
        .replace('Smithing_Table', 'Smithing_Table_JE2_BE2');

    case url.includes('/Stone_Cutter'):
      return url
        .replace('/e/e7', '/9/93')
        .replace('Stone_Cutter', 'Stonecutter_JE2_BE1')
        .replace('png', 'gif');

    case url.includes('/Bell'):
      return url
        .replace('/6/6e', '/f/fc')
        .replace('Bell', encodeURIComponent('Bell_(N)'));

    case url.includes('/Lantern'):
      return url
        .replace('/f/f5', '/7/7a')
        .replace('Lantern', 'Lantern_JE1_BE1')
        .replace('png', 'gif');

    case url.includes('/Soul_Lantern'):
      return url
        .replace('/c/c7', '/1/1b')
        .replace('Soul_Lantern', 'Soul_Lantern_JE2_BE1')
        .replace('png', 'gif');

    case url.includes('/Campfire'):
      return url
        .replace('/0/01', '/9/91')
        .replace('Campfire', 'Campfire_JE2_BE2')
        .replace('png', 'gif');

    case url.includes('/Soul_Campfire'):
      return url
        .replace('/4/43', '/f/f8')
        .replace('Soul_Campfire', 'Soul_Campfire_JE1_BE1')
        .replace('png', 'gif');

    case url.includes('/Sweet_Berry_Bush'):
      return url
        .replace('/0/09', '/4/43')
        .replace('Sweet_Berry_Bush', 'Sweet_Berry_Bush_Age_3_JE1_BE1');

    case url.includes('/Warped_Stem'):
      return url
        .replace('/7/77', '/9/9e')
        .replace('Warped_Stem', encodeURIComponent('Warped_Stem_(UD)_BE1'))
        .replace('png', 'gif');

    case url.includes('/Stripped_Warped_Stem'):
      return url
        .replace('/e/ec', '/c/c8')
        .replace(
          'Stripped_Warped_Stem',
          encodeURIComponent('Stripped_Warped_Stem_(UD)_JE2_BE1'),
        );

    case url.includes('/Warped_Hyphae'):
      return url
        .replace('/8/83', '/b/ba')
        .replace('Warped_Hyphae', encodeURIComponent('Warped_Hyphae_(UD)_JE1'))
        .replace('png', 'gif');

    case url.includes('/Stripped_Warped_Hyphae'):
      return url
        .replace('/9/9e', '/1/12')
        .replace(
          'Stripped_Warped_Hyphae',
          encodeURIComponent('Stripped_Warped_Hyphae_(UD)_JE1'),
        );

    case url.includes('/Warped_Nylium'):
      return url
        .replace('/4/4a', '/2/25')
        .replace('Warped_Nylium', 'Warped_Nylium_JE1_BE1');

    case url.includes('/Warped_Fungus'):
      return url
        .replace('/5/51', '/5/5b')
        .replace('Warped_Fungus', 'Warped_Fungus_JE1_BE1');

    case url.includes('/Warped_Wart_Block'):
      return url
        .replace('/c/c3', '/f/f0')
        .replace('Warped_Wart_Block', 'Warped_Wart_Block_JE1_BE1');

    case url.includes('/Warped_Roots'):
      return url
        .replace('/9/93', '/6/61')
        .replace('Warped_Roots', 'Warped_Roots_JE1_BE1');

    case url.includes('/Nether_Sprouts'):
      return url
        .replace('/d/d7', '/3/38')
        .replace('Nether_Sprouts', 'Nether_Sprouts_JE2_BE2');

    case url.includes('/Crimson_Stem'):
      return url
        .replace('/c/cc', '/b/ba')
        .replace('Crimson_Stem', encodeURIComponent('Crimson_Stem_(UD)_BE1'))
        .replace('png', 'gif');

    case url.includes('/Stripped_Crimson_Stem'):
      return url
        .replace('/8/8e', '/8/8c')
        .replace(
          'Stripped_Crimson_Stem',
          encodeURIComponent('Stripped_Crimson_Stem_(UD)_JE2_BE1'),
        );

    case url.includes('/Crimson_Roots'):
      return url
        .replace('/9/93', '/2/25')
        .replace('Crimson_Roots', 'Crimson_Roots_JE1_BE1');

    case url.includes('/Crimson_Hyphae'):
      return url
        .replace('/8/85', '/7/74')
        .replace(
          'Crimson_Hyphae',
          encodeURIComponent('Crimson_Hyphae_(UD)_JE1'),
        )
        .replace('png', 'gif');

    case url.includes('/Stripped_Crimson_Hyphae'):
      return url
        .replace('/7/73', '/6/60')
        .replace(
          'Stripped_Crimson_Hyphae',
          encodeURIComponent('Stripped_Crimson_Hyphae_(UD)_JE1'),
        );

    case url.includes('/Crimson_Nylium'):
      return url
        .replace('/1/1f', '/6/69')
        .replace('Crimson_Nylium', 'Crimson_Nylium_JE1_BE1');

    case url.includes('/Crimson_Fungus'):
      return url
        .replace('/1/13', '/1/1d')
        .replace('Crimson_Fungus', 'Crimson_Fungus_JE1_BE1');

    case url.includes('/Shroomlight'):
      return url
        .replace('/3/33', '/8/83')
        .replace('Shroomlight', 'Shroomlight_JE1_BE1');

    case url.includes('/Weeping_Vines'):
      return url
        .replace('/b/be', '/1/13')
        .replace('Weeping_Vines', 'Weeping_Vines_Age_0_JE1');

    case url.includes('/Weeping_Vines_Plant'):
      return url
        .replace('/5/55', '/e/ef')
        .replace('Weeping_Vines_Plant', 'Weeping_Vines_Plant_JE1');

    case url.includes('/Twisting_Vines'):
      return url
        .replace('/4/41', '/c/c0')
        .replace('Twisting_Vines', 'Twisting_Vines_Age_1_JE1_BE1');

    case url.includes('/Twisting_Vines_Plant'):
      return url
        .replace('/6/63', '/7/75')
        .replace('Twisting_Vines_Plant', 'Twisting_Vines_Plant_JE1_BE1');

    case url.includes('/Crimson_Planks'):
      return url
        .replace('/6/62', '/d/d9')
        .replace('Crimson_Planks', 'Crimson_Planks_JE1_BE1');

    case url.includes('/Warped_Planks'):
      return url
        .replace('/3/3a', '/a/a5')
        .replace('Warped_Planks', 'Warped_Planks_JE1_BE1');

    case url.includes('/Crimson_Slab'):
      return url
        .replace('/1/11', '/a/a7')
        .replace('Crimson_Slab', 'Crimson_Slab_JE1_BE1');

    case url.includes('/Warped_Slab'):
      return url
        .replace('/8/8e', '/7/7b')
        .replace('Warped_Slab', 'Warped_Slab_JE1_BE1');

    case url.includes('/Crimson_Pressure_Plate'):
      return url
        .replace('/7/72', '/d/d7')
        .replace('Crimson_Pressure_Plate', 'Crimson_Pressure_Plate_JE1_BE1');

    case url.includes('/Warped_Pressure_Plate'):
      return url
        .replace('/1/19', '/7/7d')
        .replace('Warped_Pressure_Plate', 'Warped_Pressure_Plate_JE1_BE1');

    case url.includes('/Crimson_Fence'):
      return url
        .replace('/e/e8', '/d/d9')
        .replace('Crimson_Fence', 'Crimson_Fence_JE1_BE1');

    case url.includes('/Warped_Fence'):
      return url
        .replace('/b/b2', '/1/1c')
        .replace('Warped_Fence', 'Warped_Fence_JE1_BE1');

    case url.includes('/Crimson_Trapdoor'):
      return url
        .replace('/1/18', '/1/13')
        .replace('Crimson_Trapdoor', 'Crimson_Trapdoor_JE1_BE1');

    case url.includes('/Warped_Trapdoor'):
      return url
        .replace('/5/5c', '/8/88')
        .replace('Warped_Trapdoor', 'Warped_Trapdoor_JE1_BE1');

    case url.includes('/Crimson_Fence_Gate'):
      return url
        .replace('/a/a4', '/e/ec')
        .replace('Crimson_Fence_Gate', 'Crimson_Fence_Gate_JE1_BE1');

    case url.includes('/Warped_Fence_Gate'):
      return url
        .replace('/5/53', '/b/be')
        .replace('Warped_Fence_Gate', 'Warped_Fence_Gate_JE1_BE1');

    case url.includes('/Crimson_Stairs'):
      return url
        .replace('/8/85', '/7/71')
        .replace(
          'Crimson_Stairs',
          encodeURIComponent('Crimson_Stairs_(N)_JE1_BE1'),
        );

    case url.includes('/Warped_Stairs'):
      return url
        .replace('/2/29', '/c/cc')
        .replace(
          'Warped_Stairs',
          encodeURIComponent('Warped_Stairs_(N)_JE1_BE1'),
        );

    case url.includes('/Crimson_Button'):
      return url
        .replace('/0/0b', '/7/77')
        .replace('Crimson_Button', 'Crimson_Button_JE1_BE1');

    case url.includes('/Warped_Button'):
      return url
        .replace('/f/f6', '/3/3a')
        .replace('Warped_Button', 'Warped_Button_JE1_BE1');

    case url.includes('/Crimson_Door'):
      return url
        .replace('/9/93', '/7/70')
        .replace('Crimson_Door', 'Crimson_Door_JE3');

    case url.includes('/Warped_Door'):
      return url
        .replace('/a/a9', '/f/f2')
        .replace('Warped_Door', 'Warped_Door_JE3');

    case url.includes('/Crimson_Sign'):
      return url
        .replace('/c/c7', '/a/af')
        .replace('Crimson_Sign', encodeURIComponent('Crimson_Sign_(0)'));

    case url.includes('/Warped_Sign'):
      return url
        .replace('/b/bc', '/0/05')
        .replace('Warped_Sign', encodeURIComponent('Warped_Sign_(0)'));

    case url.includes('/Structure_Block'):
      return url
        .replace('/d/d2', '/0/05')
        .replace('Structure_Block', 'Structure_Block_JE2_BE1');

    case url.includes('/Jigsaw_Block'):
      return url
        .replace('/f/f3', '/9/94')
        .replace(
          'Jigsaw_Block',
          encodeURIComponent('Jigsaw_Block_(S)_JE3_BE2'),
        );

    case url.includes('/Composter'):
      return url
        .replace('/f/f3', '/1/1d')
        .replace('Composter', 'Composter_JE1');

    case url.includes('/Target'):
      return url.replace('/0/09', '/f/f4').replace('Target', 'Target_JE1_BE1');

    case url.includes('/Bee_Nest'):
      return url
        .replace('/4/46', '/4/44')
        .replace('Bee_Nest', encodeURIComponent('Bee_Nest_(S)_JE1'));

    case url.includes('/Beehive'):
      return url
        .replace('/3/3c', '/f/f0')
        .replace('Beehive', encodeURIComponent('Beehive_(S)_JE1'));

    case url.includes('/Honey_Block'):
      return url
        .replace('/8/80', '/c/c4')
        .replace('Honey_Block', 'Honey_Block_JE1_BE2');

    case url.includes('/Honeycomb_Block'):
      return url
        .replace('/f/f3', '/3/3b')
        .replace('Honeycomb_Block', 'Honeycomb_Block_JE1_BE1');

    case url.includes('/Block_of_Netherite'):
      return url
        .replace('/0/08', '/3/31')
        .replace('Block_of_Netherite', 'Block_of_Netherite_JE1_BE1');

    case url.includes('/Ancient_Debris'):
      return url
        .replace('/c/c1', '/4/4c')
        .replace('Ancient_Debris', 'Ancient_Debris_JE1_BE1');

    case url.includes('/Crying_Obsidian'):
      return url
        .replace('/7/72', '/7/7f')
        .replace('Crying_Obsidian', 'Crying_Obsidian_JE1_BE1');

    case url.includes('/Respawn_Anchor'):
      return url
        .replace('/4/42', '/a/a7')
        .replace(
          'Respawn_Anchor',
          encodeURIComponent('Respawn_Anchor_(0)_JE1'),
        );

    case url.includes('/Potted_Crimson_Fungus'):
      return url
        .replace('/2/2b', '/7/78')
        .replace('Potted_Crimson_Fungus', 'Potted_Crimson_Fungus_JE1_BE1');

    case url.includes('/Potted_Warped_Fungus'):
      return url
        .replace('/5/50', '/4/43')
        .replace('Potted_Warped_Fungus', 'Potted_Warped_Fungus_JE1_BE1');

    case url.includes('/Potted_Crimson_Roots'):
      return url
        .replace('/9/99', '/c/cb')
        .replace('Potted_Crimson_Roots', 'Potted_Crimson_Roots_JE1_BE1');

    case url.includes('/Potted_Warped_Roots'):
      return url
        .replace('/5/5c', '/7/73')
        .replace('Potted_Warped_Roots', 'Potted_Warped_Roots_JE1_BE1');

    case url.includes('/Lodestone'):
      return url
        .replace('/f/f1', '/7/73')
        .replace('Lodestone', 'Lodestone_JE1_BE1');

    case url.includes('/Blackstone'):
      return url
        .replace('/7/72', '/3/32')
        .replace('Blackstone', 'Blackstone_JE1_BE1');

    case url.includes('/Blackstone_Stairs'):
      return url
        .replace('/5/5c', '/b/b7')
        .replace(
          'Blackstone_Stairs',
          encodeURIComponent('Blackstone_Stairs_(N)_JE1'),
        );

    case url.includes('/Blackstone_Wall'):
      return url
        .replace('/6/69', '/5/5d')
        .replace('Blackstone_Wall', 'Blackstone_Wall_JE1_BE1');

    case url.includes('/Polished_Blackstone'):
      return url
        .replace('/2/2d', '/5/53')
        .replace('Polished_Blackstone', 'Polished_Blackstone_JE1_BE1');

    case url.includes('/Polished_Blackstone_Bricks'):
      return url
        .replace('/5/59', '/8/89')
        .replace(
          'Polished_Blackstone_Bricks',
          'Polished_Blackstone_Bricks_JE2_BE2',
        );

    case url.includes('/Cracked_Polished_Blackstone_Bricks'):
      return url
        .replace('/2/29', '/8/8b')
        .replace(
          'Cracked_Polished_Blackstone_Bricks',
          'Cracked_Polished_Blackstone_Bricks_JE2_BE2',
        );

    case url.includes('/Polished_Blackstone_Brick_Slab'):
      return url
        .replace('/1/1c', '/f/fe')
        .replace(
          'Polished_Blackstone_Brick_Slab',
          'Polished_Blackstone_Brick_Slab_JE1_BE1',
        );

    case url.includes('/Polished_Blackstone_Brick_Stairs'):
      return url
        .replace('/b/bc', '/0/0n')
        .replace(
          'Polished_Blackstone_Brick_Stairs',
          encodeURIComponent('Polished_Blackstone_Brick_Stairs_(N)_JE1_BE1'),
        );

    case url.includes('/Polished_Blackstone_Brick_Wall'):
      return url
        .replace('/f/fd', '/0/03')
        .replace(
          'Polished_Blackstone_Brick_Wall',
          'Polished_Blackstone_Brick_Wall_JE1_BE1',
        );

    case url.includes('/Gilded_Blackstone'):
      return url
        .replace('/7/73', '/0/05')
        .replace('Gilded_Blackstone', 'Gilded_Blackstone_JE2_BE2');

    case url.includes('/Polished_Blackstone_Stairs'):
      return url
        .replace('/1/15', '/0/08')
        .replace(
          'Polished_Blackstone_Stairs',
          encodeURIComponent('Polished_Blackstone_Stairs_(N)_JE1_BE1'),
        );

    case url.includes('/Polished_Blackstone_Slab'):
      return url
        .replace('/7/79', '/8/8d')
        .replace(
          'Polished_Blackstone_Slab',
          'Polished_Blackstone_Slab_JE1_BE1',
        );

    case url.includes('/Polished_Blackstone_Pressure_Plate'):
      return url
        .replace('/d/d6', '/6/64')
        .replace(
          'Polished_Blackstone_Pressure_Plate',
          'Polished_Blackstone_Pressure_Plate_JE1_BE1',
        );

    case url.includes('/Polished_Blackstone_Button'):
      return url
        .replace('/4/40', '/3/3c')
        .replace(
          'Polished_Blackstone_Button',
          'Polished_Blackstone_Button_JE1',
        );

    case url.includes('/Polished_Blackstone_Wall'):
      return url
        .replace('/a/a5', '/6/68')
        .replace(
          'Polished_Blackstone_Wall',
          'Polished_Blackstone_Wall_JE1_BE1',
        );

    case url.includes('/Chiseled_Nether_Bricks'):
      return url
        .replace('/d/d6', '/3/32')
        .replace('Chiseled_Nether_Bricks', 'Chiseled_Nether_Bricks_JE2_BE2');

    case url.includes('/Cracked_Nether_Bricks'):
      return url
        .replace('/d/de', '/5/55')
        .replace('Cracked_Nether_Bricks', 'Cracked_Nether_Bricks_JE2_BE2');

    case url.includes('/Quartz_Bricks'):
      return url
        .replace('/c/c8', '/9/90')
        .replace('Quartz_Bricks', 'Quartz_Bricks_JE2');

    case url.includes('/Candle'):
      return url.replace('/3/30', '/7/76').replace('Candle', 'Candle_JE1_BE1');

    case url.includes('/Cake_with_Candle'):
      return url
        .replace('/1/13', '/1/1b')
        .replace('Cake_with_Candle', 'Cake_with_Candle_JE1');

    case url.includes('/Cake_with_White_Candle'):
      return url
        .replace('/e/ec', '/4/48')
        .replace('Cake_with_White_Candle', 'Cake_with_White_Candle_JE1');

    case url.includes('/Cake_with_Orange_Candle'):
      return url
        .replace('/f/f4', '/2/28')
        .replace('Cake_with_Orange_Candle', 'Cake_with_Orange_Candle_JE1');

    case url.includes('/Cake_with_Magenta_Candle'):
      return url
        .replace('/2/23', '/f/fc')
        .replace('Cake_with_Magenta_Candle', 'Cake_with_Magenta_Candle_JE1');

    case url.includes('/Cake_with_Light_Blue_Candle'):
      return url
        .replace('/4/43', '/2/21')
        .replace(
          'Cake_with_Light_Blue_Candle',
          'Cake_with_Light_Blue_Candle_JE1',
        );

    case url.includes('/Cake_with_Yellow_Candle'):
      return url
        .replace('/7/71', '/7/7c')
        .replace('Cake_with_Yellow_Candle', 'Cake_with_Yellow_Candle_JE1');

    case url.includes('/Cake_with_Lime_Candle'):
      return url
        .replace('/a/af', '/1/14')
        .replace('Cake_with_Lime_Candle', 'Cake_with_Lime_Candle_JE1');

    case url.includes('/Cake_with_Pink_Candle'):
      return url
        .replace('/4/43', '/d/dc')
        .replace('Cake_with_Pink_Candle', 'Cake_with_Pink_Candle_JE1');

    case url.includes('/Cake_with_Gray_Candle'):
      return url
        .replace('/7/7e', '/f/f2')
        .replace('Cake_with_Gray_Candle', 'Cake_with_Gray_Candle_JE1');

    case url.includes('/Cake_with_Light_Gray_Candle'):
      return url
        .replace('/b/bb', '/8/8a')
        .replace(
          'Cake_with_Light_Gray_Candle',
          'Cake_with_Light_Gray_Candle_JE1',
        );

    case url.includes('/Cake_with_Cyan_Candle'):
      return url
        .replace('/6/6f', '/2/2e')
        .replace('Cake_with_Cyan_Candle', 'Cake_with_Cyan_Candle_JE1');

    case url.includes('/Cake_with_Purple_Candle'):
      return url
        .replace('4/43', '/e/e9')
        .replace('Cake_with_Purple_Candle', 'Cake_with_Purple_Candle_JE1');

    case url.includes('/Cake_with_Blue_Candle'):
      return url
        .replace('/0/07', '/a/a8')
        .replace('Cake_with_Blue_Candle', 'Cake_with_Blue_Candle_JE1');

    case url.includes('/Cake_with_Brown_Candle'):
      return url
        .replace('/e/e5', '/b/be')
        .replace('Cake_with_Brown_Candle', 'Cake_with_Brown_Candle_JE1');

    case url.includes('/Cake_with_Green_Candle'):
      return url
        .replace('/9/96', '/0/08')
        .replace('Cake_with_Green_Candle', 'Cake_with_Green_Candle_JE1');

    case url.includes('/Cake_with_Red_Candle'):
      return url
        .replace('/6/69', '/f/fa')
        .replace('Cake_with_Red_Candle', 'Cake_with_Red_Candle_JE1');

    case url.includes('/Cake_with_Black_Candle'):
      return url
        .replace('/d/db', '/8/82')
        .replace('Cake_with_Black_Candle', 'Cake_with_Black_Candle_JE1');

    case url.includes('/Block_of_Amethyst'):
      return url
        .replace('/0/00', '/e/e2')
        .replace('Block_of_Amethyst', 'Block_of_Amethyst_JE3_BE1');

    case url.includes('/Budding_Amethyst'):
      return url
        .replace('/c/cc', '/0/02')
        .replace('Budding_Amethyst', 'Budding_Amethyst_JE3_BE1');

    case url.includes('/Amethyst_Cluster'):
      return url
        .replace('/8/88', '/c/cb')
        .replace(
          'Amethyst_Cluster',
          encodeURIComponent('Amethyst_Cluster_(U)_JE1'),
        );

    case url.includes('/Large_Amethyst_Bud'):
      return url
        .replace('/d/d3', '/f/f4')
        .replace(
          'Large_Amethyst_Bud',
          encodeURIComponent('Large_Amethyst_Bud_(U)_JE1'),
        );

    case url.includes('/Medium_Amethyst_Bud'):
      return url
        .replace('/5/5f', '/f/f3')
        .replace(
          'Medium_Amethyst_Bud',
          encodeURIComponent('Medium_Amethyst_Bud_(U)_JE1'),
        );

    case url.includes('/Small_Amethyst_Bud'):
      return url
        .replace('/b/b0', '/c/c1')
        .replace(
          'Small_Amethyst_Bud',
          encodeURIComponent('Small_Amethyst_Bud_(U)_JE1'),
        );

    case url.includes('/Calcite'):
      return url
        .replace('/9/97', '/5/56')
        .replace('Calcite', 'Calcite_JE4_BE1');

    case url.includes('/Tinted_Glass'):
      return url
        .replace('/e/e0', '/4/43')
        .replace('Tinted_Glass', 'Tinted_Glass_JE2_BE1');

    case url.includes('/Powder_Snow'):
      return url
        .replace('/4/45', '/7/7c')
        .replace('Powder_Snow', 'Powder_Snow_JE1_BE1');

    case url.includes('/Sculk_Sensor'):
      return url
        .replace('/7/7c', '/6/6c')
        .replace('Sculk_Sensor', 'Sculk_Sensor_JE1')
        .replace('png', 'gif');

    case url.includes('/Sculk'):
      return url
        .replace('/a/af', '/6/67')
        .replace('Sculk', 'Sculk_JE1_BE1')
        .replace('png', 'gif');

    case url.includes('/Sculk_Vein'):
      return url
        .replace('/c/cb', '/0/0d')
        .replace('Sculk_Vein', 'Sculk_Vein_JE1_BE1')
        .replace('png', 'gif');

    case url.includes('/Sculk_Catalyst'):
      return url
        .replace('/9/95', '/6/64')
        .replace('Sculk_Catalyst', 'Sculk_Catalyst_JE1_BE1');

    case url.includes('/Sculk_Shrieker'):
      return url
        .replace('/c/c3', '/e/e0')
        .replace('Sculk_Shrieker', 'Sculk_Shrieker_JE2')
        .replace('png', 'gif');

    case url.includes('/Oxidized_Copper'):
      return url
        .replace('/4/45', '/6/6e')
        .replace('Oxidized_Copper', 'Oxidized_Copper_Block_JE1_BE1');

    case url.includes('/Weathered_Copper'):
      return url
        .replace('/5/51', '/d/d4')
        .replace('Weathered_Copper', 'Weathered_Copper_Block_JE1_BE1');

    case url.includes('/Exposed_Copper'):
      return url
        .replace('/4/43', '/7/7a')
        .replace('Exposed_Copper', 'Exposed_Copper_Block_JE1_BE1');

    case url.includes('/Block_of_Copper'):
      return url
        .replace('/f/f0', '/8/86')
        .replace('Block_of_Copper', 'Copper_Block_JE1_BE1');

    case url.includes('/Deepslate_Copper_Ore'):
      return url
        .replace('/a/ab', '/6/6f')
        .replace('Deepslate_Copper_Ore', 'Deepslate_Copper_Ore_JE2_BE2');

    case url.includes('/Oxidized_Cut_Copper'):
      return url
        .replace('/9/93', '/7/7e')
        .replace('Oxidized_Cut_Copper', 'Oxidized_Cut_Copper_JE1_BE1');

    case url.includes('/Weathered_Cut_Copper'):
      return url
        .replace('/b/b6', '/e/e5')
        .replace('Weathered_Cut_Copper', 'Weathered_Cut_Copper_JE1_BE1');

    case url.includes('/Exposed_Cut_Copper'):
      return url
        .replace('/a/aa', '/8/81')
        .replace('Exposed_Cut_Copper', 'Exposed_Cut_Copper_JE1_BE1');

    case url.includes('/Cut_Copper'):
      return url
        .replace('/a/a1', '/7/71')
        .replace('Cut_Copper', 'Cut_Copper_JE2_BE1');

    case url.includes('/Oxidized_Cut_Copper_Stairs'):
      return url
        .replace('/7/70', '/e/ea')
        .replace(
          'Oxidized_Cut_Copper_Stairs',
          encodeURIComponent('Oxidized_Cut_Copper_Stairs_(N)_JE1_BE1'),
        );

    case url.includes('/Weathered_Cut_Copper_Stairs'):
      return url
        .replace('/e/e3', '/b/bd')
        .replace(
          'Weathered_Cut_Copper_Stairs',
          encodeURIComponent('Weathered_Cut_Copper_Stairs_(N)_JE1_BE1'),
        );

    case url.includes('/Exposed_Cut_Copper_Stairs'):
      return url
        .replace('/c/cf', '/4/44')
        .replace(
          'Exposed_Cut_Copper_Stairs',
          encodeURIComponent('Exposed_Cut_Copper_Stairs_(N)_JE1_BE1'),
        );

    case url.includes('/Cut_Copper_Stairs'):
      return url
        .replace('/4/48', '/6/65')
        .replace(
          'Cut_Copper_Stairs',
          encodeURIComponent('Cut_Copper_Stairs_(N)_JE2_BE1'),
        );

    case url.includes('/Oxidized_Cut_Copper_Slab'):
      return url
        .replace('/c/c2', '/d/d6')
        .replace(
          'Oxidized_Cut_Copper_Slab',
          'Oxidized_Cut_Copper_Slab_JE1_BE1',
        );

    case url.includes('/Weathered_Cut_Copper_Slab'):
      return url
        .replace('/b/be', '/0/0e')
        .replace(
          'Weathered_Cut_Copper_Slab',
          'Weathered_Cut_Copper_Slab_JE1_BE1',
        );

    case url.includes('/Exposed_Cut_Copper_Slab'):
      return url
        .replace('/1/16', '/1/10')
        .replace('Exposed_Cut_Copper_Slab', 'Exposed_Cut_Copper_Slab_JE1_BE1');

    case url.includes('/Cut_Copper_Slab'):
      return url
        .replace('/f/f3', '/5/59')
        .replace('Cut_Copper_Slab', 'Cut_Copper_Slab_JE2_BE1');

    case url.includes('/Waxed_Block_of_Copper'):
      return url
        .replace('/d/dd', '/8/86')
        .replace('Waxed_Block_of_Copper', 'Copper_Block_JE1_BE1');

    case url.includes('/Waxed_Weathered_Copper'):
      return url
        .replace('/d/de', '/8/81')
        .replace('Waxed_Weathered_Copper', 'Weathered_Copper_Block_JE1_BE1');

    case url.includes('/Waxed_Exposed_Copper'):
      return url
        .replace('/8/82', '/7/74')
        .replace('Waxed_Exposed_Copper', 'Exposed_Copper_Block_JE1_BE1');

    case url.includes('/Waxed_Oxidized_Copper'):
      return url
        .replace('/5/51', '/6/6e')
        .replace('Waxed_Oxidized_Copper', 'Oxidized_Copper_Block_JE1_BE1');

    case url.includes('/Waxed_Oxidized_Cut_Copper'):
      return url
        .replace('/c/c8', '/7/7e')
        .replace('Waxed_Oxidized_Cut_Copper', 'Oxidized_Cut_Copper_JE1_BE1');

    case url.includes('/Waxed_Weathered_Cut_Copper'):
      return url
        .replace('/d/d4', '/e/e5')
        .replace('Waxed_Weathered_Cut_Copper', 'Weathered_Cut_Copper_JE1_BE1');

    case url.includes('/Waxed_Exposed_Cut_Copper'):
      return url
        .replace('/d/d3', '/8/81')
        .replace('Waxed_Exposed_Cut_Copper', 'Exposed_Cut_Copper_JE1_BE1');

    case url.includes('/Waxed_Cut_Copper'):
      return url
        .replace('/5/50', '/7/71')
        .replace('Waxed_Cut_Copper', 'Cut_Copper_JE2_BE1');

    case url.includes('/Waxed_Oxidized_Cut_Copper_Stairs'):
      return url
        .replace('/4/4f', '/e/ea')
        .replace(
          'Waxed_Oxidized_Cut_Copper_Stairs',
          encodeURIComponent('Oxidized_Cut_Copper_Stairs_(N)_JE1_BE1'),
        );

    case url.includes('/Waxed_Weathered_Cut_Copper_Stairs'):
      return url
        .replace('/f/f9', '/b/bd')
        .replace(
          'Waxed_Weathered_Cut_Copper_Stairs',
          encodeURIComponent('Weathered_Cut_Copper_Stairs_(N)_JE1_BE1'),
        );

    case url.includes('/Waxed_Exposed_Cut_Copper_Stairs'):
      return url
        .replace('/3/3d', '/4/44')
        .replace(
          'Waxed_Exposed_Cut_Copper_Stairs',
          encodeURIComponent('Exposed_Cut_Copper_Stairs_(N)_JE1_BE1'),
        );

    case url.includes('/Waxed_Cut_Copper_Stairs'):
      return url
        .replace('/0/04', '/6/65')
        .replace(
          'Waxed_Cut_Copper_Stairs',
          encodeURIComponent('Cut_Copper_Stairs_(N)_JE2_BE1'),
        );

    case url.includes('/Waxed_Oxidized_Cut_Copper_Slab'):
      return url
        .replace('/2/2a', '/d/d6')
        .replace(
          'Waxed_Oxidized_Cut_Copper_Slab',
          'Oxidized_Cut_Copper_Slab_JE1_BE1',
        );

    case url.includes('/Waxed_Weathered_Cut_Copper_Slab'):
      return url
        .replace('/2/2c', '/0/0e')
        .replace(
          'Waxed_Weathered_Cut_Copper_Slab',
          'Weathered_Cut_Copper_Slab_JE1_BE1',
        );

    case url.includes('/Waxed_Exposed_Cut_Copper_Slab'):
      return url
        .replace('/5/54', '/1/10')
        .replace(
          'Waxed_Exposed_Cut_Copper_Slab',
          'Exposed_Cut_Copper_Slab_JE1_BE1',
        );

    case url.includes('/Waxed_Cut_Copper_Slab'):
      return url
        .replace('/1/13', '/5/59')
        .replace('Waxed_Cut_Copper_Slab', 'Cut_Copper_Slab_JE2_BE1');

    case url.includes('/Lightning_Rod'):
      return url
        .replace('/6/62', '/6/6f')
        .replace('Lightning_Rod', encodeURIComponent('Lightning_Rod_(U)_JE3'));

    case url.includes('/Pointed_Dripstone'):
      return url
        .replace('/b/b2', '/8/80')
        .replace(
          'Pointed_Dripstone',
          encodeURIComponent('Pointed_Dripstone_Base_(D)_JE1_BE1'),
        );

    case url.includes('/Dripstone_Block'):
      return url
        .replace('/c/c8', '/3/32')
        .replace('Dripstone_Block', 'Dripstone_Block_JE1_BE1');

    case url.includes('/Cave_Vines'):
      return url
        .replace('/a/aa', '/3/3c')
        .replace('Cave_Vines', encodeURIComponent('Cave_Vines_(head)_JE1_BE1'));

    case url.includes('/Cave_Vines_Plant'):
      return url
        .replace('/e/e8', '/7/78')
        .replace('Cave_Vines_Plant', 'Cave_Vines_Plant_JE1_BE1');

    case url.includes('/Spore_Blossom'):
      return url
        .replace('/4/48', '/e/e1')
        .replace('Spore_Blossom', 'Spore_Blossom_JE1');

    case url.includes('/Azalea'):
      return url.replace('/b/bb', '/5/5e').replace('Azalea', 'Azalea_JE2_BE2');

    case url.includes('/Flowering_Azalea'):
      return url
        .replace('/5/55', '/4/4a')
        .replace('Flowering_Azalea', 'Flowering_Azalea_JE2_BE2');

    case url.includes('/Moss_Block'):
      return url
        .replace('/0/02', '/c/c0')
        .replace('Moss_Block', 'Moss_Block_JE1_BE1');

    case url.includes('/Big_Dripleaf'):
      return url
        .replace('/0/07', '/4/4d')
        .replace('Big_Dripleaf', 'Big_Dripleaf_JE2_BE1');

    case url.includes('/Big_Dripleaf_Stem'):
      return url
        .replace('/8/88', '/4/4d')
        .replace('Big_Dripleaf_Stem', 'Big_Dripleaf_JE2_BE1');

    case url.includes('/Small_Dripleaf'):
      return url
        .replace('/5/50', '/2/28')
        .replace('Small_Dripleaf', 'Small_Dripleaf_JE3');

    case url.includes('/Hanging_Roots'):
      return url
        .replace('/e/e5', '/8/82')
        .replace('Hanging_Roots', 'Hanging_Roots_JE2_BE1');

    case url.includes('/Rooted_Dirt'):
      return url
        .replace('/d/d8', '/d/dd')
        .replace('Rooted_Dirt', 'Rooted_Dirt_JE1_BE1');

    case url.includes('/Mud'):
      return url.replace('/3/39', '/b/b8').replace('Mud', 'Mud_JE1_BE1');

    case url.includes('/Cobbled_Deepslate_Stairs'):
      return url
        .replace('/6/60', '/7/79')
        .replace('Cobbled_Deepslate_Stairs', 'Cobbled_Deepslate_Stairs_JE3');

    case url.includes('/Cobbled_Deepslate_Slab'):
      return url
        .replace('/e/e1', '/4/4b')
        .replace('Cobbled_Deepslate_Slab', 'Cobbled_Deepslate_Slab_JE3');

    case url.includes('/Cobbled_Deepslate_Wall'):
      return url
        .replace('/6/68', '/8/88')
        .replace('Cobbled_Deepslate_Wall', 'Cobbled_Deepslate_Wall_JE2');

    case url.includes('/Polished_Deepslate'):
      return url
        .replace('/b/bd', '/f/f7')
        .replace('Polished_Deepslate', 'Polished_Deepslate_JE2_BE1');

    case url.includes('/Polished_Deepslate_Stairs'):
      return url
        .replace('/d/dd', '/9/9c')
        .replace('Polished_Deepslate_Stairs', 'Polished_Deepslate_Stairs_JE2');

    case url.includes('/Polished_Deepslate_Slab'):
      return url
        .replace('/5/5e', '/3/32')
        .replace('Polished_Deepslate_Slab', 'Polished_Deepslate_Slab_JE2');

    case url.includes('/Polished_Deepslate_Wall'):
      return url
        .replace('/1/19', '/5/5c')
        .replace('Polished_Deepslate_Wall', 'Polished_Deepslate_Wall_JE2');

    case url.includes('/Deepslate_Tiles'):
      return url
        .replace('/f/fb', '/e/eb')
        .replace('Deepslate_Tiles', 'Deepslate_Tiles_JE2_BE1');

    case url.includes('/Deepslate_Tile_Stairs'):
      return url
        .replace('/0/0f', '/f/f1')
        .replace('Deepslate_Tile_Stairs', 'Deepslate_Tile_Stairs_JE2');

    case url.includes('/Deepslate_Tile_Slab'):
      return url
        .replace('/c/c3', '/4/44')
        .replace('Deepslate_Tile_Slab', 'Deepslate_Tile_Slab_JE2');

    case url.includes('/Deepslate_Tile_Wall'):
      return url
        .replace('/9/9a', '/b/ba')
        .replace('Deepslate_Tile_Wall', 'Deepslate_Tile_Wall_JE2');

    case url.includes('/Deepslate_Bricks'):
      return url
        .replace('/b/b3', '/3/3a')
        .replace('Deepslate_Bricks', 'Deepslate_Bricks_JE2_BE1');

    case url.includes('/Deepslate_Brick_Stairs'):
      return url
        .replace('/3/3e', '/f/f1')
        .replace('Deepslate_Brick_Stairs', 'Deepslate_Brick_Stairs_JE2');

    case url.includes('/Deepslate_Brick_Slab'):
      return url
        .replace('/3/38', '/2/23')
        .replace('Deepslate_Brick_Slab', 'Deepslate_Brick_Slab_JE2');

    case url.includes('/Deepslate_Brick_Wall'):
      return url
        .replace('/5/5f', '/2/2e')
        .replace('Deepslate_Brick_Wall', 'Deepslate_Brick_Wall_JE2');

    case url.includes('/Chiseled_Deepslate'):
      return url
        .replace('/6/63', '/3/36')
        .replace('Chiseled_Deepslate', 'Chiseled_Deepslate_JE2_BE1');

    case url.includes('/Cracked_Deepslate_Tiles'):
      return url
        .replace('/b/b3', '/f/f7')
        .replace('Cracked_Deepslate_Tiles', 'Cracked_Deepslate_Tiles_JE1_BE1');

    case url.includes('/Infested_Deepslate'):
      return url
        .replace('/e/ed', '/3/39')
        .replace('Infested_Deepslate', 'Deepslate');

    case url.includes('/Smooth_Basalt'):
      return url
        .replace('/8/8e', '/b/b5')
        .replace('Smooth_Basalt', 'Smooth_Basalt_JE1_BE1');

    case url.includes('/Block_of_Raw_Iron'):
      return url
        .replace('/d/da', '/7/74')
        .replace('Block_of_Raw_Iron', 'Block_of_Raw_Iron_JE3_BE2');

    case url.includes('/Block_of_Raw_Copper'):
      return url
        .replace('/e/e5', '/9/94')
        .replace('Block_of_Raw_Copper', 'Block_of_Raw_Copper_JE2_BE2');

    case url.includes('/Block_of_Raw_Gold'):
      return url
        .replace('/b/b2', '/a/a7')
        .replace('Block_of_Raw_Gold', 'Block_of_Raw_Gold_JE3_BE2');

    case url.includes('/Potted_Azalea'):
      return url
        .replace('/c/c5', '/7/71')
        .replace('Potted_Azalea', 'Potted_Azalea_JE1_BE1');

    case url.includes('/Potted_Flowering_Azalea'):
      return url
        .replace('/6/6b', '/f/f9')
        .replace('Potted_Flowering_Azalea', 'Potted_Flowering_Azalea_JE1_BE1');

    case url.includes('/Ochre_Froglight'):
      return url
        .replace('/4/46', '/9/91')
        .replace('Ochre_Froglight', 'Ochre_Froglight_JE1');

    case url.includes('/Verdant_Froglight'):
      return url
        .replace('/c/c2', '/f/fd')
        .replace('Verdant_Froglight', 'Verdant_Froglight_JE1');

    case url.includes('/Pearlescent_Froglight'):
      return url
        .replace('/c/c2', '/4/42')
        .replace('Pearlescent_Froglight', 'Pearlescent_Froglight_JE1');

    case url.includes('/Frogspawn'):
      return url
        .replace('/c/c2', '/5/5e')
        .replace('Frogspawn', 'Frogspawn_JE1_BE2');

    case url.includes('/Reinforced_Deepslate'):
      return url
        .replace('/c/c2', '/a/a6')
        .replace('Reinforced_Deepslate', 'Reinforced_Deepslate_JE1');

    default:
      return url;
  }
};
