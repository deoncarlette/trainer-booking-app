import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { dashboard } from '../../utils/classnames';

// Custom Time Picker Component
const TimePicker = ({ value, onChange, className }) => {
  // Convert 24-hour time to 12-hour format
  const convertTo12Hour = (time24) => {
    if (!time24) return { hour: '09', minute: '00', period: 'AM' };

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

  // Generate minute options (00, 15, 30, 45)
  // const minuteOptions = ['00', '15', '30', '45'].map(m => (
  //   <option key={m} value={m}>{m}</option>
  // ));

  // For every 5 minutes (0 to 55)
  const minuteOptions = Array.from({ length: 12 }, (_, i) => {
    const m = (i * 5).toString().padStart(2, '0');
    return <option key={m} value={m}>{m}</option>;
  });

  return (
    <div className={`inline-flex items-center border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 ${className}`}>
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
        className="px-2 py-2 outline-none appearance-none bg-transparent dark:text-white text-sm sm:text-base min-h-[44px] border-l border-gray-200 dark:border-gray-600 ml-1"
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
};

const SessionPicker = ({ value, onChange, className }) => {
  const [minutes, setMinutes] = useState(value || "30");

  // Generate options from 15 to 240 minutes in 5-minute increments
  const minuteOptions = Array.from({ length: 24 }, (_, i) => {
    const mins = 10 + (i * 10); // 10, 20, 30, 40... 240
    return (
      <option key={mins} value={mins}>
        {mins < 10 ? `0${mins}` : mins}
      </option>
    );
  });

  const handleChange = (newMinutes) => {
    setMinutes(newMinutes);
    onChange(newMinutes);
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      <select
        value={minutes}
        onChange={(e) => handleChange(e.target.value)}
        className="px-1.5 py-2.5 outline-none appearance-none bg-transparent dark:text-white text-md text-center"
        style={{width: '50px'}}
      >
        {minuteOptions}
      </select>
      <span className="px-1 dark:text-white text-md">mins</span>
    </div>
  );
};

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
        defaultAvailability[day] = { 0: { start: "17:00", end: "21:00" } };
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
                  {/*<div className="flex items-center space-x-2 sm:space-x-3 flex-1">*/}
                  {/*  <input*/}
                  {/*    type="time"*/}
                  {/*    value={slot.start || "09:00"}*/}
                  {/*    onChange={(e) => updateAvailability(day, slotKey, 'start', e.target.value)}*/}
                  {/*    className={`${dashboard.form.input} text-sm sm:text-base min-h-[44px]`}*/}
                  {/*  />*/}
                  {/*  <span className="dark:text-white text-sm sm:text-base px-1 sm:px-0">to</span>*/}
                  {/*  <input*/}
                  {/*    type="time"*/}
                  {/*    value={slot.end || "17:00"}*/}
                  {/*    onChange={(e) => updateAvailability(day, slotKey, 'end', e.target.value)}*/}
                  {/*    className={`${dashboard.form.input} text-sm sm:text-base min-h-[44px]`}*/}
                  {/*  />*/}
                  {/*</div>*/}
                  <div className="flex items-center space-x-2 sm:space-x-3 flex-1">
                    <TimePicker
                      value={slot.start || "09:00"}
                      onChange={(value) => updateAvailability(day, slotKey, 'start', value)}
                      className={dashboard.form.timePicker}
                    />
                    <span className="dark:text-white text-sm sm:text-base px-1 sm:px-0">to</span>
                    <TimePicker
                      value={slot.end || "17:00"}
                      onChange={(value) => updateAvailability(day, slotKey, 'end', value)}
                      className={dashboard.form.timePicker}
                    />

                    <span className="p-4"></span>

                    {/* Session Length Dropdown */}
                    <div className="flex items-center space-x-2 ml-4">
                      <span className="dark:text-white text-sm whitespace-nowrap">Session:</span>

                      <SessionPicker
                        value={slot.minSessionLength || "30"}
                        onChange={(value) => updateAvailability(day, slotKey, 'minSessionLength', value)}
                        className={dashboard.form.timePicker}
                      />

                      <span className="dark:text-white text-sm">to</span>

                      <SessionPicker
                        value={slot.maxSessionLength || "120"}
                        onChange={(value) => updateAvailability(day, slotKey, 'maxSessionLength', value)}
                        className={dashboard.form.timePicker}
                      />
                    </div>


                  </div>

                  <button
                    onClick={() => removeSlot(day, slotKey)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors self-center sm:self-auto min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4"/>
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
          <Save className="w-4 h-4"/>
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