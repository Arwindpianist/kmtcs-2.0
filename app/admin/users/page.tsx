'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/app/components/admin/DataTable';
import { AdminTablePageSkeleton } from '@/app/components/skeletons/PageSkeletons';
import { logger } from '@/app/lib/logger';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'editor';
  full_name: string | null;
  created_at: string;
  last_sign_in: string | null;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'editor' as 'admin' | 'editor',
    fullName: ''
  });
  const [sendingResetForId, setSendingResetForId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const response = await fetch('/api/admin-users');
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Failed to fetch users');
      }
      setUsers(payload.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const response = await fetch('/api/admin-users', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingUser.id,
            role: formData.role,
            fullName: formData.fullName || null,
            password: formData.password || undefined,
          }),
        });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || 'Failed to update user');
      } else {
        const response = await fetch('/api/admin-users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            role: formData.role,
            fullName: formData.fullName || null,
          }),
        });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || 'Failed to create user');
      }
      await fetchUsers();
      handleCancel();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      password: '',
      role: user.role,
      fullName: user.full_name || ''
    });
    setShowForm(true);
  };
  
  const handleCancel = () => {
    setEditingUser(null);
    setShowForm(false);
    setFormData({ email: '', password: '', role: 'editor', fullName: '' });
  };

  async function handleDeleteUser(id: string) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/admin-users?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Failed to delete user');
      await fetchUsers();
    } catch (err: any) {
      setError(`Failed to delete user: ${err.message}`);
    }
  }

  async function handleSendResetLink(user: User) {
    try {
      setSendingResetForId(user.id);
      setNotice(null);
      setError(null);
      const response = await fetch('/api/auth/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Failed to send reset link');
      }
      setNotice(`Reset link sent to ${user.email}`);
    } catch (err: any) {
      setError(`Failed to send reset link: ${err.message}`);
    } finally {
      setSendingResetForId(null);
    }
  }

  if (loading) {
    return <AdminTablePageSkeleton />;
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <div>
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 lg:mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Users Management</h1>
              <p className="text-gray-600">Manage admin users and their permissions</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 lg:mt-0 bg-indigo-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm lg:text-base"
            >
              Add New User
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <strong className="font-bold">Error:</strong>
          <span className="ml-2">{error}</span>
        </div>
      )}
      {notice && (
        <div className="mb-8 p-6 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg">
          <strong className="font-bold">Notice:</strong>
          <span className="ml-2">{notice}</span>
        </div>
      )}

      {showForm ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-8">
          <h2 className="text-2xl font-semibold mb-6">{editingUser ? 'Edit User' : 'Add New User'}</h2>
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required={!editingUser}
                minLength={8}
                placeholder={editingUser ? 'Leave blank to keep current password' : ''}
              />
            </div>
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">Full Name (optional)</label>
              <input
                type="text"
                id="full_name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
              >
                {editingUser ? 'Save Changes' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <DataTable
          data={users}
          columns={[
            {
              key: 'email',
              label: 'User',
              sortable: true,
              render: (user: User) => (
                <div>
                  <div className="font-medium text-gray-900">{user.email}</div>
                  {user.full_name && (
                    <div className="text-sm text-gray-500">{user.full_name}</div>
                  )}
                </div>
              )
            },
            {
              key: 'role',
              label: 'Role',
              sortable: true,
              render: (user: User) => (
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                  {user.role}
                </span>
              )
            },
            {
              key: 'created_at',
              label: 'Created',
              sortable: true,
              render: (user: User) => (
                <div className="text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleDateString()}
                  <div className="text-xs text-gray-400">
                    {new Date(user.created_at).toLocaleTimeString()}
                  </div>
                </div>
              )
            },
            {
              key: 'last_sign_in',
              label: 'Last Sign In',
              sortable: true,
              render: (user: User) => (
                <div className="text-sm text-gray-500">
                  {user.last_sign_in ? new Date(user.last_sign_in).toLocaleDateString() : 'Never'}
                  {user.last_sign_in && (
                    <div className="text-xs text-gray-400">
                      {new Date(user.last_sign_in).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              )
            }
          ]}
          filters={[
            {
              key: 'role',
              label: 'Role',
              type: 'select',
              options: [
                { value: 'admin', label: 'Admin' },
                { value: 'editor', label: 'Editor' }
              ]
            }
          ]}
          searchable={true}
          searchPlaceholder="Search by email or name..."
          pageSize={25}
          loading={loading}
          emptyMessage="No users found. Click 'Add New User' to get started."
          actions={(user) => (
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(user);
                }}
                className="text-indigo-600 hover:text-indigo-800 px-3 py-1 rounded border border-indigo-600 hover:bg-indigo-50 transition-colors text-xs"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteUser(user.id);
                }}
                className="text-red-600 hover:text-red-800 px-3 py-1 rounded border border-red-600 hover:bg-red-50 transition-colors text-xs"
              >
                Delete
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSendResetLink(user);
                }}
                disabled={sendingResetForId === user.id}
                className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded border border-blue-600 hover:bg-blue-50 transition-colors text-xs disabled:opacity-50"
              >
                {sendingResetForId === user.id ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>
          )}
          onRowClick={(user) => handleEdit(user)}
        />
        </div>
      )}
    </div>
  );
} 