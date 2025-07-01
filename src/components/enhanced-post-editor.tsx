'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { X, Save, Eye, Upload, FileText } from 'lucide-react'
import { createPost, updatePost } from '@/lib/api'
import { generateSlug } from '@/lib/utils'
import { BlogPost } from '@/types/blog'
import { RichTextEditor } from './rich-text-editor'
import { TemplateManager } from './template-manager'
import { ContentTemplate } from '@/types/blog'

interface EnhancedPostEditorProps {
  isOpen: boolean
  onClose: () => void
  post?: BlogPost | null
  mode?: 'create' | 'edit'
}

export function EnhancedPostEditor({ isOpen, onClose, post, mode = 'create' }: EnhancedPostEditorProps) {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled'>('draft')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState('')
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content')
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [showTemplates, setShowTemplates] = useState(false)

  // Initialize form with post data when editing
  useEffect(() => {
    if (mode === 'edit' && post) {
      setTitle(post.title || '')
      setSlug(post.slug?.current || '')
      setExcerpt(post.excerpt || '')
      setContent(post.content ? JSON.stringify(post.content) : '')
      setStatus(post.status || 'draft')
      setCategory(post.category || '')
      setTags(post.tags ? post.tags.join(', ') : '')
      setMetaTitle(post.seo?.metaTitle || '')
      setMetaDescription(post.seo?.metaDescription || '')
    } else {
      // Reset form for create mode
      setTitle('')
      setSlug('')
      setExcerpt('')
      setContent('')
      setStatus('draft')
      setCategory('')
      setTags('')
      setMetaTitle('')
      setMetaDescription('')
    }
  }, [mode, post, isOpen])

  // Auto-generate slug from title
  useEffect(() => {
    if (title && mode === 'create') {
      setSlug(generateSlug(title))
    }
  }, [title, mode])

  // Auto-save functionality
  useEffect(() => {
    if (!autoSaveEnabled || mode !== 'edit' || !post) return

    const autoSaveInterval = setInterval(async () => {
      if (title.trim()) {
        await handleSave(true)
      }
    }, 30000) // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval)
  }, [title, content, excerpt, autoSaveEnabled, mode, post])

  const handleTemplateSelect = (template: ContentTemplate) => {
    setContent(template.content)
    setCategory(template.category)
    
    // Fill in template fields if they match form fields
    template.fields.forEach(field => {
      switch (field.id) {
        case 'title':
          if (!title) setTitle(field.placeholder || '')
          break
        case 'category':
          setCategory(field.options?.[0] || template.category)
          break
      }
    })
  }

  const handleSave = async (isAutoSave = false) => {
    if (!title.trim()) return

    setIsSubmitting(true)
    
    try {
      const postData: Partial<BlogPost> = {
        title: title.trim(),
        slug: { current: slug || generateSlug(title) },
        excerpt: excerpt.trim() || undefined,
        content: content ? JSON.parse(content) : undefined,
        status,
        category: category.trim() || undefined,
        tags: tags.trim() ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : undefined,
        publishedAt: status === 'published' ? new Date().toISOString() : undefined,
        seo: {
          metaTitle: metaTitle.trim() || undefined,
          metaDescription: metaDescription.trim() || undefined,
        }
      }

      if (mode === 'edit' && post) {
        await updatePost(post._id, postData)
      } else {
        await createPost(postData)
      }
      
      setLastSaved(new Date())
      
      if (!isAutoSave) {
        // Reset form only on manual save
        setTitle('')
        setSlug('')
        setExcerpt('')
        setContent('')
        setStatus('draft')
        setCategory('')
        setTags('')
        setMetaTitle('')
        setMetaDescription('')
        
        onClose()
        
        // Refresh the page to show changes
        window.location.reload()
      }
    } catch (error) {
      console.error('Error saving post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleSave()
  }

  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length
  const readingTime = Math.ceil(wordCount / 200) // Assuming 200 words per minute

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="relative w-full max-w-4xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <DialogTitle as="h3" className="text-lg font-semibold text-gray-900">
                  {mode === 'edit' ? 'Edit Post' : 'Create New Post'}
                </DialogTitle>
                <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                  <span>{wordCount} words</span>
                  <span>{readingTime} min read</span>
                  {lastSaved && (
                    <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowTemplates(true)}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Use Template
                </button>
                
                <label className="flex items-center text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={autoSaveEnabled}
                    onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                    className="mr-2"
                  />
                  Auto-save
                </label>
                
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md bg-white p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('content')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'content'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Content
                </button>
                <button
                  onClick={() => setActiveTab('seo')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'seo'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  SEO & Meta
                </button>
              </nav>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                {activeTab === 'content' && (
                  <div className="space-y-6">
                    {/* Title */}
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        placeholder="Enter an engaging title..."
                      />
                    </div>

                    {/* Slug */}
                    <div>
                      <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                        URL Slug
                      </label>
                      <input
                        type="text"
                        name="slug"
                        id="slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        placeholder="url-friendly-slug"
                      />
                    </div>

                    {/* Excerpt */}
                    <div>
                      <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
                        Excerpt
                      </label>
                      <textarea
                        name="excerpt"
                        id="excerpt"
                        rows={3}
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        placeholder="Brief description that will appear in previews..."
                      />
                    </div>

                    {/* Rich Text Content */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content
                      </label>
                      <RichTextEditor
                        content={content}
                        onChange={setContent}
                        placeholder="Start writing your post..."
                        className="min-h-[400px]"
                      />
                    </div>

                    {/* Metadata */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <select
                          name="status"
                          id="status"
                          value={status}
                          onChange={(e) => setStatus(e.target.value as 'draft' | 'published' | 'scheduled')}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                          <option value="scheduled">Scheduled</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                          Category
                        </label>
                        <input
                          type="text"
                          name="category"
                          id="category"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                          placeholder="e.g., Technology"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                          Tags
                        </label>
                        <input
                          type="text"
                          name="tags"
                          id="tags"
                          value={tags}
                          onChange={(e) => setTags(e.target.value)}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                          placeholder="comma, separated, tags"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'seo' && (
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700">
                        Meta Title
                      </label>
                      <input
                        type="text"
                        name="metaTitle"
                        id="metaTitle"
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                        maxLength={60}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        placeholder="SEO optimized title (60 chars max)"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        {metaTitle.length}/60 characters
                      </p>
                    </div>

                    <div>
                      <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700">
                        Meta Description
                      </label>
                      <textarea
                        name="metaDescription"
                        id="metaDescription"
                        rows={3}
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        maxLength={160}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        placeholder="Description for search engines (160 chars max)"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        {metaDescription.length}/160 characters
                      </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-md">
                      <h4 className="text-sm font-medium text-blue-900 mb-2">SEO Preview</h4>
                      <div className="text-sm">
                        <div className="text-blue-600 underline">
                          {metaTitle || title || 'Your Post Title'}
                        </div>
                        <div className="text-green-600 text-xs mt-1">
                          yoursite.com/{slug || 'post-slug'}
                        </div>
                        <div className="text-gray-600 mt-1">
                          {metaDescription || excerpt || 'Your post description will appear here...'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 bg-gray-50">
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={isSubmitting || !title.trim()}
                    className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update Post' : 'Create Post'}
                  </button>
                </div>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
      
      <TemplateManager
        isOpen={showTemplates}
        onClose={() => setShowTemplates(false)}
        onSelectTemplate={handleTemplateSelect}
      />
    </Dialog>
  )
}
