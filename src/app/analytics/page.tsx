'use client'

import { AnalyticsDashboard } from '@/components/analytics-dashboard'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Download, Settings, RefreshCw } from 'lucide-react'

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Analytics"
        description="Track your blog performance and engagement metrics"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Analytics' }
        ]}
        actions={
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </div>
        }
      />
      
      <div className="flex-1 overflow-auto p-6">
        <AnalyticsDashboard />
      </div>
    </div>
  )
}
