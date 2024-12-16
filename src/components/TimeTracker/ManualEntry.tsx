import React, { useState } from 'react';
import { Clock, Plus, AlertCircle } from 'lucide-react';
import { useTimeEntryStore } from '../../store/timeEntryStore';
import { useAuthStore } from '../../store/authStore';
import { Notification } from '../common/Notification';
import { format, subDays, isAfter, isBefore, parseISO } from 'date-fns';

export function ManualEntry() {
  const [hours, setHours] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [useTimeRange, setUseTimeRange] = useState(false);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [showNotification, setShowNotification] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);
  
  const { addManualEntry } = useTimeEntryStore();
  const user = useAuthStore((state) => state.user);

  // Calculate date restrictions
  const today = new Date();
  const minDate = format(subDays(today, 7), 'yyyy-MM-dd');
  const maxDate = format(today, 'yyyy-MM-dd');

  const validateDate = (selectedDate: string) => {
    const dateObj = parseISO(selectedDate);
    
    if (isAfter(dateObj, today)) {
      return "Cannot add entries for future dates";
    }
    
    if (isBefore(dateObj, parseISO(minDate))) {
      return "Cannot add entries older than 7 days";
    }
    
    return null;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setDate(newDate);
    setDateError(validateDate(newDate));
  };

  const calculateDuration = (start: string, end: string): number => {
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    return endMinutes - startMinutes;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || dateError) return;

    const duration = useTimeRange 
      ? calculateDuration(startTime, endTime)
      : parseFloat(hours) * 60;

    addManualEntry({
      userId: user.id,
      date,
      duration,
      manualEntry: true,
      notes,
      startTime: useTimeRange ? `${date}T${startTime}:00` : undefined,
      endTime: useTimeRange ? `${date}T${endTime}:00` : undefined,
    });

    // Reset form
    setHours('');
    setNotes('');
    if (useTimeRange) {
      setStartTime('09:00');
      setEndTime('17:00');
    }

    // Show notification
    setShowNotification(true);
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold flex items-center mb-4">
          <Clock className="w-6 h-6 mr-2 text-blue-600" />
          Manual Time Entry
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={date}
              onChange={handleDateChange}
              min={minDate}
              max={maxDate}
              className={`mt-1 block w-full rounded-md border ${
                dateError ? 'border-red-300' : 'border-gray-300'
              } shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200`}
              required
            />
            {dateError && (
              <div className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {dateError}
              </div>
            )}
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
          <button
            type="submit"
            disabled={!!dateError}
            className={`flex items-center px-4 py-2 bg-blue-600 text-white rounded-md ${
              dateError ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Entry
          </button>
        </form>
      </div>

      <Notification 
        message="Time entry added successfully!"
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
      />
    </>
  );
}