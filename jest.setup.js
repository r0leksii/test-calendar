// Import jest-dom for DOM element assertions
import '@testing-library/jest-dom'

// Mock the navigator.language property
Object.defineProperty(window.navigator, 'language', {
  configurable: true,
  get: function() {
    return 'en-US' // Default to en-US for tests
  }
})

// Mock Intl.DateTimeFormat
const mockFormat = jest.fn().mockImplementation((date) => {
  // Simple mock implementation that returns a fixed string based on the date
  // This can be enhanced for specific test cases
  if (date instanceof Date) {
    const day = date.getDay()
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return weekdays[day]
  }
  return 'Mock Date'
})

global.Intl.DateTimeFormat = jest.fn().mockImplementation(() => ({
  format: mockFormat
}))
