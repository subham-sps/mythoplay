import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowRight, FaChevronRight } from 'react-icons/fa';
import { gitaAPI } from '@/lib/api';

interface Shloka {
  id: number;
  reference: string;
  sanskrit: string;
  transliteration_english: string;
  meaning: string;
}

export default function GitaWeeklySection() {
  const [shloka, setShloka] = useState<Shloka | null>(null);
  const [weekNumber, setWeekNumber] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gitaAPI
      .getWeeklyShloka()
      .then((res) => {
        setShloka(res.data.shloka);
        setWeekNumber(res.data.weekNumber);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section" aria-labelledby="gita-section-heading">
      <div className="container-app">
        <div className="text-center mb-10">
          <span className="eyebrow mb-4">🕉️ Weekly Wisdom</span>
          <h2 id="gita-section-heading" className="section-title mt-3">
            Bhagavad Gita Sloka of the Week
          </h2>
          <p className="text-gray-600 mt-2 max-w-xl mx-auto">
            One verse from Lord Krishna's timeless wisdom — learn it, reflect on it, live it.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2rem] shadow-card-hover max-w-3xl mx-auto"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-400" aria-hidden="true" />
          <div
            className="absolute inset-0 opacity-15 mix-blend-overlay"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
              backgroundSize: '20px 20px',
            }}
            aria-hidden="true"
          />
          <div className="absolute top-4 right-6 text-5xl opacity-20 select-none" aria-hidden="true">🪷</div>
          <div className="absolute bottom-4 left-6 text-4xl opacity-20 select-none" aria-hidden="true">☸️</div>

          <div className="relative p-8 md:p-10 text-white">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-5 bg-white/30 rounded-full w-1/3" />
                <div className="h-10 bg-white/30 rounded-xl w-full" />
                <div className="h-4 bg-white/20 rounded-full w-4/5" />
                <div className="h-4 bg-white/20 rounded-full w-3/5" />
              </div>
            ) : shloka ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur px-3 py-1 rounded-full border border-white/30">
                    Week {weekNumber}
                  </span>
                  <span className="text-sm font-semibold text-white/80">{shloka.reference}</span>
                </div>

                {/* Sanskrit */}
                <p
                  lang="sa"
                  className="font-display text-2xl md:text-3xl leading-relaxed text-white drop-shadow mb-4"
                  style={{ fontFamily: 'serif' }}
                >
                  {shloka.sanskrit}
                </p>

                {/* Transliteration */}
                <p className="text-white/80 text-sm italic mb-4 leading-relaxed">
                  {shloka.transliteration_english}
                </p>

                {/* Meaning */}
                <p className="text-white/95 text-base leading-relaxed border-t border-white/20 pt-4">
                  {shloka.meaning}
                </p>

                <div className="mt-6">
                  <Link
                    href="/gita-weekly"
                    className="inline-flex items-center gap-2 bg-white text-orange-700 font-bold px-6 py-3 rounded-2xl shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all"
                  >
                    Explore All Weeks <FaArrowRight aria-hidden="true" />
                  </Link>
                </div>
              </>
            ) : (
              <p className="text-white/80">Could not load this week&apos;s shloka.</p>
            )}
          </div>
        </motion.div>

        <div className="text-center mt-6">
          <Link
            href="/gita-weekly"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700"
          >
            See previous weeks <FaChevronRight className="text-xs" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
