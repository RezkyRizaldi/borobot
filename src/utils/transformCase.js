const { capitalCase } = require('change-case');

/**
 *
 * @param {String} str
 * @returns {String} The human-friendly format string case.
 */
module.exports = (str) => {
  if (str !== null) {
    switch (true) {
      case str === 'asmr' ||
        str === 'doom' ||
        str === 'valorant' ||
        str === 'pubg':
        return str.toUpperCase();

      case str === 'dbd':
        return 'Dead by Daylight';

      case str === 'apex':
        return 'APEX Legends';

      case str === 'fnaf':
        return "Five Nights at Freddy's";

      case str === 'residentevil':
        return 'Resident Evil';

      case str === 'membersonly':
        return 'Membership Only';

      case str === 'Mario_Kart':
        return 'Mario Kart 8 Deluxe';

      case str === 'gta5':
        return 'GTA V';

      case str === 'monhun':
        return 'Monster Hunter';

      case str === 'portal':
        return 'Portal 2';

      case str === 'touhou':
        return 'Touhou Project';

      case str === 'umamusume':
        return 'Umamusume: Pretty Derby';

      case str === 'tarkov':
        return 'Escape from Tarkov';

      case str === 'the_cycle_frontier':
        return 'The Cycle: Frontier';

      case str === 'princess_connect':
        return 'Princess Connect! Re:Dive';

      case str === 'it takes two':
        return 'It Takes Two';

      case str === 'sekiro':
        return 'Sekiro: Shadows Die Twice';

      case str === 'smash':
        return 'Super Smash Bros.';

      case str === 'idolmaster':
        return 'The Idolmaster';

      case str === 'DOTA':
        return 'Dota 2';

      case str === 'Splatoon':
        return 'Splatoon 3';

      case str === 'nier':
        return 'NieR:Automata';

      case str === 'gungeon':
        return 'Enter the Gungeon';

      case str === 'genshin':
        return 'Genshin Impact';

      case str === 'Anniversary':
        return 'Anniversary Stream';

      case str === 'announce':
        return 'Announcement Stream';

      case str === 'clubhouse51':
        return 'Clubhouse Games: 51 Worldwide Classics';

      case str === 'Final_fantasy':
        return 'Final Fantasy';

      case str === 'Duel_Masters':
        return 'Duel Masters Trading Card Game';

      case str === 'fallguys':
        return 'Fall Guys: Ultimate Knockout';

      case str === 'xenoblade':
        return 'Xenoblade Chronicles 3';

      case str === 'zelda':
        return 'The Legend of Zelda';

      case str === 'morning':
        return 'Morning Stream';

      case str === 'ark':
        return 'ARK: Survival Evolved';

      case str === 'ringfit':
        return 'Ring Fit Adventure';

      case str.match(/[A-Z]/g) === null:
      case str.match(/[A-Z]/g) === null && /[a-z]/g.test(str):
        return capitalCase(str);

      case str.includes('_') && /[A-Z]/.test(str):
        return str.replace(/_/g, ' ');

      default:
        return str;
    }
  }
};
