import { sanityClient } from '@/lib/sanity'
import { BlogPost, PlannedPost } from '@/types/blog'
import { CacheManager, debounce } from '@/lib/performance'

// Request deduplication map
const pendingRequests = new Map<string, Promise<any>>()

// Cache configuration
const CACHE_DURATION = {
  POSTS: 5, // 5 minutes
  POST_DETAIL: 10, // 10 minutes
  METADATA: 15, // 15 minutes
}

// Optimized query function with caching and deduplication
async function cachedQuery<T>(
  cacheKey: string,
  queryFn: () => Promise<T>,
  cacheDuration: number = CACHE_DURATION.POSTS
): Promise<T> {
  // Check cache first
  const cached = CacheManager.get<T>(cacheKey)
  if (cached) {
    return cached
  }

  // Check if request is already pending
  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey)!
  }

  // Execute query
  const promise = queryFn()
  pendingRequests.set(cacheKey, promise)

  try {
    const result = await promise
    CacheManager.set(cacheKey, result, cacheDuration)
    return result
  } finally {
    pendingRequests.delete(cacheKey)
  }
}

export const sanityQueries = {
  // Get all posts
  getAllPosts: () => `
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      _type,
      _createdAt,
      _updatedAt,
      title,
      slug,
      excerpt,
      publishedAt,
      status,
      tags,
      category,
      author,
      featuredImage {
        asset->{
          _id,
          url
        },
        alt
      },
      seo
    }
  `,

  // Get post by slug
  getPostBySlug: (slug: string) => `
    *[_type == "post" && slug.current == "${slug}"][0] {
      _id,
      _type,
      _createdAt,
      _updatedAt,
      title,
      slug,
      excerpt,
      content,
      publishedAt,
      status,
      tags,
      category,
      author,
      featuredImage {
        asset->{
          _id,
          url
        },
        alt
      },
      seo
    }
  `,

  // Get posts by date range
  getPostsByDateRange: (startDate: string, endDate: string) => `
    *[_type == "post" && publishedAt >= "${startDate}" && publishedAt <= "${endDate}"] | order(publishedAt asc) {
      _id,
      title,
      slug,
      publishedAt,
      status
    }
  `,

  // Get draft posts
  getDraftPosts: () => `
    *[_type == "post" && status == "draft"] | order(_updatedAt desc) {
      _id,
      title,
      slug,
      _updatedAt,
      excerpt,
      tags
    }
  `,

  // Optimized queries with pagination and minimal data
  getPostsPaginated: (offset: number = 0, limit: number = 10) => `
    *[_type == "post"] | order(publishedAt desc) [${offset}...${offset + limit}] {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      status,
      tags[0...3],
      category,
      featuredImage {
        asset->{url}
      }
    }
  `,

  getPostsCount: () => `count(*[_type == "post"])`,

  // Lightweight queries for metadata
  getPostsMetadata: () => `
    *[_type == "post"] {
      _id,
      title,
      slug,
      publishedAt,
      status,
      tags
    }
  `,
}

export async function fetchAllPosts(): Promise<BlogPost[]> {
  return cachedQuery(
    'all-posts',
    async () => {
      try {
        const posts = await sanityClient.fetch(sanityQueries.getAllPosts())
        return posts || []
      } catch (error) {
        console.error('Error fetching posts:', error)
        return []
      }
    },
    CACHE_DURATION.POSTS
  )
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  return cachedQuery(
    `post-${slug}`,
    async () => {
      try {
        const post = await sanityClient.fetch(sanityQueries.getPostBySlug(slug))
        return post || null
      } catch (error) {
        console.error('Error fetching post:', error)
        return null
      }
    },
    CACHE_DURATION.POST_DETAIL
  )
}

// New optimized functions
export async function fetchPostsPaginated(
  page: number = 1,
  limit: number = 10
): Promise<{ posts: BlogPost[]; total: number; hasMore: boolean }> {
  const offset = (page - 1) * limit
  
  const [posts, total] = await Promise.all([
    cachedQuery(
      `posts-page-${page}-${limit}`,
      async () => {
        try {
          return await sanityClient.fetch(sanityQueries.getPostsPaginated(offset, limit))
        } catch (error) {
          console.error('Error fetching paginated posts:', error)
          return []
        }
      },
      CACHE_DURATION.POSTS
    ),
    cachedQuery(
      'posts-count',
      async () => {
        try {
          return await sanityClient.fetch(sanityQueries.getPostsCount())
        } catch (error) {
          console.error('Error fetching posts count:', error)
          return 0
        }
      },
      CACHE_DURATION.METADATA
    )
  ])

  return {
    posts: posts || [],
    total: total || 0,
    hasMore: offset + limit < (total || 0)
  }
}

export async function fetchPostsMetadata(): Promise<Partial<BlogPost>[]> {
  return cachedQuery(
    'posts-metadata',
    async () => {
      try {
        const metadata = await sanityClient.fetch(sanityQueries.getPostsMetadata())
        return metadata || []
      } catch (error) {
        console.error('Error fetching posts metadata:', error)
        return []
      }
    },
    CACHE_DURATION.METADATA
  )
}

export async function fetchPostsByDateRange(
  startDate: string,
  endDate: string
): Promise<BlogPost[]> {
  try {
    const posts = await sanityClient.fetch(
      sanityQueries.getPostsByDateRange(startDate, endDate)
    )
    return posts || []
  } catch (error) {
    console.error('Error fetching posts by date range:', error)
    return []
  }
}

export async function createPost(postData: Partial<BlogPost>): Promise<BlogPost | null> {
  try {
    const doc = {
      _type: 'post',
      ...postData,
      _createdAt: new Date().toISOString(),
      _updatedAt: new Date().toISOString(),
    }
    const result = await sanityClient.create(doc)
    return result as unknown as BlogPost
  } catch (error) {
    console.error('Error creating post:', error)
    return null
  }
}

export async function updatePost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
  try {
    const result = await sanityClient
      .patch(id)
      .set({ ...updates, _updatedAt: new Date().toISOString() })
      .commit()
    return result as unknown as BlogPost
  } catch (error) {
    console.error('Error updating post:', error)
    return null
  }
}

export async function deletePost(id: string): Promise<boolean> {
  try {
    await sanityClient.delete(id)
    return true
  } catch (error) {
    console.error('Error deleting post:', error)
    return false
  }
}

// Local storage functions for planned posts (since they're planning-only)
export function getPlannedPosts(): PlannedPost[] {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem('plannedPosts')
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error reading planned posts:', error)
    return []
  }
}

export function savePlannedPosts(posts: PlannedPost[]): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem('plannedPosts', JSON.stringify(posts))
  } catch (error) {
    console.error('Error saving planned posts:', error)
  }
}

export function addPlannedPost(post: Omit<PlannedPost, 'id'>): PlannedPost {
  const newPost: PlannedPost = {
    ...post,
    id: crypto.randomUUID(),
  }

  const posts = getPlannedPosts()
  posts.push(newPost)
  savePlannedPosts(posts)

  return newPost
}

export function updatePlannedPost(id: string, updates: Partial<PlannedPost>): PlannedPost | null {
  const posts = getPlannedPosts()
  const index = posts.findIndex(post => post.id === id)

  if (index === -1) return null

  posts[index] = { ...posts[index], ...updates }
  savePlannedPosts(posts)

  return posts[index]
}

export function deletePlannedPost(id: string): boolean {
  const posts = getPlannedPosts()
  const filteredPosts = posts.filter(post => post.id !== id)

  if (filteredPosts.length === posts.length) return false

  savePlannedPosts(filteredPosts)
  return true
}
