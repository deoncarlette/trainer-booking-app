// Updated BookingSection.jsx
import {bookingSection} from "../utils/classnames";
import TrainerProfile from "./TrainerProfile";
import SessionDetails from "./SessionDetails";
import CalendarSection from "./CalendarSection";
import TimeSlots from "./TimeSlots";
import PaymentForm from "./PaymentForm";
import OrderSummary from "./OrderSummary";
import React, {useState} from "react";
import BookingSummary from "./BookingSumary";

import { format } from "date-fns";

export default function BookingSection({selectedCoach, coachAvailability}) {
  const [selectedDate, setSelectedDate] = useState(null); // Start with null instead of new Date()
  const [selectedTime, setSelectedTime] = useState(new Date());

  // Updated structure to match BookingSummary expectations
  const [selectedBlocks, setSelectedBlocks] = useState({
    // "2025-06-05": [
    //   { time: "15:00", coach: { id: "1", name: "Coach Nique", price: 65 } },
    //   { time: "15:30", coach: { id: "1", name: "Coach Nique", price: 65 } }
    // ]
  });

  const handleSelectTime = (date, time) => {
    if (!selectedCoach) return;
    const dateKey = format(date, "yyyy-MM-dd");

    setSelectedBlocks((prev) => {
      const existing = prev[dateKey] || [];
      const timeExists = existing.some(entry => entry.time === time);

      let updated;
      if (timeExists) {
        // Remove the time slot
        updated = existing.filter(entry => entry.time !== time);
      } else {
        // Add the time slot
        updated = [...existing, {
          time,
          coach: {
            id: selectedCoach.id,
            name: selectedCoach.name,
            price: selectedCoach.price
          }
        }];
      }

      // If no times left for this date, remove the date entirely
      if (updated.length === 0) {
        const { [dateKey]: removed, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [dateKey]: updated,
      };
    });
  };

  const handleClearAll = () => setSelectedBlocks({});
  const handletoggleTime = (time) => handleSelectTime(selectedDate, time);

  // Get selected times for the current date to pass to TimeSlots
  const getSelectedTimesForDate = (date) => {
    if (!date) return [];
    const dateKey = format(date, "yyyy-MM-dd");
    const entries = selectedBlocks[dateKey] || [];
    return entries.map(entry => entry.time);
  };

  // Check if there are any selected blocks
  const hasSelectedBlocks = Object.keys(selectedBlocks).length > 0;

  return (
    <div className={bookingSection.bookingOuter}>
      <h2 className={bookingSection.h2}>Book Your Training Session</h2>
      <div className={bookingSection.bookingInner}>
        <div className={bookingSection.session}>
          <TrainerProfile trainer={selectedCoach}/>
          <SessionDetails/>
        </div>

        {/*Calendar + Time + Payment*/}
        <div className="md:w-2/3 space-y-6">
          <CalendarSection
            coachAvailability={coachAvailability}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />

          {/* Only show TimeSlots if a date is selected */}
          {selectedDate && (
            <TimeSlots
              coachAvailability={coachAvailability}
              selectedDate={selectedDate}
              selectedTimes={getSelectedTimesForDate(selectedDate)}
              onToggleTime={handletoggleTime}
            />
          )}

          {/* Only show BookingSummary if there are selected blocks */}
          {hasSelectedBlocks && (
            <BookingSummary
              selectedBlocks={selectedBlocks}
              onClear={handleClearAll}
            />
          )}

          {/* Only show payment and booking button if there are selections */}
          {hasSelectedBlocks && (
            <>
              {/*<PaymentForm/>*/}
              {/*<OrderSummary/>*/}
              <button
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition">
                Complete Booking
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}