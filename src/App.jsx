// src/App.jsx - Updated with new structure
import React, { useState, useEffect, useRef } from "react";
import { Routes, Route } from "react-router-dom";

import { fetchTrainers } from "./utils/fetchTrainers";
import { fetchAvailability } from "./utils/fetchAvailability";
import { fetchBookings } from "./utils/fetchBookings";
import { db } from "./firebase";

// Layout components
import { Navbar } from "./components/layout";
import { Page, Container } from "./components/layout";

// Page components
import BookingPage from "./components/pages/BookingPage";
import DashboardPage from "./components/pages/DashboardPage";

export default function App() {
  const [trainers, setTrainers] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [coachAvailability, setCoachAvailability] = useState([]);
  const bookingRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [trainersData, availabilityData, bookingsData] = await Promise.all([
          fetchTrainers(db),
          fetchAvailability(db),
          fetchBookings(db)
        ]);

        setTrainers(trainersData);
        setAvailability(availabilityData);
        setBookings(bookingsData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  const commonProps = {
    trainers,
    availability,
    bookings,
    selectedCoach,
    setSelectedCoach,
    coachAvailability,
    setCoachAvailability,
    bookingRef,
  };

  return (
    <Page>
      <Navbar />
      <Container>
        <Routes>
          <Route path="/" element={<BookingPage {...commonProps} />} />
          <Route path="/dashboard" element={<DashboardPage {...commonProps} />} />
          <Route path="/dashboard/:trainerId" element={<DashboardPage {...commonProps} />} />
        </Routes>
      </Container>
    </Page>
  );
}