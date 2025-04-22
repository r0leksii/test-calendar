import React from 'react'
import { render, screen } from '@testing-library/react'
import { DateRangeDisplay } from '@/app/components/calendar-date-time-picker/components/DateRangeDisplay'
import '@testing-library/jest-dom'

describe('DateRangeDisplay Component', () => {
  it('should render with empty date range', () => {
    render(<DateRangeDisplay dateRange={{ startDate: null, endDate: null }} />)

    // Check that the component renders the labels
    expect(screen.getByText('Start:')).toBeInTheDocument()
    expect(screen.getByText('End:')).toBeInTheDocument()

    // Check that it shows "Select date" for both dates
    const dateTexts = screen.getAllByText('Select date')
    expect(dateTexts).toHaveLength(2)
  })

  it('should render with start date only', () => {
    const startDate = new Date(2024, 0, 1) // January 1, 2024

    // Mock the toLocaleDateString method
    const originalToLocaleDateString = Date.prototype.toLocaleDateString
    Date.prototype.toLocaleDateString = jest.fn().mockReturnValue('Jan 1, 2024')

    render(<DateRangeDisplay dateRange={{ startDate, endDate: null }} />)

    // Check that it shows the formatted start date
    expect(screen.getByText('Jan 1, 2024')).toBeInTheDocument()
    expect(screen.getByText('Select date')).toBeInTheDocument()

    // Restore the original method
    Date.prototype.toLocaleDateString = originalToLocaleDateString
  })

  it('should render with complete date range', () => {
    const startDate = new Date(2024, 0, 1) // January 1, 2024
    const endDate = new Date(2024, 0, 5) // January 5, 2024

    // Mock the toLocaleDateString method
    const originalToLocaleDateString = Date.prototype.toLocaleDateString
    Date.prototype.toLocaleDateString = jest.fn()
      .mockReturnValueOnce('Jan 1, 2024')  // First call for startDate
      .mockReturnValueOnce('Jan 5, 2024')  // Second call for endDate

    render(<DateRangeDisplay dateRange={{ startDate, endDate }} />)

    // Check that it shows both formatted dates
    expect(screen.getByText('Jan 1, 2024')).toBeInTheDocument()
    expect(screen.getByText('Jan 5, 2024')).toBeInTheDocument()

    // Restore the original method
    Date.prototype.toLocaleDateString = originalToLocaleDateString
  })

  it('should have the correct styling', () => {
    const { container } = render(<DateRangeDisplay dateRange={{ startDate: null, endDate: null }} />)

    // Check that the main container has the expected classes
    const mainContainer = container.firstChild
    expect(mainContainer).toHaveClass('mb-6')
    expect(mainContainer).toHaveClass('p-4')
    expect(mainContainer).toHaveClass('bg-blue-50')
    expect(mainContainer).toHaveClass('rounded-lg')
    expect(mainContainer).toHaveClass('border')
    expect(mainContainer).toHaveClass('border-blue-200')

    // Check that the labels have the expected styling
    const labels = screen.getAllByText(/Start:|End:/)
    labels.forEach(label => {
      expect(label).toHaveClass('text-sm')
      expect(label).toHaveClass('font-semibold')
      expect(label).toHaveClass('text-blue-600')
      expect(label).toHaveClass('uppercase')
      expect(label).toHaveClass('tracking-wider')
    })
  })
})
