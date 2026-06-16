import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/lib/store';
import { userAPI } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { ProfileSkeleton } from '@/components/Skeleton';
import { FaTrophy, FaGamepad, FaSignOutAlt, FaEdit } from 'react-icons/fa';

const categoryEmojis: Record<string, string> = {
  ramayana: '🏹',
  mahabharata: '⚔️',
  krishna_leela: '🦚',
  ganesha_stories: '🐘',
  indian_festivals: '🪔',
};

const ageGroupLabels: Record<string, { emoji: string; label: string }> = {
  '5-7': { emoji: '⭐', label: 'Little Star' },
  '8-10': { emoji: '🌟', label: 'Rising Champ' },
  '11-14': { emoji: '🏆', label: 'Quiz Master' },
};

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, user, logout, updateUser } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [achievements, setAchievements] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAgeModal, setShowAgeModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadProfile();
  }, [isAuthenticated]);

  const loadProfile = async () => {
    try {
      const [profileRes, achievementsRes] = await Promise.all([
        userAPI.getProfile(),
        userAPI.getAchievements(),
      ]);
      setProfile(profileRes.data.user);
      setAchievements(achievementsRes.data);
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgeGroupChange = async (ageGroup: string) => {
    try {
      await userAPI.updateAgeGroup(ageGroup);
      updateUser({ ageGroup });
      setProfile((prev: any) => ({ ...prev, ageGroup }));
      setShowAgeModal(false);
      toast.success('Age group updated!');
    } catch (error) {
      toast.error('Failed to update age group');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    toast.success('See you soon! 👋');
  };

  const ageInfo = profile?.ageGroup ? ageGroupLabels[profile.ageGroup] : null;

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container-app max-w-4xl px-4 py-10 md:py-12">
        {isLoading || !profile ? (
          <ProfileSkeleton />
        ) : (
          <>
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-fun text-center mb-8 relative overflow-hidden"
            >
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-primary-500 via-accent-500 to-secondary-500 opacity-90" aria-hidden="true" />
              <div className="relative">
                <img
                  src={profile.avatar || '/default-avatar.png'}
                  alt={profile.name}
                  className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-card mb-3 mt-6 object-cover"
                />
                <h1 className="font-display text-3xl text-gray-800 mb-2">{profile.name}</h1>

                <button
                  type="button"
                  onClick={() => setShowAgeModal(true)}
                  className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-1.5 rounded-full font-medium text-sm mb-5 hover:bg-primary-200 transition-all"
                >
                  {ageInfo ? `${ageInfo.emoji} ${ageInfo.label}` : 'Set age group'}
                  <span className="text-gray-500">({profile.ageGroup} yrs)</span>
                  <FaEdit className="text-xs" aria-hidden="true" />
                </button>

                {profile.badges?.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {profile.badges.map((badge: any, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold"
                      >
                        {badge.emoji} {badge.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  <div className="stat-card bg-gradient-to-br from-primary-50 to-primary-100">
                    <div className="text-2xl md:text-3xl font-display text-primary-600">
                      {profile.totalScore || 0}
                    </div>
                    <div className="text-xs md:text-sm text-gray-600">Total Points</div>
                  </div>
                  <div className="stat-card bg-gradient-to-br from-secondary-50 to-secondary-100">
                    <div className="text-2xl md:text-3xl font-display text-secondary-600">
                      {profile.quizzesCompleted || 0}
                    </div>
                    <div className="text-xs md:text-sm text-gray-600">Quizzes Played</div>
                  </div>
                  <div className="stat-card bg-gradient-to-br from-accent-50 to-accent-100">
                    <div className="text-2xl md:text-3xl font-display text-accent-600">
                      {profile.uniqueQuizzes || 0}
                    </div>
                    <div className="text-xs md:text-sm text-gray-600">Unique Quizzes</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Category Progress */}
            {achievements?.categoryProgress?.length > 0 && (
              <div className="card-fun mb-8">
                <h2 className="font-display text-2xl text-gray-800 mb-4">📊 Category Progress</h2>
                <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                  {achievements.categoryProgress.map((cat: any) => (
                    <div
                      key={cat.category}
                      className="bg-gray-50 hover:bg-primary-50/40 rounded-xl p-4 flex items-center gap-4 transition-colors"
                    >
                      <span className="text-4xl" aria-hidden="true">
                        {categoryEmojis[cat.category] || '📚'}
                      </span>
                      <div className="flex-grow">
                        <div className="font-bold text-gray-700 capitalize">
                          {cat.category.replace('_', ' ')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {cat.quizzes_completed} quizzes • {cat.category_score} points
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Natkhat Gannu Status */}
            <div
              className={`card-fun mb-8 ${
                profile.isNatkhatGannuMember ? 'bg-amber-50 border-amber-300' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-5xl" aria-hidden="true">
                  {profile.isNatkhatGannuMember ? '⭐' : '🌟'}
                </span>
                <div>
                  <h2 className="font-display text-xl text-gray-800">Natkhat Gannu Community</h2>
                  <p className="text-gray-600">
                    {profile.isNatkhatGannuMember
                      ? "You're a member! Enjoy exclusive quizzes and rewards."
                      : 'Join the community for exclusive content and rewards!'}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap justify-center gap-3">
              <button onClick={() => router.push('/quiz')} className="btn-primary">
                <FaGamepad aria-hidden="true" /> Play More Quizzes
              </button>
              <button onClick={() => router.push('/leaderboard')} className="btn-secondary">
                <FaTrophy aria-hidden="true" /> Leaderboard
              </button>
              <button onClick={handleLogout} className="btn-ghost">
                <FaSignOutAlt aria-hidden="true" /> Logout
              </button>
            </div>
          </>
        )}
      </main>

      {/* Age Group Modal */}
      {showAgeModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAgeModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-card-hover"
          >
            <h3 className="font-display text-2xl text-gray-800 mb-5 text-center">
              Change Age Group
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(ageGroupLabels).map(([value, info]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleAgeGroupChange(value)}
                  className={`p-4 rounded-2xl border-2 transition-all text-center
                    ${
                      profile?.ageGroup === value
                        ? 'border-primary-500 bg-primary-50 shadow-fun'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                >
                  <div className="text-3xl mb-1" aria-hidden="true">{info.emoji}</div>
                  <div className="font-bold text-sm">{info.label}</div>
                  <div className="text-xs text-gray-500">{value} yrs</div>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowAgeModal(false)}
              className="w-full mt-5 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
