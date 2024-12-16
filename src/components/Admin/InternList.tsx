import React, { useState } from 'react';
import { Users, Search, Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { startOfWeek, addWeeks, subWeeks, format } from 'date-fns';
import { useTimeEntryStore } from '../../store/timeEntryStore';
import { TimeEntryCard } from './TimeEntryCard';
import { WeeklyPerformance } from './WeeklyPerformance';
import { TopPerformers } from './TopPerformers';
import { mockInterns } from '../../data/mockData';

export function InternList() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedIntern, setSelectedIntern] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date()));
  
  const entries = useTimeEntryStore((state) => state.entries);

  const filteredEntries = entries.filter((entry) => {
    const intern = mockInterns.find(i => i.id === entry.userId);
    const matchesIntern = selectedIntern ? entry.userId === selectedIntern : true;
    const matchesDate = selectedDate ? entry.date === selectedDate : true;
    const matchesSearch = searchTerm 
      ? intern?.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesIntern && matchesDate && matchesSearch;
  });

  const clearFilters = () => {
    setSelectedDate('');
    setSelectedIntern('');
    setSearchTerm('');
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(current => 
      direction === 'prev' ? subWeeks(current, 1) : addWeeks(current, 1)
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header and Filters */}
      <div className="bg-white shadow-md rounded-lg mb-6">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold flex items-center mb-6">
            <Users className="w-8 h-8 mr-2 text-primary-600" />
            Intern Time Tracking
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by intern name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Intern Select */}
            <div>
              <select
                value={selectedIntern}
                onChange={(e) => setSelectedIntern(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Interns</option>
                {mockInterns.map((intern) => (
                  <option key={intern.id} value={intern.id}>
                    {intern.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Active Filters */}
          {(selectedDate || selectedIntern || searchTerm) && (
            <div className="mt-4 flex items-center space-x-2">
              <span className="text-sm text-gray-500">Active filters:</span>
              <div className="flex flex-wrap gap-2">
                {selectedIntern && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                    {mockInterns.find(i => i.id === selectedIntern)?.name}
                    <X
                      className="w-4 h-4 ml-2 cursor-pointer"
                      onClick={() => setSelectedIntern('')}
                    />
                  </span>
                )}
                {selectedDate && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                    {new Date(selectedDate).toLocaleDateString()}
                    <X
                      className="w-4 h-4 ml-2 cursor-pointer"
                      onClick={() => setSelectedDate('')}
                    />
                  </span>
                )}
                {searchTerm && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                    Search: {searchTerm}
                    <X
                      className="w-4 h-4 ml-2 cursor-pointer"
                      onClick={() => setSearchTerm('')}
                    />
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Show TopPerformers when no filters are active */}
      {!selectedIntern && !selectedDate && !searchTerm && (
        <TopPerformers entries={entries} />
      )}

      {/* Weekly Performance Section */}
      {(selectedIntern || searchTerm) && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Weekly Overview</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigateWeek('prev')}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-600">
                {format(currentWeek, 'MMMM d, yyyy')}
              </span>
              <button
                onClick={() => navigateWeek('next')}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <WeeklyPerformance 
            entries={filteredEntries} 
            weekStart={currentWeek}
          />
        </div>
      )}

      {/* Time Entries List */}
      <div className="bg-white shadow-md rounded-lg">
        <div className="p-6">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No time entries found</p>
              {(selectedDate || selectedIntern || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="mt-2 text-primary-600 hover:text-primary-700"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
              {filteredEntries.map((entry) => (
                <TimeEntryCard key={entry.id} entry={entry} />
              ))}
              <div className="text-sm text-gray-500 text-center pt-4">
                Showing {filteredEntries.length} entries
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}