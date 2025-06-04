import React, { useState } from "react";
import Calendar from "react-calendar"; // You can replace with your preferred calendar lib
import "react-calendar/dist/Calendar.css";

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function TrainerAvailabilityDashboard() {
  const [weeklyAvailability, setWeeklyAvailability] = useState({});
  const [customAvailability, setCustomAvailability] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlotInput, setTimeSlotInput] = useState({ start: "", end: "" });

  const handleWeeklyChange = (day, slot) => {
    setWeeklyAvailability((prev) => {
      const existing = prev[day] || [];
      return {
        ...prev,
        [day]: [...existing, slot],
      };
    });
  };

  const handleCustomChange = (date, slot) => {
    const key = date.toISOString().split("T")[0];
    setCustomAvailability((prev) => {
      const existing = prev[key] || [];
      return {
        ...prev,
        [key]: [...existing, slot],
      };
    });
  };

  const copyWeekForward = () => {
    const nextWeek = {};
    for (const [day, slots] of Object.entries(weeklyAvailability)) {
      nextWeek[day] = [...slots];
    }
    setWeeklyAvailability(nextWeek);
  };

  const addSlot = () => {
    const slot = [timeSlotInput.start, timeSlotInput.end];
    if (selectedDate) {
      handleCustomChange(selectedDate, slot);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold">Trainer Availability Dashboard</h2>

      <section className="border p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Weekly Availability</h3>
        {daysOfWeek.map((day) => (
          <div key={day} className="mb-2">
            <span className="font-medium mr-2">{day}:</span>
            <input
              type="time"
              className="mr-2 border rounded px-2"
              onChange={(e) => setTimeSlotInput({ ...timeSlotInput, start: e.target.value })}
            />
            <input
              type="time"
              className="mr-2 border rounded px-2"
              onChange={(e) => setTimeSlotInput({ ...timeSlotInput, end: e.target.value })}
            />
            <button
              onClick={() => handleWeeklyChange(day, [timeSlotInput.start, timeSlotInput.end])}
              className="bg-green-600 text-white px-2 py-1 rounded"
            >
              Add Slot
            </button>
            <div className="text-sm text-gray-600 mt-1">
              {weeklyAvailability[day]?.map((slot, i) => (
                <span key={i} className="mr-2">[{slot[0]}–{slot[1]}]</span>
              ))}
            </div>
          </div>
        ))}
        <button
          onClick={copyWeekForward}
          className="mt-3 bg-blue-600 text-white px-3 py-1 rounded"
        >
          Copy Schedule Forward
        </button>
      </section>

      <section className="border p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Custom Availability (e.g. Breaks)</h3>
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          className="mb-4"
        />
        <div className="flex gap-2 mb-2">
          <input
            type="time"
            className="border rounded px-2"
            value={timeSlotInput.start}
            onChange={(e) => setTimeSlotInput({ ...timeSlotInput, start: e.target.value })}
          />
          <input
            type="time"
            className="border rounded px-2"
            value={timeSlotInput.end}
            onChange={(e) => setTimeSlotInput({ ...timeSlotInput, end: e.target.value })}
          />
          <button
            className="bg-green-700 text-white px-3 rounded"
            onClick={addSlot}
          >
            Add Custom Slot
          </button>
        </div>
        {selectedDate && (
          <div className="text-sm text-gray-600">
            {customAvailability[selectedDate.toISOString().split("T")[0]]?.map((slot, i) => (
              <span key={i} className="mr-2">[{slot[0]}–{slot[1]}]</span>
            )) || <span>No custom slots yet</span>}
          </div>
        )}
      </section>
    </div>
  );
}
