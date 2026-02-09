import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaEye, FaEyeSlash, FaListOl } from 'react-icons/fa';

const categories = [
  { value: 'ramayana', label: 'Ramayana' },
  { value: 'mahabharata', label: 'Mahabharata' },
  { value: 'krishna_leela', label: 'Krishna Leela' },
  { value: 'ganesha_stories', label: 'Ganesha Stories' },
  { value: 'indian_festivals', label: 'Indian Festivals' },
];

const ageGroups = ['5-7', '8-10', '11-14'];
const quizTypes = ['multiple_choice', 'image_based', 'timed'];

export default function AdminQuizzesPage() {
  const router = useRouter();
  const { isAdmin } = useAuthStore();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'ramayana', ageGroup: '8-10',
    quizType: 'multiple_choice', timeLimitSeconds: '', isExclusive: false,
  });

  useEffect(() => {
    if (!isAdmin) { router.push('/admin/login'); return; }
    loadQuizzes();
  }, [isAdmin]);

  const loadQuizzes = async () => {
    try {
      const response = await adminAPI.getQuizzes();
      setQuizzes(response.data.quizzes);
    } catch (error) {
      toast.error('Failed to load quizzes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        timeLimitSeconds: formData.timeLimitSeconds ? parseInt(formData.timeLimitSeconds) : null,
      };
      if (editingQuiz) {
        await adminAPI.updateQuiz(editingQuiz.id, data);
        toast.success('Quiz updated!');
      } else {
        await adminAPI.createQuiz(data);
        toast.success('Quiz created!');
      }
      setShowModal(false);
      setEditingQuiz(null);
      resetForm();
      loadQuizzes();
    } catch (error) {
      toast.error('Failed to save quiz');
    }
  };

  const handleEdit = (quiz: any) => {
    setEditingQuiz(quiz);
    setFormData({
      title: quiz.title, description: quiz.description || '', category: quiz.category,
      ageGroup: quiz.age_group, quizType: quiz.quiz_type,
      timeLimitSeconds: quiz.time_limit_seconds?.toString() || '', isExclusive: quiz.is_exclusive,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return;
    try {
      await adminAPI.deleteQuiz(id);
      toast.success('Quiz deleted');
      loadQuizzes();
    } catch (error) {
      toast.error('Failed to delete quiz');
    }
  };

  const toggleActive = async (quiz: any) => {
    try {
      await adminAPI.updateQuiz(quiz.id, { isActive: !quiz.is_active });
      toast.success(quiz.is_active ? 'Quiz deactivated' : 'Quiz activated');
      loadQuizzes();
    } catch (error) {
      toast.error('Failed to update quiz');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', category: 'ramayana', ageGroup: '8-10', quizType: 'multiple_choice', timeLimitSeconds: '', isExclusive: false });
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/admin')} className="text-gray-600 hover:text-gray-800">
              <FaArrowLeft />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Manage Quizzes</h1>
          </div>
          <button onClick={() => { resetForm(); setEditingQuiz(null); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <FaPlus /> Add Quiz
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-12"><div className="text-4xl animate-spin">⏳</div></div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Questions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {quizzes.map((quiz) => (
                  <tr key={quiz.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">{quiz.title}</div>
                      {quiz.is_exclusive && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Exclusive</span>}
                    </td>
                    <td className="px-6 py-4 text-gray-600 capitalize">{quiz.category.replace('_', ' ')}</td>
                    <td className="px-6 py-4 text-gray-600">{quiz.age_group}</td>
                    <td className="px-6 py-4 text-gray-600">{quiz.question_count}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${quiz.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {quiz.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => router.push(`/admin/quizzes/${quiz.id}/questions`)} className="text-purple-500 hover:text-purple-700" title="Manage Questions">
                        <FaListOl />
                      </button>
                      <button onClick={() => toggleActive(quiz)} className="text-gray-500 hover:text-gray-700" title={quiz.is_active ? 'Deactivate' : 'Activate'}>
                        {quiz.is_active ? <FaEyeSlash /> : <FaEye />}
                      </button>
                      <button onClick={() => handleEdit(quiz)} className="text-blue-500 hover:text-blue-700" title="Edit Quiz"><FaEdit /></button>
                      <button onClick={() => handleDelete(quiz.id)} className="text-red-500 hover:text-red-700" title="Delete Quiz"><FaTrash /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{editingQuiz ? 'Edit Quiz' : 'Create Quiz'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label><input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none" rows={3} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2 rounded-lg border">{categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label><select value={formData.ageGroup} onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })} className="w-full px-4 py-2 rounded-lg border">{ageGroups.map((a) => <option key={a} value={a}>{a} years</option>)}</select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Quiz Type</label><select value={formData.quizType} onChange={(e) => setFormData({ ...formData, quizType: e.target.value })} className="w-full px-4 py-2 rounded-lg border">{quizTypes.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}</select></div>
                {formData.quizType === 'timed' && <div><label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (sec)</label><input type="number" value={formData.timeLimitSeconds} onChange={(e) => setFormData({ ...formData, timeLimitSeconds: e.target.value })} className="w-full px-4 py-2 rounded-lg border" /></div>}
              </div>
              <div className="flex items-center gap-2"><input type="checkbox" id="exclusive" checked={formData.isExclusive} onChange={(e) => setFormData({ ...formData, isExclusive: e.target.checked })} className="w-4 h-4" /><label htmlFor="exclusive" className="text-sm text-gray-700">Exclusive to Natkhat Gannu members</label></div>
              <div className="flex gap-3 pt-4"><button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 border rounded-lg">Cancel</button><button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button></div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

