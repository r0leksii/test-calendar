'use client'

import { useReducer, useEffect, useCallback, useMemo } from 'react'
import { DateRange } from '../types'
import { calendarReducer, createInitialState } from '../state/reducer'
import { getLocalFirstDayOfWeek, getWeekdayNames } from '../utils/date-utils'

interface UseCalendarStateProps {
  initialDateRange?: DateRange
  initialStartTime?: string
  initialEndTime?: string
  onChange?: (dateRange: DateRange, startTime: string, endTime: string) => void
}

export function useCalendarState({
  initialDateRange,
  initialStartTime = '09:00',
  initialEndTime = '17:00',
  onChange,
}: UseCalendarStateProps = {}) {
  // Use reducer for state management with initial props
  const [state, dispatch] = useReducer(
    calendarReducer,
    createInitialState(initialDateRange, initialStartTime, initialEndTime)
  )

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

  // Generate an array of years - memoized
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

  // Notify a parent component when date range or times change
  useEffect(() => {
    if (onChange) {
      onChange(state.dateRange, state.startTime, state.endTime)
    }
  }, [onChange, state.dateRange, state.startTime, state.endTime])

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

  // Handle time changes
  const handleStartTimeChange = useCallback((time: string): void => {
    dispatch({ type: 'SET_START_TIME', payload: time })
  }, [])

  const handleEndTimeChange = useCallback((time: string): void => {
    dispatch({ type: 'SET_END_TIME', payload: time })
  }, [])

  return {
    state,
    years,
    handleDateSelect,
    prevMonth,
    nextMonth,
    setMonth,
    setYear,
    toggleTimePicker,
    toggleMonthPicker,
    toggleYearPicker,
    handleStartTimeChange,
    handleEndTimeChange,
  }
}
