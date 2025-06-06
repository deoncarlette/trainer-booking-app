import React from "react";

export default function CoachProfileCard({ coach }) {
  return (
    <div className="p-4 rounded-lg border dark:bg-stone-900">
      <h3 className="text-xl font-semibold">{coach.name}</h3>
      <p className="text-sm text-gray-400">{coach.specialty}</p>
      <p className="text-sm text-gray-400">{coach.location}</p>
    </div>
  );
}
