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
];

export const getGame = (slug: string): Game | undefined =>
  GAMES.find((g) => g.slug === slug);
