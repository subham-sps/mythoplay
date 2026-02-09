import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/lib/store';
import { FaGamepad, FaTrophy, FaUser, FaHome } from 'react-icons/fa';

export default function Navbar() {
  const router = useRouter();
  const { isAuthenticated, user, isAdmin, admin } = useAuthStore();

  const navItems = isAdmin
    ? [
        { href: '/admin', label: 'Dashboard', icon: FaHome },
        { href: '/admin/quizzes', label: 'Quizzes', icon: FaGamepad },
        { href: '/admin/users', label: 'Users', icon: FaUser },
      ]
    : [
        { href: '/', label: 'Home', icon: FaHome },
        { href: '/quiz', label: 'Quizzes', icon: FaGamepad },
        { href: '/leaderboard', label: 'Leaderboard', icon: FaTrophy },
        { href: '/profile', label: 'Profile', icon: FaUser },
      ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b-2 border-primary-100">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href={isAdmin ? '/admin' : '/'} className="flex items-center gap-2">
          <span className="text-3xl">{isAdmin ? '⚙️' : '🎮'}</span>
          <span className="font-display text-xl text-primary-600">
            MythoPlay {isAdmin && <span className="text-sm text-gray-500">Admin</span>}
          </span>
        </Link>

        {/* Navigation Items */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = router.pathname === item.href || 
              (item.href !== '/' && router.pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 font-medium transition-colors ${
                  isActive
                    ? 'text-primary-600'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                <item.icon className="text-sm" />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3">
          {isAuthenticated && !isAdmin && user && (
            <>
              <div className="hidden sm:block text-right">
                <div className="font-bold text-gray-800 text-sm">{user.name}</div>
                <div className="text-xs text-primary-600">
                  ⭐ {user.totalScore} points
                </div>
              </div>
              <Link href="/profile">
                <img
                  src={user.avatar || '/default-avatar.png'}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border-3 border-primary-400 hover:border-primary-600 transition-all"
                />
              </Link>
            </>
          )}
          {isAdmin && admin && (
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full">
              <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                {admin.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700">{admin.name}</span>
            </div>
          )}
          {!isAuthenticated && (
            <Link href="/login" className="btn-primary text-sm py-2">
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex justify-around py-2 border-t border-gray-100">
        {navItems.map((item) => {
          const isActive = router.pathname === item.href ||
            (item.href !== '/' && router.pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center text-xs ${
                isActive ? 'text-primary-600' : 'text-gray-500'
              }`}
            >
              <item.icon className="text-lg mb-1" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

