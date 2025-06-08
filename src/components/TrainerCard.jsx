import React from "react";
import { trainerCard } from "../utils/classnames";

export default function TrainerCard({ trainer, onSelect }) {
  const hasPhoto = trainer.photoURL || trainer.image || trainer.avatar;

  return (
    <div className={trainerCard.container}>
      <div className="flex h-40">
        {/* Photo section - fixed width */}
        <div className="relative w-40 h-40 flex-shrink-0">
          <div className="w-full h-full rounded-l-lg overflow-hidden">
            {hasPhoto ? (
              <img
                src={trainer.photoURL || trainer.image || trainer.avatar}
                alt={trainer.name}
                className="w-full h-full object-cover"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
                onError={(e) => {
                  // If image fails to load, hide it and show the green background
                  e.target.style.display = 'none';
                  e.target.parentElement.classList.add('bg-gradient-to-br', 'from-green-400', 'to-green-600');
                }}
              />
            ) : (
              // Green placeholder background with SVG icon
              <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <circle cx={12} cy={12} r={10} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />
                </svg>
              </div>
            )}
          </div>

          {/* Availability badge */}
          <div className={trainerCard.availabilityOuter}>
            <div className={trainerCard.availabilityInner}>
              <span className={trainerCard.availabilityBackground} />
              <span className={trainerCard.availability}>{trainer.availability}</span>
            </div>
          </div>
        </div>

        {/* Content section */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div className={trainerCard.nameContainer}>
            <h3 className={trainerCard.name}>{trainer.name}</h3>
            <p className={trainerCard.specialty}>{trainer.specialty}</p>
          </div>

          <div className="flex justify-end">
            <button onClick={onSelect} className={trainerCard.bookButton}>
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}