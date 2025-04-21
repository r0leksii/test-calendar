'use client';

import dynamic from 'next/dynamic';

// Use dynamic import with SSR disabled for the Calendar component
// This is necessary because react-big-calendar uses browser APIs
const Calendar = dynamic(() => import('./Calendar'), {
  ssr: false,
});

export default function CalendarWrapper() {
  return <Calendar />;
}
