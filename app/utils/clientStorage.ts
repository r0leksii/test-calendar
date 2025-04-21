'use client';

import { CalendarEvent, addEvent, updateEvent, deleteEvent, getAllEvents, getEvent } from '../services/eventStorage';

// This file serves as a client-side wrapper for our IndexedDB storage
// It ensures that IndexedDB operations only run in the browser

export const useEventStorage = () => {
  const getEvents = async (): Promise<CalendarEvent[]> => {
    // Check if we're in the browser
    if (typeof window === 'undefined') {
      return [];
    }
    
    try {
      return await getAllEvents();
    } catch (error) {
      console.error('Failed to get events:', error);
      return [];
    }
  };

  const saveEvent = async (event: CalendarEvent): Promise<string | null> => {
    if (typeof window === 'undefined') {
      return null;
    }
    
    try {
      if (event.id) {
        return await updateEvent(event);
      } else {
        // Generate a new ID if one doesn't exist
        const newEvent = {
          ...event,
          id: crypto.randomUUID(),
        };
        return await addEvent(newEvent);
      }
    } catch (error) {
      console.error('Failed to save event:', error);
      return null;
    }
  };

  const removeEvent = async (id: string): Promise<boolean> => {
    if (typeof window === 'undefined') {
      return false;
    }
    
    try {
      await deleteEvent(id);
      return true;
    } catch (error) {
      console.error('Failed to delete event:', error);
      return false;
    }
  };

  const getEventById = async (id: string): Promise<CalendarEvent | null> => {
    if (typeof window === 'undefined') {
      return null;
    }
    
    try {
      const event = await getEvent(id);
      return event || null;
    } catch (error) {
      console.error('Failed to get event:', error);
      return null;
    }
  };

  return {
    getEvents,
    saveEvent,
    removeEvent,
    getEventById,
  };
};
