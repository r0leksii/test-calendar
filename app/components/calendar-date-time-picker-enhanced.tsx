'use client'

import { useEffect, useMemo, useCallback, useReducer } from 'react'
import { ChevronLeft, ChevronRight, Clock, ChevronDown } from 'lucide-react'

interface DateRange {
  startDate: Date | null
  endDate: Date | null
}

type SelectionPhase = 'start' | 'end'

// Utility functions - memoized to prevent recalculation
const getLocalFirstDayOfWeek = (locale: string): number => {
  try {
    // Create formatters once
    const sundayWeekFormat = new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      timeZone: 'UTC',
    }).format(new Date('2024-01-07')) // Jan 7, 2024 is a Sunday

    const weekFormat = new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      timeZone: 'UTC',
    })

    // Use a more efficient approach with pre-created Date objects
    const dates = [
      new Date('2024-01-01'), // Monday
      new Date('2024-01-02'), // Tuesday
      new Date('2024-01-03'), // Wednesday
      new Date('2024-01-04'), // Thursday
      new Date('2024-01-05'), // Friday
      new Date('2024-01-06'), // Saturday
      new Date('2024-01-07'), // Sunday
    ]

    for (let i = 0; i < 7; i++) {
      if (weekFormat.format(dates[i]) === sundayWeekFormat) {
        return i
      }
    }
    return 1 // Default to Monday if something goes wrong
  } catch {
    return 1 // Default to Monday if there's an error
  }
}

const getWeekdayNames = (locale: string, firstDayOfWeek: number): string[] => {
  // Pre-create dates for the week (January 1-7, 2024)
  const dates = [
    new Date('2024-01-01'), // Monday
    new Date('2024-01-02'), // Tuesday
    new Date('2024-01-03'), // Wednesday
    new Date('2024-01-04'), // Thursday
    new Date('2024-01-05'), // Friday
    new Date('2024-01-06'), // Saturday
    new Date('2024-01-07'), // Sunday
  ]

  const format = new Intl.DateTimeFormat(locale, { weekday: 'short' })
  const weekdays = []

  for (let i = 0; i < 7; i++) {
    const dayIndex = (firstDayOfWeek + i) % 7
    weekdays.push(format.format(dates[dayIndex]))
  }

  return weekdays
}

// Helper functions are now defined inside the component where they are used

