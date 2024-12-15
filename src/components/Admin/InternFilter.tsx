import React from 'react';
import { Users } from 'lucide-react';
import { mockInterns } from '../../data/mockData';

interface InternFilterProps {
  selectedIntern: string | null;
  selectedDate: string;
  onInternChange: (internId: string | null) => void;
  onDateChange: (date: string) => void;
}

export function InternFilter({
  selectedIntern,
  selectedDate,
  onInternChange,
  onDateChange,
}: InternFilterProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Intern
        </label>
        <select
          value={selectedIntern || ''}
          onChange={(e) => onInternChange(e.target.value || null)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
        >
          <option value="">All Interns</option>
          {mockInterns.map((intern) => (
            <option key={intern.id} value={intern.id}>
              {intern.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Date
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
      </div>
    </div>
  );
}