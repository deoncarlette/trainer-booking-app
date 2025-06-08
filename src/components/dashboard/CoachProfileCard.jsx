import React from "react";

export default function CoachProfileCard({ coach }) {
  return (
    <div className="p-4 rounded-lg border dark:bg-stone-900">
      <div className="flex items-center space-x-4 mb-3">
        <img
          src={coach.photoURL || coach.image || coach.avatar || '/default-avatar.png'}
          alt={coach.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
          onError={(e) => {
            e.target.src = '/default-avatar.png';
          }}
        />
        <div>
          <h3 className="text-xl font-semibold dark:text-white">{coach.name}</h3>
          <p className="text-sm text-gray-400">{coach.specialty}</p>
          <p className="text-sm text-gray-400">{coach.location}</p>
        </div>
      </div>
    </div>
  );
}