'use client'

import { useMemo } from 'react'
import { DateRange } from '../types'
import { getDaysInMonth, getFirstDayOfMonth } from '../utils/date-utils'

interface CalendarGridProps {
  currentMonth: Date
  dateRange: DateRange
  weekdays: string[]
  firstDayOfWeek: number
  onDateSelect: (date: Date) => void
}

export function CalendarGrid({
  currentMonth,
  dateRange,
  weekdays,
  firstDayOfWeek,
  onDateSelect,
}: CalendarGridProps) {
  // Generate calendar days - memoized to prevent recreation on each render
  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDayOfMonthValue = getFirstDayOfMonth(
      currentMonth,
      firstDayOfWeek
    )
    const days: React.ReactNode[] = []
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Normalize today for comparison

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonthValue; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>)
    }

    // Add cells for all days in the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        i
      )
      date.setHours(0, 0, 0, 0) // Normalize date for comparison

      const isToday = today.getTime() === date.getTime()
      const isStartDate =
        dateRange.startDate && date.getTime() === dateRange.startDate.getTime()
      const isEndDate =
        dateRange.endDate && date.getTime() === dateRange.endDate.getTime()
      const isInRange =
        dateRange.startDate &&
        dateRange.endDate &&
        date.getTime() > dateRange.startDate.getTime() &&
        date.getTime() < dateRange.endDate.getTime()

      let className =
        'flex items-center justify-center h-10 w-10 rounded-full cursor-pointer '

      if (isStartDate && isEndDate) {
        className += 'bg-blue-500 text-white'
      } else if (isStartDate) {
        className += 'bg-blue-500 text-white'
      } else if (isEndDate) {
        className += 'bg-blue-500 text-white'
      } else if (isInRange) {
        className += 'bg-blue-100'
      } else if (isToday) {
        className += 'border border-blue-500'
      } else {
        className += 'hover:bg-gray-100'
      }

      const dayDate = new Date(date) // Create a copy to avoid mutation

      days.push(
        <div
          key={i}
          className={className}
          onClick={() => onDateSelect(dayDate)}
        >
          {i}
        </div>
      )
    }

    return days
  }, [currentMonth, dateRange, firstDayOfWeek, onDateSelect])

  return (
    <div className="mb-4">
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 mb-2">
        {weekdays.map((day, index) => (
          <div key={index} className="text-center text-gray-500 text-sm">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">{calendarDays}</div>
    </div>
  )
}
