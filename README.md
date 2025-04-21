# Test Calendar

A modern, responsive date and time range picker built with Next.js, React, and Tailwind CSS. This application allows users to select date ranges and time slots with an intuitive interface.

![Test Calendar Screenshot](https://via.placeholder.com/800x400?text=Test+Calendar+Screenshot)

## Features

- **Date Range Selection**: Select start and end dates with an intuitive calendar interface
- **Time Range Selection**: Choose start and time end times for your selected dates
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Locale Support**: Automatically adapts to the user's locale for weekday names and first day of week
- **Month and Year Navigation**: Easily navigate between months and years
- **Modern UI**: Clean, accessible interface built with Tailwind CSS

## Component Architecture

The calendar application is built with a modular component structure:

- `CalendarDateTimePicker`: Main component that orchestrates the date-time selection experience
- `CalendarGrid`: Displays the days of the month and handles date selection
- `CalendarNavigation`: Controls for navigating between months and years
- `DateRangeDisplay`: Shows the currently selected date range
- `TimePicker`: Interface for selecting start and end times
- `RangeSummary`: Displays a summary of the selected date and time range

## Getting Started

### Prerequisites

- Node.js 18.18.0 or later
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/test-calendar.git
   cd test-calendar
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

### Basic Usage

The calendar component can be used as follows:

```tsx
import CalendarDateTimePicker from './components/calendar-date-time-picker'

export default function MyPage() {
  return (
    <div className="container mx-auto p-4">
      <CalendarDateTimePicker />
    </div>
  )
}
```

### Props

The `CalendarDateTimePicker` component accepts the following props:

| Prop               | Type                                                 | Default                              | Description                          |
| ------------------ | ---------------------------------------------------- | ------------------------------------ | ------------------------------------ |
| `initialDateRange` | `{ startDate: Date \| null, endDate: Date \| null }` | `{ startDate: null, endDate: null }` | Initial date range selection         |
| `initialStartTime` | `string`                                             | `'09:00'`                            | Initial start time in 24-hour format |
| `initialEndTime`   | `string`                                             | `'17:00'`                            | Initial end time in 24-hour format   |
| `onChange`         | `(dateRange, startTime, endTime) => void`            | `undefined`                          | Callback when selection changes      |

## Development

### Project Structure

```
app/
├── components/
│   └── calendar-date-time-picker/
│       ├── components/           # UI components
│       ├── hooks/                # Custom React hooks
│       ├── state/                # State management
│       ├── utils/                # Utility functions
│       ├── types.ts              # TypeScript types
│       └── index.tsx             # Main component
├── globals.css                   # Global styles
├── layout.tsx                    # Root layout
└── page.tsx                      # Home page
```

### Technologies Used

- **Next.js 15**: React framework with App Router
- **React 19**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

## Building for Production

To build the application for production:

```bash
npm run build
# or
yarn build
# or
pnpm build
# or
bun build
```

Then, you can start the production server:

```bash
npm run start
# or
yarn start
# or
pnpm start
# or
bun start
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org) - The React Framework
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Lucide Icons](https://lucide.dev) - Beautiful & consistent icons
