import React, { useState } from 'react';
import { format } from 'date-fns';
import { Clock, Calendar, Edit2 } from 'lucide-react';
import { useTimeEntryStore } from '../../store/timeEntryStore';
import { useAuthStore } from '../../store/authStore';
import { TimeEntry } from '../../types';
import { EditTimeEntryModal } from './EditTimeEntryModal';

export function TimeEntryList() {
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
  const user = useAuthStore((state) => state.user);
  const { entries, editEntry } = useTimeEntryStore();
  
  const userEntries = user ? entries.filter(entry => entry.userId === user.id) : [];

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
        <h2 className="text-xl font-semibold text-white flex items-center">
          <Calendar className="w-6 h-6 mr-2" />
          Time Entries
        </h2>
      </div>
      <div className="p-6">
        <div className="divide-y divide-primary-100">
          {userEntries.map((entry) => (
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