import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/lib/store';
import { userAPI } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { FaTrophy, FaStar, FaGamepad, FaSignOutAlt, FaEdit } from 'react-icons/fa';

const categoryEmojis: Record<string, string> = {
  ramayana: '🏹',
  mahabharata: '⚔️',
  krishna_leela: '🦚',
  ganesha_stories: '🐘',
  indian_festivals: '🪔',
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

  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce">👤</div>
          <p className="text-gray-600 mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-fun text-center mb-8"
        >
          <img
            src={profile?.avatar || '/default-avatar.png'}
            alt={profile?.name}
            className="w-24 h-24 rounded-full mx-auto border-4 border-primary-400 mb-4"
          />
          <h1 className="font-display text-3xl text-gray-800 mb-2">{profile?.name}</h1>
          
          <button
            onClick={() => setShowAgeModal(true)}
            className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full font-medium mb-4 hover:bg-primary-200 transition-all"
          >
            {profile?.ageGroup === '5-7' ? '⭐ Little Star' : profile?.ageGroup === '8-10' ? '🌟 Rising Champ' : '🏆 Quiz Master'}
            ({profile?.ageGroup} years)
            <FaEdit className="text-sm" />
          </button>

          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {profile?.badges?.map((badge: any, index: number) => (
              <span key={index} className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                {badge.emoji} {badge.name}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-4">
              <div className="text-3xl font-display text-primary-600">{profile?.totalScore || 0}</div>
              <div className="text-sm text-gray-600">Total Points</div>
            </div>
            <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-2xl p-4">
              <div className="text-3xl font-display text-secondary-600">{profile?.quizzesCompleted || 0}</div>
              <div className="text-sm text-gray-600">Quizzes Played</div>
            </div>
            <div className="bg-gradient-to-br from-accent-50 to-accent-100 rounded-2xl p-4">
              <div className="text-3xl font-display text-accent-600">{profile?.uniqueQuizzes || 0}</div>
              <div className="text-sm text-gray-600">Unique Quizzes</div>
            </div>
          </div>
        </motion.div>

        {/* Category Progress */}
        {achievements?.categoryProgress?.length > 0 && (
          <div className="card-fun mb-8">
            <h2 className="font-display text-2xl text-gray-800 mb-4">📊 Category Progress</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {achievements.categoryProgress.map((cat: any) => (
                <div key={cat.category} className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                  <span className="text-4xl">{categoryEmojis[cat.category] || '📚'}</span>
                  <div className="flex-grow">
                    <div className="font-bold text-gray-700 capitalize">{cat.category.replace('_', ' ')}</div>
                    <div className="text-sm text-gray-500">{cat.quizzes_completed} quizzes • {cat.category_score} points</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Natkhat Gannu Status */}
        <div className={`card-fun mb-8 ${profile?.isNatkhatGannuMember ? 'bg-amber-50 border-amber-300' : ''}`}>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{profile?.isNatkhatGannuMember ? '⭐' : '🌟'}</span>
            <div>
              <h2 className="font-display text-xl text-gray-800">Natkhat Gannu Community</h2>
              <p className="text-gray-600">
                {profile?.isNatkhatGannuMember 
                  ? "You're a member! Enjoy exclusive quizzes and rewards." 
                  : 'Join the community for exclusive content and rewards!'}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-4">
          <button onClick={() => router.push('/quiz')} className="btn-primary flex items-center gap-2">
            <FaGamepad /> Play More Quizzes
          </button>
          <button onClick={() => router.push('/leaderboard')} className="btn-secondary flex items-center gap-2">
            <FaTrophy /> Leaderboard
          </button>
          <button onClick={handleLogout} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-2xl font-bold hover:bg-gray-300 transition-all flex items-center gap-2">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </main>

      {/* Age Group Modal */}
      {showAgeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl p-6 max-w-md w-full">
            <h3 className="font-display text-2xl text-gray-800 mb-4 text-center">Change Age Group</h3>
            <div className="grid grid-cols-3 gap-3">
              {[{ value: '5-7', label: 'Little Stars', emoji: '⭐' }, { value: '8-10', label: 'Rising Champs', emoji: '🌟' }, { value: '11-14', label: 'Quiz Masters', emoji: '🏆' }].map((group) => (
                <button key={group.value} onClick={() => handleAgeGroupChange(group.value)} className={`p-4 rounded-2xl border-3 transition-all ${profile?.ageGroup === group.value ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300'}`}>
                  <div className="text-3xl mb-1">{group.emoji}</div>
                  <div className="font-bold text-sm">{group.label}</div>
                  <div className="text-xs text-gray-500">{group.value} yrs</div>
                </button>
              ))}
            </div>
            <button onClick={() => setShowAgeModal(false)} className="w-full mt-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
          </motion.div>
        </div>
      )}
    </div>
  );
}

