'use client'

import { useState } from 'react'
import { Plus, Search, Filter } from 'lucide-react'
import { NewPostModal } from './new-post-modal'
import { EnhancedPostEditor } from './enhanced-post-editor'
import { AdvancedSearch } from './advanced-search'
import { BlogPost } from '@/types/blog'

interface PostsHeaderProps {
  posts?: BlogPost[]
  onFilter?: (filteredPosts: BlogPost[]) => void
}

export function PostsHeader({ posts = [], onFilter }: PostsHeaderProps) {
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)

  return (
    <>
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Posts</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your blog posts and content
            </p>
          </div>
          
          <button
            onClick={() => setIsNewPostModalOpen(true)}
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </button>
        </div>
        
        <div className="mt-4 flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Quick search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <button 
            onClick={() => setShowAdvancedSearch(true)}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Filter className="mr-2 h-4 w-4" />
            Advanced Filter
          </button>
        </div>
      </div>
      
      <EnhancedPostEditor 
        isOpen={isNewPostModalOpen}
        onClose={() => setIsNewPostModalOpen(false)}
        mode="create"
      />

      <AdvancedSearch
        posts={posts}
        onFilter={onFilter || (() => {})}
        isOpen={showAdvancedSearch}
        onClose={() => setShowAdvancedSearch(false)}
      />
    </>
  )
}
