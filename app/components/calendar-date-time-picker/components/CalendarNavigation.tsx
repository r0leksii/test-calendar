'use client'

import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import { MONTH_NAMES } from '../utils/date-utils'

interface CalendarNavigationProps {
  currentMonth: Date
  years: number[]
  isMonthPickerOpen: boolean
  isYearPickerOpen: boolean
  prevMonth: () => void
  nextMonth: () => void
  toggleMonthPicker: () => void
  toggleYearPicker: () => void
  setMonth: (monthIndex: number) => void
  setYear: (year: number) => void
}

export function CalendarNavigation({
  currentMonth,
  years,
  isMonthPickerOpen,
  isYearPickerOpen,
  prevMonth,
  nextMonth,
  toggleMonthPicker,
  toggleYearPicker,
  setMonth,
  setYear,
}: CalendarNavigationProps) {
  return (
    <div className="flex items-center justify-between mb-4 relative">
      <button
        onClick={prevMonth}
        className="p-2 rounded-full hover:bg-gray-100"
        aria-label="Previous month"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex items-center space-x-1">
        {/* Month Picker */}
        <div className="relative">
          <button
            onClick={toggleMonthPicker}
            className="month-select-btn flex items-center space-x-1 px-2 py-1 rounded hover:bg-gray-100"
          >
            <span>{MONTH_NAMES[currentMonth.getMonth()]}</span>
            <ChevronDown size={16} />
          </button>

          {isMonthPickerOpen && (
            <div className="month-picker absolute top-full mt-1 bg-white shadow-lg rounded-lg py-2 z-10 max-h-48 overflow-y-auto">
              {MONTH_NAMES.map((month, index) => (
                <button
                  key={month}
                  onClick={() => setMonth(index)}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  {month}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Year Picker */}
        <div className="relative">
          <button
            onClick={toggleYearPicker}
            className="year-select-btn flex items-center space-x-1 px-2 py-1 rounded hover:bg-gray-100"
          >
            <span>{currentMonth.getFullYear()}</span>
            <ChevronDown size={16} />
          </button>

          {isYearPickerOpen && (
            <div className="year-picker absolute top-full mt-1 bg-white shadow-lg rounded-lg py-2 z-10 max-h-48 overflow-y-auto">
              {years.map(year => (
                <button
                  key={year}
                  onClick={() => setYear(year)}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={nextMonth}
        className="p-2 rounded-full hover:bg-gray-100"
        aria-label="Next month"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  )
}
