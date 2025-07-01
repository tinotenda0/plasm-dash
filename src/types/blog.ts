export interface BlogPost {
  _id: string
  _type: 'post'
  _createdAt: string
  _updatedAt: string
  title: string
  slug: {
    current: string
  }
  excerpt?: string
  content?: any[]
  publishedAt?: string
  status: 'draft' | 'published' | 'scheduled'
  tags?: string[]
  category?: string
  author?: {
    name: string
    email?: string
  }
  featuredImage?: {
    asset: {
      _ref: string
    }
    alt?: string
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

export interface PlannedPost {
  id: string
  title: string
  description?: string
  plannedDate: string
  status: 'planned' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  tags?: string[]
  estimatedReadTime?: number
}

export interface CalendarEvent {
  id: string
  title: string
  date: string
  type: 'published' | 'planned' | 'draft'
  post?: BlogPost
  plannedPost?: PlannedPost
}
