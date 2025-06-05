import React, { useState, useEffect, useRef } from "react";
import { getFirestore } from "firebase/firestore";
import { fetchTrainers } from "./utils/fetchTrainers";
import { app}  from "./utils/classnames";

import Navbar from "./components/Navbar";
import PageHeader from "./components/PageHeader";
import TrainerList from "./components/TrainerList";
import BookingSection from "./components/BookingSection";
import {fetchAvailability} from "./utils/fetchAvailability";
import {initializeApp} from "firebase/app";

import {db} from "./firebase";

export default function App() {
  const [trainers, setTrainers] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const bookingRef = useRef(null);
  const [availability, setAvailability] = useState([]);
  const [coachAvailability, setCoachAvailability] = useState([]);


  useEffect(() => {
    fetchTrainers(db).then(setTrainers);
    fetchAvailability(db).then(setAvailability);
  }, []);

  console.log("Trainers: ", trainers, "\nAvailability: ", availability, "\nSelected Coach: ", selectedCoach)

  return (
    <main className={app.main}>
      <Navbar/>
      <div className={app.container}>
        <PageHeader/>
        <TrainerList
          bookingRef={bookingRef}
          trainers={trainers}
          setSelectedCoach={setSelectedCoach}
          availability={availability}
          setCoachAvailability={setCoachAvailability}
        />
        <div ref={bookingRef}>
          <BookingSection selectedCoach={selectedCoach} coachAvailability={coachAvailability}/></div>
        </div>

    </main>
  );
}