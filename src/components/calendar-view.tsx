'use client'

import { useState, useEffect } from 'react'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay,
  isToday,
  parseISO
} from 'date-fns'
import { fetchPostsByDateRange } from '@/lib/api'
import { getPlannedPosts } from '@/lib/api'
import { BlogPost, PlannedPost, CalendarEvent } from '@/types/blog'
import { cn } from '@/lib/utils'

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCalendarData()
  }, [currentDate])

  const loadCalendarData = async () => {
    try {
      setLoading(true)
      
      const monthStart = startOfMonth(currentDate)
      const monthEnd = endOfMonth(currentDate)
      
      // Fetch published posts
      const posts = await fetchPostsByDateRange(
        monthStart.toISOString(),
        monthEnd.toISOString()
      )
      
      // Get planned posts from localStorage
      const plannedPosts = getPlannedPosts()
      
      // Convert to calendar events
      const postEvents: CalendarEvent[] = posts.map(post => ({
        id: post._id,
        title: post.title,
        date: post.publishedAt || post._createdAt,
        type: post.status === 'published' ? 'published' : 'draft',
        post
      }))
      
      const plannedEvents: CalendarEvent[] = plannedPosts
        .filter(planned => {
          const plannedDate = parseISO(planned.plannedDate)
          return plannedDate >= monthStart && plannedDate <= monthEnd
        })
        .map(planned => ({
          id: planned.id,
          title: planned.title,
          date: planned.plannedDate,
          type: 'planned',
          plannedPost: planned
        }))
      
      setEvents([...postEvents, ...plannedEvents])
    } catch (error) {
      console.error('Error loading calendar data:', error)
    } finally {
      setLoading(false)
    }
  }

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  })

  const getEventsForDay = (day: Date) => {
    return events.filter(event => 
      isSameDay(parseISO(event.date), day)
    )
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'published':
        return 'bg-green-500'
      case 'draft':
        return 'bg-yellow-500'
      case 'planned':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Calendar Header */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="bg-gray-50 py-2 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide"
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {calendarDays.map((day, dayIndex) => {
            const dayEvents = getEventsForDay(day)
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isDayToday = isToday(day)
            
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  'bg-white px-3 py-2 text-sm min-h-[100px]',
                  !isCurrentMonth && 'bg-gray-50 text-gray-400'
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      'text-sm font-medium',
                      isDayToday && 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs'
                    )}
                  >
                    {format(day, 'd')}
                  </span>
                </div>
                
                <div className="mt-2 space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className={cn(
                        'text-xs rounded px-2 py-1 text-white truncate',
                        getEventColor(event.type)
                      )}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                  
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 px-2">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* Events Summary */}
      {events.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {format(currentDate, 'MMMM yyyy')} Summary
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {events.filter(e => e.type === 'published').length}
              </div>
              <div className="text-sm text-gray-600">Published Posts</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {events.filter(e => e.type === 'draft').length}
              </div>
              <div className="text-sm text-gray-600">Draft Posts</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {events.filter(e => e.type === 'planned').length}
              </div>
              <div className="text-sm text-gray-600">Planned Posts</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
