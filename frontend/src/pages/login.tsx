import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { GoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/lib/store';
import { authAPI } from '@/lib/api';
import { FaChild, FaUserGraduate, FaStar } from 'react-icons/fa';

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
      const response = await authAPI.googleLogin(
        credentialResponse.credential,
        selectedAgeGroup
      );
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="card-fun">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <span className="text-5xl">🎮</span>
              <h1 className="font-display text-3xl text-primary-600 mt-2">MythoPlay</h1>
            </Link>
            <p className="text-gray-600 mt-2">Join the fun and start learning!</p>
          </div>

          {/* Age Group Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-3 text-center">
              How old are you? 🎂
            </label>
            <div className="grid grid-cols-3 gap-3">
              {ageGroups.map((group) => (
                <button
                  key={group.value}
                  onClick={() => setSelectedAgeGroup(group.value)}
                  className={`p-4 rounded-2xl border-3 transition-all duration-200 ${
                    selectedAgeGroup === group.value
                      ? 'border-primary-500 bg-primary-50 scale-105'
                      : 'border-gray-200 hover:border-primary-300 bg-white'
                  }`}
                >
                  <div className="text-3xl mb-1">{group.emoji}</div>
                  <div className="font-bold text-sm text-gray-700">{group.label}</div>
                  <div className="text-xs text-gray-500">{group.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Google Login */}
          <div className="flex flex-col items-center gap-4">
            <p className="text-gray-600 font-medium">Sign in with your parent's Google account</p>
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
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-gray-500 text-sm">For Parents</span>
            </div>
          </div>

          {/* Parent Info */}
          <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>👨‍👩‍👧 Parents:</strong> Your child will use your Google account to login. 
              We only store minimal information (name, email, avatar) and follow 
              kid-safe practices. No payments are made by children.
            </p>
          </div>

          {/* Admin Link */}
          <div className="mt-6 text-center">
            <Link href="/admin/login" className="text-gray-500 text-sm hover:text-gray-700">
              Admin Login →
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-4">
          <Link href="/" className="text-gray-600 hover:text-primary-600 font-medium">
            ← Back to Home
          </Link>
        </div>
      </motion.div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 text-center">
            <div className="text-6xl animate-bounce mb-4">🎮</div>
            <p className="font-bold text-gray-700">Getting ready...</p>
          </div>
        </div>
      )}
    </div>
  );
}

