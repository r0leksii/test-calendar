import { CalendarState, CalendarAction, DateRange } from '../types'

// Create initial state with props
export const createInitialState = (
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
export function calendarReducer(
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
