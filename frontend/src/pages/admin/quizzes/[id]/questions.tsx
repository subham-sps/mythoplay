import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { adminAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { FaPlus, FaArrowLeft, FaTrash, FaCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface Question {
  id: string;
  question_text: string;
  question_image?: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  points: number;
  order_index: number;
}

export default function QuizQuestions() {
  const router = useRouter();
  const { id: quizId } = router.query;
  const { admin } = useAuthStore();
  const isAuthenticated = !!admin;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    questionText: '',
    questionImage: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctOption: 'A',
    points: 10,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (quizId) {
      fetchQuestions();
    }
  }, [quizId]);

  const fetchQuestions = async () => {
    try {
      const response = await adminAPI.getQuestions(quizId as string);
      setQuestions(response.data.questions);
    } catch (error) {
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminAPI.addQuestion(quizId as string, formData);
      toast.success('Question added successfully!');
      setFormData({
        questionText: '',
        questionImage: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctOption: 'A',
        points: 10,
      });
      setShowForm(false);
      fetchQuestions();
    } catch (error) {
      toast.error('Failed to add question');
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <button
          onClick={() => router.push('/admin/quizzes')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <FaArrowLeft /> Back to Quizzes
        </button>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Quiz Questions</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2"
          >
            <FaPlus /> Add Question
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Add New Question</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question Text *
                </label>
                <textarea
                  value={formData.questionText}
                  onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.questionImage}
                  onChange={(e) => setFormData({ ...formData, questionImage: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {['A', 'B', 'C', 'D'].map((opt) => (
                  <div key={opt}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Option {opt} *
                    </label>
                    <input
                      type="text"
                      value={formData[`option${opt}` as keyof typeof formData] as string}
                      onChange={(e) => setFormData({ ...formData, [`option${opt}`]: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correct Answer *
                  </label>
                  <select
                    value={formData.correctOption}
                    onChange={(e) => setFormData({ ...formData, correctOption: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
                  <input
                    type="number"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    min={1}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary">
                  Save Question
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">Loading questions...</div>
        ) : questions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
            No questions yet. Click "Add Question" to create one.
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((q, index) => (
              <div key={q.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-sm font-medium">
                    Q{index + 1}
                  </span>
                  <span className="text-sm text-gray-500">{q.points} points</span>
                </div>
                <p className="text-gray-800 font-medium mb-4">{q.question_text}</p>
                {q.question_image && (
                  <img src={q.question_image} alt="Question" className="max-w-xs mb-4 rounded" />
                )}
                <div className="grid grid-cols-2 gap-2">
                  {['A', 'B', 'C', 'D'].map((opt) => (
                    <div
                      key={opt}
                      className={`p-2 rounded border ${
                        q.correct_option === opt
                          ? 'bg-green-100 border-green-500 text-green-700'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <span className="font-medium">{opt}:</span>{' '}
                      {q[`option_${opt.toLowerCase()}` as keyof Question]}
                      {q.correct_option === opt && <FaCheck className="inline ml-2 text-green-600" />}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

