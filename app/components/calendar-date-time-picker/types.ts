export interface DateRange {
  startDate: Date | null
  endDate: Date | null
}

export type SelectionPhase = 'start' | 'end'

// Define action types for our reducer
export type CalendarAction =
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
export interface CalendarState {
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

export interface CalendarDateTimePickerProps {
  /** Initial date range (optional) */
  initialDateRange?: DateRange
  /** Initial start time (optional, default: '09:00') */
  initialStartTime?: string
  /** Initial end time (optional, default: '17:00') */
  initialEndTime?: string
  /** Callback when date range or times change */
  onChange?: (dateRange: DateRange, startTime: string, endTime: string) => void
}
