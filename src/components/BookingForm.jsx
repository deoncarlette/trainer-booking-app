import React from "react";
import TrainerProfile from "./TrainerProfile";
import SessionDetailsForm from "./SessionDetailsForm";
import CalendarSection from "./CalendarSection";
import TimeSlots from "./TimeSlots";
import PaymentForm from "./PaymentForm";
import OrderSummary from "./OrderSummary";

export default function BookingForm() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedCoach, setSelectedCoach] = useState({
        name: "Coach Nique",
        initials: "CN",
        specialty: "Shooting Specialist",
        location: "Downtown Training Center",
        sessionLength: "60 minutes",
        price: 65,
    });

    <TrainerProfile coach={selectedCoach} />

    return (
    <div className="flex flex-col md:flex-row md:space-x-6 mt-8">
      {/* Trainer Info + Session Form */}
      <div className="md:w-1/3 mb-6 md:mb-0">
        <TrainerProfile coach={selectedCoach} />
        <SessionDetailsForm />
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
