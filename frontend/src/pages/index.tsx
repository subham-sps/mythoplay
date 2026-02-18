import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store';
import { FaGamepad, FaTrophy, FaStar, FaArrowRight, FaBook, FaFeatherAlt, FaSun } from 'react-icons/fa';
import YouTubeVideoSection from '@/components/YouTubeVideoSection';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  const features = [
    {
      icon: <FaBook className="text-5xl text-primary-500" />,
      title: 'Ganesha Stories',
      description: 'Learn about the wise elephant god!',
    },
    {
      icon: <FaFeatherAlt className="text-5xl text-blue-500" />,
      title: 'Krishna Leela',
      description: 'Discover the playful Krishna!',
    },
    {
      icon: <FaSun className="text-5xl text-amber-500" />,
      title: 'Ramayana',
      description: 'Join Ram on his epic journey!',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">🎮</span>
            <span className="font-display text-2xl text-primary-600">MythoPlay</span>
          </Link>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/quiz" className="btn-primary flex items-center gap-2">
                  <FaGamepad /> Play Quiz
                </Link>
                <Link href="/profile">
                  <img
                    src={user?.avatar || '/default-avatar.png'}
                    alt={user?.name}
                    className="w-10 h-10 rounded-full border-3 border-primary-400"
                  />
                </Link>
              </>
            ) : (
              <Link href="/login" className="btn-primary">
                Start Playing! 🎮
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="heading-fun mb-6">
              Learn Indian Mythology<br />Through Fun Quizzes! 🏹
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of kids exploring ancient stories of gods, heroes, and magical adventures!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href={isAuthenticated ? '/quiz' : '/login'} className="btn-primary text-xl px-8 py-4">
                Start Your Adventure <FaArrowRight className="inline ml-2" />
              </Link>
              <Link href="/leaderboard" className="btn-secondary text-xl px-8 py-4">
                <FaTrophy className="inline mr-2" /> Leaderboard
              </Link>
            </div>
          </motion.div>

          {/* Floating Icons */}
          <motion.div
            className="absolute top-10 left-10 text-6xl"
            animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🐘
          </motion.div>
          <motion.div
            className="absolute top-20 right-20 text-5xl"
            animate={{ y: [0, -15, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            🦚
          </motion.div>
          <motion.div
            className="absolute bottom-10 left-20 text-5xl"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🪷
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-display text-center text-gray-800 mb-12">
            Explore Amazing Stories! ✨
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="card-fun text-center hover:transform hover:scale-105"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* YouTube Videos Section */}
      <YouTubeVideoSection />

      {/* Natkhat Gannu Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="card-mythic text-center">
            <div className="text-6xl mb-4">⭐</div>
            <h2 className="text-2xl font-display text-amber-800 mb-4">
              Join Natkhat Gannu Community!
            </h2>
            <p className="text-gray-700 mb-6">
              Become a member and unlock exclusive quizzes, special badges, and amazing rewards!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="badge-gold"><FaStar className="mr-1" /> Exclusive Quizzes</span>
              <span className="badge-gold"><FaTrophy className="mr-1" /> Special Badges</span>
              <span className="badge-gold">🎁 Gift Eligibility</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-display text-2xl mb-2">🎮 MythoPlay</p>
          <p className="text-gray-400">Making learning mythology fun for kids!</p>
          <p className="text-gray-500 text-sm mt-4">© 2024 MythoPlay. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

