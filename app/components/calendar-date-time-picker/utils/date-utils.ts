// Month names for picker
export const MONTH_NAMES: string[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

/**
 * Gets the first day of the week based on locale
 */
export const getLocalFirstDayOfWeek = (locale: string): number => {
  try {
    // Create formatters once
    const sundayWeekFormat = new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      timeZone: 'UTC',
    }).format(new Date('2024-01-07')) // Jan 7, 2024 is a Sunday

    const weekFormat = new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      timeZone: 'UTC',
    })

    // Use a more efficient approach with pre-created Date objects
    const dates = [
      new Date('2024-01-01'), // Monday
      new Date('2024-01-02'), // Tuesday
      new Date('2024-01-03'), // Wednesday
      new Date('2024-01-04'), // Thursday
      new Date('2024-01-05'), // Friday
      new Date('2024-01-06'), // Saturday
      new Date('2024-01-07'), // Sunday
    ]

    for (let i = 0; i < 7; i++) {
      if (weekFormat.format(dates[i]) === sundayWeekFormat) {
        return i
      }
    }
    return 1 // Default to Monday if something goes wrong
  } catch {
    return 1 // Default to Monday if there's an error
  }
}

/**
 * Gets weekday names based on locale and first day of week
 */
export const getWeekdayNames = (
  locale: string,
  firstDayOfWeek: number
): string[] => {
  // Pre-create dates for the week (January 1-7, 2024)
  const dates = [
    new Date('2024-01-01'), // Monday
    new Date('2024-01-02'), // Tuesday
    new Date('2024-01-03'), // Wednesday
    new Date('2024-01-04'), // Thursday
    new Date('2024-01-05'), // Friday
    new Date('2024-01-06'), // Saturday
    new Date('2024-01-07'), // Sunday
  ]

  const format = new Intl.DateTimeFormat(locale, { weekday: 'short' })
  const weekdays = []

  for (let i = 0; i < 7; i++) {
    const dayIndex = (firstDayOfWeek + i) % 7
    weekdays.push(format.format(dates[dayIndex]))
  }

  return weekdays
}

/**
 * Gets the number of days in a month
 */
export const getDaysInMonth = (date: Date): number => {
  const year = date.getFullYear()
  const month = date.getMonth()
  return new Date(year, month + 1, 0).getDate()
}

/**
 * Gets the first day of the month adjusted for the first day of the week
 */
export const getFirstDayOfMonth = (
  date: Date,
  firstDayOfWeek: number
): number => {
  const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  return (7 + day - firstDayOfWeek) % 7
}

/**
 * Formats a date for display
 */
export const formatDate = (date: Date | null): string => {
  if (!date) return 'Select date'
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
