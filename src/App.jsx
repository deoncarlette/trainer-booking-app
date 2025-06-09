import React, { useState, useEffect, useRef } from "react";
import {Routes, Route, Link} from "react-router-dom";

import { fetchTrainers } from "./utils/fetchTrainers";
import { app } from "./utils/classnames";

import Navbar from "./components/Navbar"
import { fetchAvailability } from "./utils/fetchAvailability";

import { db } from "./firebase";
import CoachesDashboard from "./components/CoachDashboard";
import {fetchBookings} from "./utils/fetchBookings";
import BookingPage from "./components/BookingPage";



export default function App() {
  const [trainers, setTrainers] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const bookingRef = useRef(null);
  const [availability, setAvailability] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [coachAvailability, setCoachAvailability] = useState([]);

  useEffect(() => {
    fetchTrainers(db).then(setTrainers);
    fetchAvailability(db).then(setAvailability);
    fetchBookings(db).then(setBookings);
  }, []);

  console.log("Trainers: ", trainers, "\nAvailability: ", availability, "\nSelected Coach: ", selectedCoach);

  const commonProps = {
    trainers: trainers,
    availability: availability,
    bookings: bookings,

    selectedCoach: selectedCoach,
    setSelectedCoach: setSelectedCoach,
    coachAvailability: coachAvailability,
    setCoachAvailability: setCoachAvailability,
    bookingRef: bookingRef,
  };

  return (
    <main className={app.main}>
      <Navbar />
      <div className={app.container}>
        <Routes>
          {/* Main booking page */}
          <Route path="/" element={<BookingPage {...commonProps} />} />

          {/* Dashboard routes */}
          <Route path="/dashboard" element={<CoachesDashboard {...commonProps} />} />
          {trainers.length > 0 && (
            <Route path="/dashboard/:trainerId" element={<CoachesDashboard {...commonProps}  />}/>
          )}
        </Routes>
      </div>
    </main>
  );
}