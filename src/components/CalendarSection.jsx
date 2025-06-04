import React, { useState } from "react";
import { eachDayOfInterval, format, parseISO, startOfWeek, addDays } from "date-fns";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // your config file

async function fetchTrainerAvailability(trainerId) {
  const ref = doc(db, "trainers", trainerId);
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data();
  throw new Error("Trainer not found");
}

export default function CalendarSection({ trainerId, selectedDate, onSelectDate }) {
  const [viewDate, setViewDate] = useState(selectedDate || new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = Array.from({ length: firstDay + daysInMonth }, (_, i) => {
    const day = i - firstDay + 1;
    return day > 0 ? new Date(year, month, day) : null;
  });

  const isSameDay = (a, b) =>
    a &&
    b &&
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

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
          {days.map((date, i) => (
            <div
              key={i}
              className={`h-8 flex items-center justify-center rounded-md text-sm cursor-pointer transition
                            ${!date ? "" :
                isSameDay(date, selectedDate)
                  ? "bg-green-600 text-white"
                  : "text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              onClick={() => date && onSelectDate(date)}
            >
              {date?.getDate()}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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