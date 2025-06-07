import React, { useState, useEffect, useRef } from "react";
import {Routes, Route, Link} from "react-router-dom";

import { getFirestore } from "firebase/firestore";
import { fetchTrainers } from "./utils/fetchTrainers";
import { app } from "./utils/classnames";

import Navbar from "./components/Navbar";
import PageHeader from "./components/PageHeader";
import TrainerList from "./components/TrainerList";
import BookingSection from "./components/BookingSection";
import { fetchAvailability } from "./utils/fetchAvailability";
import { initializeApp } from "firebase/app";

import { db } from "./firebase";
import TrainerDashboard from "./components/TrainerDashboard";
import CoachesDashboard from "./components/CoachDashboard";
import {fetchBookings} from "./utils/fetchBookings";

// Main booking page component
function BookingPage({ trainers, selectedCoach, setSelectedCoach, availability, coachAvailability, setCoachAvailability, bookingRef }) {
  return (
    <>
      <PageHeader />
      <TrainerList
        bookingRef={bookingRef}
        trainers={trainers}
        setSelectedCoach={setSelectedCoach}
        availability={availability}
        setCoachAvailability={setCoachAvailability}
      />
      <div ref={bookingRef}>
        <BookingSection selectedCoach={selectedCoach} coachAvailability={coachAvailability} />
      </div>
    </>
  );
}

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

  return (
    <main className={app.main}>
      <Navbar />
      <div className={app.container}>
        <Routes>
          {/* Main booking page */}
          <Route
            path="/"
            element={
              <BookingPage
                trainers={trainers}
                selectedCoach={selectedCoach}
                setSelectedCoach={setSelectedCoach}
                availability={availability}
                coachAvailability={coachAvailability}
                setCoachAvailability={setCoachAvailability}
                bookingRef={bookingRef}
              />
            }
          />

          <Route path="/dashboard" element={<CoachesDashboard trainers={trainers} bookings={bookings} availability={availability} />} />
          {trainers.length > 0 && (
            <Route
              path="/dashboard/:trainerId"
              element={<CoachesDashboard trainers={trainers} bookings={bookings} availability={availability} />}
            />
          )}

          {/* Dashboard routes */}
          <Route path="/trainer" element={<TrainerDashboard trainers={trainers} bookings={bookings} />} />
        </Routes>
      </div>
    </main>
  );
}