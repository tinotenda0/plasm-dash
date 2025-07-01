'use client'

import { useState, useEffect, Suspense } from 'react'
import { PostsList } from '@/components/posts-list'
import { OptimizedPostsList } from '@/components/optimized-posts-list'
import { PostsHeader } from '@/components/posts-header'
import { PageHeader } from '@/components/page-header'
import { LazyLoad } from '@/components/lazy-load'
import { DemoModeBanner } from '@/components/demo-mode-banner'
import { BlogPost } from '@/types/blog'
import { fetchPostsMetadata } from '@/lib/api'
import { usePerformanceMonitor } from '@/lib/performance'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function PostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [useOptimizedView, setUseOptimizedView] = useState(true)
  
  const { startMeasure, endMeasure } = usePerformanceMonitor()

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      setLoading(true)
      startMeasure('page-load')
      
      // Load lightweight metadata first for faster initial render
      const fetchedPosts = await fetchPostsMetadata()
      setPosts(fetchedPosts as BlogPost[])
      setFilteredPosts(fetchedPosts as BlogPost[])
      
      endMeasure('page-load')
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
      <PageHeader
        title="Posts"
        description="Manage your blog posts and content"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Posts' }
        ]}
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        }
      />
      
      <div className="flex-1 overflow-hidden">
        <PostsHeader posts={posts} onFilter={handleFilter} />
        
        <div className="flex-1 overflow-auto px-6">
          <DemoModeBanner />
          
          {/* Performance toggle for development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-yellow-800">Performance Mode</h3>
                  <p className="text-sm text-yellow-700">
                    Toggle between optimized and standard post loading
                  </p>
                </div>
                <button
                  onClick={() => setUseOptimizedView(!useOptimizedView)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    useOptimizedView
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {useOptimizedView ? 'Optimized' : 'Standard'}
                </button>
              </div>
            </div>
          )}
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <Suspense
              fallback={
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              }
            >
              {useOptimizedView ? (
                <LazyLoad threshold={0.1}>
                  <OptimizedPostsList
                    initialPosts={filteredPosts}
                    onPostsUpdate={loadPosts}
                    pageSize={12}
                    enableVirtualization={true}
                  />
                </LazyLoad>
              ) : (
                <PostsList 
                  posts={filteredPosts}
                  onPostsUpdate={loadPosts}
                />
              )}
            </Suspense>
          )}
        </div>
      </div>
    </div>
  )
}
