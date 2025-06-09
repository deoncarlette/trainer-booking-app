// src/components/trainer/TrainerList.jsx
import React from "react";
import { base } from "../../utils/classnames";
import TrainerCard from "./TrainerCard";

export default function TrainerList({ trainers, onTrainerSelect }) {
  if (!trainers?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-stone-500 dark:text-stone-400">
          No trainers available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className={base.grid.cards}>
      {trainers.map(trainer => (
        <TrainerCard
          key={trainer.id}
          trainer={trainer}
          onSelect={() => onTrainerSelect(trainer)}
        />
      ))}
    </div>
  );
}