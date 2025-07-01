import { sanityClient } from '@/lib/sanity'
import { BlogPost, PlannedPost } from '@/types/blog'

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
  `
}

export async function fetchAllPosts(): Promise<BlogPost[]> {
  try {
    const posts = await sanityClient.fetch(sanityQueries.getAllPosts())
    return posts || []
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const post = await sanityClient.fetch(sanityQueries.getPostBySlug(slug))
    return post || null
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

export async function fetchPostsByDateRange(startDate: string, endDate: string): Promise<BlogPost[]> {
  try {
    const posts = await sanityClient.fetch(sanityQueries.getPostsByDateRange(startDate, endDate))
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
