import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaGamepad } from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO, { SITE_URL, SITE_NAME } from '@/components/SEO';
import { GAMES } from '@/lib/games';

const FILTERS = [
  { key: 'all', label: 'All ages' },
  { key: 'little', label: '4–7 yrs' },
  { key: 'big', label: '8+ yrs' },
];

function matchesFilter(ageRange: string, filter: string) {
  if (filter === 'all') return true;
  const nums = ageRange.match(/\d+/g)?.map(Number) ?? [];
  const min = nums[0] ?? 0;
  if (filter === 'little') return min <= 7;
  if (filter === 'big') return (nums[1] ?? min) >= 8;
  return true;
}

export default function GamesIndex() {
  const [filter, setFilter] = useState('all');

  const filteredGames = useMemo(
    () => GAMES.filter((g) => matchesFilter(g.ageRange, filter)),
    [filter]
  );

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Games',
    url: `${SITE_URL}/games`,
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
    hasPart: GAMES.map((g) => ({
      '@type': 'VideoGame',
      name: g.title,
      description: g.description,
      url: `${SITE_URL}/games/${g.slug}`,
      genre: 'Educational',
      applicationCategory: 'Game',
    })),
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Games — Fun Learning Games for Kids"
        description="Play kid-safe learning games on Natkhat Gannu — spell words, match animals, count with Number Ninja, sort shapes, and match sparkling gems. Free, fun, and parent-approved."
        path="/games"
        keywords={[
          'kids games',
          'word game for kids',
          'match 3 game for kids',
          'games for preschoolers',
          'educational games',
          'Natkhat Gannu games',
        ]}
        jsonLd={collectionLd}
      />
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-hero pointer-events-none" aria-hidden="true" />
        {/* Floating decorative emojis */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <span className="absolute top-6 left-[8%] text-4xl opacity-70 animate-float">🎈</span>
          <span className="absolute top-16 right-[10%] text-3xl opacity-70 animate-wiggle">🧩</span>
          <span className="absolute bottom-4 left-[18%] text-3xl opacity-60 animate-float" style={{ animationDelay: '0.6s' }}>⭐</span>
          <span className="absolute bottom-8 right-[20%] text-4xl opacity-60 animate-wiggle" style={{ animationDelay: '0.3s' }}>🎨</span>
          <span className="absolute top-1/2 left-[4%] text-2xl opacity-50 animate-float" style={{ animationDelay: '1s' }}>🦋</span>
        </div>
        <div className="relative container-app px-4 pt-12 pb-10 md:pt-16 md:pb-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="eyebrow mb-4">🎮 Play & Learn</span>
            <h1 className="heading-fun mt-4 mb-4">Games</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Take a break and play! Kid-safe games that sneak in a little learning while you have fun —
              perfect for little hands aged 4 to 14.
            </p>
          </motion.div>

          {/* Age filter chips */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="flex flex-wrap justify-center gap-3 mt-8"
          >
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={filter === f.key ? 'chip chip-active' : 'chip'}
              >
                {f.label}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Game cards */}
      <section className="section-tight">
        <div className="container-app">
          <AnimatePresence mode="popLayout">
            <motion.div
              layout
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {filteredGames.map((game, index) => (
                <motion.div
                  key={game.slug}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.06 }}
                >
                  <Link
                    href={`/games/${game.slug}`}
                    className="group block h-full card-fun hover:-translate-y-1 text-left"
                  >
                    <div
                      className={`mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br ${game.tint}
                        flex items-center justify-center text-3xl shadow-soft group-hover:scale-110 group-hover:rotate-6 transition-transform`}
                      aria-hidden="true"
                    >
                      {game.emoji}
                    </div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h2 className="font-display text-2xl text-gray-800">{game.title}</h2>
                      <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                        Ages {game.ageRange}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-primary-600 mb-2">{game.tagline}</p>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{game.description}</p>
                    <span className="btn-primary py-2 px-4 text-sm inline-flex">
                      <FaGamepad aria-hidden="true" /> Play now <FaArrowRight aria-hidden="true" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredGames.length === 0 && (
            <p className="text-center text-gray-500 mt-10">
              No games in this age range yet — check back soon! 🌈
            </p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
