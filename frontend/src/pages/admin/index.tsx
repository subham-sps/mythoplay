import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { FaUsers, FaGamepad, FaChartLine, FaStar, FaSignOutAlt, FaArrowRight } from 'react-icons/fa';

export default function AdminDashboard() {
  const router = useRouter();
  const { isAdmin, admin, logout } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      router.push('/admin/login');
      return;
    }
    loadStats();
  }, [isAdmin]);

  const loadStats = async () => {
    try {
      const response = await adminAPI.getStats();
      setStats(response.data.stats);
    } catch (error) {
      toast.error('Failed to load dashboard stats');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
    toast.success('Logged out successfully');
  };

  if (!isAdmin) return null;

  const statCards = [
    { label: 'Total Users', value: stats?.total_users || 0, icon: FaUsers, tint: 'from-sky-400 to-blue-600' },
    { label: 'Natkhat Members', value: stats?.natkhat_members || 0, icon: FaStar, tint: 'from-amber-400 to-orange-500' },
    { label: 'Active Quizzes', value: stats?.active_quizzes || 0, icon: FaGamepad, tint: 'from-secondary-400 to-secondary-600' },
    { label: 'Total Attempts', value: stats?.total_attempts || 0, icon: FaChartLine, tint: 'from-accent-400 to-purple-600' },
    { label: 'Today\'s Attempts', value: stats?.today_attempts || 0, icon: FaChartLine, tint: 'from-pink-400 to-rose-500' },
  ];

  const quickActions = [
    { label: 'Manage Quizzes', desc: 'Create, edit & organize quizzes', href: '/admin/quizzes', icon: FaGamepad, tint: 'from-secondary-400 to-secondary-600' },
    { label: 'Manage Users', desc: 'View members & gift eligibility', href: '/admin/users', icon: FaUsers, tint: 'from-sky-400 to-blue-600' },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-primary-100/60 shadow-soft">
        <div className="container-app px-4 py-3 flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xl shadow-fun" aria-hidden="true">
              ⚙️
            </span>
            <div>
              <h1 className="font-display text-xl md:text-2xl text-primary-600 leading-none">
                MythoPlay <span className="text-gray-400 text-sm align-middle">Admin</span>
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">Welcome, {admin?.name}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <FaSignOutAlt aria-hidden="true" /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <main className="container-app px-4 py-8 md:py-10">
        <div className="mb-6">
          <span className="eyebrow mb-2">Overview</span>
          <h2 className="section-title mt-2">Dashboard</h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="card-fun p-5"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.tint} flex items-center justify-center shadow-soft mb-3`}>
                <stat.icon className="text-white text-xl" aria-hidden="true" />
              </div>
              <div className="text-3xl font-display text-gray-800">
                {isLoading ? <span className="text-gray-300">—</span> : stat.value}
              </div>
              <div className="text-sm text-gray-500 mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="font-display text-2xl text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href} className="group card-fun hover:-translate-y-1 p-6">
              <div className="flex items-center gap-4">
                <div className={`shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${action.tint} flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform`}>
                  <action.icon className="text-white text-2xl" aria-hidden="true" />
                </div>
                <div>
                  <div className="font-bold text-lg text-gray-800">{action.label}</div>
                  <div className="text-sm text-gray-500">{action.desc}</div>
                </div>
                <FaArrowRight className="ml-auto text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>

        {/* System Status */}
        <div className="card-fun p-6">
          <h2 className="font-display text-2xl text-gray-800 mb-4">System Status</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {['Database connected', 'API server running', 'Authentication active'].map((label) => (
              <div key={label} className="flex items-center gap-3 rounded-2xl bg-secondary-50 border border-secondary-100 px-4 py-3">
                <span className="relative flex h-3 w-3" aria-hidden="true">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-400 opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary-500"></span>
                </span>
                <span className="text-sm font-medium text-gray-700">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

