// src/components/booking/SessionDetails.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Select, Textarea } from '../ui';

export default function SessionDetails({ sessionDurations, onSessionDetailsChange }) {
  const [focusArea, setFocusArea] = useState('Shooting Technique');
  const [skillLevel, setSkillLevel] = useState('Beginner');
  const [notes, setNotes] = useState('');

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
    <Card>
      <CardHeader>
        <CardTitle>Session Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select
            label="Focus Area"
            value={focusArea}
            onChange={(e) => setFocusArea(e.target.value)}
          >
            <option value="Shooting Technique">Shooting Technique</option>
            <option value="Ball Handling">Ball Handling</option>
            <option value="Defense">Defense</option>
            <option value="Conditioning">Conditioning</option>
            <option value="Game Strategy">Game Strategy</option>
            <option value="General Skills">General Skills</option>
          </Select>

          <Select
            label="Your Skill Level"
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value)}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Elite">Elite</option>
          </Select>

          <Textarea
            label="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any specific areas you'd like to work on..."
            rows={3}
          />

          {sessionDurations && (
            <div className="text-sm text-stone-500 dark:text-stone-400">
              Session Duration: {sessionDurations.min}-{sessionDurations.max} minutes
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}