'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, Edit, Trash2, CheckCircle, Flag } from 'lucide-react'
import { getPlannedPosts, updatePlannedPost, deletePlannedPost } from '@/lib/api'
import { PlannedPost } from '@/types/blog'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

export function PlanningBoard() {
  const [plannedPosts, setPlannedPosts] = useState<PlannedPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPlannedPosts()
  }, [])

  const loadPlannedPosts = () => {
    try {
      const posts = getPlannedPosts()
      setPlannedPosts(posts)
    } catch (error) {
      console.error('Error loading planned posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = (postId: string, newStatus: PlannedPost['status']) => {
    const updatedPost = updatePlannedPost(postId, { status: newStatus })
    if (updatedPost) {
      setPlannedPosts(posts => 
        posts.map(post => post.id === postId ? updatedPost : post)
      )
    }
  }

  const handleDeletePost = (postId: string) => {
    if (!confirm('Are you sure you want to delete this planned post?')) {
      return
    }

    const success = deletePlannedPost(postId)
    if (success) {
      setPlannedPosts(posts => posts.filter(post => post.id !== postId))
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'low':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-200 bg-green-50'
      case 'in-progress':
        return 'border-yellow-200 bg-yellow-50'
      case 'planned':
        return 'border-gray-200 bg-white'
      default:
        return 'border-gray-200 bg-white'
    }
  }

  const groupedPosts = {
    planned: plannedPosts.filter(post => post.status === 'planned'),
    'in-progress': plannedPosts.filter(post => post.status === 'in-progress'),
    completed: plannedPosts.filter(post => post.status === 'completed'),
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (plannedPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto max-w-md">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No planned posts</h3>
          <p className="mt-2 text-sm text-gray-500">
            Start planning your content by creating your first planned post.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Object.entries(groupedPosts).map(([status, posts]) => (
          <div key={status} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 capitalize">
                {status.replace('-', ' ')} ({posts.length})
              </h3>
              <div className={cn(
                'w-3 h-3 rounded-full',
                status === 'completed' ? 'bg-green-500' :
                status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-400'
              )} />
            </div>
            
            <div className="space-y-3">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className={cn(
                    'rounded-lg border p-4 transition-all hover:shadow-md',
                    getStatusColor(post.status)
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 line-clamp-2">
                        {post.title}
                      </h4>
                      
                      {post.description && (
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                          {post.description}
                        </p>
                      )}
                      
                      <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {formatDate(post.plannedDate)}
                        </div>
                        
                        {post.estimatedReadTime && (
                          <div className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {post.estimatedReadTime}min read
                          </div>
                        )}
                      </div>
                      
                      {post.tags && post.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
                            >
                              {tag}
                            </span>
                          ))}
                          {post.tags.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{post.tags.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4 flex flex-col items-end space-y-2">
                      <span className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                        getPriorityColor(post.priority)
                      )}>
                        <Flag className="mr-1 h-3 w-3" />
                        {post.priority}
                      </span>
                      
                      <div className="flex space-x-1">
                        {post.status === 'planned' && (
                          <button
                            onClick={() => handleStatusChange(post.id, 'in-progress')}
                            className="rounded-md bg-yellow-100 p-1.5 text-yellow-600 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                            title="Start working"
                          >
                            <Edit className="h-3 w-3" />
                          </button>
                        )}
                        
                        {post.status === 'in-progress' && (
                          <button
                            onClick={() => handleStatusChange(post.id, 'completed')}
                            className="rounded-md bg-green-100 p-1.5 text-green-600 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            title="Mark as completed"
                          >
                            <CheckCircle className="h-3 w-3" />
                          </button>
                        )}
                        
                        {post.status === 'completed' && (
                          <button
                            onClick={() => handleStatusChange(post.id, 'in-progress')}
                            className="rounded-md bg-yellow-100 p-1.5 text-yellow-600 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                            title="Move back to in-progress"
                          >
                            <Edit className="h-3 w-3" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="rounded-md bg-red-100 p-1.5 text-red-600 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          title="Delete"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {posts.length === 0 && (
                <div className="text-center py-6 text-gray-500 text-sm">
                  No {status.replace('-', ' ')} posts
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
