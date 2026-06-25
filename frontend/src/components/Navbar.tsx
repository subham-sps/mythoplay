import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/lib/store';
import { FaGamepad, FaTrophy, FaUser, FaHome, FaPuzzlePiece, FaBookOpen } from 'react-icons/fa';

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
        { href: '/games', label: 'Games', icon: FaPuzzlePiece },
        { href: '/gita-weekly', label: 'Gita', icon: FaBookOpen },
        { href: '/leaderboard', label: 'Leaderboard', icon: FaTrophy },
        { href: '/profile', label: 'Profile', icon: FaUser },
      ];

  const isItemActive = (href: string) =>
    href === '/'
      ? router.pathname === '/'
      : router.pathname === href || router.pathname.startsWith(href + '/');

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-primary-100/60 shadow-soft">
      <div className="container-app px-4 py-3 flex justify-between items-center gap-4">
        <Link href={isAdmin ? '/admin' : '/'} className="flex items-center gap-2 shrink-0">
          <span className="text-2xl md:text-3xl" aria-hidden="true">{isAdmin ? '⚙️' : '🎮'}</span>
          <span className="font-display text-xl md:text-2xl text-primary-600 leading-none">
            MythoPlay
            {isAdmin && <span className="ml-1 text-xs text-gray-500 align-middle">Admin</span>}
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const active = isItemActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`relative flex items-center gap-2 px-3 py-2 rounded-xl font-semibold text-sm transition-colors
                  ${active ? 'text-primary-700 bg-primary-50' : 'text-gray-600 hover:text-primary-700 hover:bg-primary-50/60'}
                `}
              >
                <item.icon className="text-sm" aria-hidden="true" />
                {item.label}
                {active && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-6 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {isAuthenticated && !isAdmin && user && (
            <>
              <div className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-amber-100 to-orange-100 px-3 py-1.5 rounded-full border border-amber-200">
                <span aria-hidden="true">⭐</span>
                <span className="text-sm font-bold text-amber-800">{user.totalScore ?? 0}</span>
              </div>
              <Link href="/profile" aria-label="Your profile" className="block">
                <img
                  src={user.avatar || '/default-avatar.png'}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border-2 border-primary-300 hover:border-primary-500 transition-all object-cover"
                />
              </Link>
            </>
          )}
          {isAdmin && admin && (
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
              <div className="w-7 h-7 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                {admin.name.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline text-sm font-medium text-gray-700">{admin.name}</span>
            </div>
          )}
          {!isAuthenticated && (
            <Link href="/login" className="btn-primary py-2 px-4 text-sm">
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile secondary row */}
      <div className="md:hidden flex justify-around py-1.5 border-t border-gray-100">
        {navItems.map((item) => {
          const active = isItemActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={`flex flex-col items-center justify-center text-[10px] font-semibold min-w-[60px] py-1 rounded-xl transition-colors
                ${active ? 'text-primary-600' : 'text-gray-500 hover:text-primary-600'}
              `}
            >
              <item.icon className={`text-lg mb-0.5 ${active ? 'scale-110' : ''} transition-transform`} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
