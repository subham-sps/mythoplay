import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store';
import { leaderboardAPI } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { FaTrophy, FaMedal, FaStar } from 'react-icons/fa';

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

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <span className="badge-gold">🥇 1st</span>;
    if (rank === 2) return <span className="badge-silver">🥈 2nd</span>;
    if (rank === 3) return <span className="badge-bronze">🥉 3rd</span>;
    return <span className="text-gray-600 font-bold">#{rank}</span>;
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl text-gray-800 mb-2">
            🏆 Leaderboard
          </h1>
          <p className="text-gray-600">See who the top quiz champions are!</p>
        </div>

        {/* Filters */}
        <div className="card-fun mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Period */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">Time Period</label>
              <div className="flex gap-2">
                {['weekly', 'monthly', 'all'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`flex-1 py-2 px-3 rounded-xl font-medium transition-all ${
                      selectedPeriod === period
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {period === 'all' ? 'All Time' : period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-primary-500 outline-none"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.emoji} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Age Group */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">Age Group</label>
              <select
                value={selectedAgeGroup}
                onChange={(e) => setSelectedAgeGroup(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-primary-500 outline-none"
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

        {/* Leaderboard */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-6xl animate-bounce">🏆</div>
            <p className="text-gray-600 mt-4">Loading champions...</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl">📊</div>
            <p className="text-gray-600 mt-4">No scores yet. Be the first to play!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                  entry.rank <= 3
                    ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300'
                    : 'bg-white border-2 border-gray-100'
                } ${entry.id === user?.id ? 'ring-4 ring-primary-300' : ''}`}
              >
                {/* Rank */}
                <div className="w-16 text-center">{getRankBadge(entry.rank)}</div>

                {/* Avatar */}
                <img
                  src={entry.avatar || '/default-avatar.png'}
                  alt={entry.name}
                  className="w-12 h-12 rounded-full border-3 border-primary-300"
                />

                {/* Info */}
                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800">{entry.name}</span>
                    {entry.is_natkhat_gannu_member && (
                      <span className="text-amber-500 text-sm">⭐</span>
                    )}
                    {entry.id === user?.id && (
                      <span className="bg-primary-100 text-primary-600 text-xs px-2 py-0.5 rounded-full">You</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {entry.quizzes_completed} quizzes • {entry.age_group} years
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-600">{entry.total_score}</div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Current User Rank (if not in list) */}
        {currentUserRank && isAuthenticated && (
          <div className="mt-8 p-4 bg-primary-50 rounded-2xl border-2 border-primary-300">
            <p className="text-center text-primary-700 font-medium">
              Your Rank: <span className="font-bold">#{currentUserRank.rank}</span> with{' '}
              <span className="font-bold">{currentUserRank.total_score}</span> points
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

