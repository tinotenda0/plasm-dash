'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, FileText, Search } from 'lucide-react'
import { ContentTemplate } from '@/types/blog'
import { cn } from '@/lib/utils'

// Default templates
const defaultTemplates: ContentTemplate[] = [
  {
    id: '1',
    name: 'Tech Tutorial',
    description: 'Step-by-step tutorial template for technical content',
    category: 'tutorial',
    content: `# [Tutorial Title]

## Overview
Brief description of what readers will learn.

## Prerequisites
- Requirement 1
- Requirement 2

## Step 1: [First Step]
Detailed explanation...

## Step 2: [Second Step]
Detailed explanation...

## Conclusion
Summary and next steps.

## Resources
- [Link 1](url)
- [Link 2](url)`,
    fields: [
      { id: 'title', name: 'Tutorial Title', type: 'text', required: true },
      { id: 'difficulty', name: 'Difficulty Level', type: 'select', options: ['Beginner', 'Intermediate', 'Advanced'], required: true },
      { id: 'duration', name: 'Estimated Duration', type: 'text', placeholder: 'e.g., 30 minutes' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Product Review',
    description: 'Comprehensive product review template',
    category: 'review',
    content: `# [Product Name] Review

## Rating: ⭐⭐⭐⭐⭐ (X/5)

## Overview
Brief introduction to the product.

## Pros
- Pro 1
- Pro 2
- Pro 3

## Cons
- Con 1
- Con 2

## Features
### Feature 1
Description...

### Feature 2
Description...

## Price & Value
Discussion of pricing and value proposition.

## Final Verdict
Overall recommendation and who this product is best for.`,
    fields: [
      { id: 'product', name: 'Product Name', type: 'text', required: true },
      { id: 'rating', name: 'Rating (1-5)', type: 'number', required: true },
      { id: 'price', name: 'Price', type: 'text', placeholder: 'e.g., $99' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'News Article',
    description: 'Breaking news or announcement template',
    category: 'news',
    content: `# [News Headline]

**[Location, Date]** - Lead paragraph with the most important information.

## Key Details
- Important point 1
- Important point 2
- Important point 3

## Background
Context and background information.

## Impact
What this means for readers/industry.

## What's Next
Future developments to watch.`,
    fields: [
      { id: 'headline', name: 'Headline', type: 'text', required: true },
      { id: 'location', name: 'Location', type: 'text' },
      { id: 'urgency', name: 'Urgency Level', type: 'select', options: ['Low', 'Medium', 'High', 'Breaking'] }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

interface TemplateManagerProps {
  onSelectTemplate: (template: ContentTemplate) => void
  isOpen: boolean
  onClose: () => void
}

export function TemplateManager({ onSelectTemplate, isOpen, onClose }: TemplateManagerProps) {
  const [templates, setTemplates] = useState<ContentTemplate[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    // Load templates from localStorage or use defaults
    const stored = localStorage.getItem('contentTemplates')
    if (stored) {
      setTemplates(JSON.parse(stored))
    } else {
      setTemplates(defaultTemplates)
      localStorage.setItem('contentTemplates', JSON.stringify(defaultTemplates))
    }
  }, [])

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const categories = ['all', 'tutorial', 'review', 'news', 'personal', 'technical', 'other']

  const handleSelectTemplate = (template: ContentTemplate) => {
    onSelectTemplate(template)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl transform overflow-hidden rounded-lg bg-white shadow-xl">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Content Templates</h3>
              <button
                onClick={onClose}
                className="rounded-md p-2 text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            </div>
            
            {/* Search and Filters */}
            <div className="mt-4 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="max-h-96 overflow-y-auto p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="cursor-pointer rounded-lg border border-gray-200 p-4 transition-all hover:border-blue-300 hover:shadow-md"
                  onClick={() => handleSelectTemplate(template)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <h4 className="font-medium text-gray-900">{template.name}</h4>
                      </div>
                      
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {template.description}
                      </p>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <span className={cn(
                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                          template.category === 'tutorial' && 'bg-blue-100 text-blue-800',
                          template.category === 'review' && 'bg-green-100 text-green-800',
                          template.category === 'news' && 'bg-red-100 text-red-800',
                          template.category === 'personal' && 'bg-purple-100 text-purple-800',
                          template.category === 'technical' && 'bg-gray-100 text-gray-800',
                          template.category === 'other' && 'bg-yellow-100 text-yellow-800'
                        )}>
                          {template.category}
                        </span>
                        
                        <span className="text-xs text-gray-500">
                          {template.fields.length} fields
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredTemplates.length === 0 && (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No templates found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or category filter.
                </p>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <div className="flex justify-between">
              <button
                onClick={onClose}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              
              <p className="text-sm text-gray-500">
                Select a template to use as a starting point
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
