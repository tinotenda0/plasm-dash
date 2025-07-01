'use client';

import { useState } from 'react';
import { Users, Shield, Edit, MessageSquare, Bell, Settings, Plus } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'author' | 'contributor';
  avatar?: string;
  status: 'active' | 'invited' | 'inactive';
  lastActive: string;
  joinedAt: string;
}

interface TeamRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  color: string;
}

export function TeamManagement() {
  const [activeTab, setActiveTab] = useState<'members' | 'roles' | 'permissions'>('members');
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Mock data - in a real app, this would come from your backend
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com',
      role: 'admin',
      status: 'active',
      lastActive: '2025-07-01T10:30:00Z',
      joinedAt: '2025-01-15T09:00:00Z'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'editor',
      status: 'active',
      lastActive: '2025-06-30T16:45:00Z',
      joinedAt: '2025-02-20T11:30:00Z'
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike@example.com',
      role: 'author',
      status: 'invited',
      lastActive: '2025-06-28T14:20:00Z',
      joinedAt: '2025-06-25T13:15:00Z'
    },
    {
      id: '4',
      name: 'Emma Wilson',
      email: 'emma@example.com',
      role: 'contributor',
      status: 'active',
      lastActive: '2025-06-29T12:10:00Z',
      joinedAt: '2025-03-10T10:00:00Z'
    }
  ];

  const teamRoles: TeamRole[] = [
    {
      id: 'admin',
      name: 'Admin',
      description: 'Full access to all features and settings',
      permissions: ['manage_team', 'publish_posts', 'edit_all', 'delete_posts', 'manage_settings'],
      color: 'bg-red-100 text-red-800 border-red-200'
    },
    {
      id: 'editor',
      name: 'Editor',
      description: 'Can edit and publish all content',
      permissions: ['publish_posts', 'edit_all', 'manage_media'],
      color: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    {
      id: 'author',
      name: 'Author',
      description: 'Can create and edit own posts',
      permissions: ['create_posts', 'edit_own', 'upload_media'],
      color: 'bg-green-100 text-green-800 border-green-200'
    },
    {
      id: 'contributor',
      name: 'Contributor',
      description: 'Can create drafts for review',
      permissions: ['create_drafts', 'comment'],
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  ];

  const getRoleInfo = (roleId: string) => {
    return teamRoles.find(role => role.id === roleId) || teamRoles[3];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'invited': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'members', label: 'Team Members', icon: Users },
    { id: 'roles', label: 'Roles', icon: Shield },
    { id: 'permissions', label: 'Permissions', icon: Settings }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Team Management</h2>
          <p className="text-gray-600">Manage your team members, roles, and permissions</p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Invite Member
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-gray-200">
        {activeTab === 'members' && (
          <div>
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Team Members ({teamMembers.length})</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {teamMembers.map((member) => {
                const roleInfo = getRoleInfo(member.role);
                return (
                  <div key={member.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{member.name}</h4>
                          <p className="text-sm text-gray-500">{member.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${roleInfo.color}`}>
                              {roleInfo.name}
                            </span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                              {member.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                          <MessageSquare className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                          <Bell className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                      <span>Last active: {new Date(member.lastActive).toLocaleDateString()}</span>
                      <span className="ml-4">Joined: {new Date(member.joinedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'roles' && (
          <div>
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">User Roles</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teamRoles.map((role) => (
                  <div key={role.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${role.color}`}>
                        {role.name}
                      </span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-gray-600 mb-4">{role.description}</p>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Permissions:</h4>
                      <div className="flex flex-wrap gap-2">
                        {role.permissions.map((permission) => (
                          <span
                            key={permission}
                            className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-xs text-gray-700"
                          >
                            {permission.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'permissions' && (
          <div>
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Permission Matrix</h3>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Permission</th>
                      {teamRoles.map((role) => (
                        <th key={role.id} className="text-center py-3 px-4 font-medium text-gray-900">
                          {role.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {['manage_team', 'publish_posts', 'edit_all', 'edit_own', 'create_posts', 'create_drafts', 'delete_posts', 'manage_media', 'upload_media', 'manage_settings', 'comment'].map((permission) => (
                      <tr key={permission} className="hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">
                          {permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </td>
                        {teamRoles.map((role) => (
                          <td key={role.id} className="text-center py-3 px-4">
                            {role.permissions.includes(permission) ? (
                              <div className="w-4 h-4 bg-green-500 rounded-full mx-auto"></div>
                            ) : (
                              <div className="w-4 h-4 bg-gray-200 rounded-full mx-auto"></div>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Invite Team Member</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="colleague@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {teamRoles.map((role) => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Personal Message (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Welcome to our team! Looking forward to working with you."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
