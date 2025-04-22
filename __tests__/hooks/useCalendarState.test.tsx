import { renderHook, act } from '@testing-library/react'
import { useCalendarState } from '@/app/components/calendar-date-time-picker/hooks/useCalendarState'

// Mock the document event listeners
const mockAddEventListener = jest.fn()
const mockRemoveEventListener = jest.fn()

// Store the original methods
const originalAddEventListener = document.addEventListener
const originalRemoveEventListener = document.removeEventListener

describe('useCalendarState Hook', () => {
  // Setup and teardown for document event listener mocks
  beforeAll(() => {
    document.addEventListener = mockAddEventListener
    document.removeEventListener = mockRemoveEventListener
  })

  afterAll(() => {
    document.addEventListener = originalAddEventListener
    document.removeEventListener = originalRemoveEventListener
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useCalendarState())

    expect(result.current.state.dateRange).toEqual({ startDate: null, endDate: null })
    expect(result.current.state.startTime).toBe('09:00')
    expect(result.current.state.endTime).toBe('17:00')
    expect(result.current.state.selectionPhase).toBe('start')
    expect(result.current.state.isTimePickerOpen).toBe(false)
    expect(result.current.state.isMonthPickerOpen).toBe(false)
    expect(result.current.state.isYearPickerOpen).toBe(false)
  })

  it('should initialize with provided values', () => {
    const startDate = new Date(2024, 0, 1)
    const endDate = new Date(2024, 0, 5)
    const initialDateRange = { startDate, endDate }
    const initialStartTime = '10:00'
    const initialEndTime = '16:00'

    const { result } = renderHook(() =>
      useCalendarState({
        initialDateRange,
        initialStartTime,
        initialEndTime
      })
    )

    expect(result.current.state.dateRange).toEqual(initialDateRange)
    expect(result.current.state.startTime).toBe(initialStartTime)
    expect(result.current.state.endTime).toBe(initialEndTime)
    expect(result.current.state.currentMonth).toEqual(startDate)
  })

  it('should add and remove event listeners', () => {
    const { unmount } = renderHook(() => useCalendarState())

    // Check that event listener was added
    expect(mockAddEventListener).toHaveBeenCalledWith('mousedown', expect.any(Function))

    // Unmount the hook
    unmount()

    // Check that event listener was removed
    expect(mockRemoveEventListener).toHaveBeenCalledWith('mousedown', expect.any(Function))
  })

  it('should handle date selection', () => {
    const { result } = renderHook(() => useCalendarState())

    // Select the start date
    const startDate = new Date(2024, 0, 1)
    act(() => {
      result.current.handleDateSelect(startDate)
    })

    expect(result.current.state.dateRange.startDate).toEqual(startDate)
    expect(result.current.state.dateRange.endDate).toBeNull()
    expect(result.current.state.selectionPhase).toBe('end')

    // Select the end date
    const endDate = new Date(2024, 0, 5)
    act(() => {
      result.current.handleDateSelect(endDate)
    })

    expect(result.current.state.dateRange.startDate).toEqual(startDate)
    expect(result.current.state.dateRange.endDate).toEqual(endDate)
    expect(result.current.state.selectionPhase).toBe('start')
  })

  it('should navigate between months', () => {
    const initialDate = new Date(2024, 5, 15) // June 15, 2024
    const { result } = renderHook(() =>
      useCalendarState({
        initialDateRange: {
          startDate: initialDate,
          endDate: null
        }
      })
    )

    // Go to the previous month
    act(() => {
      result.current.prevMonth()
    })

    expect(result.current.state.currentMonth.getFullYear()).toBe(2024)
    expect(result.current.state.currentMonth.getMonth()).toBe(4) // May

    // Go to next month
    act(() => {
      result.current.nextMonth()
    })

    expect(result.current.state.currentMonth.getFullYear()).toBe(2024)
    expect(result.current.state.currentMonth.getMonth()).toBe(5) // June
  })

  it('should set specific month', () => {
    const { result } = renderHook(() => useCalendarState())

    act(() => {
      result.current.setMonth(3) // April
    })

    expect(result.current.state.currentMonth.getMonth()).toBe(3)
  })

  it('should set specific year', () => {
    const { result } = renderHook(() => useCalendarState())

    act(() => {
      result.current.setYear(2025)
    })

    expect(result.current.state.currentMonth.getFullYear()).toBe(2025)
  })

  it('should toggle time picker', () => {
    const { result } = renderHook(() => useCalendarState())

    act(() => {
      result.current.toggleTimePicker()
    })

    expect(result.current.state.isTimePickerOpen).toBe(true)

    act(() => {
      result.current.toggleTimePicker()
    })

    expect(result.current.state.isTimePickerOpen).toBe(false)
  })

  it('should toggle month picker', () => {
    const { result } = renderHook(() => useCalendarState())

    act(() => {
      result.current.toggleMonthPicker()
    })

    expect(result.current.state.isMonthPickerOpen).toBe(true)
    expect(result.current.state.isYearPickerOpen).toBe(false)
  })

  it('should toggle year picker', () => {
    const { result } = renderHook(() => useCalendarState())

    act(() => {
      result.current.toggleYearPicker()
    })

    expect(result.current.state.isYearPickerOpen).toBe(true)
    expect(result.current.state.isMonthPickerOpen).toBe(false)
  })

  it('should handle time changes', () => {
    const { result } = renderHook(() => useCalendarState())

    act(() => {
      result.current.handleStartTimeChange('08:30')
    })

    expect(result.current.state.startTime).toBe('08:30')

    act(() => {
      result.current.handleEndTimeChange('18:30')
    })

    expect(result.current.state.endTime).toBe('18:30')
  })

  it('should call onChange callback when values change', () => {
    const onChange = jest.fn()
    const { result } = renderHook(() =>
      useCalendarState({ onChange })
    )

    // Initial render should trigger onChange
    expect(onChange).toHaveBeenCalledWith(
      { startDate: null, endDate: null },
      '09:00',
      '17:00'
    )

    // Reset mock to check the next call
    onChange.mockReset()

    // Change start date
    const startDate = new Date(2024, 0, 1)
    act(() => {
      result.current.handleDateSelect(startDate)
    })

    expect(onChange).toHaveBeenCalledWith(
      { startDate, endDate: null },
      '09:00',
      '17:00'
    )
  })

  it('should generate years array correctly', () => {
    // Instead of mocking Date, we'll just check the structure of the year array
    const { result } = renderHook(() => useCalendarState())

    // Get the current year for comparison
    const currentYear = new Date().getFullYear()

    // Should generate years from (currentYear - 55) to (currentYear + 5)
    expect(result.current.years).toContain(currentYear - 55) // Earliest year
    expect(result.current.years).toContain(currentYear + 5) // Latest year
    expect(result.current.years.length).toBe(61) // Total number of years
  })
})
