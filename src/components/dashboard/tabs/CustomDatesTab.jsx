import React from 'react';
import { Plus, Trash2, Save, Calendar } from 'lucide-react';
import { dashboard } from '../../../utils';
import { TimePicker, SessionPicker, DateInput } from './AvailabilityComponents';

// Helper function to check if a slot is in default state (12am-12am)
const isDefaultSlot = (slot) => {
  return slot.start === "00:00" && slot.end === "00:00";
};

export default function CustomDatesTab({
                                         customAvailability,
                                         setCustomAvailability,
                                         onCustomAvailabilityUpdate,
                                         loading
                                       }) {
  const today = new Date().toISOString().split('T')[0];

  const addCustomDate = () => {
    const newDate = today;
    setCustomAvailability(prev => ({
      ...prev,
      [newDate]: {
        0: {
          start: "00:00",
          end: "00:00",
          minSessionLength: "30",
          maxSessionLength: "120"
        }
      }
    }));
  };

  const removeCustomDate = (date) => {
    setCustomAvailability(prev => {
      const { [date]: removed, ...rest } = prev;
      return rest;
    });
  };

  const updateCustomAvailability = (date, slotKey, field, value) => {
    setCustomAvailability(prev => ({
      ...prev,
      [date]: {
        ...(prev[date] || {}),
        [slotKey]: {
          ...(prev[date]?.[slotKey] || {}),
          [field]: value
        }
      }
    }));
  };

  const addCustomSlot = (date) => {
    const dateSlots = customAvailability[date] || {};
    const existingSlots = Object.keys(dateSlots);
    const existingNumbers = existingSlots.map(key => parseInt(key)).filter(num => !isNaN(num));
    const nextKey = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 0;

    setCustomAvailability(prev => ({
      ...prev,
      [date]: {
        ...(prev[date] || {}),
        [nextKey]: {
          start: "00:00",
          end: "00:00",
          minSessionLength: "30",
          maxSessionLength: "120"
        }
      }
    }));
  };

  const removeCustomSlot = (date, slotKey) => {
    setCustomAvailability(prev => {
      const dateSlots = prev[date] || {};
      const { [slotKey]: removed, ...rest } = dateSlots;

      // If no slots left, remove the entire date
      if (Object.keys(rest).length === 0) {
        const { [date]: removedDate, ...restDates } = prev;
        return restDates;
      }

      return {
        ...prev,
        [date]: rest
      };
    });
  };

  const updateCustomDate = (oldDate, newDate) => {
    if (newDate !== oldDate && !customAvailability[newDate]) {
      setCustomAvailability(prev => {
        const { [oldDate]: slots, ...rest } = prev;
        return { ...rest, [newDate]: slots };
      });
    }
  };

  const sortedCustomDates = Object.keys(customAvailability).sort();

  const saveCustomAvailability = async () => {
    if (onCustomAvailabilityUpdate) {
      await onCustomAvailabilityUpdate(customAvailability);
    }
  };

  return (
    <>
      <div className="mb-6">
        <button
          onClick={addCustomDate}
          className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Date</span>
        </button>
      </div>

      {sortedCustomDates.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No custom dates set</p>
          <p className="text-sm text-gray-400 mt-2">Add custom availability for specific dates that differ from your weekly schedule</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedCustomDates.map(date => (
            <div key={date} className="border dark:border-stone-700 rounded-lg p-4 bg-gray-50 dark:bg-black">
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-1 sm:space-y-0">
                  <DateInput
                    value={date}
                    onChange={(newDate) => updateCustomDate(date, newDate)}
                    min={today}
                    className="font-medium"
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })})
                  </span>
                </div>
                <button
                  onClick={() => addCustomSlot(date)}
                  className="inline-flex items-center px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded transition-colors space-x-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Slot</span>
                </button>
              </div>

              <div className="space-y-3">
                {Object.entries(customAvailability[date] || {}).map(([slotKey, slot], index) => (
                  <div key={slotKey}>
                    {/* Separator for stacked slots (not first slot) */}
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
                              onChange={(value) => updateCustomAvailability(date, slotKey, 'start', value)}
                              isDefaultSlot={isDefaultSlot(slot)}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="dark:text-white text-sm w-12">Stop:</span>
                            <TimePicker
                              value={slot.end || "00:00"}
                              onChange={(value) => updateCustomAvailability(date, slotKey, 'end', value)}
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
                              onChange={(value) => updateCustomAvailability(date, slotKey, 'minSessionLength', value)}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="dark:text-white text-sm w-12">Max:</span>
                            <SessionPicker
                              value={slot.maxSessionLength || "120"}
                              onChange={(value) => updateCustomAvailability(date, slotKey, 'maxSessionLength', value)}
                            />
                          </div>
                        </div>

                        {/* Delete Button */}
                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => removeCustomSlot(date, slotKey)}
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
                                onChange={(value) => updateCustomAvailability(date, slotKey, 'start', value)}
                                isDefaultSlot={isDefaultSlot(slot)}
                              />
                              <span className="dark:text-white text-sm whitespace-nowrap">Stop:</span>
                              <TimePicker
                                value={slot.end || "00:00"}
                                onChange={(value) => updateCustomAvailability(date, slotKey, 'end', value)}
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
                                onChange={(value) => updateCustomAvailability(date, slotKey, 'minSessionLength', value)}
                              />
                              <span className="dark:text-white text-sm whitespace-nowrap">Max:</span>
                              <SessionPicker
                                value={slot.maxSessionLength || "120"}
                                onChange={(value) => updateCustomAvailability(date, slotKey, 'maxSessionLength', value)}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Delete Button - Always on right, aligned properly */}
                        <button
                          onClick={() => removeCustomSlot(date, slotKey)}
                          className={`p-1.5 sm:p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors min-h-[36px] sm:min-h-[44px] min-w-[36px] sm:min-w-[44px] flex items-center justify-center flex-shrink-0 ${index === 0 ? 'mt-4 sm:mt-6' : ''}`}
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4"/>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {Object.keys(customAvailability[date] || {}).length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400 italic text-sm text-center py-4">No time slots set for this date</p>
                )}
              </div>

              {/* Delete Date Button */}
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-stone-600">
                <button
                  onClick={() => removeCustomDate(date)}
                  className="inline-flex items-center px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400 rounded transition-colors space-x-2 text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Date</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
          Custom Date Availability
        </h4>
        <p className="text-sm text-blue-800 dark:text-blue-400">
          Set specific availability for dates that differ from your weekly schedule. Custom dates override your weekly availability for those specific days.
        </p>
      </div>

      <div className="mt-6">
        <button
          onClick={saveCustomAvailability}
          disabled={loading}
          className={`${dashboard.form.primaryButton} flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] w-full sm:w-auto text-base ${
            loading ? 'cursor-wait' : ''
          }`}
        >
          <Save className="w-5 h-5"/>
          <span>{loading ? 'Saving...' : 'Save Custom Dates'}</span>
        </button>
      </div>
    </>
  );
}