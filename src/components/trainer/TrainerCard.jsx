// src/components/trainer/TrainerCard.jsx
import React from "react";
import { trainerCard } from "../../utils/classnames";
import { Button, Badge, Avatar } from "../ui";

export default function TrainerCard({ trainer, onSelect }) {
  const hasPhoto = trainer.photoURL || trainer.image || trainer.avatar;

  return (
    <div className={trainerCard.container}>
      {/* Image Section */}
      <div className={trainerCard.imageSection}>
        {hasPhoto ? (
          <img
            src={trainer.photoURL || trainer.image || trainer.avatar}
            alt={trainer.name}
            className={trainerCard.image}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.classList.add('bg-gradient-to-br', 'from-green-400', 'to-green-600');
            }}
          />
        ) : (
          <div className={trainerCard.placeholder}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 14l9-5-9-5-9 5 9 5z" />
              <circle cx={12} cy={12} r={10} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />
            </svg>
          </div>
        )}

        {/* Availability Badge */}
        <div className={trainerCard.badge}>
          <Badge variant="success">
            Available Today
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className={trainerCard.content}>
        <div className={trainerCard.header}>
          <div>
            <h3 className={trainerCard.title}>{trainer.name}</h3>
            <p className={trainerCard.specialty}>{trainer.specialty}</p>
          </div>
          <Avatar
            src={trainer.photoURL}
            alt={trainer.name}
            fallback={trainer.initials}
            size="md"
          />
        </div>

        <p className={trainerCard.location}>📍 {trainer.location}</p>

        <div className={trainerCard.footer}>
          <div>
            <div className={trainerCard.price}>
              ${trainer.price}
            </div>
            <div className={trainerCard.priceLabel}>
              per session
            </div>
          </div>

          <Button onClick={onSelect} size="md">
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
}