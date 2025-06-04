import React from "react";
import {trainerProfile} from "../utils/classnames";

export default function TrainerProfile({ coach }) {
  if (!coach) return null;

  const { initials, name, specialty, location, sessionLength, price } = coach;

  return (
    <div className={trainerProfile.outerContainer}>
        <div className={trainerProfile.innerContainer}>
          <div
            className={trainerProfile.initials}>{initials}</div>
          <div>
            <h3 className={trainerProfile.name}>{name}</h3>
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
