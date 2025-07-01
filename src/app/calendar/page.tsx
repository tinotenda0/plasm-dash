import { CalendarView } from '@/components/calendar-view'
import { CalendarHeader } from '@/components/calendar-header'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Plus, Download } from 'lucide-react'

export default function CalendarPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Calendar"
        description="View your posts by publication date"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Calendar' }
        ]}
        actions={
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Post
            </Button>
          </div>
        }
      />
      <div className="flex-1 overflow-hidden">
        <CalendarHeader />
        <div className="flex-1 overflow-auto">
          <CalendarView />
        </div>
      </div>
    </div>
  )
}
