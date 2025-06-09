import React, { useState } from 'react';

// Custom Time Picker Component
export const TimePicker = ({ value, onChange, className, isDefaultSlot }) => {
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
    <div className={`inline-flex items-center border border-gray-300 dark:border-stone-600 rounded-md shadow-sm bg-white dark:bg-stone-900 ${defaultSlotStyle} ${className || ''}`}>
      <select
        value={hour}
        onChange={(e) => handleTimeChange(e.target.value, minute, period)}
        className="px-2 py-2 outline-none appearance-none bg-transparent dark:text-white text-sm text-center min-h-[44px] w-10 sm:w-12"
      >
        {hourOptions}
      </select>

      <span className="px-2 py-2 dark:text-white text-sm">:</span>

      <select
        value={minute}
        onChange={(e) => handleTimeChange(hour, e.target.value, period)}
        className="px-2 py-2 outline-none appearance-none bg-transparent dark:text-white text-sm text-center min-h-[44px] w-10 sm:w-12"
      >
        {minuteOptions}
      </select>

      <select
        value={period}
        onChange={(e) => handleTimeChange(hour, minute, e.target.value)}
        className="px-2 py-2 outline-none appearance-none bg-transparent dark:text-white text-sm text-center min-h-[44px] border-l border-gray-200 dark:border-stone-600 w-12 sm:w-14"
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
};

export const SessionPicker = ({ value, onChange, className }) => {
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
    <div className={`inline-flex items-center border border-gray-300 dark:border-stone-600 rounded-md shadow-sm bg-white dark:bg-stone-900 ${className || ''}`}>
      <select
        value={minutes}
        onChange={(e) => handleChange(e.target.value)}
        className="px-2 py-2 outline-none appearance-none bg-transparent dark:text-white text-sm text-center min-h-[44px] w-16"
      >
        {minuteOptions}
      </select>
      <span className="px-2 py-2 dark:text-white text-sm border-l border-gray-200 dark:border-stone-600">mins</span>
    </div>
  );
};

// Date picker component for custom availability
export const DateInput = ({ value, onChange, min, className }) => {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      min={min}
      className={`px-3 py-2 border border-gray-300 dark:border-stone-600 rounded bg-white dark:bg-stone-900 text-gray-900 dark:text-white text-sm ${className || ''}`}
    />
  );
};