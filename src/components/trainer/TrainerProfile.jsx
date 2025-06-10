// src/components/trainer/TrainerProfile.jsx - Updated with new styling
import React from "react";
import { Card, CardContent, Avatar } from "../ui";
import { tokens, base } from "../../utils/classnames";

export default function TrainerProfile({ trainer }) {
  if (!trainer) return null;

  const { name, specialty, location, sessionLength, price } = trainer;

  return (
    <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
      <CardContent>
        <div className={base.flexStart + " space-x-4 mb-4"}>
          <Avatar
            src={trainer.photoURL || trainer.image}
            alt={name}
            fallback={trainer.initials || name?.charAt(0)}
            size="lg"
            className="bg-white/20 text-white"
          />
          <div>
            <h3 className="text-xl font-bold">{name}</h3>
            <p className="text-green-100">{specialty}</p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <span>📍</span>
            <span>{location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>⏱️</span>
            <span>{sessionLength || "60 minutes"}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>💰</span>
            <span>${price} per session</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}