import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { TimeEntry } from '../../types';

interface EditTimeEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (entry: Partial<TimeEntry>) => void;
  entry: TimeEntry;
}

export function EditTimeEntryModal({ isOpen, onClose, onSubmit, entry }: EditTimeEntryModalProps) {
  const [useTimeRange, setUseTimeRange] = useState(false);
  const [hours, setHours] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (entry) {
      setDate(entry.date);
      setNotes(entry.notes || '');
      
      if (entry.startTime && entry.endTime) {
        setUseTimeRange(true);
        setStartTime(entry.startTime.split('T')[1].slice(0, 5));
        setEndTime(entry.endTime.split('T')[1].slice(0, 5));
      } else {
        setUseTimeRange(false);
        setHours(String(entry.duration / 60));
      }
    }
  }, [entry]);

  if (!isOpen) return null;

  const calculateDuration = (start: string, end: string): number => {
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    return endMinutes - startMinutes;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const duration = useTimeRange 
      ? calculateDuration(startTime, endTime)
      : parseFloat(hours) * 60;

    onSubmit({
      date,
      duration,
      notes,
      startTime: useTimeRange ? `${date}T${startTime}:00` : undefined,
      endTime: useTimeRange ? `${date}T${endTime}:00` : undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Edit Time Entry</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              required
            />
          </div>

          <div>
            <button
              type="button"
              onClick={() => setUseTimeRange(!useTimeRange)}
              className="text-sm text-blue-600 hover:text-blue-800 underline mb-2"
            >
              {useTimeRange ? 'Enter total hours instead' : 'Set start and end time instead'}
            </button>

            {useTimeRange ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    required
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700">Hours</label>
                <input
                  type="number"
                  step="0.5"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  required
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 