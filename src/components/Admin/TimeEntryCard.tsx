import React from 'react';
import { format } from 'date-fns';
import { Clock, Calendar, FileText } from 'lucide-react';
import { TimeEntry } from '../../types';
import { mockInterns } from '../../data/mockData';

interface TimeEntryCardProps {
  entry: TimeEntry;
}

export function TimeEntryCard({ entry }: TimeEntryCardProps) {
  const intern = mockInterns.find((i) => i.id === entry.userId);
  const hours = Math.floor(entry.duration / 60);
  const minutes = entry.duration % 60;

  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-lg text-gray-900">{intern?.name}</span>
            <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
              {entry.manualEntry ? 'Manual Entry' : 'Timer Entry'}
            </span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {format(new Date(entry.date), 'MMM d, yyyy')}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {hours > 0 && `${hours}h `}{minutes}m
            </div>
            {entry.startTime && entry.endTime && (
              <div className="text-gray-500">
                {format(new Date(entry.startTime), 'HH:mm')} - {format(new Date(entry.endTime), 'HH:mm')}
              </div>
            )}
          </div>
          
          {entry.notes && (
            <div className="flex items-start space-x-2 bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
              <FileText className="w-4 h-4 mt-0.5 text-gray-400" />
              <p className="flex-1">{entry.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}