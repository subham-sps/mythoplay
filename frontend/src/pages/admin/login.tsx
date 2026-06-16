import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/lib/store';
import { authAPI } from '@/lib/api';
import { FaLock, FaEnvelope, FaSignInAlt } from 'react-icons/fa';

export default function AdminLoginPage() {
  const router = useRouter();
  const { setAdmin } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.adminLogin(email, password);
      const { token, admin } = response.data;
      setAdmin(admin, token);
      toast.success(`Welcome back, ${admin.name}!`);
      router.push('/admin');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.error || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-brand-hero pointer-events-none" aria-hidden="true" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative"
      >
        <div className="card-fun shadow-card-hover">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-3xl shadow-fun">
              ⚙️
            </div>
            <h1 className="font-display text-3xl text-primary-600">Admin Login</h1>
            <p className="text-gray-600 mt-1">MythoPlay Administration</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="admin-email" className="form-label">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" aria-hidden="true" />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-fun pl-12"
                  placeholder="admin@mythoplay.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="form-label">Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" aria-hidden="true" />
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-fun pl-12"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? (
                <span className="animate-spin" aria-hidden="true">⏳</span>
              ) : (
                <>
                  <FaSignInAlt aria-hidden="true" /> Login
                </>
              )}
            </button>
          </form>

          {/* Back Link */}
          <div className="mt-6 text-center">
            <Link href="/login" className="text-gray-500 hover:text-primary-600 text-sm transition-colors">
              ← Back to User Login
            </Link>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-4 p-4 bg-amber-50/90 backdrop-blur rounded-2xl border border-amber-200 text-center shadow-soft">
          <p className="text-sm text-amber-800">
            <strong>Demo Credentials</strong><br />
            admin@mythoplay.com · admin123
          </p>
        </div>
      </motion.div>
    </div>
  );
}

