import React, { useState, useMemo } from "react";
import { parse, addMinutes, format, isBefore, isAfter, differenceInMinutes } from "date-fns";
import { timeSlots } from '../utils/classnames';
import clsx from 'clsx';

/**
 * Generates all possible start times from availability ranges
 * @param {Array} ranges - Array of {start, end} availability ranges
 * @param {number} interval - Time slot interval in minutes (default: 15)
 */
function generateAvailableStartTimes(ranges, interval = 15) {
  const startTimes = [];

  ranges.forEach(({ start, end }) => {
    if (!start || !end) return;

    try {
      let current = parse(start, "HH:mm", new Date());
      const endTime = parse(end, "HH:mm", new Date());

      while (isBefore(current, endTime)) {
        startTimes.push({
          time: format(current, "HH:mm"),
          timeObj: new Date(current)
        });
        current = addMinutes(current, interval);
      }
    } catch (err) {
      console.error(`❌ Failed to parse time range: { start: ${start}, end: ${end} }`, err);
    }
  });

  // Remove duplicates and sort
  const uniqueTimes = Array.from(
    new Map(startTimes.map(t => [t.time, t])).values()
  ).sort((a, b) => a.timeObj - b.timeObj);

  return uniqueTimes;
}

/**
 * Gets valid end times for a given start time based on duration constraints
 * @param {string} startTime - Start time in HH:mm format
 * @param {Array} ranges - Availability ranges
 * @param {Object} sessionDurations - Min/max duration constraints
 */
function getValidEndTimes(startTime, ranges, sessionDurations) {
  if (!startTime) return [];

  const startTimeObj = parse(startTime, "HH:mm", new Date());
  const endTimes = [];

  // Find which availability range this start time belongs to
  const containingRange = ranges.find(({ start, end }) => {
    const rangeStart = parse(start, "HH:mm", new Date());
    const rangeEnd = parse(end, "HH:mm", new Date());
    return !isBefore(startTimeObj, rangeStart) && isBefore(startTimeObj, rangeEnd);
  });

  if (!containingRange) return [];

  const rangeEnd = parse(containingRange.end, "HH:mm", new Date());
  const maxPossibleEnd = rangeEnd;

  // Generate end time options based on duration constraints
  const { min, max } = sessionDurations;

  for (let duration = min; duration <= max; duration += 15) {
    const endTime = addMinutes(startTimeObj, duration);

    // Check if this end time fits within availability
    if (!isAfter(endTime, maxPossibleEnd)) {
      endTimes.push({
        time: format(endTime, "HH:mm"),
        duration,
        label: formatDuration(duration)
      });
    }
  }

  return endTimes;
}

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
}

/**
 * TimeSlots component with time picker approach
 */
