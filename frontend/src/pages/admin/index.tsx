import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { FaUsers, FaGamepad, FaChartLine, FaStar, FaSignOutAlt } from 'react-icons/fa';

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
    { label: 'Total Users', value: stats?.total_users || 0, icon: FaUsers, color: 'bg-blue-500' },
    { label: 'Natkhat Members', value: stats?.natkhat_members || 0, icon: FaStar, color: 'bg-amber-500' },
    { label: 'Active Quizzes', value: stats?.active_quizzes || 0, icon: FaGamepad, color: 'bg-green-500' },
    { label: 'Total Attempts', value: stats?.total_attempts || 0, icon: FaChartLine, color: 'bg-purple-500' },
    { label: 'Today\'s Attempts', value: stats?.today_attempts || 0, icon: FaChartLine, color: 'bg-pink-500' },
  ];

  const quickActions = [
    { label: 'Manage Quizzes', href: '/admin/quizzes', icon: FaGamepad, color: 'bg-green-100 text-green-700' },
    { label: 'Manage Users', href: '/admin/users', icon: FaUsers, color: 'bg-blue-100 text-blue-700' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚙️</span>
            <div>
              <h1 className="text-xl font-bold text-gray-800">MythoPlay Admin</h1>
              <p className="text-sm text-gray-500">Welcome, {admin?.name}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 transition-colors"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                <stat.icon className="text-white text-xl" />
              </div>
              <div className="text-3xl font-bold text-gray-800">
                {isLoading ? '...' : stat.value}
              </div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <div className={`${action.color} rounded-xl p-6 hover:shadow-md transition-all cursor-pointer`}>
                <div className="flex items-center gap-4">
                  <action.icon className="text-3xl" />
                  <div>
                    <div className="font-bold text-lg">{action.label}</div>
                    <div className="text-sm opacity-75">Click to manage</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Activity Placeholder */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">System Status</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="text-gray-600">Database connected</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="text-gray-600">API server running</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="text-gray-600">Authentication active</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

