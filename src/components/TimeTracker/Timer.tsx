import { useState, useEffect } from 'react';
import { Play, Pause, Square, Clock } from 'lucide-react';
import { useTimeEntryStore } from '../../store/timeEntryStore';
import { useAuthStore } from '../../store/authStore';
import { NotesModal } from './NotesModal';

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export function Timer() {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { activeEntry, startTimer, stopTimer } = useTimeEntryStore();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    let interval: number;
    if (activeEntry && !isPaused) {
      interval = setInterval(() => {
        setElapsedTime((time) => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeEntry, isPaused]);

  const handleStart = () => {
    if (!user) return;
    startTimer(user.id);
    setElapsedTime(0);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    setIsModalOpen(true);
  };

  const handleNotesSubmit = (notes: string) => {
    stopTimer(notes);
    setIsModalOpen(false);
    setElapsedTime(0);
    setIsPaused(false);
  };

  return (
    <div className="bg-gradient-to-br from-primary-50 to-white rounded-2xl shadow-lg overflow-hidden border border-primary-100">
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-6">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <Clock className="w-6 h-6 mr-2" />
          Time Tracker
        </h2>
      </div>
      <div className="p-8">
        <div className="text-7xl font-mono text-center my-8 font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          {formatTime(elapsedTime)}
        </div>
        <div className="flex justify-center space-x-4">
          {!activeEntry ? (
            <button
              onClick={handleStart}
              className="flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl hover:from-primary-700 hover:to-primary-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Timer
            </button>
          ) : (
            <>
              <button
                onClick={handlePauseResume}
                className={`flex items-center px-8 py-4 rounded-xl transform hover:scale-105 transition-all duration-200 shadow-lg ${
                  isPaused
                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600'
                    : 'bg-gradient-to-r from-secondary-500 to-secondary-400 hover:from-secondary-600 hover:to-secondary-500'
                } text-white`}
              >
                {isPaused ? (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    Pause
                  </>
                )}
              </button>
              <button
                onClick={handleStop}
                className="flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl hover:from-red-700 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <Square className="w-5 h-5 mr-2" />
                Stop
              </button>
            </>
          )}
        </div>
      </div>
      <NotesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleNotesSubmit}
      />
    </div>
  );
}