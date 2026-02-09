import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import toast from 'react-hot-toast';
import { useAuthStore, useQuizStore } from '@/lib/store';
import { quizAPI } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { FaArrowLeft, FaArrowRight, FaClock, FaCheck } from 'react-icons/fa';

export default function QuizPlayPage() {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated, user, updateUser } = useAuthStore();
  const { currentQuiz, setQuiz, answers, setAnswer, currentQuestion, nextQuestion, prevQuestion, goToQuestion, startTime, startQuiz, resetQuiz } = useQuizStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (id) loadQuiz();
    return () => resetQuiz();
  }, [id, isAuthenticated]);

  // Timer for timed quizzes
  useEffect(() => {
    if (!currentQuiz?.time_limit_seconds || !startTime) return;
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = currentQuiz.time_limit_seconds - elapsed;
      if (remaining <= 0) {
        clearInterval(interval);
        handleSubmit();
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [currentQuiz, startTime]);

  const loadQuiz = async () => {
    try {
      const response = await quizAPI.getQuiz(id as string);
      setQuiz(response.data.quiz);
      startQuiz();
      if (response.data.quiz.time_limit_seconds) {
        setTimeLeft(response.data.quiz.time_limit_seconds);
      }
    } catch (error: any) {
      if (error.response?.data?.code === 'NATKHAT_GANNU_REQUIRED') {
        toast.error('This quiz is exclusive to Natkhat Gannu members!');
        router.push('/quiz');
      } else {
        toast.error('Failed to load quiz');
        router.push('/quiz');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const timeTaken = startTime ? Math.floor((Date.now() - startTime) / 1000) : undefined;
      const response = await quizAPI.submitQuiz(id as string, { answers, timeTaken });
      setResult(response.data);
      updateUser({ totalScore: (user?.totalScore || 0) + response.data.score });
      toast.success(`Great job! You scored ${response.data.score} points! 🎉`);
    } catch (error) {
      toast.error('Failed to submit quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce">🎮</div>
          <p className="text-gray-600 mt-4">Loading quiz...</p>
        </div>
      </div>
    );
  }

  // Show results
  if (result) {
    return (
      <div className="min-h-screen">
        {result.percentage >= 60 && <Confetti recycle={false} numberOfPieces={300} />}
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 py-12">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="card-fun text-center">
            <div className="text-8xl mb-4">
              {result.percentage >= 80 ? '🏆' : result.percentage >= 60 ? '⭐' : result.percentage >= 40 ? '👍' : '💪'}
            </div>
            <h1 className="font-display text-3xl text-gray-800 mb-2">
              {result.percentage >= 80 ? 'Amazing!' : result.percentage >= 60 ? 'Great Job!' : result.percentage >= 40 ? 'Good Try!' : 'Keep Practicing!'}
            </h1>
            <div className="bg-gradient-to-r from-primary-100 to-accent-100 rounded-2xl p-6 my-6">
              <div className="text-5xl font-display text-primary-600">{result.score}</div>
              <div className="text-gray-600">Points Earned</div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-green-100 rounded-xl p-4">
                <div className="text-2xl font-bold text-green-600">{result.correctAnswers}</div>
                <div className="text-sm text-green-700">Correct</div>
              </div>
              <div className="bg-red-100 rounded-xl p-4">
                <div className="text-2xl font-bold text-red-600">{result.totalQuestions - result.correctAnswers}</div>
                <div className="text-sm text-red-700">Wrong</div>
              </div>
              <div className="bg-blue-100 rounded-xl p-4">
                <div className="text-2xl font-bold text-blue-600">{result.percentage}%</div>
                <div className="text-sm text-blue-700">Score</div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={() => router.push('/quiz')} className="btn-primary">Play More Quizzes</button>
              <button onClick={() => router.push('/leaderboard')} className="btn-secondary">View Leaderboard</button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  const question = currentQuiz?.questions?.[currentQuestion];
  if (!question) return null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Timer */}
        {timeLeft !== null && (
          <div className={`fixed top-20 right-4 ${timeLeft < 30 ? 'bg-red-500 animate-pulse' : 'bg-primary-500'} text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 z-40`}>
            <FaClock /> {formatTime(timeLeft)}
          </div>
        )}
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {currentQuiz.questions.length}</span>
            <span>{Math.round(((currentQuestion + 1) / currentQuiz.questions.length) * 100)}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all" style={{ width: `${((currentQuestion + 1) / currentQuiz.questions.length) * 100}%` }} />
          </div>
        </div>
        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div key={currentQuestion} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card-fun mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">{question.question_text}</h2>
            {question.question_image && <img src={question.question_image} alt="Question" className="w-full max-w-md mx-auto rounded-xl mb-6" />}
            <div className="grid gap-3">
              {['A', 'B', 'C', 'D'].map((opt) => {
                const optionKey = `option_${opt.toLowerCase()}` as keyof typeof question;
                const isSelected = answers[currentQuestion] === opt;
                return (
                  <button key={opt} onClick={() => setAnswer(currentQuestion, opt)} className={`quiz-option text-left p-4 rounded-2xl border-3 transition-all ${isSelected ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300 bg-white'}`}>
                    <span className={`inline-flex w-8 h-8 rounded-full items-center justify-center mr-3 font-bold ${isSelected ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'}`}>{opt}</span>
                    <span className="text-gray-700">{question[optionKey]}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button onClick={prevQuestion} disabled={currentQuestion === 0} className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"><FaArrowLeft className="mr-2" /> Previous</button>
          {currentQuestion === currentQuiz.questions.length - 1 ? (
            <button onClick={handleSubmit} disabled={isSubmitting} className="btn-primary"><FaCheck className="mr-2" /> Submit Quiz</button>
          ) : (
            <button onClick={nextQuestion} className="btn-primary">Next <FaArrowRight className="ml-2" /></button>
          )}
        </div>
        {/* Question Navigator */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {currentQuiz.questions.map((_: any, idx: number) => (
            <button key={idx} onClick={() => goToQuestion(idx)} className={`w-10 h-10 rounded-full font-bold transition-all ${idx === currentQuestion ? 'bg-primary-500 text-white' : answers[idx] ? 'bg-green-100 text-green-600 border-2 border-green-400' : 'bg-gray-100 text-gray-600'}`}>{idx + 1}</button>
          ))}
        </div>
      </main>
    </div>
  );
}

