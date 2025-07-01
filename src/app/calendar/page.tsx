import { CalendarView } from '@/components/calendar-view'
import { CalendarHeader } from '@/components/calendar-header'

export default function CalendarPage() {
  return (
    <div className="flex flex-col h-full">
      <CalendarHeader />
      <div className="flex-1 overflow-auto">
        <CalendarView />
      </div>
    </div>
  )
}
