// src/components/pages/BookingPage.jsx
import React from 'react';
import { PageHeader } from '../layout';
import { TrainerList } from '../trainer';
import { BookingSection } from '../booking';

export default function BookingPage({
                                      trainers,
                                      selectedCoach,
                                      setSelectedCoach,
                                      availability,
                                      coachAvailability,
                                      setCoachAvailability,
                                      bookingRef
                                    }) {
  const handleTrainerSelect = (trainer) => {
    setSelectedCoach(trainer);
    const coachAvailability = availability.find(item => item.id === trainer?.id) ?? {};
    setCoachAvailability(coachAvailability);

    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setTimeout(() => {
        bookingRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <>
      <PageHeader
        title="Find Your Trainer"
        subtitle="Choose from our expert basketball trainers"
      />

      <TrainerList
        trainers={trainers}
        onTrainerSelect={handleTrainerSelect}
      />

      <div ref={bookingRef}>
        <BookingSection
          selectedCoach={selectedCoach}
          coachAvailability={coachAvailability}
        />
      </div>
    </>
  );
}