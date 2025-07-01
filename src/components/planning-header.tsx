'use client'

import { useState } from 'react'
import { Plus, Target } from 'lucide-react'
import { NewPlannedPostModal } from './new-planned-post-modal'

export function PlanningHeader() {
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false)

  return (
    <>
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Content Planning</h1>
            <p className="mt-1 text-sm text-gray-500">
              Plan and organize your upcoming blog posts
            </p>
          </div>
          
          <button
            onClick={() => setIsNewPostModalOpen(true)}
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="mr-2 h-4 w-4" />
            Plan New Post
          </button>
        </div>
        
        <div className="mt-4 flex items-center space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
            <span className="text-gray-600">Planned</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-gray-600">In Progress</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Completed</span>
          </div>
        </div>
      </div>
      
      <NewPlannedPostModal 
        isOpen={isNewPostModalOpen}
        onClose={() => setIsNewPostModalOpen(false)}
      />
    </>
  )
}
