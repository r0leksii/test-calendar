import { openDB } from 'idb';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
}

const DB_NAME = 'calendar-events-db';
const STORE_NAME = 'events';
const DB_VERSION = 1;

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
};

export const getAllEvents = async (): Promise<CalendarEvent[]> => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

export const addEvent = async (event: CalendarEvent): Promise<string> => {
  const db = await initDB();
  await db.put(STORE_NAME, event);
  return event.id;
};

export const updateEvent = async (event: CalendarEvent): Promise<string> => {
  const db = await initDB();
  await db.put(STORE_NAME, event);
  return event.id;
};

export const deleteEvent = async (id: string): Promise<void> => {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
};

export const getEvent = async (id: string): Promise<CalendarEvent | undefined> => {
  const db = await initDB();
  return db.get(STORE_NAME, id);
};
