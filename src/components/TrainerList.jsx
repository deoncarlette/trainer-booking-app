import React from "react";
import trainers from "../data/trainers.json";

function TrainerList({setSelectedCoach}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
      {trainers.map((trainer) => (
        <div key={trainer.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-5">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{trainer.name}</h3>
            <p className="text-sm text-green-600">{trainer.specialty}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{trainer.location}</p>
            <p className="text-lg font-semibold mt-2">${trainer.price}/session</p>
            <button onClick={() => setSelectedCoach(trainer)} className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Book Now</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TrainerList;
