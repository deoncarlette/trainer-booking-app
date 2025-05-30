import React from "react";
import TrainerList from "./components/TrainerList";
import BookingForm from "./components/BookingForm";

function App() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Find Your Trainer</h1>
        <TrainerList />
        <BookingForm />
      </div>
    </main>
  );
}

export default App;
