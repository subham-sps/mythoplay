import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaStar, FaGift, FaSearch } from 'react-icons/fa';

export default function AdminUsersPage() {
  const router = useRouter();
  const { isAdmin } = useAuthStore();
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterNatkhat, setFilterNatkhat] = useState(false);

  useEffect(() => {
    if (!isAdmin) { router.push('/admin/login'); return; }
    loadUsers();
  }, [isAdmin, page, filterNatkhat]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const response = await adminAPI.getUsers({
        page,
        limit: 20,
        natkhatMember: filterNatkhat ? 'true' : undefined,
      });
      setUsers(response.data.users);
      setTotal(response.data.total);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMembership = async (userId: string, currentStatus: boolean) => {
    try {
      await adminAPI.updateMembership(userId, !currentStatus);
      toast.success(currentStatus ? 'Membership removed' : 'Membership granted!');
      loadUsers();
      if (selectedUser?.id === userId) {
        setSelectedUser((prev: any) => ({ ...prev, is_natkhat_gannu_member: !currentStatus }));
      }
    } catch (error) {
      toast.error('Failed to update membership');
    }
  };

  const toggleGiftEligibility = async (userId: string, currentStatus: boolean) => {
    try {
      await adminAPI.updateGiftEligibility(userId, !currentStatus);
      toast.success(currentStatus ? 'Gift eligibility removed' : 'Gift eligibility granted!');
      loadUsers();
      if (selectedUser?.id === userId) {
        setSelectedUser((prev: any) => ({ ...prev, is_eligible_for_gifts: !currentStatus }));
      }
    } catch (error) {
      toast.error('Failed to update gift eligibility');
    }
  };

  const viewUserDetails = async (userId: string) => {
    try {
      const response = await adminAPI.getUser(userId);
      setSelectedUser(response.data.user);
    } catch (error) {
      toast.error('Failed to load user details');
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/admin')} className="text-gray-600 hover:text-gray-800">
              <FaArrowLeft />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Manage Users</h1>
          </div>
          <div className="text-sm text-gray-500">{total} total users</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex-grow relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filterNatkhat}
              onChange={(e) => setFilterNatkhat(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">Natkhat Gannu Members Only</span>
          </label>
        </div>

        <div className="flex gap-6">
          {/* Users List */}
          <div className="flex-grow bg-white rounded-xl shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="text-center py-12"><div className="text-4xl animate-spin">⏳</div></div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className={`hover:bg-gray-50 cursor-pointer ${selectedUser?.id === user.id ? 'bg-blue-50' : ''}`} onClick={() => viewUserDetails(user.id)}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={user.avatar || '/default-avatar.png'} alt={user.name} className="w-10 h-10 rounded-full" />
                          <div>
                            <div className="font-medium text-gray-800">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{user.age_group}</td>
                      <td className="px-6 py-4 text-gray-600">{user.total_score || 0}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          {user.is_natkhat_gannu_member && <span className="text-amber-500" title="Natkhat Gannu Member"><FaStar /></span>}
                          {user.is_eligible_for_gifts && <span className="text-green-500" title="Gift Eligible"><FaGift /></span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={(e) => { e.stopPropagation(); toggleMembership(user.id, user.is_natkhat_gannu_member); }} className={`px-2 py-1 text-xs rounded ${user.is_natkhat_gannu_member ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                          {user.is_natkhat_gannu_member ? '⭐ Member' : 'Add ⭐'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* User Details Panel */}
          {selectedUser && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-80 bg-white rounded-xl shadow-sm p-6">
              <img src={selectedUser.avatar || '/default-avatar.png'} alt={selectedUser.name} className="w-20 h-20 rounded-full mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-800 text-center">{selectedUser.name}</h3>
              <p className="text-sm text-gray-500 text-center mb-4">{selectedUser.email}</p>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-gray-600">Age Group:</span><span className="font-medium">{selectedUser.age_group}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Total Score:</span><span className="font-medium">{selectedUser.total_score}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Quizzes:</span><span className="font-medium">{selectedUser.quizzes_taken || 0}</span></div>
              </div>
              <div className="mt-6 space-y-2">
                <button onClick={() => toggleMembership(selectedUser.id, selectedUser.is_natkhat_gannu_member)} className={`w-full py-2 rounded-lg font-medium ${selectedUser.is_natkhat_gannu_member ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}`}>
                  {selectedUser.is_natkhat_gannu_member ? '⭐ Remove Membership' : '⭐ Grant Membership'}
                </button>
                <button onClick={() => toggleGiftEligibility(selectedUser.id, selectedUser.is_eligible_for_gifts)} className={`w-full py-2 rounded-lg font-medium ${selectedUser.is_eligible_for_gifts ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {selectedUser.is_eligible_for_gifts ? '🎁 Remove Gift Eligibility' : '🎁 Grant Gift Eligibility'}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

