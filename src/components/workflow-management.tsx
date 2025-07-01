'use client';

import { useState } from 'react';
import { CheckCircle, Clock, AlertCircle, MessageSquare, User, Calendar, ArrowRight } from 'lucide-react';
import { safeFormatDate } from '@/lib/utils';

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  required: boolean;
  assignedRole: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  completedAt?: string;
  completedBy?: string;
  comments?: WorkflowComment[];
}

interface WorkflowComment {
  id: string;
  author: string;
  message: string;
  createdAt: string;
  type: 'feedback' | 'approval' | 'rejection' | 'general';
}

interface WorkflowPost {
  id: string;
  title: string;
  author: string;
  status: 'draft' | 'in_review' | 'approved' | 'published' | 'rejected';
  createdAt: string;
  updatedAt: string;
  currentStep: number;
  steps: WorkflowStep[];
  priority: 'low' | 'medium' | 'high';
  deadline?: string;
}

export function WorkflowManagement() {
  const [activeTab, setActiveTab] = useState<'pending' | 'in_review' | 'completed'>('pending');
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  // Mock workflow data
  const workflowPosts: WorkflowPost[] = [
    {
      id: '1',
      title: 'Getting Started with React Server Components',
      author: 'Sarah Johnson',
      status: 'in_review',
      createdAt: '2025-06-28T09:00:00Z',
      updatedAt: '2025-06-30T14:30:00Z',
      currentStep: 1,
      priority: 'high',
      deadline: '2025-07-05T17:00:00Z',
      steps: [
        {
          id: 'draft',
          name: 'Draft Creation',
          description: 'Author creates initial draft',
          required: true,
          assignedRole: 'author',
          status: 'completed',
          completedAt: '2025-06-28T09:00:00Z',
          completedBy: 'Sarah Johnson'
        },
        {
          id: 'review',
          name: 'Editorial Review',
          description: 'Editor reviews content for quality and accuracy',
          required: true,
          assignedRole: 'editor',
          status: 'in_progress',
          comments: [
            {
              id: '1',
              author: 'John Smith',
              message: 'Great article! Just needs some minor formatting adjustments in the code blocks.',
              createdAt: '2025-06-30T14:30:00Z',
              type: 'feedback'
            }
          ]
        },
        {
          id: 'approval',
          name: 'Final Approval',
          description: 'Admin or senior editor gives final approval',
          required: true,
          assignedRole: 'admin',
          status: 'pending'
        },
        {
          id: 'publish',
          name: 'Publication',
          description: 'Post is published and promoted',
          required: true,
          assignedRole: 'editor',
          status: 'pending'
        }
      ]
    },
    {
      id: '2',
      title: 'Advanced TypeScript Patterns',
      author: 'Mike Chen',
      status: 'draft',
      createdAt: '2025-06-29T11:15:00Z',
      updatedAt: '2025-06-29T16:45:00Z',
      currentStep: 0,
      priority: 'medium',
      deadline: '2025-07-10T17:00:00Z',
      steps: [
        {
          id: 'draft',
          name: 'Draft Creation',
          description: 'Author creates initial draft',
          required: true,
          assignedRole: 'author',
          status: 'in_progress'
        },
        {
          id: 'review',
          name: 'Editorial Review',
          description: 'Editor reviews content for quality and accuracy',
          required: true,
          assignedRole: 'editor',
          status: 'pending'
        },
        {
          id: 'approval',
          name: 'Final Approval',
          description: 'Admin or senior editor gives final approval',
          required: true,
          assignedRole: 'admin',
          status: 'pending'
        },
        {
          id: 'publish',
          name: 'Publication',
          description: 'Post is published and promoted',
          required: true,
          assignedRole: 'editor',
          status: 'pending'
        }
      ]
    },
    {
      id: '3',
      title: 'Building Scalable APIs with Node.js',
      author: 'Emma Wilson',
      status: 'approved',
      createdAt: '2025-06-25T08:30:00Z',
      updatedAt: '2025-06-30T10:15:00Z',
      currentStep: 3,
      priority: 'high',
      steps: [
        {
          id: 'draft',
          name: 'Draft Creation',
          description: 'Author creates initial draft',
          required: true,
          assignedRole: 'author',
          status: 'completed',
          completedAt: '2025-06-25T08:30:00Z',
          completedBy: 'Emma Wilson'
        },
        {
          id: 'review',
          name: 'Editorial Review',
          description: 'Editor reviews content for quality and accuracy',
          required: true,
          assignedRole: 'editor',
          status: 'completed',
          completedAt: '2025-06-27T14:20:00Z',
          completedBy: 'John Smith'
        },
        {
          id: 'approval',
          name: 'Final Approval',
          description: 'Admin or senior editor gives final approval',
          required: true,
          assignedRole: 'admin',
          status: 'completed',
          completedAt: '2025-06-30T10:15:00Z',
          completedBy: 'John Smith'
        },
        {
          id: 'publish',
          name: 'Publication',
          description: 'Post is published and promoted',
          required: true,
          assignedRole: 'editor',
          status: 'pending'
        }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'rejected': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_review': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'published': return 'bg-purple-100 text-purple-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredPosts = workflowPosts.filter(post => {
    switch (activeTab) {
      case 'pending': return ['draft', 'in_review'].includes(post.status);
      case 'in_review': return post.status === 'in_review';
      case 'completed': return ['approved', 'published'].includes(post.status);
      default: return true;
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Editorial Workflow</h2>
        <p className="text-gray-600">Manage content review and approval process</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'pending', label: 'Pending Review', count: workflowPosts.filter(p => ['draft', 'in_review'].includes(p.status)).length },
            { id: 'in_review', label: 'In Review', count: workflowPosts.filter(p => p.status === 'in_review').length },
            { id: 'completed', label: 'Completed', count: workflowPosts.filter(p => ['approved', 'published'].includes(p.status)).length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Workflow Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{post.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                    <span>•</span>
                    <Calendar className="h-4 w-4" />
                    <span>{safeFormatDate(post.updatedAt)}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                    {post.status.replace('_', ' ')}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(post.priority)}`}>
                    {post.priority} priority
                  </span>
                </div>
              </div>

              {post.deadline && (
                <div className="flex items-center gap-2 text-sm text-orange-600 mb-4">
                  <Clock className="h-4 w-4" />
                  <span>Due: {safeFormatDate(post.deadline)}</span>
                </div>
              )}

              {/* Workflow Progress */}
              <div className="space-y-3">
                {post.steps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-3">
                    {getStatusIcon(step.status)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${
                          step.status === 'completed' ? 'text-green-600' :
                          step.status === 'in_progress' ? 'text-blue-600' :
                          'text-gray-600'
                        }`}>
                          {step.name}
                        </span>
                        {step.status === 'completed' && step.completedBy && (
                          <span className="text-xs text-gray-500">{step.completedBy}</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{step.description}</p>
                    </div>
                    {index < post.steps.length - 1 && (
                      <ArrowRight className="h-3 w-3 text-gray-400" />
                    )}
                  </div>
                ))}
              </div>

              {/* Comments Preview */}
              {selectedPost === post.id && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Recent Comments
                  </h4>
                  <div className="space-y-3">
                    {post.steps
                      .filter(step => step.comments && step.comments.length > 0)
                      .flatMap(step => step.comments || [])
                      .slice(0, 3)
                      .map((comment) => (
                        <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-900">{comment.author}</span>
                            <span className="text-xs text-gray-500">{safeFormatDate(comment.createdAt)}</span>
                          </div>
                          <p className="text-sm text-gray-700">{comment.message}</p>
                        </div>
                      ))}
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                      Approve
                    </button>
                    <button className="flex-1 px-3 py-2 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 transition-colors">
                      Request Changes
                    </button>
                    <button className="flex-1 px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors">
                      Add Comment
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts in this stage</h3>
          <p className="text-gray-500">All posts in this category have been processed.</p>
        </div>
      )}
    </div>
  );
}
