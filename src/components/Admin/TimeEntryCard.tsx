import React from 'react';
import { format } from 'date-fns';
import { TimeEntry } from '../../types';
import { mockInterns } from '../../data/mockData';

interface TimeEntryCardProps {
  entry: TimeEntry;
}

export function TimeEntryCard({ entry }: TimeEntryCardProps) {
  const intern = mockInterns.find((i) => i.id === entry.userId);

  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-semibold">{intern?.name}</div>
          <div className="text-sm text-gray-600">
            {format(new Date(entry.date), 'MMMM d, yyyy')}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Duration: {entry.duration} minutes
          </div>
          {entry.notes && (
            <div className="text-sm text-gray-600 mt-2">{entry.notes}</div>
          )}
        </div>
        <div className="text-sm text-gray-500">
          {entry.manualEntry ? 'Manual Entry' : 'Timer Entry'}
        </div>
      </div>
    </div>
  );
}