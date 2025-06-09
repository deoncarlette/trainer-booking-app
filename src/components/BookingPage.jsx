// Main booking page component
import PageHeader from "./PageHeader";
import TrainerList from "./TrainerList";
import BookingSection from "./BookingSection";

export default function BookingPage({ trainers, selectedCoach, setSelectedCoach, availability, coachAvailability, setCoachAvailability, bookingRef }) {
  const commonProps = {
    trainers: trainers,
    availability: availability,
    selectedCoach: selectedCoach,
    setSelectedCoach: setSelectedCoach,
    coachAvailability: coachAvailability,
    setCoachAvailability: setCoachAvailability,
    bookingRef: bookingRef,
  };

  return (
    <>
      <PageHeader />
      <TrainerList {...commonProps} />
      <div ref={bookingRef}>
        <BookingSection {...commonProps} />
      </div>
    </>
  );
}