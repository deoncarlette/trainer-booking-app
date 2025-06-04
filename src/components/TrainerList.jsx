import React from "react";
import trainers from "../data/trainers.json";
import {trainerList} from "../utils/classnames";
import TrainerCard from "./TrainerCard";

export default function TrainerList({setSelectedCoach}) {
  return (
    <div className={trainerList.container}>
      {trainers.map(trainer => (
        <TrainerCard key={trainer.id} trainer={trainer} onSelect={() => setSelectedCoach(trainer)} />
      ))}
    </div>
  );
}