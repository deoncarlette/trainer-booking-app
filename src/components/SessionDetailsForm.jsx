import React from "react";

export default function SessionDetailsForm() {
  return (
    <div className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white rounded-lg p-4">
      <h4 className="font-medium mb-3">Session Details</h4>
      <div className="space-y-3">
        <div>
          <label htmlFor="focus-area" className="block text-sm font-medium mb-1">Focus Area</label>
          <select id="focus-area" className="w-full border border-gray-600 bg-gray-900 rounded-md px-3 py-2">
            <option>Shooting Technique</option>
            <option>Dribbling & Ball Handling</option>
            <option>Defensive Skills</option>
            <option>Conditioning & Agility</option>
            <option>Game Strategy</option>
          </select>
        </div>

        <div>
          <label htmlFor="skill-level" className="block text-sm font-medium mb-1">Your Skill Level</label>
          <select id="skill-level" className="w-full border border-gray-600 bg-gray-900 rounded-md px-3 py-2">
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
            <option>Elite/Professional</option>
          </select>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium mb-1">Notes (optional)</label>
          <textarea id="notes" rows="2" className="w-full border border-gray-600 bg-gray-900 rounded-md px-3 py-2" placeholder="Any specific areas you'd like to work on..."></textarea>
        </div>
      </div>
    </div>
  );
}
