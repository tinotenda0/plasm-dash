'use client'

import { AnalyticsDashboard } from '@/components/analytics-dashboard'

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your blog performance and engagement
          </p>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-6">
        <AnalyticsDashboard />
      </div>
    </div>
  )
}
