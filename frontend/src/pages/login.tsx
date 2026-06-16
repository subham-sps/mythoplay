import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { GoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/lib/store';
import { authAPI } from '@/lib/api';
import { FaChild, FaUserGraduate, FaStar, FaShieldAlt } from 'react-icons/fa';
import SEO from '@/components/SEO';

const ageGroups = [
  { value: '5-7', label: 'Little Stars', emoji: '⭐', description: '5-7 years', icon: FaChild },
  { value: '8-10', label: 'Rising Champs', emoji: '🌟', description: '8-10 years', icon: FaStar },
  { value: '11-14', label: 'Quiz Masters', emoji: '🏆', description: '11-14 years', icon: FaUserGraduate },
];

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('8-10');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    try {
      const response = await authAPI.googleLogin(credentialResponse.credential, selectedAgeGroup);
      const { token, user } = response.data;
      setUser(user, token);
      toast.success(`Welcome, ${user.name}! 🎉`);
      router.push('/quiz');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <SEO
        title="Sign In — Start Your Mythology Adventure"
        description="Sign in with Google to start playing mythology quizzes, track your scores on the leaderboard, and unlock weekly stories, Bhagavad Gita slokas, and mantras."
        path="/login"
      />
      <div className="absolute inset-0 bg-brand-hero pointer-events-none" aria-hidden="true" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative"
      >
        <div className="card-fun shadow-card-hover">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-5xl" aria-hidden="true">🎮</span>
            </Link>
            <h1 className="font-display text-3xl text-primary-600 mt-2">MythoPlay</h1>
            <p className="text-gray-600 mt-1">Join the fun and start learning!</p>
          </div>

          {/* Age Group Selection */}
          <fieldset className="mb-6">
            <legend className="form-label text-center w-full mb-3">How old are you? 🎂</legend>
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              {ageGroups.map((group) => {
                const selected = selectedAgeGroup === group.value;
                return (
                  <button
                    key={group.value}
                    type="button"
                    onClick={() => setSelectedAgeGroup(group.value)}
                    aria-pressed={selected}
                    className={`p-3 md:p-4 rounded-2xl border-2 transition-all duration-200 text-center
                      ${
                        selected
                          ? 'border-primary-500 bg-primary-50 shadow-fun -translate-y-0.5'
                          : 'border-gray-200 hover:border-primary-300 bg-white'
                      }`}
                  >
                    <div className="text-3xl mb-1" aria-hidden="true">{group.emoji}</div>
                    <div className="font-bold text-xs md:text-sm text-gray-700">{group.label}</div>
                    <div className="text-[10px] md:text-xs text-gray-500">{group.description}</div>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Google Login */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm text-gray-600 font-medium text-center">
              Sign in with your parent's Google account
            </p>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error('Login failed. Please try again.')}
              theme="filled_blue"
              size="large"
              shape="pill"
              text="signin_with"
              locale="en"
            />
          </div>

          {/* Divider */}
          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-gray-500 text-xs uppercase tracking-wide font-semibold">
                For Parents
              </span>
            </div>
          </div>

          {/* Parent Info */}
          <div className="rounded-2xl p-4 bg-blue-50 border border-blue-200 flex items-start gap-3">
            <FaShieldAlt className="text-blue-600 text-lg mt-0.5 shrink-0" aria-hidden="true" />
            <p className="text-sm text-blue-900 leading-relaxed">
              <strong>Parents:</strong> Your child will use your Google account to log in. We only
              store minimal info (name, email, avatar) and follow kid-safe practices. No payments
              are made by children.
            </p>
          </div>

          {/* Admin Link */}
          <div className="mt-6 text-center">
            <Link
              href="/admin/login"
              className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
            >
              Admin Login →
            </Link>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link href="/" className="text-gray-600 hover:text-primary-600 font-medium text-sm">
            ← Back to Home
          </Link>
        </div>
      </motion.div>

      {/* Loading Overlay */}
      {isLoading && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          role="status"
          aria-live="polite"
        >
          <div className="bg-white rounded-3xl p-8 text-center shadow-card-hover">
            <div className="text-6xl animate-bounce mb-4" aria-hidden="true">🎮</div>
            <p className="font-bold text-gray-700">Getting ready...</p>
          </div>
        </div>
      )}
    </div>
  );
}
