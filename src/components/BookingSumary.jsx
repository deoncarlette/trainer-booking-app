// components/BookingSummary.jsx
import React from "react";
import { parse, format, addMinutes, differenceInMinutes } from "date-fns";

const PRICE_PER_BLOCK = 25; // Fallback price

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
  // Early return if no selections made
  if (!selectedBlocks || Object.keys(selectedBlocks).length === 0) {
    return null; // Don't render anything
  }

  const groupedByCoach = {};
  const coachPricing = {}; // Store each coach's price

  for (const [dateStr, entries] of Object.entries(selectedBlocks)) {
    for (const { time, coach } of entries) {
      if (!time || !coach) continue;
      const coachName = coach.name || "Unknown Coach";
      const price = coach.price || PRICE_PER_BLOCK;

      // Store the coach's price
      coachPricing[coachName] = price;

      if (!groupedByCoach[coachName]) groupedByCoach[coachName] = {};
      if (!groupedByCoach[coachName][dateStr]) groupedByCoach[coachName][dateStr] = [];
      groupedByCoach[coachName][dateStr].push(time);
    }
  }

  const coachNames = Object.keys(groupedByCoach);

  // If no valid coaches after processing, don't render
  if (coachNames.length === 0) {
    return null;
  }

  // Calculate total blocks and total price
  let totalBlocks = 0;
  let totalPrice = 0;

  const coachSummaries = coachNames.map(coach => {
    const coachBlocks = Object.values(groupedByCoach[coach]).reduce((acc, times) => acc + times.length, 0);
    const coachPrice = coachPricing[coach] || PRICE_PER_BLOCK;
    const coachTotal = coachBlocks * coachPrice;

    totalBlocks += coachBlocks;
    totalPrice += coachTotal;

    return {
      name: coach,
      blocks: coachBlocks,
      pricePerBlock: coachPrice,
      total: coachTotal
    };
  });

  console.log("totalBlocks", totalBlocks);
  console.log("totalPrice", totalPrice);
  console.log("coachSummaries", coachSummaries);

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

      <div className="space-y-6">
        {coachNames.map((coach) => {
          const sessionsByDate = Object.entries(groupedByCoach[coach])
            .sort(([d1], [d2]) => new Date(d1) - new Date(d2));

          const coachSummary = coachSummaries.find(c => c.name === coach);

          return (
            <div key={coach}>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-base font-semibold text-stone-700 dark:text-white">{coach}</h4>
                <div className="text-sm text-gray-300">
                  {/*${coachSummary.pricePerBlock}/block × {coachSummary.blocks} = ${coachSummary.total}*/}
                </div>
              </div>
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

        <div className="pt-4 border-gray-600 space-y-2">
          {/* Show breakdown by coach if multiple coaches */}
          {coachSummaries.length > 1 && (
            <div className="space-y-1 text-sm text-gray-300 border-t border-gray-600 pt-2">
              {coachSummaries.map(coach => (
                <div key={coach.name} className="flex justify-between">
                  <span>{coach.name}: {coach.blocks} {coach.blocks === 1 ? "slot" : "slots"}</span>
                  <span>${coach.total}</span>
                </div>
              ))}
            </div>
          )}

          {/* Total summary */}
          <div className="flex justify-between text-sm font-semibold border-t border-gray-600 pt-2">
            <span>Total Slots: {totalBlocks}</span>
            <span>Total Price: ${totalPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
}