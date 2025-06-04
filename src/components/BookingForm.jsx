import React, { useState } from "react";
import TrainerProfile from "./TrainerProfile";
import SessionDetails from "./SessionDetails";
import CalendarSection from "./CalendarSection";
import TimeSlots from "./TimeSlots";
import PaymentForm from "./PaymentForm";
import OrderSummary from "./OrderSummary";

export default function BookingForm({selectedCoach}) {
    const [selectedDate, setSelectedDate] = useState(new Date());

    return (
      <div className="flex flex-col md:flex-row md:space-x-6 mt-8">
        {/* Trainer Info + Session Form */}
        <div className="md:w-1/3 mb-6 md:mb-0">
          <TrainerProfile coach={selectedCoach} />
          <SessionDetails />
        </div>

        {/* Calendar + Time + Payment */}
        <div className="md:w-2/3 space-y-6">
          <CalendarSection selectedDate={selectedDate} onSelectDate={setSelectedDate} />
          <TimeSlots />
          <PaymentForm />
          <OrderSummary />
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition">
            Complete Booking
          </button>
        </div>
      </div>
  );
}
