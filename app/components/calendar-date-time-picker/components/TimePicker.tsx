'use client'

import { Clock, ChevronDown } from 'lucide-react'

interface TimePickerProps {
  isOpen: boolean
  startTime: string
  endTime: string
  onToggle: () => void
  onStartTimeChange: (time: string) => void
  onEndTimeChange: (time: string) => void
}

export function TimePicker({
  isOpen,
  startTime,
  endTime,
  onToggle,
  onStartTimeChange,
  onEndTimeChange,
}: TimePickerProps) {
  return (
    <div className="mt-6">
      <div
        className="flex items-center gap-2 cursor-pointer mb-3 bg-blue-50 p-3 rounded-lg hover:bg-blue-100 transition-colors"
        onClick={onToggle}
      >
        <Clock size={20} className="text-blue-600" />
        <span className="font-semibold text-lg text-blue-600">
          Time Selection
        </span>
        <ChevronDown
          size={18}
          className={`ml-auto text-blue-600 transform transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </div>

      {isOpen && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                className="block text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2"
                htmlFor="start-time"
              >
                Start Time
              </label>
              <input
                id="start-time"
                type="time"
                value={startTime}
                onChange={e => onStartTimeChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Start time"
              />
            </div>
            <div>
              <label
                className="block text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2"
                htmlFor="end-time"
              >
                End Time
              </label>
              <input
                id="end-time"
                type="time"
                value={endTime}
                onChange={e => onEndTimeChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="End time"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
