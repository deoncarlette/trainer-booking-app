import React, { useEffect, useState } from "react";
import { eachDayOfInterval, format, addDays } from "date-fns";

function generateWeekAvailability(weekly, custom, weekStartDate) {
  const days = eachDayOfInterval({ start: weekStartDate, end: addDays(weekStartDate, 6) });

  return days.map((date) => {
    const dayKey = format(date, "EEEE").toLowerCase(); // e.g., 'monday'
    const dateStr = format(date, "yyyy-MM-dd");

    const baseSlots = weekly?.[dayKey] || [];
    const customSlots = custom?.[dateStr] || [];

    return {
      date: dateStr,
      slots: customSlots.length > 0 ? customSlots : baseSlots,
    };
  });
}

export default function CalendarSection({ coachAvailability, selectedDate, onSelectDate }) {
  const [viewDate, setViewDate] = useState(selectedDate || new Date());


  const isSameDay = (a, b) =>
    a &&
    b &&
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  const isAvailable = (date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const dayKey = format(date, "EEEE").toLowerCase();

    if (coachAvailability.unavailableDates?.includes(dateStr)) return false;

    const custom = coachAvailability.customAvailability?.[dateStr];
    const weekly = coachAvailability.weeklyAvailability?.[dayKey];

    const customHasSlots = custom && Object.keys(custom).length > 0;
    const weeklyHasSlots = weekly && Object.keys(weekly).length > 0;

    return customHasSlots || weeklyHasSlots;
  };

  const formatMonthYear = (date) =>
    date.toLocaleDateString("default", { month: "long", year: "numeric" });

  const goToPreviousMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(viewDate.getMonth() - 1);
    setViewDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(viewDate.getMonth() + 1);
    setViewDate(newDate);
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = Array.from({ length: firstDay + daysInMonth }, (_, i) => {
    const day = i - firstDay + 1;
    return day > 0 ? new Date(year, month, day) : null;
  });

  return (
    <div className="w-full p-4 rounded-md bg-white dark:bg-stone-900 dark:text-stone-100 shadow-md mb-5">
      <h3 className="font-medium mb-3 text-gray-900 dark:text-white">Select a Date</h3>

      <div className="border border-gray-200 rounded-lg">
        {/* Month Navigation */}
        <div className="flex justify-between items-center mb-2 border border-gray-300 p-3">
          <button
            onClick={goToPreviousMonth}
            className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
            ←
          </button>
          <span className="text-gray-800 dark:text-gray-200 font-semibold">
            {formatMonthYear(viewDate)}
          </span>
          <button
            onClick={goToNextMonth}
            className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
            →
          </button>
        </div>

        {/* Weekday Labels */}
        <div className="grid grid-cols-7 gap-1 mb-1 text-center text-xs text-gray-500 dark:text-gray-400">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i}>{d}</div>
          ))}
        </div>

        {/* Date Cells */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, i) => {
            const selected = isSameDay(date, selectedDate);
            const available = date && isAvailable(date);

            return (
              <div
                key={i}
                className={`h-8 flex items-center justify-center rounded-md text-sm transition
                  ${!date
                  ? ""
                  : selected
                    ? "bg-green-600 text-white"
                    : available
                      ? "text-gray-900 dark:text-white cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                      : "bg-gray-200 text-stone-400 dark:bg-stone-700 dark:text-stone-500 cursor-not-allowed"
                }`}
                onClick={() => available && onSelectDate(date)}
              >
                {date?.getDate()}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}