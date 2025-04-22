import {
  getLocalFirstDayOfWeek,
  getWeekdayNames,
  getDaysInMonth,
  getFirstDayOfMonth,
  formatDate,
  MONTH_NAMES
} from '@/app/components/calendar-date-time-picker/utils/date-utils'

describe('Date Utility Functions', () => {
  // Test for MONTH_NAMES constant
  describe('MONTH_NAMES', () => {
    it('should contain all 12 months in correct order', () => {
      expect(MONTH_NAMES).toHaveLength(12)
      expect(MONTH_NAMES[0]).toBe('January')
      expect(MONTH_NAMES[11]).toBe('December')
    })
  })

  // Tests for getLocalFirstDayOfWeek
  describe('getLocalFirstDayOfWeek', () => {
    it('should return a number between 0 and 6', () => {
      const result = getLocalFirstDayOfWeek('en-US')
      expect(result).toBeGreaterThanOrEqual(0)
      expect(result).toBeLessThanOrEqual(6)
    })

    it('should return 0 for en-US locale (Sunday)', () => {
      // Mock implementation for en-US
      const originalDateTimeFormat = Intl.DateTimeFormat
      const mockFormat = jest.fn()
      mockFormat.mockReturnValueOnce('Sunday') // Format for Sunday
      mockFormat.mockReturnValueOnce('Sunday') // Format for the first day (Sunday in en-US)

      // Create a proper mock that includes all required properties
      const MockDateTimeFormat = jest.fn().mockImplementation(() => ({
        format: mockFormat
      }));
      // Add the required static method
      MockDateTimeFormat.supportedLocalesOf = jest.fn().mockReturnValue([]);

      // Apply the mock
      global.Intl.DateTimeFormat = MockDateTimeFormat as unknown as typeof Intl.DateTimeFormat

      const result = getLocalFirstDayOfWeek('en-US')
      expect(result).toBe(0)

      // Restore original implementation
      global.Intl.DateTimeFormat = originalDateTimeFormat
    })

    it('should return a value for en-GB locale', () => {
      // Since we can't reliably mock the exact behavior of Intl.DateTimeFormat
      // across different environments, we'll just check that it returns a valid value
      const result = getLocalFirstDayOfWeek('en-GB')
      expect(result).toBeGreaterThanOrEqual(0)
      expect(result).toBeLessThanOrEqual(6)
    })

    it('should handle errors gracefully and return default value', () => {
      // Mock implementation that throws an error
      const originalDateTimeFormat = Intl.DateTimeFormat
      // Create a proper mock that throws an error
      const MockDateTimeFormat = jest.fn().mockImplementation(() => {
        throw new Error('Mock error')
      });
      // Add the required static method
      MockDateTimeFormat.supportedLocalesOf = jest.fn().mockReturnValue([]);

      // Apply the mock
      global.Intl.DateTimeFormat = MockDateTimeFormat as unknown as typeof Intl.DateTimeFormat

      const result = getLocalFirstDayOfWeek('invalid-locale')
      expect(result).toBe(1) // Default to Monday

      // Restore original implementation
      global.Intl.DateTimeFormat = originalDateTimeFormat
    })
  })

  // Tests for getWeekdayNames
  describe('getWeekdayNames', () => {
    it('should return an array of 7 weekday names', () => {
      const result = getWeekdayNames('en-US', 0)
      expect(result).toHaveLength(7)
    })

    it('should start with Sunday when firstDayOfWeek is 0', () => {
      // Mock implementation
      const originalDateTimeFormat = Intl.DateTimeFormat
      const mockFormat = jest.fn()
      mockFormat.mockReturnValueOnce('Sun')
      mockFormat.mockReturnValueOnce('Mon')
      mockFormat.mockReturnValueOnce('Tue')
      mockFormat.mockReturnValueOnce('Wed')
      mockFormat.mockReturnValueOnce('Thu')
      mockFormat.mockReturnValueOnce('Fri')
      mockFormat.mockReturnValueOnce('Sat')

      // Create a proper mock that includes all required properties
      const MockDateTimeFormat = jest.fn().mockImplementation(() => ({
        format: mockFormat
      }));
      // Add the required static method
      MockDateTimeFormat.supportedLocalesOf = jest.fn().mockReturnValue([]);

      // Apply the mock
      global.Intl.DateTimeFormat = MockDateTimeFormat as unknown as typeof Intl.DateTimeFormat

      const result = getWeekdayNames('en-US', 0)
      expect(result[0]).toBe('Sun')
      expect(result[6]).toBe('Sat')

      // Restore original implementation
      global.Intl.DateTimeFormat = originalDateTimeFormat
    })

    it('should start with Monday when firstDayOfWeek is 1', () => {
      // Mock implementation
      const originalDateTimeFormat = Intl.DateTimeFormat
      const mockFormat = jest.fn()
      mockFormat.mockReturnValueOnce('Mon')
      mockFormat.mockReturnValueOnce('Tue')
      mockFormat.mockReturnValueOnce('Wed')
      mockFormat.mockReturnValueOnce('Thu')
      mockFormat.mockReturnValueOnce('Fri')
      mockFormat.mockReturnValueOnce('Sat')
      mockFormat.mockReturnValueOnce('Sun')

      // Create a proper mock that includes all required properties
      const MockDateTimeFormat = jest.fn().mockImplementation(() => ({
        format: mockFormat
      }));
      // Add the required static method
      MockDateTimeFormat.supportedLocalesOf = jest.fn().mockReturnValue([]);

      // Apply the mock
      global.Intl.DateTimeFormat = MockDateTimeFormat as unknown as typeof Intl.DateTimeFormat

      const result = getWeekdayNames('en-US', 1)
      expect(result[0]).toBe('Mon')
      expect(result[6]).toBe('Sun')

      // Restore original implementation
      global.Intl.DateTimeFormat = originalDateTimeFormat
    })
  })

  // Tests for getDaysInMonth
  describe('getDaysInMonth', () => {
    it('should return 31 for January', () => {
      const january = new Date(2024, 0, 1) // January 2024
      expect(getDaysInMonth(january)).toBe(31)
    })

    it('should return 29 for February in a leap year', () => {
      const february2024 = new Date(2024, 1, 1) // February 2024 (leap year)
      expect(getDaysInMonth(february2024)).toBe(29)
    })

    it('should return 28 for February in a non-leap year', () => {
      const february2023 = new Date(2023, 1, 1) // February 2023 (non-leap year)
      expect(getDaysInMonth(february2023)).toBe(28)
    })

    it('should return 30 for April', () => {
      const april = new Date(2024, 3, 1) // April 2024
      expect(getDaysInMonth(april)).toBe(30)
    })
  })

  // Tests for getFirstDayOfMonth
  describe('getFirstDayOfMonth', () => {
    it('should return the correct first day for January 2024 with firstDayOfWeek=0', () => {
      const january2024 = new Date(2024, 0, 1) // January 1, 2024 is a Monday
      expect(getFirstDayOfMonth(january2024, 0)).toBe(1) // Monday is 1 day after Sunday
    })

    it('should return the correct first day for January 2024 with firstDayOfWeek=1', () => {
      const january2024 = new Date(2024, 0, 1) // January 1, 2024 is a Monday
      expect(getFirstDayOfMonth(january2024, 1)).toBe(0) // Monday is 0 days after Monday
    })

    it('should return the correct first day for February 2024 with firstDayOfWeek=0', () => {
      const february2024 = new Date(2024, 1, 1) // February 1, 2024 is a Thursday
      expect(getFirstDayOfMonth(february2024, 0)).toBe(4) // Thursday is 4 days after Sunday
    })
  })

  // Tests for formatDate
  describe('formatDate', () => {
    it('should return "Select date" for null date', () => {
      expect(formatDate(null)).toBe('Select date')
    })

    it('should format a date correctly', () => {
      // Mock the toLocaleDateString method
      const originalToLocaleDateString = Date.prototype.toLocaleDateString
      Date.prototype.toLocaleDateString = jest.fn().mockReturnValue('Jan 1, 2024')

      const date = new Date(2024, 0, 1) // January 1, 2024
      expect(formatDate(date)).toBe('Jan 1, 2024')

      // Restore original method
      Date.prototype.toLocaleDateString = originalToLocaleDateString
    })
  })
})