export default function TimeSlots({
                                    coachAvailability,
                                    selectedDate,
                                    selectedTimes,
                                    onToggleTime,
                                    sessionDurations = { min: 30, max: 120 },
                                    selectedCoach, // Add coach info
                                    sessionDetails // Add session details (technique, etc.)
                                  }) {
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');

  // Don't render if no date is selected
  if (!selectedDate || !coachAvailability) return null;

  const dayKey = format(selectedDate, "EEEE").toLowerCase();
  const ranges = Object.values(coachAvailability?.weeklyAvailability?.[dayKey] || {});
  const displayDate = format(selectedDate, "MMMM d, yyyy");

  // Get all available start times
  const availableStartTimes = useMemo(() =>
    generateAvailableStartTimes(ranges, 15), [ranges]
  );

  // Get valid end times for selected start time
  const validEndTimes = useMemo(() =>
      getValidEndTimes(selectedStartTime, ranges, sessionDurations),
    [selectedStartTime, ranges, sessionDurations]
  );

  // Calculate selected duration
  const selectedDuration = useMemo(() => {
    if (!selectedStartTime || !selectedEndTime) return 0;
    try {
      const start = parse(selectedStartTime, "HH:mm", new Date());
      const end = parse(selectedEndTime, "HH:mm", new Date());
      return differenceInMinutes(end, start);
    } catch {
      return 0;
    }
  }, [selectedStartTime, selectedEndTime]);

  const handleStartTimeChange = (startTime) => {
    setSelectedStartTime(startTime);
    setSelectedEndTime(''); // Reset end time when start time changes
  };

  const handleAddSession = () => {
    if (selectedStartTime && selectedEndTime) {
      // Pass additional session info with safe defaults
      onToggleTime?.(selectedStartTime, selectedDuration, {
        coach: selectedCoach,
        technique: sessionDetails?.technique || sessionDetails?.focusArea || "Training Session",
        skillLevel: sessionDetails?.skillLevel || "Intermediate"
      });
      // Reset selection
      setSelectedStartTime('');
      setSelectedEndTime('');
    }
  };

  // Format time for display
  const formatTime = (timeStr) => {
    try {
      return format(parse(timeStr, "HH:mm", new Date()), "h:mm a");
    } catch {
      return timeStr;
    }
  };

  // Don't render if no available times
  if (availableStartTimes.length === 0) {
    return (
      <div className={timeSlots.container}>
        <h3 className={timeSlots.heading}>Available Time Slots</h3>
        <p className={timeSlots.dateDisplay}>{displayDate}</p>
        <p className={timeSlots.emptyState}>No available times for this date</p>
      </div>
    );
  }

  return (
    <div className={timeSlots.container}>
      <h3 className={timeSlots.heading}>Book Training Session</h3>
      <p className={timeSlots.dateDisplay}>{displayDate}</p>

      <div className="space-y-4">
        {/* Start Time Picker */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Start Time
          </label>
          <select
            value={selectedStartTime}
            onChange={(e) => handleStartTimeChange(e.target.value)}
            className="w-full bg-gray-100 dark:bg-stone-700 border border-gray-600 text-gray-800 dark:text-stone-100 rounded px-3 py-2 text-sm"
          >
            <option value="">Select start time...</option>
            {availableStartTimes.map(({ time }) => (
              <option key={time} value={time}>
                {formatTime(time)}
              </option>
            ))}
          </select>
        </div>

        {/* End Time Picker - only show when start time is selected */}
        {selectedStartTime && (
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              End Time
            </label>
            <select
              value={selectedEndTime}
              onChange={(e) => setSelectedEndTime(e.target.value)}
              className="w-full bg-gray-100 dark:bg-stone-700 border border-gray-600 text-gray-800 dark:text-stone-100 rounded px-3 py-2 text-sm"
            >
              <option value="">Select end time...</option>
              {validEndTimes.map(({ time, duration, label }) => (
                <option key={time} value={time}>
                  {formatTime(time)} ({label})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Session Preview */}
        {selectedStartTime && selectedEndTime && (
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-600">
            <div className="text-sm">
              <div className="font-medium text-white mb-2">Session Preview</div>

              {/* Trainer Info */}
              <div className="text-gray-300 mb-1">
                <span className="font-medium">Trainer:</span> {selectedCoach?.name || 'Coach'}
              </div>

              {/* Technique/Focus Area */}
              <div className="text-gray-300 mb-1">
                <span className="font-medium">Focus:</span> {sessionDetails?.technique || sessionDetails?.focusArea || "Training Session"}
              </div>

              {/* Skill Level */}
              <div className="text-gray-300 mb-1">
                <span className="font-medium">Level:</span> {sessionDetails?.skillLevel || "Intermediate"}
              </div>

              {/* Time & Duration */}
              <div className="text-gray-300 mb-1">
                <span className="font-medium">Time:</span> {formatTime(selectedStartTime)} - {formatTime(selectedEndTime)}
              </div>
              <div className="text-gray-300">
                <span className="font-medium">Duration:</span> {formatDuration(selectedDuration)}
              </div>
            </div>

            <button
              onClick={handleAddSession}
              className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition"
            >
              Add This Session
            </button>
          </div>
        )}

      </div>
    </div>
  );
}