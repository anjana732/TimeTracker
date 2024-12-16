import React from 'react';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, parseISO } from 'date-fns';
import { BarChart, Clock, TrendingUp } from 'lucide-react';
import { TimeEntry } from '../../types';

interface WeeklyPerformanceProps {
  entries: TimeEntry[];
  weekStart: Date;
}

export function WeeklyPerformance({ entries, weekStart }: WeeklyPerformanceProps) {
  const weekEnd = endOfWeek(weekStart);
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Calculate daily hours
  const dailyHours = daysInWeek.map(day => {
    const dayEntries = entries.filter(entry => 
      format(parseISO(entry.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );
    const totalMinutes = dayEntries.reduce((sum, entry) => sum + entry.duration, 0);
    return {
      date: day,
      hours: totalMinutes / 60,
      entries: dayEntries
    };
  });

  // Calculate total weekly hours
  const totalWeeklyHours = dailyHours.reduce((sum, day) => sum + day.hours, 0);
  const averageHoursPerDay = totalWeeklyHours / 7;

  // Find max hours for scaling the chart
  const maxHours = Math.max(...dailyHours.map(day => day.hours));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold flex items-center">
          <BarChart className="w-5 h-5 mr-2 text-primary-600" />
          Weekly Performance
        </h3>
        <div className="text-sm text-gray-500">
          {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-4">
          <div className="flex items-center text-primary-600 mb-2">
            <Clock className="w-4 h-4 mr-2" />
            Total Hours
          </div>
          <div className="text-2xl font-bold text-primary-800">
            {totalWeeklyHours.toFixed(1)}h
          </div>
        </div>
        <div className="bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-lg p-4">
          <div className="flex items-center text-secondary-600 mb-2">
            <TrendingUp className="w-4 h-4 mr-2" />
            Daily Average
          </div>
          <div className="text-2xl font-bold text-secondary-800">
            {averageHoursPerDay.toFixed(1)}h
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="space-y-2">
        {dailyHours.map(({ date, hours, entries }) => (
          <div key={format(date, 'yyyy-MM-dd')} className="relative">
            <div className="flex items-center">
              <div className="w-20 text-sm text-gray-600">
                {format(date, 'EEE')}
              </div>
              <div className="flex-1">
                <div className="h-8 flex items-center">
                  <div 
                    className="bg-gradient-to-r from-primary-200 to-secondary-200 rounded h-6 transition-all duration-500"
                    style={{ 
                      width: `${(hours / (maxHours || 1)) * 100}%`,
                      minWidth: hours > 0 ? '20px' : '0'
                    }}
                  >
                    {hours > 0 && (
                      <div className="px-2 text-sm text-primary-800 font-medium">
                        {hours.toFixed(1)}h
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {entries.length > 0 && (
              <div className="ml-20 mt-1 text-xs text-gray-500">
                {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-end space-x-4 text-xs text-gray-500">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-primary-200 to-secondary-200 rounded mr-1"></div>
            Hours worked
          </div>
        </div>
      </div>
    </div>
  );
} 