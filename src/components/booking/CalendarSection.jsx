
// src/components/booking/CalendarSection.jsx
import React, { useState } from "react";
import { eachDayOfInterval, format, addDays } from "date-fns";
import { calendar } from '../../utils/classnames';
import { Card, CardHeader, CardTitle, CardContent } from '../ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

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
    <Card>
      <CardHeader>
        <CardTitle>Select a Date</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Month Navigation */}
        <div className={calendar.header}>
          <button
            onClick={goToPreviousMonth}
            className={calendar.navButton}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className={calendar.monthTitle}>
            {formatMonthYear(viewDate)}
          </span>
          <button
            onClick={goToNextMonth}
            className={calendar.navButton}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Weekday Labels */}
        <div className={calendar.weekdays}>
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i}>{d}</div>
          ))}
        </div>

        {/* Date Grid */}
        <div className={calendar.dates}>
          {days.map((date, i) => {
            const selected = isSameDay(date, selectedDate);
            const available = date && isAvailable(date);

            return (
              <div
                key={i}
                className={clsx(
                  calendar.date.base,
                  {
                    [calendar.date.selected]: selected,
                    [calendar.date.available]: !selected && available,
                    [calendar.date.unavailable]: !selected && !available && date,
                  }
                )}
                onClick={() => available && onSelectDate(date)}
              >
                {date?.getDate()}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
