import React from "react";
import {sessionDetails} from "../utils/classnames";

export default function SessionDetails() {
  return (
    <div className={sessionDetails.container}>
      <h4 className={sessionDetails.h4}>Session Details</h4>
      <div className={sessionDetails.innerContainer}>
        <div>
          <label htmlFor="focus-area" className={sessionDetails.label}>Focus Area</label>
          <select id="focus-area" className={sessionDetails.text}>
            <option>Shooting Technique</option>
            <option>Dribbling & Ball Handling</option>
            <option>Defensive Skills</option>
            <option>Conditioning & Agility</option>
            <option>Game Strategy</option>
          </select>
        </div>

        <div>
          <label htmlFor="skill-level" className={sessionDetails.label}>Your Skill Level</label>
          <select id="skill-level" className={sessionDetails.text}>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
            <option>Elite/Professional</option>
          </select>
        </div>

        <div>
          <label htmlFor="notes" className={sessionDetails.label}>Notes (optional)</label>
          <textarea id="notes" rows="2" className={sessionDetails.text} placeholder="Any specific areas you'd like to work on..."></textarea>
        </div>
      </div>
    </div>
  );
}
