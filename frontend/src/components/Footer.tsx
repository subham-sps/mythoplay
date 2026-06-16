import Link from 'next/link';
import { FaYoutube, FaGamepad, FaTrophy, FaHeart } from 'react-icons/fa';
import { YOUTUBE_CONFIG } from './YouTubeVideoSection';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-10 bg-gradient-to-br from-mythic-ink to-gray-900 text-gray-300">
      <div className="absolute inset-x-0 -top-6 flex justify-center pointer-events-none">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 shadow-fun flex items-center justify-center text-2xl">
          🎮
        </div>
      </div>

      <div className="container-app px-4 pt-14 pb-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-3xl">🎮</span>
              <span className="font-display text-2xl text-white">MythoPlay</span>
            </Link>
            <p className="mt-3 max-w-md text-sm text-gray-400 leading-relaxed">
              A fun, safe playground where kids learn Indian mythology through
              stories, slokas, mantras, and interactive quizzes.
            </p>
          </div>

          <div>
            <h4 className="font-display text-white text-lg mb-3">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/quiz" className="inline-flex items-center gap-2 hover:text-primary-300 transition-colors">
                  <FaGamepad className="text-primary-400" /> Quizzes
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="inline-flex items-center gap-2 hover:text-primary-300 transition-colors">
                  <FaTrophy className="text-primary-400" /> Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-primary-300 transition-colors">
                  My Profile
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-white text-lg mb-3">Community</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={`https://www.youtube.com/channel/${YOUTUBE_CONFIG.channelId}?sub_confirmation=1`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-primary-300 transition-colors"
                >
                  <FaYoutube className="text-red-500" /> YouTube
                </a>
              </li>
              <li>
                <Link href="/login" className="hover:text-primary-300 transition-colors">
                  Join the fun
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {year} MythoPlay. All rights reserved.</p>
          <p className="inline-flex items-center gap-1">
            Made with <FaHeart className="text-primary-400" /> for curious little minds
          </p>
        </div>
      </div>
    </footer>
  );
}
