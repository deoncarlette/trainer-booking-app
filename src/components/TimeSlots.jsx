import React, { useState } from "react";
import { parse, addMinutes, format, isBefore, isAfter } from "date-fns";
import { timeSlots } from '../utils/classnames';
import clsx from 'clsx';


/**
 * Converts an array of {start, end} objects into 30-minute intervals
 */
function generate30MinSlotsFromRanges(ranges) {
  const slots = [];

  ranges.forEach(({ start, end }, idx) => {
    if (!start || !end) {
      console.warn(`⛔ Skipping invalid range at index ${idx}:`, { start, end });
      return;
    }

    try {
      let current = parse(start, "HH:mm", new Date());
      const endTime = parse(end, "HH:mm", new Date());

      while (isBefore(current, endTime)) {
        const next = addMinutes(current, 30);
        if (isAfter(next, endTime)) break;

        slots.push({
          start: format(current, "HH:mm"),
          end: format(next, "HH:mm"),
        });

        current = next;
      }
    } catch (err) {
      console.error(`❌ Failed to parse time block: { start: ${start}, end: ${end} }`, err);
    }
  });

  return slots;
}

/**
 * TimeSlots component
 * @param {{
 *   coachAvailability: object,
 *   selectedDate: Date,
 *   selectedTimes: string[],
 *   onToggleTime: (time: string) => void
 * }}
 */
export default function TimeSlots({
                                    coachAvailability,
                                    selectedDate,
                                    selectedTimes,
                                    onToggleTime
                                  }) {
  if (!selectedDate || !coachAvailability) return null;

  const dayKey = format(selectedDate, "EEEE").toLowerCase();
  const ranges = Object.values(coachAvailability?.weeklyAvailability?.[dayKey] || {});
  const slots = generate30MinSlotsFromRanges(ranges);
  const displayDate = format(selectedDate, "MMMM d, yyyy");

  return (
    <div className={timeSlots.container}>
      <h3 className={timeSlots.heading}>Available Time Slots</h3>
      <p className={timeSlots.dateDisplay}>{displayDate}</p>

      {slots.length === 0 ? (
        <p className={timeSlots.emptyState}>No available times</p>
      ) : (
        <div className={timeSlots.grid}>
          {slots.map(({ start, end }) => {
            const isSelected = selectedTimes?.includes(start);

            return (
              <button
                key={`${start}-${end}`}
                onClick={() => onToggleTime?.(start)}
                className={clsx(
                  timeSlots.slotButton.base,
                  isSelected ? timeSlots.slotButton.selected : timeSlots.slotButton.available
                )}
              >
                {format(parse(start, "HH:mm", new Date()), "h:mm a")}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

