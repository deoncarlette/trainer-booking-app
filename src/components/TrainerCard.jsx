import React from "react";
import {trainerCard} from "../utils/classnames";

export default function TrainerCard({trainer, onSelect}) {
  return (
    <div className={trainerCard.container}>
      <div className="relative">
        <div className={trainerCard.imageContainer}>
          {/* Replace with photos*/}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-white opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 14l9-5-9-5-9 5 9 5z" />
            <circle cx={12} cy={12} r={10} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />
          </svg>
        </div>
        <div className={trainerCard.availabilityOuter}>
          <div className={trainerCard.availabilityInner}>
            <span className={trainerCard.availabilityBackground} />
            <span className={trainerCard.availability}>{trainer.availability}</span>
          </div>
        </div>
      </div>
      <div className="p-4">
            <div className={trainerCard.bookContainer}>
              <div className={trainerCard.nameContainer}>
                <h3 className={trainerCard.name}>{trainer.name}</h3>
                <p className={trainerCard.specialty}>{trainer.specialty}</p>
              </div>
              <button onClick={onSelect} className={trainerCard.bookButton}>
            Book Now</button>
            </div>
        {/*<div className={trainerCard.location}>{trainer.location}</div>*/}
        {/*<div className={trainerCard.duration}>{trainer.duration}</div>*/}
        {/*<div className={trainerCard.bookContainer}>*/}
          {/*<div className={trainerCard.priceContainer}>*/}
          {/*  <span className={trainerCard.price}>${trainer.price}</span>*/}
          {/*  <span className={trainerCard.session}>/session</span>*/}
          {/*</div>*/}
          {/*<button*/}
          {/*  onClick={onSelect}*/}
          {/*  className={trainerCard.bookButton}*/}
          {/*>*/}
          {/*  Book Now</button>*/}
        {/*</div>*/}
      </div>
    </div>
  );
}
