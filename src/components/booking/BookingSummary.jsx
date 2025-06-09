// components/booking/BookingSummary.jsx
import React from "react";
import { parse, format, addMinutes } from "date-fns";

/**
 * BookingSummary Component - Updated for duration-based bookings with remove buttons
 * @param {{
 *   selectedBlocks: { [date: string]: { time: string, coach: object, duration?: number, technique?: string, skillLevel?: string }[] },
 *   onClear: () => void,
 *   onRemoveSession: (date: string, time: string) => void
 * }}
 */
export default function BookingSummary({ selectedBlocks, onClear, onRemoveSession }) {
  // Early return if no selections made
  if (!selectedBlocks || Object.keys(selectedBlocks).length === 0) {
    return null; // Don't render anything
  }

  const sessions = [];
  let totalPrice = 0;

  // Process selected blocks into sessions
  for (const [dateStr, entries] of Object.entries(selectedBlocks)) {
    for (const { time, coach, duration = 90, technique, skillLevel } of entries) { // Add technique and skillLevel
      if (!time || !coach) continue;

      const startTime = parse(time, "HH:mm", new Date());
      const endTime = addMinutes(startTime, duration);
      const hourlyRate = coach.price || coach.hourlyRate || 65;

      // Calculate price based on duration and hourly rate
      const sessionPrice = (hourlyRate * duration) / 60;

      sessions.push({
        date: dateStr,
        startTime: time,
        endTime: format(endTime, "HH:mm"),
        duration,
        coach: coach.name || "Unknown Coach",
        coachId: coach.id,
        hourlyRate,
        sessionPrice,
        technique: technique || "Training Session", // Use technique or fallback
        skillLevel,
        dateKey: dateStr, // Add for remove functionality
        timeKey: time // Add for remove functionality
      });

      totalPrice += sessionPrice;
    }
  }

  // Sort sessions by date and time
  sessions.sort((a, b) => {
    const dateCompare = new Date(a.date) - new Date(b.date);
    if (dateCompare !== 0) return dateCompare;
    return parse(a.startTime, "HH:mm", new Date()) - parse(b.startTime, "HH:mm", new Date());
  });

  // If no valid sessions after processing, don't render
  if (sessions.length === 0) {
    return null;
  }

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}min`;
  };

  const formatDate = (dateStr) => {
    try {
      return format(new Date(dateStr + 'T12:00:00'), "MMMM d, yyyy");
    } catch (error) {
      return dateStr;
    }
  };

  const formatTime = (timeStr) => {
    try {
      return format(parse(timeStr, "HH:mm", new Date()), "h:mm a");
    } catch (error) {
      return timeStr;
    }
  };

  // Group sessions by date for better display
  const sessionsByDate = sessions.reduce((acc, session) => {
    if (!acc[session.date]) {
      acc[session.date] = [];
    }
    acc[session.date].push(session);
    return acc;
  }, {});

  return (
    <div className="dark:bg-stone-900 dark:text-stone-100 p-4 mt-6 rounded-lg border border-gray-700">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-lg">Booking Summary</h3>
        <button
          className="text-red-500 text-sm underline hover:text-red-400"
          onClick={onClear}
        >
          Clear All
        </button>
      </div>

      <div className="space-y-4">
        {Object.entries(sessionsByDate).map(([dateStr, dateSessions]) => (
          <div key={dateStr}>
            <h4 className="text-sm font-semibold text-gray-300 mb-2">
              {formatDate(dateStr)}
            </h4>

            <div className="space-y-2">
              {dateSessions.map((session, idx) => (
                <div
                  key={`${session.date}-${session.startTime}-${idx}`}
                  className="bg-gray-800 rounded-lg p-3 border border-gray-600"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="font-medium text-white">
                        {session.coach}
                      </div>
                      <div className="text-sm text-gray-400">
                        {session.technique}
                      </div>
                      {session.skillLevel && (
                        <div className="text-xs text-gray-500">
                          {session.skillLevel} Level
                        </div>
                      )}
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="text-right">
                        <div className="font-bold text-green-400">
                          ${session.sessionPrice.toFixed(0)}
                        </div>
                        <div className="text-xs text-gray-400">
                          ${session.hourlyRate}/hr
                        </div>
                      </div>
                      <button
                        onClick={() => onRemoveSession?.(session.dateKey, session.timeKey)}
                        className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded border border-red-400 hover:border-red-300 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <div className="text-gray-300">
                      <span className="font-medium">Time:</span> {formatTime(session.startTime)} - {formatTime(session.endTime)}
                    </div>
                    <div className="text-gray-300">
                      <span className="font-medium">Duration:</span> {formatDuration(session.duration)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Total Summary - More uniform design */}
        <div className="bg-gray-800 rounded-lg p-3 border border-gray-600">
          <div className="flex justify-between items-center mb-2">
            <div className="font-medium text-white">
              Total Sessions: {sessions.length}
            </div>
            <div className="text-xl font-bold text-green-400">
              ${totalPrice.toFixed(0)}
            </div>
          </div>

          {/* Sessions breakdown if multiple sessions */}
          {sessions.length > 1 && (
            <div className="space-y-1 text-xs text-gray-400 border-t border-gray-600 pt-2">
              {sessions.map((session, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>
                    {formatDate(session.date)} - {formatDuration(session.duration)}
                  </span>
                  <span>${session.sessionPrice.toFixed(0)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}