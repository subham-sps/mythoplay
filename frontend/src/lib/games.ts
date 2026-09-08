// Catalog of playable games. Each game is a self-contained HTML file served
// from /public/games and embedded in an iframe by the games pages.
export interface Game {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  ageRange: string;
  emoji: string;
  tint: string; // tailwind gradient (from-... to-...)
  /** Path to the self-contained game HTML in /public. */
  file: string;
}

export const GAMES: Game[] = [
  {
    slug: 'word-wonders-jr',
    title: 'Word Wonders Jr',
    tagline: 'Swipe letters to spell words',
    description:
      'A cheerful word game in the style of Words of Wonders — swipe letters on a wheel to spell words that drop into an interlocking crossword. Endless kid-safe levels with definitions and bonus words.',
    ageRange: '4–7',
    emoji: '🦉',
    tint: 'from-amber-400 to-orange-500',
    file: '/play/word-wonders-jr.html',
  },
  {
    slug: 'gem-fever',
    title: 'Gem Fever',
    tagline: 'Match sparkling gems',
    description:
      'A colourful match-and-pop puzzle full of rubies, emeralds, and sapphires. Line up gems, trigger dazzling combos, and clear the board across endless levels.',
    ageRange: '5–14',
    emoji: '💎',
    tint: 'from-fuchsia-500 to-purple-600',
    file: '/play/gem-fever.html',
  },
  {
    slug: 'animal-match-safari',
    title: 'Animal Match Safari',
    tagline: 'Flip cards, find animal pairs',
    description:
      'A gentle memory game bursting with jungle friends. Flip two cards at a time, remember where each animal hides, and match every pair to win a round.',
    ageRange: '4–7',
    emoji: '🐵',
    tint: 'from-lime-400 to-emerald-500',
    file: '/play/animal-match-safari.html',
  },
  {
    slug: 'number-ninja',
    title: 'Number Ninja',
    tagline: 'Pop bubbles in counting order',
    description:
      'Bright number bubbles float across the screen — tap them in order from 1 to 10 to slice through each round. Great practice for counting and number recognition.',
    ageRange: '4–8',
    emoji: '🥷',
    tint: 'from-sky-400 to-blue-600',
    file: '/play/number-ninja.html',
  },
  {
    slug: 'shape-sorter-adventure',
    title: 'Shape Sorter Adventure',
    tagline: 'Drag shapes into their homes',
    description:
      'Circles, squares, stars, and hearts need to find their matching outline. Drag each colourful shape into its home to complete the picture and celebrate!',
    ageRange: '4–6',
    emoji: '🔺',
    tint: 'from-rose-400 to-pink-600',
    file: '/play/shape-sorter-adventure.html',
  },
];

export const getGame = (slug: string): Game | undefined =>
  GAMES.find((g) => g.slug === slug);
