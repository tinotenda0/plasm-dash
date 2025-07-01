'use client'

import { useState } from 'react'
import { BarChart, Calendar, Clock, Eye, Users, TrendingUp, Share2 } from 'lucide-react'
import { RealTimeAnalytics } from './real-time-analytics'
import { ContentInsights } from './content-insights'
import { LazyLoad } from './lazy-load'

export function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'insights' | 'performance'>('overview')

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart },
    { id: 'insights', label: 'Insights', icon: TrendingUp },
    { id: 'performance', label: 'Performance', icon: Users }
  ]

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {activeTab === 'overview' && (
          <LazyLoad>
            <RealTimeAnalytics />
          </LazyLoad>
        )}
        
        {activeTab === 'insights' && (
          <LazyLoad>
            <ContentInsights />
          </LazyLoad>
        )}
        
        {activeTab === 'performance' && (
          <LazyLoad>
            <div className="space-y-6">
              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Content Velocity</h3>
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-gray-900">12</p>
                    <p className="text-sm text-gray-600">Posts this month</p>
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <TrendingUp className="h-3 w-3" />
                      <span>+20% from last month</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Quality Score</h3>
                    <Eye className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-gray-900">8.4/10</p>
                    <p className="text-sm text-gray-600">Based on engagement</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '84%' }} />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Consistency</h3>
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-gray-900">3.2</p>
                    <p className="text-sm text-gray-600">Posts per week</p>
                    <div className="flex items-center gap-1 text-sm text-orange-600">
                      <span>Target: 4 posts/week</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Categories Performance */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Content Categories Performance</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {[
                      { category: 'Tutorials', posts: 8, avgViews: 1250, engagement: 18.5 },
                      { category: 'Reviews', posts: 3, avgViews: 890, engagement: 12.3 },
                      { category: 'News', posts: 2, avgViews: 2100, engagement: 8.7 },
                      { category: 'Guides', posts: 5, avgViews: 1680, engagement: 22.1 }
                    ].map((item) => (
                      <div key={item.category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{item.category}</h4>
                          <p className="text-sm text-gray-600">{item.posts} posts</p>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="text-center">
                            <p className="font-semibold text-gray-900">{item.avgViews}</p>
                            <p className="text-gray-600">Avg Views</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold text-gray-900">{item.engagement}%</p>
                            <p className="text-gray-600">Engagement</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </LazyLoad>
        )}
      </div>
    </div>
  )
}
