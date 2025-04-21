'use client'

import dynamic from 'next/dynamic'

const DynamicCalendarDateTimePicker = dynamic(
  () => import('./components/calendar-date-time-picker'),
  {
    ssr: false,
  }
)

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <DynamicCalendarDateTimePicker />
    </div>
  )
}
