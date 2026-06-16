import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowRight, FaGamepad } from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO, { SITE_URL, SITE_NAME } from '@/components/SEO';
import { GAMES } from '@/lib/games';

export default function GamesIndex() {
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
        description="Play kid-safe learning games on Natkhat Gannu — spell words in Word Wonders Jr and match sparkling gems in Gem Fever. Free, fun, and parent-approved."
        path="/games"
        keywords={[
          'kids games',
          'word game for kids',
          'match 3 game for kids',
          'educational games',
          'Natkhat Gannu games',
        ]}
        jsonLd={collectionLd}
      />
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-hero pointer-events-none" aria-hidden="true" />
        <div className="relative container-app px-4 pt-12 pb-10 md:pt-16 md:pb-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="eyebrow mb-4">🎮 Play & Learn</span>
            <h1 className="heading-fun mt-4 mb-4">Games</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Take a break and play! Kid-safe games that sneak in a little learning while you have fun.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Game cards */}
      <section className="section-tight">
        <div className="container-app">
          <div className="grid sm:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {GAMES.map((game, index) => (
              <motion.div
                key={game.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={`/games/${game.slug}`}
                  className="group block h-full card-fun hover:-translate-y-1 text-left"
                >
                  <div
                    className={`mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br ${game.tint}
                      flex items-center justify-center text-3xl shadow-soft group-hover:scale-110 transition-transform`}
                    aria-hidden="true"
                  >
                    {game.emoji}
                  </div>
                  <div className="flex items-center gap-2 mb-1">
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
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
