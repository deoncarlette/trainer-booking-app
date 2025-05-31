import React from "react";

export default function TrainerProfile() {
  return (
    <div className="bg-green-600 text-white rounded-lg p-4 mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-white text-green-600 rounded-full flex items-center justify-center font-bold text-xl">CM</div>
        <div>
          <h3 className="font-bold">Coach Michael</h3>
          <p>Shooting Specialist</p>
        </div>
      </div>
      <div className="mt-4 text-sm">
        <p className="mb-2"><span className="font-medium">Location:</span> Downtown Training Center</p>
        <p className="mb-2"><span className="font-medium">Session Length:</span> 60 minutes</p>
        <p><span className="font-medium">Price:</span> $65 per session</p>
      </div>
    </div>
  );
}
