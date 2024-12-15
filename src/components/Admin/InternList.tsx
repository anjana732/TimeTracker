import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { useTimeEntryStore } from '../../store/timeEntryStore';
import { InternFilter } from './InternFilter';
import { TimeEntryCard } from './TimeEntryCard';

export function InternList() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [selectedIntern, setSelectedIntern] = useState<string | null>(null);
  
  const entries = useTimeEntryStore((state) => state.entries);

  const filteredEntries = entries.filter((entry) => {
    if (selectedIntern && entry.userId !== selectedIntern) return false;
    if (selectedDate && entry.date !== selectedDate) return false;
    return true;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <Users className="w-8 h-8 mr-2 text-blue-600" />
        Intern Time Tracking
      </h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <InternFilter
          selectedIntern={selectedIntern}
          selectedDate={selectedDate}
          onInternChange={setSelectedIntern}
          onDateChange={setSelectedDate}
        />

        <div className="space-y-4">
          {filteredEntries.map((entry) => (
            <TimeEntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      </div>
    </div>
  );
}