'use client'

import { CalendarDateTimePickerProps } from './types'
import { useCalendarState } from './hooks/useCalendarState'
import { DateRangeDisplay } from './components/DateRangeDisplay'
import { CalendarNavigation } from './components/CalendarNavigation'
import { CalendarGrid } from './components/CalendarGrid'
import { TimePicker } from './components/TimePicker'
import { RangeSummary } from './components/RangeSummary'

export default function CalendarDateTimePicker({
  initialDateRange,
  initialStartTime = '09:00',
  initialEndTime = '17:00',
  onChange,
}: CalendarDateTimePickerProps = {}) {
  const {
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
  } = useCalendarState({
    initialDateRange,
    initialStartTime,
    initialEndTime,
    onChange,
  })

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">
        Select Date and Time Range
      </h2>

      {/* Selected Date Range Display */}
      <DateRangeDisplay dateRange={state.dateRange} />

      {/* Calendar Navigation with Month/Year Pickers */}
      <CalendarNavigation
        currentMonth={state.currentMonth}
        years={years}
        isMonthPickerOpen={state.isMonthPickerOpen}
        isYearPickerOpen={state.isYearPickerOpen}
        prevMonth={prevMonth}
        nextMonth={nextMonth}
        toggleMonthPicker={toggleMonthPicker}
        toggleYearPicker={toggleYearPicker}
        setMonth={setMonth}
        setYear={setYear}
      />

      {/* Calendar Grid */}
      <CalendarGrid
        currentMonth={state.currentMonth}
        dateRange={state.dateRange}
        weekdays={state.weekdays}
        firstDayOfWeek={state.firstDayOfWeek}
        onDateSelect={handleDateSelect}
      />

      {/* Time Selection */}
      <TimePicker
        isOpen={state.isTimePickerOpen}
        startTime={state.startTime}
        endTime={state.endTime}
        onToggle={toggleTimePicker}
        onStartTimeChange={handleStartTimeChange}
        onEndTimeChange={handleEndTimeChange}
      />

      {/* Selected Range Summary */}
      <RangeSummary
        dateRange={state.dateRange}
        startTime={state.startTime}
        endTime={state.endTime}
      />
    </div>
  )
}
