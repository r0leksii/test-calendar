'use client';

import { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CalendarEvent, getAllEvents } from '../services/eventStorage';
import EventModal from './EventModal';

// Setup the localizer for BigCalendar
const localizer = momentLocalizer(moment);

export default function Calendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const allEvents = await getAllEvents();
        // Convert string dates back to Date objects
        const formattedEvents = allEvents.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end)
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Failed to load events:', error);
      }
    };

    loadEvents();
  }, []);

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedEvent({
      id: '',
      title: '',
      start,
      end,
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleSaveEvent = async (updatedEvent: CalendarEvent) => {
    try {
      // If the event already exists in our events array, update it
      if (events.some(e => e.id === updatedEvent.id)) {
        setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
      } else {
        // Otherwise, add it as a new event
        setEvents([...events, updatedEvent]);
      }
      setIsModalOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Failed to save event:', error);
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId));
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Event Calendar</h1>
      <div className="h-[calc(100vh-120px)]">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4"
        />
      </div>
      
      {isModalOpen && selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={handleCloseModal}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
        />
      )}
    </div>
  );
}
