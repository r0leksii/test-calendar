import { calendarReducer, createInitialState } from '@/app/components/calendar-date-time-picker/state/reducer'
import { CalendarState, CalendarAction } from '@/app/components/calendar-date-time-picker/types'

describe('Calendar Reducer', () => {
  // Tests for createInitialState
  describe('createInitialState', () => {
    it('should create default initial state when no props provided', () => {
      const initialState = createInitialState()
      
      expect(initialState.dateRange).toEqual({ startDate: null, endDate: null })
      expect(initialState.startTime).toBe('09:00')
      expect(initialState.endTime).toBe('17:00')
      expect(initialState.selectionPhase).toBe('start')
      expect(initialState.isTimePickerOpen).toBe(false)
      expect(initialState.isMonthPickerOpen).toBe(false)
      expect(initialState.isYearPickerOpen).toBe(false)
      expect(initialState.firstDayOfWeek).toBe(0)
      expect(initialState.weekdays).toEqual([])
      expect(initialState.currentMonth).toBeInstanceOf(Date)
    })

    it('should use provided initialDateRange', () => {
      const startDate = new Date(2024, 0, 1)
      const endDate = new Date(2024, 0, 5)
      const initialDateRange = { startDate, endDate }
      
      const initialState = createInitialState(initialDateRange)
      
      expect(initialState.dateRange).toEqual(initialDateRange)
      expect(initialState.currentMonth).toEqual(startDate)
    })

    it('should use provided time values', () => {
      const initialState = createInitialState(undefined, '10:00', '18:00')
      
      expect(initialState.startTime).toBe('10:00')
      expect(initialState.endTime).toBe('18:00')
    })
  })

  // Tests for calendarReducer
  describe('calendarReducer', () => {
    let initialState: CalendarState

    beforeEach(() => {
      initialState = createInitialState()
    })

    it('should handle SET_DATE_RANGE action', () => {
      const startDate = new Date(2024, 0, 1)
      const endDate = new Date(2024, 0, 5)
      const dateRange = { startDate, endDate }
      
      const action: CalendarAction = { type: 'SET_DATE_RANGE', payload: dateRange }
      const newState = calendarReducer(initialState, action)
      
      expect(newState.dateRange).toEqual(dateRange)
    })

    it('should handle SET_START_TIME action', () => {
      const action: CalendarAction = { type: 'SET_START_TIME', payload: '08:00' }
      const newState = calendarReducer(initialState, action)
      
      expect(newState.startTime).toBe('08:00')
    })

    it('should handle SET_END_TIME action', () => {
      const action: CalendarAction = { type: 'SET_END_TIME', payload: '16:00' }
      const newState = calendarReducer(initialState, action)
      
      expect(newState.endTime).toBe('16:00')
    })

    it('should handle SET_CURRENT_MONTH action', () => {
      const newDate = new Date(2024, 5, 1) // June 2024
      const action: CalendarAction = { type: 'SET_CURRENT_MONTH', payload: newDate }
      const newState = calendarReducer(initialState, action)
      
      expect(newState.currentMonth).toEqual(newDate)
    })

    it('should handle SET_SELECTION_PHASE action', () => {
      const action: CalendarAction = { type: 'SET_SELECTION_PHASE', payload: 'end' }
      const newState = calendarReducer(initialState, action)
      
      expect(newState.selectionPhase).toBe('end')
    })

    it('should handle TOGGLE_TIME_PICKER action', () => {
      const action: CalendarAction = { type: 'TOGGLE_TIME_PICKER' }
      const newState = calendarReducer(initialState, action)
      
      expect(newState.isTimePickerOpen).toBe(true)
      
      // Toggle back to false
      const newState2 = calendarReducer(newState, action)
      expect(newState2.isTimePickerOpen).toBe(false)
    })

    it('should handle TOGGLE_MONTH_PICKER action', () => {
      const action: CalendarAction = { type: 'TOGGLE_MONTH_PICKER' }
      const newState = calendarReducer(initialState, action)
      
      expect(newState.isMonthPickerOpen).toBe(true)
      expect(newState.isYearPickerOpen).toBe(false)
    })

    it('should handle TOGGLE_YEAR_PICKER action', () => {
      const action: CalendarAction = { type: 'TOGGLE_YEAR_PICKER' }
      const newState = calendarReducer(initialState, action)
      
      expect(newState.isYearPickerOpen).toBe(true)
      expect(newState.isMonthPickerOpen).toBe(false)
    })

    it('should handle CLOSE_ALL_PICKERS action', () => {
      // First open the pickers
      let state = calendarReducer(initialState, { type: 'TOGGLE_MONTH_PICKER' })
      
      // Then close them
      const action: CalendarAction = { type: 'CLOSE_ALL_PICKERS' }
      state = calendarReducer(state, action)
      
      expect(state.isMonthPickerOpen).toBe(false)
      expect(state.isYearPickerOpen).toBe(false)
    })

    it('should handle SET_LOCALE_SETTINGS action', () => {
      const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      const action: CalendarAction = { 
        type: 'SET_LOCALE_SETTINGS', 
        payload: { firstDayOfWeek: 1, weekdays } 
      }
      const newState = calendarReducer(initialState, action)
      
      expect(newState.firstDayOfWeek).toBe(1)
      expect(newState.weekdays).toEqual(weekdays)
    })

    it('should handle SELECT_DATE action in start phase', () => {
      const date = new Date(2024, 0, 1)
      const action: CalendarAction = { type: 'SELECT_DATE', payload: date }
      const newState = calendarReducer(initialState, action)
      
      expect(newState.dateRange.startDate).toEqual(date)
      expect(newState.dateRange.endDate).toBeNull()
      expect(newState.selectionPhase).toBe('end')
    })

    it('should handle SELECT_DATE action in end phase', () => {
      // First set to end phase with a start date
      const startDate = new Date(2024, 0, 1)
      let state = initialState
      state = calendarReducer(state, { 
        type: 'SELECT_DATE', 
        payload: startDate 
      })
      
      // Now select the end date
      const endDate = new Date(2024, 0, 5)
      const action: CalendarAction = { type: 'SELECT_DATE', payload: endDate }
      const newState = calendarReducer(state, action)
      
      expect(newState.dateRange.startDate).toEqual(startDate)
      expect(newState.dateRange.endDate).toEqual(endDate)
      expect(newState.selectionPhase).toBe('start')
    })

    it('should handle SELECT_DATE when end date is before start date', () => {
      // First set to end phase with a start date
      const startDate = new Date(2024, 0, 10)
      let state = initialState
      state = calendarReducer(state, { 
        type: 'SELECT_DATE', 
        payload: startDate 
      })
      
      // Now select the end date before the start date
      const earlierDate = new Date(2024, 0, 5)
      const action: CalendarAction = { type: 'SELECT_DATE', payload: earlierDate }
      const newState = calendarReducer(state, action)
      
      // Should reset the start date to the earlier date
      expect(newState.dateRange.startDate).toEqual(earlierDate)
      expect(newState.dateRange.endDate).toBeNull()
      expect(newState.selectionPhase).toBe('end')
    })

    it('should handle PREV_MONTH action', () => {
      const initialDate = new Date(2024, 5, 15) // June 15, 2024
      const state = { ...initialState, currentMonth: initialDate }
      
      const action: CalendarAction = { type: 'PREV_MONTH' }
      const newState = calendarReducer(state, action)
      
      expect(newState.currentMonth.getFullYear()).toBe(2024)
      expect(newState.currentMonth.getMonth()).toBe(4) // May
      expect(newState.currentMonth.getDate()).toBe(1) // First day of the month
    })

    it('should handle NEXT_MONTH action', () => {
      const initialDate = new Date(2024, 5, 15) // June 15, 2024
      const state = { ...initialState, currentMonth: initialDate }
      
      const action: CalendarAction = { type: 'NEXT_MONTH' }
      const newState = calendarReducer(state, action)
      
      expect(newState.currentMonth.getFullYear()).toBe(2024)
      expect(newState.currentMonth.getMonth()).toBe(6) // July
      expect(newState.currentMonth.getDate()).toBe(1) // First day of the month
    })

    it('should handle SET_MONTH action', () => {
      const initialDate = new Date(2024, 5, 15) // June 15, 2024
      const state = { ...initialState, currentMonth: initialDate }
      
      const action: CalendarAction = { type: 'SET_MONTH', payload: 2 } // March
      const newState = calendarReducer(state, action)
      
      expect(newState.currentMonth.getFullYear()).toBe(2024)
      expect(newState.currentMonth.getMonth()).toBe(2) // March
      expect(newState.currentMonth.getDate()).toBe(1) // First day of the month
      expect(newState.isMonthPickerOpen).toBe(false)
    })

    it('should handle SET_YEAR action', () => {
      const initialDate = new Date(2024, 5, 15) // June 15, 2024
      const state = { ...initialState, currentMonth: initialDate }
      
      const action: CalendarAction = { type: 'SET_YEAR', payload: 2025 }
      const newState = calendarReducer(state, action)
      
      expect(newState.currentMonth.getFullYear()).toBe(2025)
      expect(newState.currentMonth.getMonth()).toBe(5) // June
      expect(newState.currentMonth.getDate()).toBe(1) // First day of the month
      expect(newState.isYearPickerOpen).toBe(false)
    })

    it('should return the same state for unknown action types', () => {
      const action = { type: 'UNKNOWN_ACTION' } as never
      const newState = calendarReducer(initialState, action)
      
      expect(newState).toEqual(initialState)
    })
  })
})
