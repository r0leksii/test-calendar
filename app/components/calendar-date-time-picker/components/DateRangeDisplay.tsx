'use client'

import { DateRange } from '../types'
import { formatDate } from '../utils/date-utils'

interface DateRangeDisplayProps {
  dateRange: DateRange
}

export function DateRangeDisplay({ dateRange }: DateRangeDisplayProps) {
  return (
    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
            Start:
          </span>
          <div className="text-lg font-medium mt-1">
            {formatDate(dateRange.startDate)}
          </div>
        </div>
        <div className="flex-1">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
            End:
          </span>
          <div className="text-lg font-medium mt-1">
            {formatDate(dateRange.endDate)}
          </div>
        </div>
      </div>
    </div>
  )
}
