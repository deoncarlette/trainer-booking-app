import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { dashboard } from '../../utils/classnames';

export default function AvailabilityTab({ availability: initialAvailability, onAvailabilityUpdate, loading }) {
  const [weeklyAvailability, setWeeklyAvailability] = useState({});

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

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
        [nextKey]: { start: "09:00", end: "17:00" }
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
        defaultAvailability[day] = { 0: { start: "10:00", end: "15:00" } };
      } else {
        defaultAvailability[day] = { 0: { start: "09:00", end: "17:00" } };
      }
    });
    setWeeklyAvailability(defaultAvailability);
  };

  return (
    <div className={dashboard.section.container}>
      <h3 className={dashboard.section.title}>Weekly Availability</h3>

      <div className={dashboard.section.content}>
        {days.map(day => (
          <div key={day} className="border dark:border-gray-700 rounded-lg p-3 sm:p-4">
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
              {Object.entries(weeklyAvailability[day] || {}).map(([slotKey, slot]) => (
                <div key={slotKey} className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  {/* Mobile: stack vertically, Desktop: side by side */}
                  <div className="flex items-center space-x-2 sm:space-x-3 flex-1">
                    <input
                      type="time"
                      value={slot.start || "09:00"}
                      onChange={(e) => updateAvailability(day, slotKey, 'start', e.target.value)}
                      className={`${dashboard.form.input} text-sm sm:text-base min-h-[44px]`}
                    />
                    <span className="dark:text-white text-sm sm:text-base px-1 sm:px-0">to</span>
                    <input
                      type="time"
                      value={slot.end || "17:00"}
                      onChange={(e) => updateAvailability(day, slotKey, 'end', e.target.value)}
                      className={`${dashboard.form.input} text-sm sm:text-base min-h-[44px]`}
                    />
                  </div>
                  <button
                    onClick={() => removeSlot(day, slotKey)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors self-center sm:self-auto min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {Object.keys(weeklyAvailability[day] || {}).length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 italic text-sm">No availability set</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={`${dashboard.form.buttonGroup} flex-col sm:flex-row space-y-2 sm:space-y-0`}>
        <button
          onClick={saveAvailability}
          disabled={loading}
          className={`${dashboard.form.primaryButton} flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] w-full sm:w-auto ${
            loading ? 'cursor-wait' : ''
          }`}
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Saving...' : 'Save Changes'}</span>
        </button>
        <button
          onClick={resetToDefault}
          disabled={loading}
          className={`${dashboard.form.secondaryButton} disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] w-full sm:w-auto`}
        >
          Reset to Default
        </button>
      </div>
    </div>
  );
}