// src/components/booking/TimeSlots.jsx
import React, { useState, useMemo } from "react";
import { parse, addMinutes, format, isBefore, isAfter, differenceInMinutes } from "date-fns";
import { timeSlots } from '../../utils/classnames';
import { Card, CardHeader, CardTitle, CardContent, Button, Select } from '../ui';
import clsx from 'clsx';

export default function TimeSlots({
                                    coachAvailability,
                                    selectedDate,
                                    selectedTimes,
                                    onToggleTime,
                                    sessionDurations = { min: 30, max: 120 },
                                    selectedCoach,
                                    sessionDetails
                                  }) {
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');

  if (!selectedDate || !coachAvailability) return null;

  const dayKey = format(selectedDate, "EEEE").toLowerCase();
  const ranges = Object.values(coachAvailability?.weeklyAvailability?.[dayKey] || {});
  const displayDate = format(selectedDate, "MMMM d, yyyy");

  // Generate available start times (simplified for example)
  const availableStartTimes = useMemo(() => {
    const times = [];
    ranges.forEach(({ start, end }) => {
      if (!start || !end) return;
      try {
        let current = parse(start, "HH:mm", new Date());
        const endTime = parse(end, "HH:mm", new Date());

        while (isBefore(current, endTime)) {
          times.push({
            time: format(current, "HH:mm"),
            timeObj: new Date(current)
          });
          current = addMinutes(current, 15);
        }
      } catch (err) {
        console.error('Failed to parse time range:', { start, end }, err);
      }
    });

    return times.sort((a, b) => a.timeObj - b.timeObj);
  }, [ranges]);

  const formatTime = (timeStr) => {
    try {
      return format(parse(timeStr, "HH:mm", new Date()), "h:mm a");
    } catch {
      return timeStr;
    }
  };

  const handleAddSession = () => {
    if (selectedStartTime && selectedEndTime) {
      const duration = useMemo(() => {
        if (!selectedStartTime || !selectedEndTime) return 0;
        try {
          const start = parse(selectedStartTime, "HH:mm", new Date());
          const end = parse(selectedEndTime, "HH:mm", new Date());
          return differenceInMinutes(end, start);
        } catch {
          return 0;
        }
      }, [selectedStartTime, selectedEndTime]);

      onToggleTime?.(selectedStartTime, duration, {
        coach: selectedCoach,
        technique: sessionDetails?.technique || "Training Session",
        skillLevel: sessionDetails?.skillLevel || "Intermediate"
      });

      setSelectedStartTime('');
      setSelectedEndTime('');
    }
  };

  if (availableStartTimes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Available Time Slots</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-stone-500 dark:text-stone-400 text-center py-8">
            No available times for {displayDate}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book Training Session</CardTitle>
        <p className="text-sm text-stone-600 dark:text-stone-400">{displayDate}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select
            label="Start Time"
            value={selectedStartTime}
            onChange={(e) => setSelectedStartTime(e.target.value)}
          >
            <option value="">Select start time...</option>
            {availableStartTimes.map(({ time }) => (
              <option key={time} value={time}>
                {formatTime(time)}
              </option>
            ))}
          </Select>

          {selectedStartTime && (
            <Select
              label="End Time"
              value={selectedEndTime}
              onChange={(e) => setSelectedEndTime(e.target.value)}
            >
              <option value="">Select end time...</option>
              {/* Generate end time options based on start time and duration constraints */}
            </Select>
          )}

          {selectedStartTime && selectedEndTime && (
            <div className="bg-stone-50 dark:bg-stone-800 rounded-lg p-4 space-y-2">
              <h4 className="font-medium">Session Preview</h4>
              <div className="text-sm space-y-1">
                <div><span className="font-medium">Trainer:</span> {selectedCoach?.name}</div>
                <div><span className="font-medium">Time:</span> {formatTime(selectedStartTime)} - {formatTime(selectedEndTime)}</div>
                <div><span className="font-medium">Focus:</span> {sessionDetails?.technique || "Training Session"}</div>
              </div>
              <Button onClick={handleAddSession} className="w-full mt-3">
                Add This Session
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}