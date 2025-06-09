// Helper function to check if a slot is in default state (12am-12am)
const isDefaultSlot = (slot) => {
  return slot.start === "00:00" && slot.end === "00:00";
};

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { dashboard } from '../../utils/classnames';

// Custom Time Picker Component
const TimePicker = ({ value, onChange, className, isDefaultSlot }) => {
  // Convert 24-hour time to 12-hour format
  const convertTo12Hour = (time24) => {
    if (!time24) return { hour: '12', minute: '00', period: 'AM' };

    const [hours, minutes] = time24.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const period = hour24 >= 12 ? 'PM' : 'AM';

    return {
      hour: hour12.toString().padStart(2, '0'),
      minute: minutes,
      period
    };
  };

  // Convert 12-hour format to 24-hour time
  const convertTo24Hour = (hour, minute, period) => {
    let hour24 = parseInt(hour);
    if (period === 'AM' && hour24 === 12) hour24 = 0;
    if (period === 'PM' && hour24 !== 12) hour24 += 12;
    return `${hour24.toString().padStart(2, '0')}:${minute}`;
  };

  const { hour, minute, period } = convertTo12Hour(value);

  const handleTimeChange = (newHour, newMinute, newPeriod) => {
    const time24 = convertTo24Hour(newHour || hour, newMinute || minute, newPeriod || period);
    onChange(time24);
  };

  // Generate hour options (1-12)
  const hourOptions = Array.from({ length: 12 }, (_, i) => {
    const h = (i + 1).toString().padStart(2, '0');
    return <option key={h} value={h}>{h}</option>;
  });

  // For every 5 minutes (0 to 55)
  const minuteOptions = Array.from({ length: 12 }, (_, i) => {
    const m = (i * 5).toString().padStart(2, '0');
    return <option key={m} value={m}>{m}</option>;
  });

  // Style for default slots (12am-12am)
  const defaultSlotStyle = isDefaultSlot ? 'border-dashed border-2 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' : '';

  return (
    <div className={`inline-flex items-center border border-gray-300 dark:border-stone-600 rounded-md shadow-sm bg-white dark:bg-stone-900 ${defaultSlotStyle} ${className}`}>
      <select
        value={hour}
        onChange={(e) => handleTimeChange(e.target.value, minute, period)}
        className="px-2 py-2 outline-none appearance-none bg-transparent dark:text-white text-sm sm:text-base min-h-[44px]"
      >
        {hourOptions}
      </select>

      <span className="px-1 dark:text-white">:</span>

      <select
        value={minute}
        onChange={(e) => handleTimeChange(hour, e.target.value, period)}
        className="px-2 py-2 outline-none appearance-none bg-transparent dark:text-white text-sm sm:text-base min-h-[44px]"
      >
        {minuteOptions}
      </select>

      <select
        value={period}
        onChange={(e) => handleTimeChange(hour, minute, e.target.value)}
        className="px-2 py-2 outline-none appearance-none bg-transparent dark:text-white text-sm sm:text-base min-h-[44px] border-l border-gray-200 dark:border-stone-600 ml-1"
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
};

const SessionPicker = ({ value, onChange, className }) => {
  const [minutes, setMinutes] = useState(value || "30");

  // Generate options from 10 to 240 minutes in 10-minute increments
  const minuteOptions = Array.from({ length: 24 }, (_, i) => {
    const mins = 10 + (i * 10); // 10, 20, 30, 40... 240
    return (
      <option key={mins} value={mins}>
        {mins}
      </option>
    );
  });

  const handleChange = (newMinutes) => {
    setMinutes(newMinutes);
    onChange(newMinutes);
  };

  return (
    <div className="inline-flex items-center border border-gray-300 dark:border-stone-600 rounded-md shadow-sm bg-white dark:bg-stone-900">
      <select
        value={minutes}
        onChange={(e) => handleChange(e.target.value)}
        className="px-2 py-2 outline-none appearance-none bg-transparent dark:text-white text-sm sm:text-base text-center min-h-[44px]"
        style={{width: '66px'}}
      >
        {minuteOptions}
      </select>
      <span className="px-2 py-2 dark:text-white text-sm sm:text-base border-l border-gray-200 dark:border-stone-600">mins</span>
    </div>
  );
};

export default function AvailabilityTab({ availability: initialAvailability, onAvailabilityUpdate, loading }) {
  const [weeklyAvailability, setWeeklyAvailability] = useState({});

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  // Helper function to convert time to minutes for comparison
  const timeToMinutes = (time24) => {
    if (!time24) return 0;
    const [hours, minutes] = time24.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Helper function to convert minutes back to 24-hour time
  const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // Function to merge overlapping slots for a specific day
  const mergeOverlappingSlots = (day) => {
    const daySlots = weeklyAvailability[day] || {};
    if (Object.keys(daySlots).length < 2) return;

    // Get non-default slots and sort by start time
    const slotsArray = Object.entries(daySlots)
      .filter(([, slot]) => !isDefaultSlot(slot))
      .map(([key, slot]) => ({
        key,
        ...slot,
        startMinutes: timeToMinutes(slot.start),
        endMinutes: timeToMinutes(slot.end)
      }))
      .sort((a, b) => a.startMinutes - b.startMinutes);

    if (slotsArray.length < 2) return;

    // Merge overlapping ranges
    const merged = [];
    const slotsToRemove = new Set();
    let current = { ...slotsArray[0] };

    for (let i = 1; i < slotsArray.length; i++) {
      const next = slotsArray[i];

      // Check if ranges overlap
      if (current.endMinutes > next.startMinutes) {
        // Merge ranges - extend current to include next
        current.endMinutes = Math.max(current.endMinutes, next.endMinutes);
        // Keep the wider session duration range
        current.minSessionLength = Math.min(
          parseInt(current.minSessionLength),
          parseInt(next.minSessionLength)
        ).toString();
        current.maxSessionLength = Math.max(
          parseInt(current.maxSessionLength),
          parseInt(next.maxSessionLength)
        ).toString();
        // Mark the next slot for removal
        slotsToRemove.add(next.key);
      } else {
        // No overlap, add current to merged and move to next
        merged.push(current);
        current = { ...next };
      }
    }

    // Add the last range
    merged.push(current);

    // Update the state
    setWeeklyAvailability(prev => {
      const newDaySlots = { ...prev[day] };

      // Remove merged slots
      slotsToRemove.forEach(key => {
        delete newDaySlots[key];
      });

      // Update the first merged slot with new times
      if (merged.length > 0) {
        const firstMerged = merged[0];
        newDaySlots[firstMerged.key] = {
          start: minutesToTime(firstMerged.startMinutes),
          end: minutesToTime(firstMerged.endMinutes),
          minSessionLength: firstMerged.minSessionLength,
          maxSessionLength: firstMerged.maxSessionLength
        };
      }

      return {
        ...prev,
        [day]: newDaySlots
      };
    });
  };

  // Function to sort slots by time without merging (put default slots at end)
  const sortSlots = (slotsObject) => {
    if (!slotsObject || Object.keys(slotsObject).length === 0) return {};

    // Convert to array, sort by start time, then convert back to object
    // Put default slots (12am-12am) at the end
    const sortedEntries = Object.entries(slotsObject)
      .sort(([, a], [, b]) => {
        const aIsDefault = isDefaultSlot(a);
        const bIsDefault = isDefaultSlot(b);

        // Default slots go to the end
        if (aIsDefault && !bIsDefault) return 1;
        if (!aIsDefault && bIsDefault) return -1;
        if (aIsDefault && bIsDefault) return 0;

        // Both are real slots, sort by time
        return timeToMinutes(a.start) - timeToMinutes(b.start);
      });

    // Return as object with original keys preserved
    return Object.fromEntries(sortedEntries);
  };

  // Function to detect overlapping slots for display warning (skip default slots)
  const hasOverlappingSlots = (slotsObject) => {
    if (!slotsObject || Object.keys(slotsObject).length < 2) return false;

    const sortedSlots = Object.values(slotsObject)
      .filter(slot => !isDefaultSlot(slot)) // Only check non-default slots
      .map(slot => ({
        start: timeToMinutes(slot.start),
        end: timeToMinutes(slot.end)
      }))
      .sort((a, b) => a.start - b.start);

    for (let i = 0; i < sortedSlots.length - 1; i++) {
      if (sortedSlots[i].end > sortedSlots[i + 1].start) {
        return true;
      }
    }
    return false;
  };

  // Initialize availability from Firebase data
  useEffect(() => {
    if (initialAvailability?.weeklyAvailability) {
      setWeeklyAvailability(initialAvailability.weeklyAvailability);
    } else {
      // Default availability structure
      const defaultAvailability = {};
      days.forEach(day => {
        defaultAvailability[day] = {};
      });
      setWeeklyAvailability(defaultAvailability);
    }
  }, [initialAvailability]);

  const updateAvailability = (day, slotKey, field, value) => {
    setWeeklyAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [slotKey]: {
          ...prev[day]?.[slotKey],
          [field]: value
        }
      }
    }));
  };

  const addSlot = (day) => {
    const existingSlots = Object.keys(weeklyAvailability[day] || {});
    const existingNumbers = existingSlots.map(key => parseInt(key)).filter(num => !isNaN(num));
    const nextKey = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 0;

    setWeeklyAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [nextKey]: {
          start: "00:00",
          end: "00:00",
          minSessionLength: "30",
          maxSessionLength: "120"
        }
      }
    }));
  };

  const removeSlot = (day, slotKey) => {
    setWeeklyAvailability(prev => {
      const daySlots = prev[day] || {};
      const { [slotKey]: removed, ...rest } = daySlots;
      return {
        ...prev,
        [day]: rest
      };
    });
  };

  const saveAvailability = async () => {
    if (onAvailabilityUpdate) {
      await onAvailabilityUpdate(weeklyAvailability);
    }
  };

  const resetToDefault = () => {
    const defaultAvailability = {};
    days.forEach(day => {
      if (day === 'sunday') {
        defaultAvailability[day] = {};
      } else if (day === 'saturday') {
        defaultAvailability[day] = {
          0: {
            start: "10:00",
            end: "15:00",
            minSessionLength: "30",
            maxSessionLength: "120"
          }
        };
      } else {
        defaultAvailability[day] = {
          0: {
            start: "17:00",
            end: "21:00",
            minSessionLength: "30",
            maxSessionLength: "120"
          }
        };
      }
    });
    setWeeklyAvailability(defaultAvailability);
  };

  return (
    <div className={dashboard.section.container}>
      <div className={dashboard.section.header}>
        <h3 className={dashboard.section.title}>Weekly Availability</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Set your available hours and session durations. Time slots are automatically sorted by start time.
        </p>
      </div>

      <div className={dashboard.section.content}>
        {days.map(day => (
          <div key={day} className="border dark:border-stone-700 rounded-lg p-3 sm:p-4 mb-4 bg-gray-50 dark:bg-black">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 space-y-2 sm:space-y-0">
              <h4 className="font-medium capitalize dark:text-white">{day}</h4>
              <button
                onClick={() => addSlot(day)}
                className={`${dashboard.actions.add} w-full sm:w-auto justify-center sm:justify-start`}
              >
                <Plus className="w-4 h-4" />
                <span>Add Slot</span>
              </button>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {hasOverlappingSlots(weeklyAvailability[day]) && (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <div className="flex items-start space-x-2">
                      <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">⚠️</span>
                      <span className="text-sm text-yellow-800 dark:text-yellow-300">
                        You have overlapping time slots. Would you like to merge them to avoid conflicts?
                      </span>
                    </div>
                    <button
                      onClick={() => mergeOverlappingSlots(day)}
                      className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded transition-colors w-full sm:w-auto sm:ml-3 whitespace-nowrap"
                    >
                      Merge Slots
                    </button>
                  </div>
                </div>
              )}

              {Object.values(weeklyAvailability[day] || {}).some(slot => isDefaultSlot(slot)) && (
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded text-sm text-blue-800 dark:text-blue-300">
                  💡 New slots start at 12:00 AM - 12:00 AM. Please update them with your actual availability times.
                </div>
              )}

              {Object.entries(sortSlots(weeklyAvailability[day] || {})).map(([slotKey, slot], index) => (
                <div key={slotKey}>
                  {/* Separator for stacked slots (not first slot) - shows when desktop layout wraps */}
                  {index > 0 && (
                    <div className="border-t border-gray-300 dark:border-stone-600 mx-3 mb-3"></div>
                  )}

                  <div className="rounded-lg p-3">
                    {/* Mobile Layout - Cleaner and more compact */}
                    <div className="block sm:hidden space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="dark:text-white text-sm">Start:</span>
                          <TimePicker
                            value={slot.start || "00:00"}
                            onChange={(value) => updateAvailability(day, slotKey, 'start', value)}
                            className="flex-shrink-0"
                            isDefaultSlot={isDefaultSlot(slot)}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="dark:text-white text-sm">Stop:</span>
                          <TimePicker
                            value={slot.end || "00:00"}
                            onChange={(value) => updateAvailability(day, slotKey, 'end', value)}
                            className="flex-shrink-0"
                            isDefaultSlot={isDefaultSlot(slot)}
                          />
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="flex items-center space-x-2">
                          <span className="dark:text-white text-sm">Min:</span>
                          <SessionPicker
                            value={slot.minSessionLength || "30"}
                            onChange={(value) => updateAvailability(day, slotKey, 'minSessionLength', value)}
                          />
                        </div>
                        <div className="flex items-center space-x-2 ml-auto">
                          <span className="dark:text-white text-sm">Max:</span>
                          <SessionPicker
                            value={slot.maxSessionLength || "120"}
                            onChange={(value) => updateAvailability(day, slotKey, 'maxSessionLength', value)}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => removeSlot(day, slotKey)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4"/>
                        </button>
                      </div>
                    </div>

                    {/* Desktop Layout - Better spacing and wrapping */}
                    <div className="hidden sm:flex sm:items-start sm:justify-between sm:gap-8">
                      <div className="flex flex-wrap gap-8 lg:gap-12 flex-1">
                        {/* Time Range Group */}
                        <div className="flex flex-col space-y-2 flex-shrink-0 min-w-0">
                          {index === 0 && (
                            <span className="dark:text-white text-sm font-medium">Time Range</span>
                          )}
                          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                            <span className="dark:text-white text-sm whitespace-nowrap">Start:</span>
                            <TimePicker
                              value={slot.start || "00:00"}
                              onChange={(value) => updateAvailability(day, slotKey, 'start', value)}
                              isDefaultSlot={isDefaultSlot(slot)}
                            />
                            <span className="dark:text-white text-sm whitespace-nowrap">Stop:</span>
                            <TimePicker
                              value={slot.end || "00:00"}
                              onChange={(value) => updateAvailability(day, slotKey, 'end', value)}
                              isDefaultSlot={isDefaultSlot(slot)}
                            />
                          </div>
                        </div>

                        {/* Session Duration Group */}
                        <div className="flex flex-col space-y-2 flex-shrink-0 min-w-0">
                          {index === 0 && (
                            <span className="dark:text-white text-sm font-medium">Session Duration</span>
                          )}
                          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                            <span className="dark:text-white text-sm whitespace-nowrap">Min:</span>
                            <SessionPicker
                              value={slot.minSessionLength || "30"}
                              onChange={(value) => updateAvailability(day, slotKey, 'minSessionLength', value)}
                            />
                            <span className="dark:text-white text-sm whitespace-nowrap">Max:</span>
                            <SessionPicker
                              value={slot.maxSessionLength || "120"}
                              onChange={(value) => updateAvailability(day, slotKey, 'maxSessionLength', value)}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Delete Button - Always on right, aligned properly */}
                      <button
                        onClick={() => removeSlot(day, slotKey)}
                        className={`p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0 ${index === 0 ? 'mt-6' : ''}`}
                      >
                        <Trash2 className="w-4 h-4"/>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {Object.keys(sortSlots(weeklyAvailability[day] || {})).length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 italic text-sm text-center py-4">No availability set</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
          Smart Time Management
        </h4>
        <p className="text-sm text-blue-800 dark:text-blue-400">
          New slots start at 12:00 AM - 12:00 AM and won't cause conflicts until you set real times.
          Time slots are automatically sorted by start time. When overlaps are detected, you can choose to merge them with a single click.
        </p>
      </div>

      <div className={`${dashboard.form.buttonGroup} flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 mt-6`}>
        <button
          onClick={saveAvailability}
          disabled={loading}
          className={`${dashboard.form.primaryButton} flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] w-full sm:w-auto text-base ${
            loading ? 'cursor-wait' : ''
          }`}
        >
          <Save className="w-5 h-5"/>
          <span>{loading ? 'Saving...' : 'Save Changes'}</span>
        </button>
        <button
          onClick={resetToDefault}
          disabled={loading}
          className={`${dashboard.form.secondaryButton} disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] w-full sm:w-auto text-base`}
        >
          Reset to Default
        </button>
      </div>
    </div>
  );
}