'use client'

import { DateRange } from '../types'
import { formatDate } from '../utils/date-utils'

interface RangeSummaryProps {
  dateRange: DateRange
  startTime: string
  endTime: string
}

export function RangeSummary({ dateRange, startTime, endTime }: RangeSummaryProps) {
  return (
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
  )
}
