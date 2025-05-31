import React from "react";

export default function CalendarSection({ selectedDate, onSelectDate }) {
    const today = new Date();
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = Array.from({ length: firstDay + daysInMonth }, (_, i) => {
        const day = i - firstDay + 1;
        return day > 0 ? new Date(year, month, day) : null;
    });

    const isSameDay = (a, b) =>
        a.getDate() === b.getDate() &&
        a.getMonth() === b.getMonth() &&
        a.getFullYear() === b.getFullYear();

    return (
        <div>
            <h3 className="font-medium mb-3 text-gray-900 dark:text-white">Select a Date</h3>
            <div className="grid grid-cols-7 gap-1">
                {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                    <div key={d} className="text-center text-xs text-gray-500">{d}</div>
                ))}
                {days.map((date, i) => (
                    <div
                        key={i}
                        className={`h-8 flex items-center justify-center rounded-md text-sm cursor-pointer ${
                            date
                                ? isSameDay(date, selectedDate)
                                    ? "bg-green-600 text-white"
                                    : "text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700"
                                : ""
                        }`}
                        onClick={() => date && onSelectDate(date)}
                    >
                        {date?.getDate()}
                    </div>
                ))}
            </div>
        </div>
    );
}
