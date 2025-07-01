'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, Send, AlertCircle, CheckCircle2 } from 'lucide-react'
import { BlogPost } from '@/types/blog'
import { updatePost } from '@/lib/api'
import { formatDate } from '@/lib/utils'

interface ScheduledPost extends BlogPost {
  scheduledDate: string
}

export function ScheduledPublishing() {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([])
  const [loading, setLoading] = useState(true)
  const [publishingPost, setPublishingPost] = useState<string | null>(null)

  useEffect(() => {
    loadScheduledPosts()
    
    // Set up interval to check for posts to publish
    const interval = setInterval(checkForPostsToPublish, 60000) // Check every minute
    
    return () => clearInterval(interval)
  }, [])

  const loadScheduledPosts = () => {
    // In a real app, this would fetch from your CMS
    // For now, we'll use localStorage to simulate scheduled posts
    const stored = localStorage.getItem('scheduledPosts')
    if (stored) {
      const posts = JSON.parse(stored)
      setScheduledPosts(posts)
    }
    setLoading(false)
  }

  const checkForPostsToPublish = async () => {
    const now = new Date()
    const postsToPublish = scheduledPosts.filter(post => 
      post.status === 'scheduled' && new Date(post.scheduledDate) <= now
    )

    for (const post of postsToPublish) {
      try {
        await publishPost(post._id)
      } catch (error) {
        console.error('Failed to publish scheduled post:', error)
      }
    }
  }

  const publishPost = async (postId: string) => {
    setPublishingPost(postId)
    
    try {
      await updatePost(postId, {
        status: 'published',
        publishedAt: new Date().toISOString()
      })
      
      // Update local state
      setScheduledPosts(prev => 
        prev.map(post => 
          post._id === postId 
            ? { ...post, status: 'published' as const, publishedAt: new Date().toISOString() }
            : post
        )
      )
      
      // Show success notification
      showNotification(`Post "${scheduledPosts.find(p => p._id === postId)?.title}" has been published!`, 'success')
      
    } catch (error) {
      console.error('Error publishing post:', error)
      showNotification('Failed to publish post', 'error')
    } finally {
      setPublishingPost(null)
    }
  }

  const updateScheduledDate = async (postId: string, newDate: string) => {
    try {
      await updatePost(postId, {
        scheduledDate: newDate
      })
      
      setScheduledPosts(prev =>
        prev.map(post =>
          post._id === postId ? { ...post, scheduledDate: newDate } : post
        )
      )
      
      showNotification('Schedule updated successfully', 'success')
    } catch (error) {
      console.error('Error updating schedule:', error)
      showNotification('Failed to update schedule', 'error')
    }
  }

  const cancelSchedule = async (postId: string) => {
    try {
      await updatePost(postId, {
        status: 'draft',
        scheduledDate: undefined
      })
      
      setScheduledPosts(prev => prev.filter(post => post._id !== postId))
      
      showNotification('Publishing schedule cancelled', 'success')
    } catch (error) {
      console.error('Error cancelling schedule:', error)
      showNotification('Failed to cancel schedule', 'error')
    }
  }

  const showNotification = (message: string, type: 'success' | 'error') => {
    // In a real app, you'd use a proper notification system
    alert(`${type.toUpperCase()}: ${message}`)
  }

  const getTimeUntilPublish = (scheduledDate: string) => {
    const now = new Date()
    const scheduled = new Date(scheduledDate)
    const diff = scheduled.getTime() - now.getTime()
    
    if (diff <= 0) return 'Ready to publish'
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 24) {
      const days = Math.floor(hours / 24)
      return `${days} day${days !== 1 ? 's' : ''}`
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else {
      return `${minutes}m`
    }
  }

  const getStatusColor = (post: ScheduledPost) => {
    const now = new Date()
    const scheduled = new Date(post.scheduledDate)
    
    if (post.status === 'published') return 'text-green-600'
    if (scheduled <= now) return 'text-orange-600'
    return 'text-blue-600'
  }

  const getStatusIcon = (post: ScheduledPost) => {
    const now = new Date()
    const scheduled = new Date(post.scheduledDate)
    
    if (post.status === 'published') return <CheckCircle2 className="h-4 w-4" />
    if (scheduled <= now) return <AlertCircle className="h-4 w-4" />
    return <Clock className="h-4 w-4" />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Scheduled Publishing</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your scheduled posts and automated publishing
        </p>
      </div>

      {scheduledPosts.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No scheduled posts</h3>
          <p className="mt-2 text-sm text-gray-500">
            Schedule posts for automatic publishing by setting their status to "Scheduled" when creating or editing.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {scheduledPosts.map((post) => (
              <li key={post._id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <div className={`flex-shrink-0 ${getStatusColor(post)}`}>
                        {getStatusIcon(post)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {post.title}
                        </h3>
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Scheduled: {formatDate(post.scheduledDate)}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {getTimeUntilPublish(post.scheduledDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {post.status === 'scheduled' && (
                      <>
                        <input
                          type="datetime-local"
                          value={post.scheduledDate.slice(0, 16)}
                          onChange={(e) => updateScheduledDate(post._id, e.target.value)}
                          className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        />
                        
                        <button
                          onClick={() => publishPost(post._id)}
                          disabled={publishingPost === post._id}
                          className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 disabled:opacity-50"
                        >
                          <Send className="mr-1 h-3 w-3" />
                          {publishingPost === post._id ? 'Publishing...' : 'Publish Now'}
                        </button>
                        
                        <button
                          onClick={() => cancelSchedule(post._id)}
                          className="inline-flex items-center rounded-md border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    
                    {post.status === 'published' && (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Published
                      </span>
                    )}
                  </div>
                </div>
                
                {post.excerpt && (
                  <div className="mt-3 ml-6">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Automated Publishing
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Posts are automatically checked for publishing every minute. Make sure your system time is correct.
                You can also manually publish posts using the "Publish Now" button.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
