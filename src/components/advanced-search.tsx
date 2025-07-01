'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, X, Calendar, Tag, User, Save } from 'lucide-react'
import { BlogPost } from '@/types/blog'
import { formatDate } from '@/lib/utils'

interface SearchFilters {
  query: string
  status: string[]
  categories: string[]
  tags: string[]
  dateRange: {
    start: string
    end: string
  }
  sortBy: 'newest' | 'oldest' | 'title' | 'updated'
  sortOrder: 'asc' | 'desc'
}

interface AdvancedSearchProps {
  posts: BlogPost[]
  onFilter: (filteredPosts: BlogPost[]) => void
  isOpen: boolean
  onClose: () => void
}

export function AdvancedSearch({ posts, onFilter, isOpen, onClose }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    status: [],
    categories: [],
    tags: [],
    dateRange: {
      start: '',
      end: ''
    },
    sortBy: 'newest',
    sortOrder: 'desc'
  })

  const [savedSearches, setSavedSearches] = useState<Array<{
    id: string
    name: string
    filters: SearchFilters
  }>>([])

  // Extract unique categories and tags from posts
  const availableCategories = [...new Set(posts.map(post => post.category).filter(Boolean))] as string[]
  const availableTags = [...new Set(posts.flatMap(post => post.tags || []))]
  const availableStatuses = ['draft', 'published', 'scheduled']

  useEffect(() => {
    // Apply filters whenever they change
    applyFilters()
  }, [filters, posts])

  useEffect(() => {
    // Load saved searches from localStorage
    const saved = localStorage.getItem('savedSearches')
    if (saved) {
      setSavedSearches(JSON.parse(saved))
    }
  }, [])

  const applyFilters = () => {
    let filteredPosts = [...posts]

    // Text search
    if (filters.query.trim()) {
      const query = filters.query.toLowerCase()
      filteredPosts = filteredPosts.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt?.toLowerCase().includes(query) ||
        post.category?.toLowerCase().includes(query) ||
        post.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Status filter
    if (filters.status.length > 0) {
      filteredPosts = filteredPosts.filter(post => filters.status.includes(post.status))
    }

    // Category filter
    if (filters.categories.length > 0) {
      filteredPosts = filteredPosts.filter(post => 
        post.category && filters.categories.includes(post.category)
      )
    }

    // Tags filter
    if (filters.tags.length > 0) {
      filteredPosts = filteredPosts.filter(post =>
        post.tags && filters.tags.some(tag => post.tags!.includes(tag))
      )
    }

    // Date range filter
    if (filters.dateRange.start || filters.dateRange.end) {
      filteredPosts = filteredPosts.filter(post => {
        const postDate = new Date(post.publishedAt || post._createdAt)
        const startDate = filters.dateRange.start ? new Date(filters.dateRange.start) : new Date('1900-01-01')
        const endDate = filters.dateRange.end ? new Date(filters.dateRange.end) : new Date('2100-01-01')
        
        return postDate >= startDate && postDate <= endDate
      })
    }

    // Sort
    filteredPosts.sort((a, b) => {
      let aValue: string | Date
      let bValue: string | Date

      switch (filters.sortBy) {
        case 'title':
          aValue = a.title
          bValue = b.title
          break
        case 'updated':
          aValue = new Date(a._updatedAt)
          bValue = new Date(b._updatedAt)
          break
        case 'oldest':
          aValue = new Date(a._createdAt)
          bValue = new Date(b._createdAt)
          break
        case 'newest':
        default:
          aValue = new Date(a._createdAt)
          bValue = new Date(b._createdAt)
          break
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return filters.sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      } else {
        const aTime = (aValue as Date).getTime()
        const bTime = (bValue as Date).getTime()
        return filters.sortOrder === 'asc' ? aTime - bTime : bTime - aTime
      }
    })

    onFilter(filteredPosts)
  }

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleArrayFilterToggle = (key: 'status' | 'categories' | 'tags', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }))
  }

  const saveSearch = () => {
    const name = prompt('Enter a name for this search:')
    if (!name) return

    const newSearch = {
      id: Date.now().toString(),
      name,
      filters: { ...filters }
    }

    const updated = [...savedSearches, newSearch]
    setSavedSearches(updated)
    localStorage.setItem('savedSearches', JSON.stringify(updated))
  }

  const loadSearch = (searchFilters: SearchFilters) => {
    setFilters(searchFilters)
  }

  const clearFilters = () => {
    setFilters({
      query: '',
      status: [],
      categories: [],
      tags: [],
      dateRange: { start: '', end: '' },
      sortBy: 'newest',
      sortOrder: 'desc'
    })
  }

  const hasActiveFilters = () => {
    return filters.query.trim() !== '' ||
           filters.status.length > 0 ||
           filters.categories.length > 0 ||
           filters.tags.length > 0 ||
           filters.dateRange.start !== '' ||
           filters.dateRange.end !== ''
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl transform overflow-hidden rounded-lg bg-white shadow-xl">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Advanced Search & Filter</h3>
              <button
                onClick={onClose}
                className="rounded-md p-2 text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Search Query */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Query
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search in titles, excerpts, categories, and tags..."
                  value={filters.query}
                  onChange={(e) => handleFilterChange('query', e.target.value)}
                  className="w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex flex-wrap gap-2">
                {availableStatuses.map(status => (
                  <button
                    key={status}
                    onClick={() => handleArrayFilterToggle('status', status)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filters.status.includes(status)
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories Filter */}
            {availableCategories.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableCategories.map(category => (
                    <button
                      key={category}
                      onClick={() => handleArrayFilterToggle('categories', category)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        filters.categories.includes(category)
                          ? 'bg-green-100 text-green-800 border border-green-300'
                          : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tags Filter */}
            {availableTags.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {availableTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleArrayFilterToggle('tags', tag)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        filters.tags.includes(tag)
                          ? 'bg-purple-100 text-purple-800 border border-purple-300'
                          : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      <Tag className="inline h-3 w-3 mr-1" />
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Date Range */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">From</label>
                  <input
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">To</label>
                  <input
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Sort Options */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Title</option>
                  <option value="updated">Last Updated</option>
                </select>
                
                <select
                  value={filters.sortOrder}
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>

            {/* Saved Searches */}
            {savedSearches.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Saved Searches
                </label>
                <div className="space-y-2">
                  {savedSearches.map(search => (
                    <button
                      key={search.id}
                      onClick={() => loadSearch(search.filters)}
                      className="w-full text-left px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900">{search.name}</div>
                      <div className="text-sm text-gray-500">
                        {search.filters.query && `"${search.filters.query}"`}
                        {search.filters.status.length > 0 && ` • ${search.filters.status.length} status filters`}
                        {search.filters.categories.length > 0 && ` • ${search.filters.categories.length} categories`}
                        {search.filters.tags.length > 0 && ` • ${search.filters.tags.length} tags`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex space-x-3">
                <button
                  onClick={clearFilters}
                  disabled={!hasActiveFilters()}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear Filters
                </button>
                
                <button
                  onClick={saveSearch}
                  disabled={!hasActiveFilters()}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Search
                </button>
              </div>
              
              <button
                onClick={onClose}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
