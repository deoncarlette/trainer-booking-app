import React, { useState, useRef } from "react";
import {app} from "./utils/classnames";
import Navbar from "./components/Navbar";
import PageHeader from "./components/PageHeader";
import TrainerList from "./components/TrainerList";
import BookingSection from "./components/BookingSection";


export default function App() {
  const [selectedCoach, setSelectedCoach] = useState(null);
  const bookingRef = useRef(null);

  return (
    <body>
      <main className={app.main}>
        <Navbar/>
        <div className={app.container}>
          <PageHeader/>
          <TrainerList bookingRef={bookingRef} setSelectedCoach={setSelectedCoach}/>
          <BookingSection bookingRef={bookingRef} selectedCoach={selectedCoach}/>
        </div>

      </main>
    </body>

  );
}