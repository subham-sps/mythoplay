import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { gitaAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

interface Shloka {
  id: number;
  week_number: number;
  reference: string;
  chapter: number;
  verse: number;
  sanskrit: string;
  transliteration_english: string;
  meaning: string;
}

const AGE_GROUPS = [
  { value: '5-7', label: 'Little Stars (5–7)', emoji: '⭐' },
  { value: '8-10', label: 'Rising Champs (8–10)', emoji: '🌟' },
  { value: '11-14', label: 'Quiz Masters (11–14)', emoji: '💫' },
];

const INSIGHT_CACHE_PREFIX = 'gita-insight-v1-';

function getCachedInsight(shlokaId: number, ageGroup: string): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(`${INSIGHT_CACHE_PREFIX}${shlokaId}-${ageGroup}`);
}

function setCachedInsight(shlokaId: number, ageGroup: string, insight: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${INSIGHT_CACHE_PREFIX}${shlokaId}-${ageGroup}`, insight);
}

export default function GitaWeekly() {
  const { user } = useAuthStore();

  const [shloka, setShloka] = useState<Shloka | null>(null);
  const [weekNumber, setWeekNumber] = useState<number>(1);
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [loadingShloka, setLoadingShloka] = useState(true);

  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('');
  const [insight, setInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(false);

  const fetchShloka = useCallback((week?: number) => {
    setLoadingShloka(true);
    setInsight('');
    gitaAPI
      .getWeeklyShloka(week)
      .then((res) => {
        setShloka(res.data.shloka);
        setWeekNumber(res.data.weekNumber);
        setCurrentWeek(res.data.currentWeek);
      })
      .catch(() => toast.error('Could not load shloka'))
      .finally(() => setLoadingShloka(false));
  }, []);

  useEffect(() => {
    fetchShloka();
  }, [fetchShloka]);

  // Pre-fill age group from user profile
  useEffect(() => {
    if (user?.ageGroup) setSelectedAgeGroup(user.ageGroup);
  }, [user]);

  // Restore cached insight when shloka or age group changes
  useEffect(() => {
    if (!shloka || !selectedAgeGroup) return;
    const cached = getCachedInsight(shloka.id, selectedAgeGroup);
    if (cached) setInsight(cached);
    else setInsight('');
  }, [shloka, selectedAgeGroup]);

  const handleGetInsight = async () => {
    if (!shloka || !selectedAgeGroup) {
      toast.error('Please select your age group first');
      return;
    }
    const cached = getCachedInsight(shloka.id, selectedAgeGroup);
    if (cached) {
      setInsight(cached);
      return;
    }
    setLoadingInsight(true);
    try {
      const res = await gitaAPI.getInsight(shloka.id, selectedAgeGroup);
      const text: string = res.data.insight;
      setInsight(text);
      setCachedInsight(shloka.id, selectedAgeGroup, text);
    } catch {
      toast.error('Could not generate wisdom. Try again shortly.');
    } finally {
      setLoadingInsight(false);
    }
  };

  const goWeek = (delta: number) => {
    const next = Math.max(1, Math.min(52, weekNumber + delta));
    if (next !== weekNumber) fetchShloka(next);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Bhagavad Gita Sloka of the Week — Natkhat Gannu"
        description="Learn one Bhagavad Gita shloka every week with age-appropriate explanations powered by AI. For kids aged 5–14."
        path="/gita-weekly"
      />
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 pointer-events-none" aria-hidden="true" />
          <div className="relative container-app px-4 pt-14 pb-10 text-center">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="eyebrow mb-4">🕉️ Weekly Wisdom</span>
              <h1 className="heading-fun mt-4 mb-3">
                Bhagavad Gita Sloka of the Week
              </h1>
              <p className="text-gray-600 max-w-xl mx-auto text-lg">
                One verse from Lord Krishna&apos;s timeless wisdom — with AI-powered explanations for every age.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main content */}
        <section className="section-tight">
          <div className="container-app max-w-3xl">

            {/* Week navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => goWeek(-1)}
                disabled={weekNumber <= 1 || loadingShloka}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold text-sm shadow-soft disabled:opacity-40 hover:bg-primary-50 hover:border-primary-200 transition-all"
                aria-label="Previous week"
              >
                <FaChevronLeft aria-hidden="true" /> Previous
              </button>

              <div className="text-center">
                <span className="font-display text-primary-600 text-lg">Week {weekNumber}</span>
                {weekNumber === currentWeek && (
                  <span className="ml-2 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-semibold">This week</span>
                )}
              </div>

              <button
                onClick={() => goWeek(1)}
                disabled={weekNumber >= currentWeek || loadingShloka}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold text-sm shadow-soft disabled:opacity-40 hover:bg-primary-50 hover:border-primary-200 transition-all"
                aria-label="Next week"
              >
                Next <FaChevronRight aria-hidden="true" />
              </button>
            </div>

            {/* Shloka card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={weekNumber}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                {loadingShloka ? (
                  <div className="rounded-[2rem] bg-white shadow-card p-8 space-y-5 animate-pulse">
                    <div className="h-5 bg-gray-100 rounded-full w-1/3" />
                    <div className="h-16 bg-gray-100 rounded-xl" />
                    <div className="h-4 bg-gray-100 rounded-full w-4/5" />
                    <div className="h-4 bg-gray-100 rounded-full w-3/5" />
                    <div className="h-4 bg-gray-100 rounded-full w-full" />
                  </div>
                ) : shloka ? (
                  <div className="rounded-[2rem] bg-white shadow-card overflow-hidden">
                    {/* Orange accent bar */}
                    <div className="h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-400" />

                    <div className="p-7 md:p-10">
                      {/* Reference badge */}
                      <div className="flex items-center gap-3 mb-6">
                        <span className="text-3xl" aria-hidden="true">🪷</span>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
                            {shloka.reference}
                          </p>
                          <p className="text-sm text-gray-500">Chapter {shloka.chapter}, Verse {shloka.verse}</p>
                        </div>
                      </div>

                      {/* Sanskrit */}
                      <div className="mb-5">
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Sanskrit</p>
                        <p
                          lang="sa"
                          className="text-2xl md:text-3xl leading-relaxed text-gray-800 font-display"
                          style={{ fontFamily: 'serif' }}
                        >
                          {shloka.sanskrit}
                        </p>
                      </div>

                      {/* Transliteration */}
                      <div className="mb-5 p-4 rounded-2xl bg-amber-50 border border-amber-100">
                        <p className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">Transliteration</p>
                        <p className="text-gray-700 italic leading-relaxed">
                          {shloka.transliteration_english}
                        </p>
                      </div>

                      {/* Meaning */}
                      <div className="mb-8 p-4 rounded-2xl bg-orange-50 border border-orange-100">
                        <p className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-1">Meaning</p>
                        <p className="text-gray-800 leading-relaxed">{shloka.meaning}</p>
                      </div>

                      {/* AI Insight section */}
                      <div className="border-t border-gray-100 pt-7">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-xl" aria-hidden="true">🤖</span>
                          <h2 className="font-display text-lg text-gray-800">
                            Krishna&apos;s Wisdom — Just For You
                          </h2>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">
                          Select your age group to get a personalised explanation:
                        </p>

                        {/* Age group selector */}
                        <div className="flex flex-wrap gap-2 mb-5">
                          {AGE_GROUPS.map((ag) => (
                            <button
                              key={ag.value}
                              onClick={() => setSelectedAgeGroup(ag.value)}
                              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all
                                ${selectedAgeGroup === ag.value
                                  ? 'bg-primary-600 text-white border-primary-600 shadow-soft'
                                  : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300'}`}
                            >
                              <span aria-hidden="true">{ag.emoji}</span> {ag.label}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={handleGetInsight}
                          disabled={!selectedAgeGroup || loadingInsight}
                          className="btn-primary disabled:opacity-50 flex items-center gap-2"
                        >
                          {loadingInsight ? (
                            <>
                              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Generating wisdom…
                            </>
                          ) : (
                            <>
                              <FaStar aria-hidden="true" /> Get Krishna&apos;s Wisdom
                            </>
                          )}
                        </button>

                        {/* Insight result */}
                        <AnimatePresence>
                          {insight && (
                            <motion.div
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className="mt-5 p-5 rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-100"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl" aria-hidden="true">🌸</span>
                                <p className="font-bold text-primary-700 text-sm">Krishna says:</p>
                              </div>
                              <p className="text-gray-800 leading-relaxed">{insight}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    Could not load this week&apos;s shloka. Please try again.
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
