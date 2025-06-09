import React from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { dashboard } from '../../utils/classnames';
import { TimePicker, SessionPicker } from './AvailabilityComponents';

// Helper function to check if a slot is in default state (12am-12am)
const isDefaultSlot = (slot) => {
  return slot.start === "00:00" && slot.end === "00:00";
};

export default function WeeklyScheduleTab({
                                            weeklyAvailability,
                                            setWeeklyAvailability,
                                            onAvailabilityUpdate,
                                            loading
                                          }) {
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

  const updateAvailability = (day, slotKey, field, value) => {
    setWeeklyAvailability(prev => ({
      ...prev,
      [day]: {
        ...(prev[day] || {}),
        [slotKey]: {
          ...(prev[day]?.[slotKey] || {}),
          [field]: value
        }
      }
    }));
  };

  const addSlot = (day) => {
    const daySlots = weeklyAvailability[day] || {};
    const existingSlots = Object.keys(daySlots);
    const existingNumbers = existingSlots.map(key => parseInt(key)).filter(num => !isNaN(num));
    const nextKey = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 0;

    setWeeklyAvailability(prev => ({
      ...prev,
      [day]: {
        ...(prev[day] || {}),
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

  const saveAvailability = async () => {
    if (onAvailabilityUpdate) {
      await onAvailabilityUpdate(weeklyAvailability);
    }
  };

  return (
    <>
      {days.map(day => (
        <div key={day} className="border dark:border-stone-700 rounded-lg p-3 sm:p-4 mb-4 bg-gray-50 dark:bg-black">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium capitalize dark:text-white">{day}</h4>
            <button
              onClick={() => addSlot(day)}
              className="inline-flex items-center px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm rounded transition-colors space-x-1"
            >
              <Plus className="w-3 h-3" />
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
                  {/* Mobile Layout - Vertical stacking for better space usage */}
                  <div className="block sm:hidden space-y-3">
                    {/* Time Range Section */}
                    <div className="space-y-2">
                      {index === 0 && (
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-2">Time Range</span>
                      )}
                      <div className="flex items-center space-x-2">
                        <span className="dark:text-white text-sm w-12">Start:</span>
                        <TimePicker
                          value={slot.start || "00:00"}
                          onChange={(value) => updateAvailability(day, slotKey, 'start', value)}
                          isDefaultSlot={isDefaultSlot(slot)}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="dark:text-white text-sm w-12">Stop:</span>
                        <TimePicker
                          value={slot.end || "00:00"}
                          onChange={(value) => updateAvailability(day, slotKey, 'end', value)}
                          isDefaultSlot={isDefaultSlot(slot)}
                        />
                      </div>
                    </div>

                    {/* Session Duration Section */}
                    <div className="space-y-2">
                      {index === 0 && (
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-2">Session Duration</span>
                      )}
                      <div className="flex items-center space-x-2">
                        <span className="dark:text-white text-sm w-12">Min:</span>
                        <SessionPicker
                          value={slot.minSessionLength || "30"}
                          onChange={(value) => updateAvailability(day, slotKey, 'minSessionLength', value)}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="dark:text-white text-sm w-12">Max:</span>
                        <SessionPicker
                          value={slot.maxSessionLength || "120"}
                          onChange={(value) => updateAvailability(day, slotKey, 'maxSessionLength', value)}
                        />
                      </div>
                    </div>

                    {/* Delete Button */}
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => removeSlot(day, slotKey)}
                        className="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4"/>
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
                      className={`p-1.5 sm:p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors min-h-[36px] sm:min-h-[44px] min-w-[36px] sm:min-w-[44px] flex items-center justify-center flex-shrink-0 ${index === 0 ? 'mt-4 sm:mt-6' : ''}`}
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4"/>
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
    </>
  );
}