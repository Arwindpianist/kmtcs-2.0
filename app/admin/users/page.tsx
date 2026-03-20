'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import DataTable from '@/app/components/admin/DataTable';
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
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'editor' as 'admin' | 'editor',
    fullName: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
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
        // Update logic
        const { error } = await supabase
          .from('users')
          .update({
            role: formData.role,
            full_name: formData.fullName || null,
          })
          .eq('id', editingUser.id);
        if (error) throw error;
      } else {
        // Create logic
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });
        if (authError) throw authError;

        if (authData.user) {
          const { error: userError } = await supabase
            .from('users')
            .insert({
              id: authData.user.id,
              email: formData.email,
              role: formData.role,
              full_name: formData.fullName || null,
            });
          if (userError) throw userError;
        }
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
      const { error: adminError } = await supabase.auth.admin.deleteUser(id)
      if (adminError) throw adminError;
      await fetchUsers();
    } catch (err: any) {
      setError(`Failed to delete user: ${err.message}`);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
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
                required
                minLength={6}
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
            </div>
          )}
          onRowClick={(user) => handleEdit(user)}
        />
        </div>
      )}
    </div>
  );
} 