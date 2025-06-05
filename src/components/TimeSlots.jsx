import React, { useState } from "react";
import { parse, addMinutes, format, isBefore } from "date-fns";

function generate30MinSlotsFromRanges(ranges) {
  const slots = [];

  ranges.forEach(({ start, end }) => {
    if (!start || !end) {
      console.warn("Skipping invalid time range:", { start, end });
      return;
    }

    let current = parse(start, "HH:mm", new Date());
    const endTime = parse(end, "HH:mm", new Date());

    while (
      isBefore(addMinutes(current, 30), endTime) ||
      format(current, "HH:mm") === format(endTime, "HH:mm")
      ) {
      const slotStart = format(current, "HH:mm");
      const slotEnd = format(addMinutes(current, 30), "HH:mm");
      slots.push({ start: slotStart, end: slotEnd });
      current = addMinutes(current, 30);
    }
  });

  return slots;
}

function formatRange(slots) {
  const sorted = [...slots].sort();
  if (sorted.length === 0) return null;

  const start = sorted[0];
  const end = format(addMinutes(parse(sorted[sorted.length - 1], "HH:mm", new Date()), 30), "HH:mm");
  return { start, end };
}

/**
 * TimeSlots (multi-select + summary)
 * @param {{
 *   coachAvailability: object,
 *   selectedDate: Date,
 *   selectedTimes: string[],
 *   onSelectTime: (time: string[]) => void
 * }}
 */
export default function TimeSlots({
                                    coachAvailability,
                                    selectedDate,
                                    selectedTimes = [],
                                    onSelectTime
                                  }) {
  if (!selectedDate || !coachAvailability) return null;

  const [internalSelected, setInternalSelected] = useState(selectedTimes || []);
  const dayKey = format(selectedDate, "EEEE").toLowerCase();

  const raw = coachAvailability?.weeklyAvailability?.[dayKey];
  const ranges = raw ? Object.values(raw) : [];
  const slots = generate30MinSlotsFromRanges(ranges);
  const displayDate = format(selectedDate, "MMMM d, yyyy");

  const toggleSlot = (start) => {
    const isSelected = internalSelected.includes(start);
    const updated = isSelected
      ? internalSelected.filter((s) => s !== start)
      : [...internalSelected, start];

    setInternalSelected(updated);
    onSelectTime?.(updated);
  };

  const range = formatRange(internalSelected);
  const totalPrice = ((internalSelected.length || 0) / 2) * (coachAvailability.price || 0);

  return (
    <div className="dark:bg-stone-900 dark:text-stone-100 p-4">
      <h3 className="font-medium mb-2">Available Time Slots</h3>
      <p className="text-sm text-gray-400 mb-2">{displayDate}</p>

      {slots.length === 0 ? (
        <p className="text-gray-500 text-sm italic">No available times</p>
      ) : (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
            {slots.map(({ start, end }) => (
              <button
                key={`${start}-${end}`}
                onClick={() => toggleSlot(start)}
                className={`py-2 px-2 text-center rounded-md border text-sm transition ${
                  internalSelected.includes(start)
                    ? "bg-green-600 text-white border-green-600"
                    : "border-gray-600 text-gray-300 hover:bg-gray-100 dark:hover:bg-stone-700"
                }`}
              >
                {format(parse(start, "HH:mm", new Date()), "h:mm a")}
              </button>
            ))}
          </div>

          {/* Selected Summary */}
          {internalSelected.length > 0 && range && (
            <div className="border-t border-gray-600 pt-4 text-sm">
              <p>
                <strong>Selected:</strong> {format(parse(range.start, "HH:mm", new Date()), "h:mm a")} –{" "}
                {format(parse(range.end, "HH:mm", new Date()), "h:mm a")}
              </p>
              <p>
                <strong>Total:</strong> {internalSelected.length * 30} mins • ${totalPrice.toFixed(2)}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}