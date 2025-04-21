'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CalendarEvent, addEvent, updateEvent, deleteEvent } from '../services/eventStorage';

interface EventModalProps {
  event: CalendarEvent;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => void;
}

export default function EventModal({ event, onClose, onSave, onDelete }: EventModalProps) {
  const [title, setTitle] = useState(event.title || '');
  const [description, setDescription] = useState(event.description || '');
  const [startDate, setStartDate] = useState<Date>(new Date(event.start));
  const [endDate, setEndDate] = useState<Date>(new Date(event.end));
  const [error, setError] = useState('');
  const isNewEvent = !event.id;

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (startDate >= endDate) {
      setError('End time must be after start time');
      return;
    }

    try {
      const updatedEvent: CalendarEvent = {
        id: event.id || crypto.randomUUID(),
        title,
        description,
        start: startDate,
        end: endDate,
      };

      if (isNewEvent) {
        await addEvent(updatedEvent);
      } else {
        await updateEvent(updatedEvent);
      }

      onSave(updatedEvent);
    } catch (error) {
      console.error('Failed to save event:', error);
      setError('Failed to save event. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (event.id) {
      try {
        await deleteEvent(event.id);
        onDelete(event.id);
      } catch (error) {
        console.error('Failed to delete event:', error);
        setError('Failed to delete event. Please try again.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {isNewEvent ? 'Add New Event' : 'Edit Event'}
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Event title"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Event description"
            rows={3}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Start Date & Time</label>
          <DatePicker
            selected={startDate}
            onChange={(date: Date) => setStartDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">End Date & Time</label>
          <DatePicker
            selected={endDate}
            onChange={(date: Date) => setEndDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            minDate={startDate}
          />
        </div>
        
        <div className="flex justify-between">
          <div>
            <button
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
          {!isNewEvent && (
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
