import React from "react";

export default function CalendarSection() {
  return (
    <div>
      <h3 className="font-medium mb-3">Select a Date</h3>
      <div className="bg-gray-800 text-white border border-gray-700 rounded-lg p-4">
        <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-3">
          <button>&lt;</button>
          <h4 className="font-medium">June 2023</h4>
          <button>&gt;</button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-sm">
          {["S", "M", "T", "W", "T", "F", "S"].map(day => (
            <div key={day} className="text-center font-medium text-gray-400">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 mt-1">
          {Array.from({ length: 35 }, (_, i) => (
            <div key={i} className={`h-8 flex items-center justify-center rounded-md text-sm ${
              i === 12 ? "bg-green-600 text-white" : "text-gray-300"
            }`}>
              {i < 4 ? "" : i - 3}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