// Month names for picker - defined outside component to prevent recreation
const MONTH_NAMES: string[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

// Define action types for our reducer
type CalendarAction =
  | { type: 'SET_DATE_RANGE'; payload: DateRange }
  | { type: 'SET_START_TIME'; payload: string }
  | { type: 'SET_END_TIME'; payload: string }
  | { type: 'SET_CURRENT_MONTH'; payload: Date }
  | { type: 'SET_SELECTION_PHASE'; payload: SelectionPhase }
  | { type: 'TOGGLE_TIME_PICKER' }
  | { type: 'TOGGLE_MONTH_PICKER' }
  | { type: 'TOGGLE_YEAR_PICKER' }
  | { type: 'CLOSE_ALL_PICKERS' }
  | {
      type: 'SET_LOCALE_SETTINGS'
      payload: { firstDayOfWeek: number; weekdays: string[] }
    }
  | { type: 'SELECT_DATE'; payload: Date }
  | { type: 'PREV_MONTH' }
  | { type: 'NEXT_MONTH' }
  | { type: 'SET_MONTH'; payload: number }
  | { type: 'SET_YEAR'; payload: number }

// Define state interface
interface CalendarState {
  dateRange: DateRange
  startTime: string
  endTime: string
  currentMonth: Date
  selectionPhase: SelectionPhase
  isTimePickerOpen: boolean
  isMonthPickerOpen: boolean
  isYearPickerOpen: boolean
  firstDayOfWeek: number
  weekdays: string[]
}

// Create initial state with props
const createInitialState = (
  initialDateRange?: DateRange,
  initialStartTime = '09:00',
  initialEndTime = '17:00'
): CalendarState => ({
  dateRange: initialDateRange || {
    startDate: null,
    endDate: null,
  },
  startTime: initialStartTime,
  endTime: initialEndTime,
  currentMonth: initialDateRange?.startDate || new Date(),
  selectionPhase: 'start',
  isTimePickerOpen: false,
  isMonthPickerOpen: false,
  isYearPickerOpen: false,
  firstDayOfWeek: 0,
  weekdays: [],
})

// Reducer function
function calendarReducer(
  state: CalendarState,
  action: CalendarAction
): CalendarState {
  switch (action.type) {
    case 'SET_DATE_RANGE':
      return { ...state, dateRange: action.payload }
    case 'SET_START_TIME':
      return { ...state, startTime: action.payload }
    case 'SET_END_TIME':
      return { ...state, endTime: action.payload }
    case 'SET_CURRENT_MONTH':
      return { ...state, currentMonth: action.payload }
    case 'SET_SELECTION_PHASE':
      return { ...state, selectionPhase: action.payload }
    case 'TOGGLE_TIME_PICKER':
      return { ...state, isTimePickerOpen: !state.isTimePickerOpen }
    case 'TOGGLE_MONTH_PICKER':
      return {
        ...state,
        isMonthPickerOpen: !state.isMonthPickerOpen,
        isYearPickerOpen: false,
      }
    case 'TOGGLE_YEAR_PICKER':
      return {
        ...state,
        isYearPickerOpen: !state.isYearPickerOpen,
        isMonthPickerOpen: false,
      }
    case 'CLOSE_ALL_PICKERS':
      return {
        ...state,
        isMonthPickerOpen: false,
        isYearPickerOpen: false,
      }
    case 'SET_LOCALE_SETTINGS':
      return {
        ...state,
        firstDayOfWeek: action.payload.firstDayOfWeek,
        weekdays: action.payload.weekdays,
      }
    case 'SELECT_DATE':
      if (state.selectionPhase === 'start') {
        return {
          ...state,
          dateRange: { startDate: action.payload, endDate: null },
          selectionPhase: 'end',
        }
      } else {
        if (
          state.dateRange.startDate &&
          action.payload < state.dateRange.startDate
        ) {
          return {
            ...state,
            dateRange: { startDate: action.payload, endDate: null },
            selectionPhase: 'end',
          }
        } else {
          return {
            ...state,
            dateRange: { ...state.dateRange, endDate: action.payload },
            selectionPhase: 'start',
          }
        }
      }
    case 'PREV_MONTH':
      return {
        ...state,
        currentMonth: new Date(
          state.currentMonth.getFullYear(),
          state.currentMonth.getMonth() - 1,
          1
        ),
      }
    case 'NEXT_MONTH':
      return {
        ...state,
        currentMonth: new Date(
          state.currentMonth.getFullYear(),
          state.currentMonth.getMonth() + 1,
          1
        ),
      }
    case 'SET_MONTH':
      return {
        ...state,
        currentMonth: new Date(
          state.currentMonth.getFullYear(),
          action.payload,
          1
        ),
        isMonthPickerOpen: false,
      }
    case 'SET_YEAR':
      return {
        ...state,
        currentMonth: new Date(
          action.payload,
          state.currentMonth.getMonth(),
          1
        ),
        isYearPickerOpen: false,
      }
    default:
      return state
  }
}

// Memoized components are removed as they weren't being used

interface CalendarDateTimePickerProps {
  /** Initial date range (optional) */
  initialDateRange?: DateRange
  /** Initial start time (optional, default: '09:00') */
  initialStartTime?: string
  /** Initial end time (optional, default: '17:00') */
  initialEndTime?: string
  /** Callback when date range or times change */
  onChange?: (dateRange: DateRange, startTime: string, endTime: string) => void
}

export default function CalendarDateTimePicker({
  initialDateRange,
  initialStartTime = '09:00',
  initialEndTime = '17:00',
  onChange,
}: CalendarDateTimePickerProps = {}) {
  // Use reducer for state management with initial props
  const [state, dispatch] = useReducer(
    calendarReducer,
    createInitialState(initialDateRange, initialStartTime, initialEndTime)
  )

  // Destructure state for easier access
  const {
    dateRange,
    startTime,
    endTime,
    currentMonth,
    isTimePickerOpen,
    isMonthPickerOpen,
    isYearPickerOpen,
    firstDayOfWeek,
    weekdays,
  } = state

  // Initialize locale settings
  useEffect(() => {
    const userLocale = navigator.language || 'en-US'
    const firstDay = getLocalFirstDayOfWeek(userLocale)
    const weekdayNames = getWeekdayNames(userLocale, firstDay)

    dispatch({
      type: 'SET_LOCALE_SETTINGS',
      payload: { firstDayOfWeek: firstDay, weekdays: weekdayNames },
    })
  }, [])

  // Memoize constants to prevent recreation on each render
  const currentYear = useMemo(() => new Date().getFullYear(), [])

  // Generate array of years - memoized
  const years = useMemo(() => {
    const startYear = currentYear - 55
    const endYear = currentYear + 5
    return Array.from(
      { length: endYear - startYear + 1 },
      (_, i) => startYear + i
    )
  }, [currentYear])

  // Close dropdowns when clicking outside - memoized handler
  const handleClickOutside = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (
      !target.closest('.month-picker') &&
      !target.closest('.month-select-btn') &&
      !target.closest('.year-picker') &&
      !target.closest('.year-select-btn')
    ) {
      dispatch({ type: 'CLOSE_ALL_PICKERS' })
    }
  }, [])

  // Add event listener with memoized callback
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handleClickOutside])

  // Handle date selection - memoized to prevent recreation on each render
  const handleDateSelect = useCallback((date: Date): void => {
    dispatch({ type: 'SELECT_DATE', payload: date })
  }, [])

  // Notify parent component when date range or times change
  useEffect(() => {
    if (onChange) {
      onChange(dateRange, startTime, endTime)
    }
  }, [onChange, dateRange, startTime, endTime])

  // Generate calendar days - memoized to prevent recreation on each render
  const generateCalendarDays = useMemo(() => {
    // Helper functions moved inside the component
    const getDaysInMonth = (date: Date): number => {
      const year = date.getFullYear()
      const month = date.getMonth()
      return new Date(year, month + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (date: Date, firstDayOfWeek: number): number => {
      const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
      return (7 + day - firstDayOfWeek) % 7
    }

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
          onClick={() => handleDateSelect(dayDate)}
        >
          {i}
        </div>
      )
    }

    return days
  }, [currentMonth, dateRange, firstDayOfWeek, handleDateSelect])

  // Navigate between months - memoized
  const prevMonth = useCallback((): void => {
    dispatch({ type: 'PREV_MONTH' })
  }, [])

  const nextMonth = useCallback((): void => {
    dispatch({ type: 'NEXT_MONTH' })
  }, [])

  // Set specific month - memoized
  const setMonth = useCallback((monthIndex: number): void => {
    dispatch({ type: 'SET_MONTH', payload: monthIndex })
  }, [])

  // Set specific year - memoized
  const setYear = useCallback((year: number): void => {
    dispatch({ type: 'SET_YEAR', payload: year })
  }, [])

  // Format date for display - memoized
  const formatDate = useCallback((date: Date | null): string => {
    if (!date) return 'Select date'
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }, [])

  // Toggle time picker - memoized
  const toggleTimePicker = useCallback((): void => {
    dispatch({ type: 'TOGGLE_TIME_PICKER' })
  }, [])

  // Toggle month picker - memoized
  const toggleMonthPicker = useCallback((): void => {
    dispatch({ type: 'TOGGLE_MONTH_PICKER' })
  }, [])

  // Toggle year picker - memoized
  const toggleYearPicker = useCallback((): void => {
    dispatch({ type: 'TOGGLE_YEAR_PICKER' })
  }, [])

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">
        Select Date and Time Range
      </h2>

      {/* Selected Date Range Display */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
              Start:
            </span>
            <div className="text-lg font-medium mt-1">
              {formatDate(dateRange.startDate)}
            </div>
          </div>
          <div className="flex-1">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
              End:
            </span>
            <div className="text-lg font-medium mt-1">
              {formatDate(dateRange.endDate)}
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Navigation with Month/Year Pickers */}
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

      {/* Calendar Grid */}
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
        <div className="grid grid-cols-7 gap-1">{generateCalendarDays}</div>
      </div>

      {/* Time Selection */}
      <div className="mt-6">
        <div
          className="flex items-center gap-2 cursor-pointer mb-3 bg-blue-50 p-3 rounded-lg hover:bg-blue-100 transition-colors"
          onClick={toggleTimePicker}
        >
          <Clock size={20} className="text-blue-600" />
          <span className="font-semibold text-lg text-blue-600">
            Time Selection
          </span>
          <ChevronDown
            size={18}
            className={`ml-auto text-blue-600 transform transition-transform ${
              isTimePickerOpen ? 'rotate-180' : ''
            }`}
          />
        </div>

        {isTimePickerOpen && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className="block text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2"
                  htmlFor="start-time"
                >
                  Start Time
                </label>
                <input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={e =>
                    dispatch({
                      type: 'SET_START_TIME',
                      payload: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Start time"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2"
                  htmlFor="end-time"
                >
                  End Time
                </label>
                <input
                  id="end-time"
                  type="time"
                  value={endTime}
                  onChange={e =>
                    dispatch({ type: 'SET_END_TIME', payload: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="End time"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Selected Range Summary */}
      <div className="mt-6 p-4 bg-blue-600 rounded-lg text-white shadow-lg">
        <h4 className="text-xl font-bold mb-3">Selected Range</h4>
        <div className="space-y-2">
          <p className="flex items-center justify-between">
            <span className="font-medium text-blue-100">Start:</span>
            <span className="font-bold">
              {formatDate(dateRange.startDate)}{' '}
              {dateRange.startDate ? `at ${startTime}` : ''}
            </span>
          </p>
          <p className="flex items-center justify-between">
            <span className="font-medium text-blue-100">End:</span>
            <span className="font-bold">
              {formatDate(dateRange.endDate)}{' '}
              {dateRange.endDate ? `at ${endTime}` : ''}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
