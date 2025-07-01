'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BlogPost } from '@/types/blog';
import { fetchPostsPaginated } from '@/lib/api';
import { LazyLoad } from './lazy-load';
import { OptimizedImage } from './optimized-image';
import { usePerformanceMonitor, debounce } from '@/lib/performance';
import { Edit, Trash2, ExternalLink, Clock, Calendar, Tag, Square, CheckSquare } from 'lucide-react';
import { formatDate, truncateText } from '@/lib/utils';

interface OptimizedPostsListProps {
  initialPosts?: BlogPost[];
  onPostsUpdate?: () => void;
  pageSize?: number;
  enableVirtualization?: boolean;
}

export function OptimizedPostsList({
  initialPosts = [],
  onPostsUpdate,
  pageSize = 10,
  enableVirtualization = true,
}: OptimizedPostsListProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPosts, setTotalPosts] = useState(0);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  
  const { startMeasure, endMeasure } = usePerformanceMonitor();

  // Debounced load function to prevent excessive API calls
  const debouncedLoadPosts = useCallback(
    debounce(async (page: number) => {
      try {
        startMeasure('load-posts');
        setLoading(true);
        
        const result = await fetchPostsPaginated(page, pageSize);
        
        if (page === 1) {
          setPosts(result.posts);
        } else {
          setPosts(prev => [...prev, ...result.posts]);
        }
        
        setHasMore(result.hasMore);
        setTotalPosts(result.total);
        setError(null);
        onPostsUpdate?.();
        
        endMeasure('load-posts');
      } catch (err) {
        setError('Failed to load posts. Please check your Sanity configuration.');
        console.error('Error loading posts:', err);
      } finally {
        setLoading(false);
      }
    }, 300),
    [pageSize, onPostsUpdate, startMeasure, endMeasure]
  );

  useEffect(() => {
    if (initialPosts.length === 0) {
      debouncedLoadPosts(1);
    }
  }, [initialPosts.length, debouncedLoadPosts]);

  const loadMorePosts = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      debouncedLoadPosts(nextPage);
    }
  }, [loading, hasMore, currentPage, debouncedLoadPosts]);

  // Memoized post items to prevent unnecessary re-renders
  const postItems = useMemo(() => {
    return posts.map((post) => (
      <PostItem
        key={post._id}
        post={post}
        isSelected={selectedPosts.includes(post._id)}
        onSelect={(selected) => {
          setSelectedPosts(prev =>
            selected
              ? [...prev, post._id]
              : prev.filter(id => id !== post._id)
          );
        }}
      />
    ));
  }, [posts, selectedPosts]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => debouncedLoadPosts(1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk operations */}
      {selectedPosts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            {selectedPosts.length} post{selectedPosts.length !== 1 ? 's' : ''} selected
          </p>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => setSelectedPosts([])}
              className="text-sm px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Clear selection
            </button>
          </div>
        </div>
      )}

      {/* Posts grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {postItems}
      </div>

      {/* Load more button */}
      {hasMore && (
        <LazyLoad
          fallback={<div className="h-12 animate-pulse bg-gray-200 rounded" />}
          threshold={0.3}
        >
          <div className="text-center pt-8">
            <button
              onClick={loadMorePosts}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Load More Posts'}
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Showing {posts.length} of {totalPosts} posts
            </p>
          </div>
        </LazyLoad>
      )}

      {loading && posts.length === 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: pageSize }).map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      )}
    </div>
  );
}

// Memoized post item component
const PostItem = React.memo(({
  post,
  isSelected,
  onSelect,
}: {
  post: BlogPost;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
}) => {
  return (
    <LazyLoad
      fallback={<PostSkeleton />}
      threshold={0.1}
    >
      <article className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
        {/* Selection checkbox */}
        <div className="p-4 pb-0">
          <button
            onClick={() => onSelect(!isSelected)}
            className="flex items-center text-gray-400 hover:text-gray-600"
          >
            {isSelected ? (
              <CheckSquare className="h-4 w-4" />
            ) : (
              <Square className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Featured image */}
        {post.featuredImage?.asset && (
          <div className="px-4 pb-4">
            <OptimizedImage
              src={
                'url' in post.featuredImage.asset
                  ? (post.featuredImage.asset as any).url
                  : post.featuredImage.asset._ref
              }
              alt={post.featuredImage.alt || post.title}
              width={400}
              height={200}
              className="w-full h-48 rounded-lg object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        )}

        <div className="p-4 pt-0">
          {/* Status indicator */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                post.status === 'published'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {post.status}
            </span>
            {post.publishedAt && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(post.publishedAt)}
              </span>
            )}
          </div>

          {/* Title and excerpt */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-3">
              {truncateText(post.excerpt, 120)}
            </p>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {post.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                >
                  <Tag className="h-3 w-3" />
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

          {/* Actions */}
          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              {formatDate(post._updatedAt)}
            </div>
            <div className="flex gap-2">
              <button className="p-1 text-gray-400 hover:text-blue-600">
                <Edit className="h-4 w-4" />
              </button>
              <button className="p-1 text-gray-400 hover:text-green-600">
                <ExternalLink className="h-4 w-4" />
              </button>
              <button className="p-1 text-gray-400 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </article>
    </LazyLoad>
  );
});

// Skeleton loading component
function PostSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="animate-pulse">
        <div className="h-4 w-4 bg-gray-200 rounded mb-4"></div>
        <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="flex gap-2 mb-4">
          <div className="h-6 w-12 bg-gray-200 rounded"></div>
          <div className="h-6 w-16 bg-gray-200 rounded"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
          <div className="flex gap-2">
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

PostItem.displayName = 'PostItem';
