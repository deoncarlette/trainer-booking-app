import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { dashboard } from '../../utils/classnames';

export default function AvailabilityTab({ availability: initialAvailability }) {
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
    const newSlotKey = `slot${existingSlots.length + 1}`;
    setWeeklyAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [newSlotKey]: { start: "09:00", end: "17:00" }
      }
    }));
  };

  const removeSlot = (day, slotKey) => {
    setWeeklyAvailability(prev => {
      const { [slotKey]: removed, ...rest } = prev[day];
      return { ...prev, [day]: rest };
    });
  };

  const saveAvailability = () => {
    // Here you would typically save to Firebase
    console.log('Saving availability:', weeklyAvailability);
    // You can emit an event or call a prop function to save to Firebase
  };

  const resetToDefault = () => {
    const defaultAvailability = {};
    days.forEach(day => {
      if (day === 'sunday') {
        defaultAvailability[day] = {};
      } else if (day === 'saturday') {
        defaultAvailability[day] = { slot1: { start: "10:00", end: "15:00" } };
      } else {
        defaultAvailability[day] = { slot1: { start: "09:00", end: "17:00" } };
      }
    });
    setWeeklyAvailability(defaultAvailability);
  };

  return (
    <div className={dashboard.section.container}>
      <h3 className={dashboard.section.title}>Weekly Availability</h3>

      <div className={dashboard.section.content}>
        {days.map(day => (
          <div key={day} className="border dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium capitalize dark:text-white">{day}</h4>
              <button
                onClick={() => addSlot(day)}
                className={dashboard.actions.add}
              >
                <Plus className="w-4 h-4" />
                <span>Add Slot</span>
              </button>
            </div>

            <div className="space-y-2">
              {Object.entries(weeklyAvailability[day] || {}).map(([slotKey, slot]) => (
                <div key={slotKey} className="flex items-center space-x-3">
                  <input
                    type="time"
                    value={slot.start || "09:00"}
                    onChange={(e) => updateAvailability(day, slotKey, 'start', e.target.value)}
                    className={dashboard.form.input}
                  />
                  <span className="dark:text-white">to</span>
                  <input
                    type="time"
                    value={slot.end || "17:00"}
                    onChange={(e) => updateAvailability(day, slotKey, 'end', e.target.value)}
                    className={dashboard.form.input}
                  />
                  <button
                    onClick={() => removeSlot(day, slotKey)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {Object.keys(weeklyAvailability[day] || {}).length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 italic">No availability set</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={dashboard.form.buttonGroup}>
        <button
          onClick={saveAvailability}
          className={`${dashboard.form.primaryButton} flex items-center space-x-2`}
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
        <button
          onClick={resetToDefault}
          className={dashboard.form.secondaryButton}
        >
          Reset to Default
        </button>
      </div>
    </div>
  );
}