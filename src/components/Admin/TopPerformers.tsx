import React from 'react';
import { Trophy, TrendingUp, Clock } from 'lucide-react';
import { TimeEntry } from '../../types';
import { mockInterns } from '../../data/mockData';
import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

interface TopPerformersProps {
  entries: TimeEntry[];
}

interface PerformerStats {
  internId: string;
  name: string;
  totalHours: number;
  weeklyAverage: number;
}

export function TopPerformers({ entries }: TopPerformersProps) {
  // Calculate total hours and weekly average for each intern
  const performerStats: PerformerStats[] = mockInterns.map(intern => {
    const internEntries = entries.filter(entry => entry.userId === intern.id);
    const totalMinutes = internEntries.reduce((sum, entry) => sum + entry.duration, 0);
    
    // Calculate weekly average
    const now = new Date();
    const currentWeekStart = startOfWeek(now);
    const currentWeekEnd = endOfWeek(now);
    
    const weeklyEntries = internEntries.filter(entry => 
      isWithinInterval(new Date(entry.date), {
        start: currentWeekStart,
        end: currentWeekEnd
      })
    );
    
    const weeklyMinutes = weeklyEntries.reduce((sum, entry) => sum + entry.duration, 0);

    return {
      internId: intern.id,
      name: intern.name,
      totalHours: totalMinutes / 60,
      weeklyAverage: weeklyMinutes / 60 / 7
    };
  });

  // Sort by total hours and get top 5
  const topPerformers = [...performerStats]
    .sort((a, b) => b.totalHours - a.totalHours)
    .slice(0, 5);

  // Find max hours for scaling the bars
  const maxHours = Math.max(...topPerformers.map(p => p.totalHours));

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-primary-600" />
          Top 5 Performers
        </h2>
        <div className="text-sm text-gray-500">
          Based on total hours worked
        </div>
      </div>

      {/* Performance Bars */}
      <div className="space-y-4">
        {topPerformers.map((performer, index) => (
          <div key={performer.internId} className="relative">
            <div className="flex items-center mb-1">
              <div className="w-32 text-sm font-medium">
                {performer.name}
              </div>
              <div className="flex-1">
                <div className="h-8 flex items-center">
                  <div 
                    className="bg-gradient-to-r from-primary-200 to-secondary-200 rounded h-6 transition-all duration-500"
                    style={{ 
                      width: `${(performer.totalHours / maxHours) * 100}%`,
                      minWidth: '20px'
                    }}
                  >
                    <div className="px-2 text-sm text-primary-800 font-medium">
                      {performer.totalHours.toFixed(1)}h
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="ml-32 text-xs text-gray-500 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              Weekly Avg: {performer.weeklyAverage.toFixed(1)}h/day
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Progress Summary */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="flex items-center mb-4">
          <TrendingUp className="w-5 h-5 mr-2 text-secondary-600" />
          <h3 className="text-md font-semibold">Weekly Progress Overview</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-4">
            <div className="text-sm text-primary-600 mb-1">Team Average</div>
            <div className="text-2xl font-bold text-primary-800">
              {(performerStats.reduce((sum, p) => sum + p.weeklyAverage, 0) / performerStats.length).toFixed(1)}h
            </div>
            <div className="text-xs text-primary-600 mt-1">per day</div>
          </div>
          <div className="bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-lg p-4">
            <div className="text-sm text-secondary-600 mb-1">Total Team Hours</div>
            <div className="text-2xl font-bold text-secondary-800">
              {performerStats.reduce((sum, p) => sum + p.totalHours, 0).toFixed(1)}h
            </div>
            <div className="text-xs text-secondary-600 mt-1">all time</div>
          </div>
        </div>
      </div>
    </div>
  );
} 