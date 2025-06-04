// Placeholder for BookingSection component
import {bookingSection} from "../utils/classnames";
import TrainerProfile from "./TrainerProfile";
import SessionDetails from "./SessionDetails";
import CalendarSection from "./CalendarSection";
import TimeSlots from "./TimeSlots";
import PaymentForm from "./PaymentForm";
import OrderSummary from "./OrderSummary";
import React, {useState} from "react";

export default function BookingSection({selectedCoach}) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className={bookingSection.bookingOuter}>
      <h2 className={bookingSection.h2}>Book Your Training Session</h2>
        <div className={bookingSection.bookingInner}>
        <div className={bookingSection.session}>
          <TrainerProfile coach={selectedCoach}/>
            <SessionDetails/>
        </div>

        {/*Calendar + Time + Payment*/}
        <div className="md:w-2/3 space-y-6">
          <CalendarSection selectedDate={selectedDate} onSelectDate={setSelectedDate}/>
          <TimeSlots/>
          <PaymentForm/>
          <OrderSummary/>
          <button
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition">
            Complete Booking
          </button>
        </div>
      </div>
    </div>
  );
}
