import React, { useState, useEffect } from 'react';
import { sessionDetails } from '../utils/classnames';

export default function SessionDetails({
                                         sessionDurations,
                                         onSessionDetailsChange // Add callback to parent
                                       }) {
  const [focusArea, setFocusArea] = useState('Shooting Technique');
  const [skillLevel, setSkillLevel] = useState('Beginner');
  const [notes, setNotes] = useState('');

  // Notify parent when session details change
  useEffect(() => {
    if (onSessionDetailsChange) {
      onSessionDetailsChange({
        technique: focusArea,
        skillLevel,
        notes
      });
    }
  }, [focusArea, skillLevel, notes, onSessionDetailsChange]);

  return (
    <div className={sessionDetails.container}>
      <h4 className={sessionDetails.h4}>Session Details</h4>
      <div className={sessionDetails.innerContainer}>
        <div>
          <label className={sessionDetails.label}>Focus Area</label>
          <select
            value={focusArea}
            onChange={(e) => setFocusArea(e.target.value)}
            className={sessionDetails.text}
          >
            <option value="Shooting Technique">Shooting Technique</option>
            <option value="Ball Handling">Ball Handling</option>
            <option value="Defense">Defense</option>
            <option value="Conditioning">Conditioning</option>
            <option value="Game Strategy">Game Strategy</option>
            <option value="General Skills">General Skills</option>
          </select>
        </div>

        <div>
          <label className={sessionDetails.label}>Your Skill Level</label>
          <select
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value)}
            className={sessionDetails.text}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Elite">Elite</option>
          </select>
        </div>

        <div>
          <label className={sessionDetails.label}>Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any specific areas you'd like to work on..."
            className={`${sessionDetails.text} resize-none h-20`}
          />
        </div>

        {sessionDurations && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Session Duration: {sessionDurations.min}-{sessionDurations.max} minutes
          </div>
        )}
      </div>
    </div>
  );
}