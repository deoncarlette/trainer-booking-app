import React from "react";

export default function TrainerProfile({ coach }) {
  if (!coach) return null;

  const { initials, name, specialty, location, sessionLength, price } = coach;

  return (
    <div className="bg-green-600 text-white rounded-lg p-4 mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-white text-green-600 rounded-full flex items-center justify-center font-bold text-xl">{initials}</div>
        <div>
          <h3 className="font-bold">{name}</h3>
          <p>{specialty}</p>
        </div>
      </div>
      <div className="mt-4 text-sm">
        <p className="mb-2"><span className="font-medium">Location:</span> {location}</p>
        <p className="mb-2"><span className="font-medium">Session Length:</span> {sessionLength}</p>
        <p><span className="font-medium">Price:</span> ${price} per session</p>
      </div>
    </div>
  );
}
