import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store';
import { quizAPI, leaderboardAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { FaPlay, FaClock, FaImage, FaLock, FaStar } from 'react-icons/fa';
import Navbar from '@/components/Navbar';

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
  const { isAuthenticated, user } = useAuthStore();
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
      case 'timed': return 'Timed Quiz';
      case 'image_based': return 'Picture Quiz';
      default: return 'Quiz';
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl text-gray-800 mb-2">
            Choose Your Quiz! 🎮
          </h1>
          <p className="text-gray-600">Pick a quiz and test your mythology knowledge!</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-full font-bold transition-all ${
              !selectedCategory
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-600 hover:bg-primary-100'
            }`}
          >
            All Quizzes
          </button>
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-full font-bold transition-all flex items-center gap-2 ${
                selectedCategory === cat.value
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-primary-100'
              }`}
            >
              <span>{cat.emoji}</span> {cat.label}
            </button>
          ))}
        </div>

        {/* Quiz Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-6xl animate-bounce">🎮</div>
            <p className="text-gray-600 mt-4">Loading quizzes...</p>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl">😔</div>
            <p className="text-gray-600 mt-4">No quizzes found for your age group.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz, index) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`card-fun h-full flex flex-col ${quiz.is_exclusive ? 'border-amber-400 bg-amber-50' : ''}`}>
                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{categoryEmojis[quiz.category]}</span>
                    {quiz.is_exclusive && (
                      <span className="badge-gold text-xs">
                        <FaStar className="mr-1" /> Exclusive
                      </span>
                    )}
                  </div>

                  {/* Quiz Info */}
                  <h3 className="font-bold text-xl text-gray-800 mb-2">{quiz.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-grow">{quiz.description}</p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-600">
                      {quiz.question_count} questions
                    </span>
                    {quiz.quiz_type !== 'multiple_choice' && (
                      <span className="bg-primary-100 px-3 py-1 rounded-full text-xs font-medium text-primary-600 flex items-center gap-1">
                        {quizTypeIcons[quiz.quiz_type] && <span>{React.createElement(quizTypeIcons[quiz.quiz_type])}</span>}
                        {getQuizTypeLabel(quiz.quiz_type)}
                      </span>
                    )}
                    {quiz.time_limit_seconds && (
                      <span className="bg-red-100 px-3 py-1 rounded-full text-xs font-medium text-red-600">
                        <FaClock className="inline mr-1" />
                        {Math.floor(quiz.time_limit_seconds / 60)} min
                      </span>
                    )}
                  </div>

                  {/* Play Button */}
                  <Link
                    href={`/quiz/${quiz.id}`}
                    className="btn-primary text-center flex items-center justify-center gap-2"
                  >
                    <FaPlay /> Play Now!
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

