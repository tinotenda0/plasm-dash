'use client'

import { useState, useEffect } from 'react'
import { PostsList } from '@/components/posts-list'
import { PostsHeader } from '@/components/posts-header'
import { BlogPost } from '@/types/blog'
import { fetchAllPosts } from '@/lib/api'

export default function PostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      setLoading(true)
      const fetchedPosts = await fetchAllPosts()
      setPosts(fetchedPosts)
      setFilteredPosts(fetchedPosts)
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = (filtered: BlogPost[]) => {
    setFilteredPosts(filtered)
  }

  return (
    <div className="flex flex-col h-full">
      <PostsHeader posts={posts} onFilter={handleFilter} />
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <PostsList posts={filteredPosts} onPostsUpdate={loadPosts} />
        )}
      </div>
    </div>
  )
}
