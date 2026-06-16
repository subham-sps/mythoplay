import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store';
import { leaderboardAPI } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { LeaderboardRowSkeleton } from '@/components/Skeleton';
import SEO from '@/components/SEO';

export default function LeaderboardPage() {
  const { isAuthenticated, user } = useAuthStore();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [ageGroups, setAgeGroups] = useState<any[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('');
  const [currentUserRank, setCurrentUserRank] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadLeaderboard();
  }, [selectedPeriod, selectedCategory, selectedAgeGroup]);

  const loadCategories = async () => {
    try {
      const response = await leaderboardAPI.getCategories();
      setCategories(response.data.categories);
      setAgeGroups(response.data.ageGroups);
    } catch (error) {
      console.error('Failed to load categories');
    }
  };

  const loadLeaderboard = async () => {
    setIsLoading(true);
    try {
      const response = await leaderboardAPI.getLeaderboard({
        period: selectedPeriod,
        category: selectedCategory || undefined,
        ageGroup: selectedAgeGroup || undefined,
      });
      setLeaderboard(response.data.leaderboard);
      setCurrentUserRank(response.data.currentUserRank);
    } catch (error) {
      console.error('Failed to load leaderboard');
    } finally {
      setIsLoading(false);
    }
  };

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  // 2nd - 1st - 3rd visual order on podium
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);

  const podiumStyles: Record<number, { height: string; medal: string; ring: string; label: string }> = {
    1: { height: 'h-32 md:h-40', medal: '🥇', ring: 'ring-amber-400', label: 'podium-1' },
    2: { height: 'h-24 md:h-32', medal: '🥈', ring: 'ring-gray-400', label: 'podium-2' },
    3: { height: 'h-20 md:h-28', medal: '🥉', ring: 'ring-amber-600', label: 'podium-3' },
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Leaderboard — Top Mythology Quiz Champions"
        description="See the weekly, monthly, and all-time top quiz champions on Natkhat Gannu. Track scores across Ramayana, Mahabharata, Krishna Leela, and Ganesha stories by age group."
        path="/leaderboard"
      />
      <Navbar />

      <main className="container-app max-w-4xl px-4 py-10 md:py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="eyebrow mb-4">🏆 Hall of Fame</span>
          <h1 className="font-display text-4xl md:text-5xl text-gray-800 mt-3 mb-2">
            Leaderboard
          </h1>
          <p className="text-gray-600">See who the top quiz champions are!</p>
        </div>

        {/* Filters */}
        <div className="card-flat mb-10">
          <div className="grid md:grid-cols-3 gap-5">
            <div>
              <label className="form-label">Time Period</label>
              <div className="flex gap-2">
                {['weekly', 'monthly', 'all'].map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => setSelectedPeriod(period)}
                    className={`flex-1 py-2 px-3 rounded-xl font-semibold text-sm transition-all
                      ${
                        selectedPeriod === period
                          ? 'bg-primary-500 text-white shadow-fun'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {period === 'all' ? 'All Time' : period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="lb-cat" className="form-label">
                Category
              </label>
              <select
                id="lb-cat"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-fun"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.emoji} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="lb-age" className="form-label">
                Age Group
              </label>
              <select
                id="lb-age"
                value={selectedAgeGroup}
                onChange={(e) => setSelectedAgeGroup(e.target.value)}
                className="input-fun"
              >
                <option value="">All Ages</option>
                {ageGroups.map((group) => (
                  <option key={group.value} value={group.value}>
                    {group.emoji} {group.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Podium */}
        {!isLoading && top3.length > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-3 gap-3 md:gap-6 items-end max-w-2xl mx-auto">
              {podiumOrder.map((entry) => {
                if (!entry) return null;
                const rank = entry.rank as 1 | 2 | 3;
                const style = podiumStyles[rank];
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * (4 - rank) }}
                    className="text-center"
                  >
                    <div className="flex flex-col items-center">
                      <div className="text-3xl md:text-4xl mb-2" aria-hidden="true">
                        {style.medal}
                      </div>
                      <img
                        src={entry.avatar || '/default-avatar.png'}
                        alt={entry.name}
                        className={`w-16 h-16 md:w-20 md:h-20 rounded-full object-cover ring-4 ${style.ring} shadow-card`}
                      />
                      <div className="mt-2 font-bold text-gray-800 text-sm md:text-base truncate max-w-[9rem]">
                        {entry.name}
                      </div>
                      <div className="text-primary-600 font-bold text-sm">{entry.total_score} pts</div>
                      <div
                        className={`w-full mt-2 rounded-t-2xl ${style.label} ${style.height} flex items-start justify-center pt-2 text-white font-display text-xl md:text-2xl shadow-card`}
                      >
                        #{rank}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* List */}
        {isLoading ? (
          <div className="space-y-3" aria-busy="true" aria-live="polite">
            {Array.from({ length: 6 }).map((_, i) => (
              <LeaderboardRowSkeleton key={i} />
            ))}
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-3" aria-hidden="true">📊</div>
            <h3 className="font-display text-xl text-gray-800 mb-2">No scores yet</h3>
            <p className="text-gray-600">Be the first to play and grab the top spot!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {rest.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(index * 0.03, 0.3) }}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all bg-white border border-gray-100 hover:border-primary-200 hover:shadow-card ${
                  entry.id === user?.id ? 'ring-2 ring-primary-400 bg-primary-50/40' : ''
                }`}
              >
                <div className="w-10 text-center text-gray-600 font-display text-lg">#{entry.rank}</div>

                <img
                  src={entry.avatar || '/default-avatar.png'}
                  alt={entry.name}
                  className="w-11 h-11 rounded-full border-2 border-primary-200 object-cover"
                />

                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800 truncate">{entry.name}</span>
                    {entry.is_natkhat_gannu_member && (
                      <span className="text-amber-500 text-sm" title="Natkhat Gannu member">
                        ⭐
                      </span>
                    )}
                    {entry.id === user?.id && (
                      <span className="bg-primary-100 text-primary-700 text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full font-bold">
                        You
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {entry.quizzes_completed} quizzes • {entry.age_group} yrs
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xl font-display text-primary-600">{entry.total_score}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wide">points</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Current user rank callout */}
        {currentUserRank && isAuthenticated && (
          <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200 text-center">
            <p className="text-primary-800 font-medium">
              Your rank: <span className="font-bold">#{currentUserRank.rank}</span> with{' '}
              <span className="font-bold">{currentUserRank.total_score}</span> points
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
