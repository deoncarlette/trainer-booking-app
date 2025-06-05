// components/BookingSummary.jsx
import React from "react";
import { parse, format, addMinutes, differenceInMinutes } from "date-fns";

const PRICE_PER_BLOCK = 25;

/**
 * Groups time blocks into consecutive ranges
 */
function groupTimeRanges(times) {
  if (!Array.isArray(times) || times.some(t => typeof t !== "string" || !t.match(/\d{2}:\d{2}/))) {
    console.warn("Invalid time list:", times);
    return [];
  }

  const sorted = [...times].sort(
    (a, b) => parse(a, "HH:mm", new Date()) - parse(b, "HH:mm", new Date())
  );

  const ranges = [];
  let start = sorted[0];
  let prev = start;

  for (let i = 1; i <= sorted.length; i++) {
    const current = sorted[i];
    const prevTime = parse(prev, "HH:mm", new Date());

    if (!current || differenceInMinutes(parse(current, "HH:mm", new Date()), prevTime) > 30) {
      ranges.push([start, format(addMinutes(prevTime, 30), "HH:mm")]);
      start = current;
    }

    prev = current;
  }

  return ranges;
}

/**
 * BookingSummary Component
 * @param {{
 *   selectedBlocks: { [date: string]: { time: string, coach: object }[] },
 *   onClear: () => void
 * }}
 */
export default function BookingSummary({ selectedBlocks, onClear }) {
  const groupedByCoach = {};

  for (const [dateStr, entries] of Object.entries(selectedBlocks)) {
    for (const { time, coach } of entries) {
      if (!time || !coach) continue;
      const coachName = coach.name || "Unknown Coach";
      if (!groupedByCoach[coachName]) groupedByCoach[coachName] = {};
      if (!groupedByCoach[coachName][dateStr]) groupedByCoach[coachName][dateStr] = [];
      groupedByCoach[coachName][dateStr].push(time);
    }
  }

  const coachNames = Object.keys(groupedByCoach);
  const totalBlocks = coachNames.reduce((sum, coach) =>
    sum + Object.values(groupedByCoach[coach]).reduce((acc, times) => acc + times.length, 0), 0
  );

  return (
    <div className="dark:bg-stone-900 dark:text-stone-100 p-4 mt-6 rounded-lg border border-gray-700">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-lg">Booking Summary</h3>
        {totalBlocks > 0 && (
          <button
            className="text-red-500 text-sm underline hover:text-red-400"
            onClick={onClear}
          >
            Clear All
          </button>
        )}
      </div>

      {coachNames.length === 0 ? (
        <p className="text-sm text-gray-400 italic">No time slots selected yet.</p>
      ) : (
        <div className="space-y-6">
          {coachNames.map((coach) => {
            const sessionsByDate = Object.entries(groupedByCoach[coach])
              .sort(([d1], [d2]) => new Date(d1) - new Date(d2));

            return (
              <div key={coach}>
                <h4 className="text-base font-semibold text-white mb-2">{coach}</h4>
                {sessionsByDate.map(([dateStr, times]) => {
                  const ranges = groupTimeRanges(times);
                  return (
                    <div key={dateStr} className="mb-2">
                      <p className="text-sm font-semibold text-gray-300 mb-1">
                        {format(new Date(dateStr), "MMMM d, yyyy")}
                      </p>
                      <ul className="flex flex-wrap gap-2 text-sm text-green-400">
                        {ranges.map(([start, end], idx) => (
                          <li key={idx} className="px-2 py-1 bg-green-900 rounded">
                            {format(parse(start, "HH:mm", new Date()), "h:mm a")} –{" "}
                            {format(parse(end, "HH:mm", new Date()), "h:mm a")}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            );
          })}

          <div className="pt-4 border-t border-gray-600 flex justify-between text-sm font-semibold">
            <span>Total Blocks: {totalBlocks}</span>
            <span>Total Price: ${totalBlocks * PRICE_PER_BLOCK}</span>
          </div>
        </div>
      )}
    </div>
  );
}