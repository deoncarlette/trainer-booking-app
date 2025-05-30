import React from "react";

function BookingForm() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Book Your Training Session</h2>
      <form>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Focus Area</label>
          <select className="w-full px-3 py-2 border rounded">
            <option>Shooting</option>
            <option>Dribbling</option>
            <option>Defense</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Skill Level</label>
          <select className="w-full px-3 py-2 border rounded">
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Date</label>
          <input type="date" className="w-full px-3 py-2 border rounded" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Time</label>
          <input type="time" className="w-full px-3 py-2 border rounded" />
        </div>
        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
          Confirm Booking
        </button>
      </form>
    </div>
  );
}

export default BookingForm;
