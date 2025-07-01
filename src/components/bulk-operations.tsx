'use client'

import { useState } from 'react'
import { Trash2, Edit, Tag, Calendar, CheckSquare, Square } from 'lucide-react'
import { BlogPost } from '@/types/blog'
import { deletePost, updatePost } from '@/lib/api'

interface BulkOperationsProps {
  posts: BlogPost[]
  selectedPosts: string[]
  onSelectionChange: (selectedIds: string[]) => void
  onPostsUpdate: () => void
}

export function BulkOperations({ posts, selectedPosts, onSelectionChange, onPostsUpdate }: BulkOperationsProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [showBulkActions, setShowBulkActions] = useState(false)

  const selectedCount = selectedPosts.length
  const allSelected = posts.length > 0 && selectedPosts.length === posts.length

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange([])
    } else {
      onSelectionChange(posts.map(post => post._id))
    }
  }

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedCount} posts? This action cannot be undone.`)) {
      return
    }

    setIsProcessing(true)
    try {
      const deletePromises = selectedPosts.map(postId => deletePost(postId))
      await Promise.all(deletePromises)
      
      onSelectionChange([])
      onPostsUpdate()
    } catch (error) {
      console.error('Error deleting posts:', error)
      alert('Some posts could not be deleted. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBulkStatusChange = async (newStatus: 'draft' | 'published') => {
    if (!confirm(`Are you sure you want to change ${selectedCount} posts to ${newStatus}?`)) {
      return
    }

    setIsProcessing(true)
    try {
      const updatePromises = selectedPosts.map(postId => 
        updatePost(postId, { 
          status: newStatus,
          publishedAt: newStatus === 'published' ? new Date().toISOString() : undefined
        })
      )
      await Promise.all(updatePromises)
      
      onSelectionChange([])
      onPostsUpdate()
    } catch (error) {
      console.error('Error updating posts:', error)
      alert('Some posts could not be updated. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBulkTagging = async () => {
    const tags = prompt('Enter tags (comma-separated):')
    if (!tags) return

    const tagArray = tags.split(',').map(tag => tag.trim()).filter(Boolean)
    if (tagArray.length === 0) return

    setIsProcessing(true)
    try {
      const updatePromises = selectedPosts.map(postId => {
        const post = posts.find(p => p._id === postId)
        const existingTags = post?.tags || []
        const newTags = [...new Set([...existingTags, ...tagArray])]
        
        return updatePost(postId, { tags: newTags })
      })
      await Promise.all(updatePromises)
      
      onSelectionChange([])
      onPostsUpdate()
    } catch (error) {
      console.error('Error updating tags:', error)
      alert('Some posts could not be updated. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (selectedCount === 0) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <button
          onClick={handleSelectAll}
          className="inline-flex items-center space-x-1 hover:text-gray-700"
        >
          <Square className="h-4 w-4" />
          <span>Select all</span>
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
      <div className="flex items-center space-x-4">
        <button
          onClick={handleSelectAll}
          className="inline-flex items-center space-x-1 text-sm font-medium text-blue-700 hover:text-blue-800"
        >
          <CheckSquare className="h-4 w-4" />
          <span>{selectedCount} selected</span>
        </button>
        
        <button
          onClick={() => onSelectionChange([])}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Clear selection
        </button>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative">
          <button
            onClick={() => setShowBulkActions(!showBulkActions)}
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Bulk Actions'}
          </button>
          
          {showBulkActions && (
            <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <button
                onClick={() => handleBulkStatusChange('published')}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Edit className="mr-3 h-4 w-4" />
                Mark as Published
              </button>
              
              <button
                onClick={() => handleBulkStatusChange('draft')}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Edit className="mr-3 h-4 w-4" />
                Mark as Draft
              </button>
              
              <button
                onClick={handleBulkTagging}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Tag className="mr-3 h-4 w-4" />
                Add Tags
              </button>
              
              <hr className="my-1" />
              
              <button
                onClick={handleBulkDelete}
                className="flex w-full items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50"
              >
                <Trash2 className="mr-3 h-4 w-4" />
                Delete Posts
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
