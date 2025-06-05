import React, {useRef} from "react";
import trainers from "../data/trainers.json";
import {trainerList} from "../utils/classnames";
import TrainerCard from "./TrainerCard";

export default function TrainerList({bookingRef, trainers, setSelectedCoach, availability, setCoachAvailability}) {

  const handleTrainerSelect = (trainer) => {
    setSelectedCoach(trainer);
    const coachAvailability = availability.find(item => item.id === trainer?.id) ?? {};
    setCoachAvailability(coachAvailability);

    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      setTimeout(() => {
        bookingRef.current?.scrollIntoView({behavior: "smooth"});
      }, 100); // Delay slightly to wait for state update/render
    }
  }

  return (
    <div className={trainerList.container}>
      {trainers.map(trainer => (
        <TrainerCard key={trainer.id} trainer={trainer} onSelect={() => handleTrainerSelect(trainer)} />
      ))}
    </div>
  );
}