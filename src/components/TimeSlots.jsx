import React from "react";

export default function TimeSlots() {
  return (
    <div className="dark:bg-stone-900 dark:text-stone-100 p-4">
      <h3 className="font-medium mb-2">Available Time Slots</h3>
      <p className="text-sm text-gray-400 mb-2">June 9, 2023</p>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"].map((time, idx) => (
          <div key={time} className={`py-2 px-2 text-center rounded-md border text-sm ${
            time === "1:00 PM" ? "bg-green-600 text-white" : "border-gray-600 text-gray-300"
          }`}>
            {time}
          </div>
        ))}
      </div>
    </div>
  );
}
