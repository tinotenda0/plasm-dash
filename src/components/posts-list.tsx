'use client'

import { useState, useEffect } from 'react'
import { Edit, Trash2, ExternalLink, Clock, Calendar, Tag, Square, CheckSquare } from 'lucide-react'
import { fetchAllPosts, deletePost } from '@/lib/api'
import { BlogPost } from '@/types/blog'
import { formatDate, truncateText } from '@/lib/utils'
import { EnhancedPostEditor } from './enhanced-post-editor'
import { BulkOperations } from './bulk-operations'

export function PostsList({ posts: initialPosts = [], onPostsUpdate }: { 
  posts?: BlogPost[], 
  onPostsUpdate?: () => void 
}) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [selectedPosts, setSelectedPosts] = useState<string[]>([])

  // Update posts when props change
  useEffect(() => {
    setPosts(initialPosts)
  }, [initialPosts])

  useEffect(() => {
    if (initialPosts.length === 0) {
      loadPosts()
    }
  }, [])

  const loadPosts = async () => {
    try {
      setLoading(true)
      const fetchedPosts = await fetchAllPosts()
      setPosts(fetchedPosts)
      setError(null)
      onPostsUpdate?.()
    } catch (err) {
      setError('Failed to load posts. Please check your Sanity configuration.')
      console.error('Error loading posts:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post)
    setIsEditorOpen(true)
  }

  const handleCloseEditor = () => {
    setEditingPost(null)
    setIsEditorOpen(false)
    // Refresh posts after editing
    loadPosts()
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return
    }

    try {
      const success = await deletePost(postId)
      if (success) {
        setPosts(posts.filter(post => post._id !== postId))
        setSelectedPosts(selectedPosts.filter(id => id !== postId))
      } else {
        alert('Failed to delete post')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Failed to delete post')
    }
  }

  const handlePostSelection = (postId: string) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error Loading Posts
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
                <p className="mt-2">
                  Make sure you have:
                </p>
                <ul className="mt-1 list-disc list-inside">
                  <li>Created a <code>.env.local</code> file with your Sanity configuration</li>
                  <li>Set up your Sanity project with the correct schema</li>
                  <li>Verified your API credentials</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto max-w-md">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No posts found</h3>
          <p className="mt-2 text-sm text-gray-500">
            Get started by creating your first blog post.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Bulk Operations */}
      {posts.length > 0 && (
        <div className="mb-6">
          <BulkOperations
            posts={posts}
            selectedPosts={selectedPosts}
            onSelectionChange={setSelectedPosts}
            onPostsUpdate={loadPosts}
          />
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <div
            key={post._id}
            className={`relative overflow-hidden rounded-lg border bg-white shadow-sm hover:shadow-md transition-shadow ${
              selectedPosts.includes(post._id) ? 'border-blue-300 ring-2 ring-blue-100' : 'border-gray-200'
            }`}
          >
            {/* Selection Checkbox */}
            <div className="absolute top-3 left-3 z-10">
              <button
                onClick={() => handlePostSelection(post._id)}
                className="rounded-md bg-white p-1 shadow-sm hover:bg-gray-50"
              >
                {selectedPosts.includes(post._id) ? (
                  <CheckSquare className="h-4 w-4 text-blue-600" />
                ) : (
                  <Square className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>

            <div className="p-4 pt-12">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                      {truncateText(post.excerpt, 120)}
                    </p>
                  )}
                </div>
                
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(post.status)}`}>
                  {post.status}
                </span>
              </div>
              
              <div className="mt-4 flex items-center text-xs text-gray-500 space-x-4">
                {post.publishedAt && (
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    {formatDate(post.publishedAt)}
                  </div>
                )}
                
                <div className="flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  {formatDate(post._updatedAt, 'relative')}
                </div>
              </div>
              
              {post.tags && post.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
                    >
                      <Tag className="mr-1 h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{post.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3">
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleEditPost(post)}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Edit className="mr-1 h-3 w-3" />
                  Edit
                </button>
                
                {post.status === 'published' && post.slug && (
                  <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    <ExternalLink className="mr-1 h-3 w-3" />
                    View
                  </button>
                )}
              </div>
              
              <button
                onClick={() => handleDeletePost(post._id)}
                className="inline-flex items-center rounded-md border border-red-300 bg-white px-2.5 py-1.5 text-xs font-medium text-red-700 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <Trash2 className="mr-1 h-3 w-3" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <EnhancedPostEditor
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
        post={editingPost}
        mode="edit"
      />
    </div>
  )
}
