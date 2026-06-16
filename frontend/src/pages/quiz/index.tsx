import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store';
import { quizAPI, leaderboardAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { FaPlay, FaClock, FaImage, FaStar } from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import { QuizCardSkeleton } from '@/components/Skeleton';

const categoryEmojis: Record<string, string> = {
  ramayana: '🏹',
  mahabharata: '⚔️',
  krishna_leela: '🦚',
  ganesha_stories: '🐘',
  indian_festivals: '🪔',
};

const quizTypeIcons: Record<string, any> = {
  multiple_choice: null,
  image_based: FaImage,
  timed: FaClock,
};

export default function QuizListPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadData();
  }, [isAuthenticated, selectedCategory]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [quizzesRes, categoriesRes] = await Promise.all([
        quizAPI.getQuizzes({ category: selectedCategory || undefined }),
        leaderboardAPI.getCategories(),
      ]);
      setQuizzes(quizzesRes.data.quizzes);
      setCategories(categoriesRes.data.categories);
    } catch (error) {
      toast.error('Failed to load quizzes');
    } finally {
      setIsLoading(false);
    }
  };

  const getQuizTypeLabel = (type: string) => {
    switch (type) {
      case 'timed':
        return 'Timed Quiz';
      case 'image_based':
        return 'Picture Quiz';
      default:
        return 'Quiz';
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container-app px-4 py-10 md:py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="eyebrow mb-4">Pick one — they're all fun</span>
          <h1 className="font-display text-4xl md:text-5xl text-gray-800 mt-3 mb-2">
            Choose Your Quiz 🎮
          </h1>
          <p className="text-gray-600">Test your mythology knowledge and earn points.</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10">
          <button
            type="button"
            onClick={() => setSelectedCategory('')}
            className={`chip ${!selectedCategory ? 'chip-active' : ''}`}
            aria-pressed={!selectedCategory}
          >
            All Quizzes
          </button>
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setSelectedCategory(cat.value)}
              className={`chip ${selectedCategory === cat.value ? 'chip-active' : ''}`}
              aria-pressed={selectedCategory === cat.value}
            >
              <span aria-hidden="true">{cat.emoji}</span> {cat.label}
            </button>
          ))}
        </div>

        {/* Quiz Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true" aria-live="polite">
            {Array.from({ length: 6 }).map((_, i) => (
              <QuizCardSkeleton key={i} />
            ))}
          </div>
        ) : quizzes.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-3" aria-hidden="true">😔</div>
            <h3 className="font-display text-xl text-gray-800 mb-2">No quizzes yet</h3>
            <p className="text-gray-600">
              Nothing matches your filters for your age group. Try another category!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz, index) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.05, 0.4) }}
              >
                <div
                  className={`card-fun h-full flex flex-col hover:-translate-y-1 ${
                    quiz.is_exclusive
                      ? 'border-amber-300 bg-gradient-to-br from-amber-50 via-orange-50 to-white'
                      : ''
                  }`}
                >
                  {/* Header row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-2xl">
                      {categoryEmojis[quiz.category] ?? '📚'}
                    </div>
                    {quiz.is_exclusive && (
                      <span className="badge-gold">
                        <FaStar aria-hidden="true" /> Exclusive
                      </span>
                    )}
                  </div>

                  {/* Title & description */}
                  <h3 className="font-display text-xl text-gray-800 mb-2 leading-tight">
                    {quiz.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
                    {quiz.description}
                  </p>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="badge-tag">{quiz.question_count} questions</span>
                    {quiz.quiz_type !== 'multiple_choice' && (
                      <span className="badge-tag-primary">
                        {quizTypeIcons[quiz.quiz_type] &&
                          React.createElement(quizTypeIcons[quiz.quiz_type], {
                            className: 'text-xs',
                            'aria-hidden': true,
                          })}
                        {getQuizTypeLabel(quiz.quiz_type)}
                      </span>
                    )}
                    {quiz.time_limit_seconds && (
                      <span className="badge-tag bg-red-50 text-red-600">
                        <FaClock aria-hidden="true" />
                        {Math.floor(quiz.time_limit_seconds / 60)} min
                      </span>
                    )}
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/quiz/${quiz.id}`}
                    className="btn-primary w-full"
                  >
                    <FaPlay aria-hidden="true" /> Play Now
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
