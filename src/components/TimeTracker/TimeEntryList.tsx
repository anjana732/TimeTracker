import React, { useState } from 'react';
import { format } from 'date-fns';
import { Clock, Calendar, Edit2, Filter } from 'lucide-react';
import { useTimeEntryStore } from '../../store/timeEntryStore';
import { useAuthStore } from '../../store/authStore';
import { TimeEntry } from '../../types';
import { EditTimeEntryModal } from './EditTimeEntryModal';

export function TimeEntryList() {
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const user = useAuthStore((state) => state.user);
  const { entries, editEntry } = useTimeEntryStore();
  
  const userEntries = user ? entries.filter(entry => {
    const isUserEntry = entry.userId === user.id;
    const matchesDate = selectedDate ? entry.date === selectedDate : true;
    return isUserEntry && matchesDate;
  }) : [];

  // Sort entries by date and time, most recent first
  const sortedEntries = [...userEntries].sort((a, b) => {
    const dateA = new Date(a.date + (a.startTime?.slice(10) || 'T00:00:00'));
    const dateB = new Date(b.date + (b.startTime?.slice(10) || 'T00:00:00'));
    return dateB.getTime() - dateA.getTime();
  });

  const handleEdit = (entry: TimeEntry) => {
    setEditingEntry(entry);
  };

  const handleEditSubmit = (updates: Partial<TimeEntry>) => {
    if (editingEntry) {
      editEntry(editingEntry.id, updates);
      setEditingEntry(null);
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary-50 to-white rounded-2xl shadow-lg overflow-hidden border border-primary-100">
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Calendar className="w-6 h-6 mr-2" />
            Time Entries
          </h2>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-white" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1 rounded-md border border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="Filter by date"
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate('')}
                className="text-white/80 hover:text-white text-sm underline"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="p-6">
        {sortedEntries.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No time entries found {selectedDate && 'for the selected date'}
          </div>
        ) : (
          <div className="divide-y divide-primary-100">
            {sortedEntries.map((entry) => (
              <div
                key={entry.id}
                className="py-4 first:pt-0 last:pb-0 hover:bg-primary-50/50 transition-all duration-200 rounded-lg px-4 -mx-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-gray-900">
                      {format(new Date(entry.date), 'EEEE, MMMM d, yyyy')}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center mt-1">
                      <Clock className="w-4 h-4 mr-1 text-primary-500" />
                      {Math.floor(entry.duration / 60)} hours {entry.duration % 60} minutes
                      {entry.startTime && entry.endTime && (
                        <span className="ml-2 text-gray-500">
                          ({format(new Date(entry.startTime), 'HH:mm')} - {format(new Date(entry.endTime), 'HH:mm')})
                        </span>
                      )}
                    </div>
                    {entry.notes && (
                      <div className="text-sm text-gray-600 mt-2 bg-primary-50/50 p-3 rounded-lg border border-primary-100">
                        {entry.notes}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleEdit(entry)}
                    className="p-2 text-gray-500 hover:text-primary-600 rounded-full hover:bg-primary-50"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingEntry && (
        <EditTimeEntryModal
          isOpen={!!editingEntry}
          onClose={() => setEditingEntry(null)}
          onSubmit={handleEditSubmit}
          entry={editingEntry}
        />
      )}
    </div>
  );
}