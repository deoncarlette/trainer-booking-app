// Updated BookingSection.jsx
import {bookingSection} from "../utils/classnames";
import TrainerProfile from "./TrainerProfile";
import SessionDetails from "./SessionDetails";
import CalendarSection from "./CalendarSection";
import TimeSlots from "./TimeSlots";
import ClientInfoForm from "./ClientInfoForm"; // Updated import
import OrderSummary from "./OrderSummary";
import React, {useState} from "react";
import BookingSummary from "./BookingSumary";
import { addBooking } from "../utils/firebaseService"; // Import the booking function

import { format } from "date-fns";

export default function BookingSection({selectedCoach, coachAvailability}) {
  // Get session durations from coach data or use defaults
  const sessionDurations = {
    min: selectedCoach?.minSessionDuration || selectedCoach?.sessionDurations?.min || 30,
    max: selectedCoach?.maxSessionDuration || selectedCoach?.sessionDurations?.max || 120
  };

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(sessionDurations.min);
  const [isBooking, setIsBooking] = useState(false); // Loading state for booking
  const [bookingMessage, setBookingMessage] = useState(''); // Success/error messages

  // State for session details from the form
  const [sessionDetails, setSessionDetails] = useState({
    technique: 'Shooting Technique',
    skillLevel: 'Beginner',
    notes: ''
  });

  // State for client information
  const [clientInfo, setClientInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: ''
  });

  const [selectedBlocks, setSelectedBlocks] = useState({});

  // Helper function to calculate end time
  const calculateEndTime = (startTime, durationMinutes) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);

    const endDate = new Date(startDate.getTime() + (durationMinutes * 60000));
    const endHours = endDate.getHours().toString().padStart(2, '0');
    const endMinutes = endDate.getMinutes().toString().padStart(2, '0');

    return `${endHours}:${endMinutes}`;
  };

  // Function to handle completing the booking
  const handleCompleteBooking = async () => {
    // Validate client info
    if (!clientInfo.firstName || !clientInfo.lastName || !clientInfo.email) {
      setBookingMessage('Please fill in all required fields (First Name, Last Name, Email)');
      setTimeout(() => setBookingMessage(''), 5000);
      return;
    }

    setIsBooking(true);
    setBookingMessage('');

    try {
      const bookingPromises = [];

      // Create bookings for each selected time slot
      Object.entries(selectedBlocks).forEach(([date, timeSlots]) => {
        timeSlots.forEach((slot) => {
          const bookingData = {
            clientId: `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Generate temp client ID
            firstName: clientInfo.firstName,
            lastName: clientInfo.lastName,
            email: clientInfo.email,
            phone: clientInfo.phone,
            date: date, // "2025-06-17"
            timeSlot: {
              start: `${date}T${slot.time}:00-05:00`, // Adjust timezone as needed
              end: `${date}T${calculateEndTime(slot.time, slot.duration)}:00-05:00`,
              duration: slot.duration.toString()
            },
            sessionDetails: {
              technique: slot.technique,
              skillLevel: slot.skillLevel,
              notes: slot.notes || clientInfo.notes
            },
            status: "pending"
          };

          bookingPromises.push(addBooking(selectedCoach.id, bookingData));
        });
      });

      const results = await Promise.all(bookingPromises);

      // Check if all bookings succeeded
      const allSuccessful = results.every(result => result.success);

      if (allSuccessful) {
        setBookingMessage('📋 Booking request submitted! Your coach will review and confirm your session shortly.');
        setSelectedBlocks({}); // Clear selections
        setClientInfo({ firstName: '', lastName: '', email: '', phone: '', notes: '' }); // Reset form

        // Clear success message after 10 seconds
        setTimeout(() => setBookingMessage(''), 10000);
      } else {
        const failedBookings = results.filter(result => !result.success);
        setBookingMessage(`❌ Some bookings failed: ${failedBookings.map(f => f.error).join(', ')}`);
        setTimeout(() => setBookingMessage(''), 8000);
      }

    } catch (error) {
      console.error('Booking error:', error);
      setBookingMessage('❌ Failed to create booking. Please try again.');
      setTimeout(() => setBookingMessage(''), 5000);
    } finally {
      setIsBooking(false);
    }
  };

  const handleSelectTime = (date, time, duration = selectedDuration, sessionInfo = {}) => {
    if (!selectedCoach) return;
    const dateKey = format(date, "yyyy-MM-dd");

    setSelectedBlocks((prev) => {
      const existing = prev[dateKey] || [];
      const timeExists = existing.some(entry => entry.time === time);

      let updated;
      if (timeExists) {
        updated = existing.filter(entry => entry.time !== time);
      } else {
        updated = [...existing, {
          time,
          duration,
          technique: sessionInfo.technique || sessionDetails.technique,
          skillLevel: sessionInfo.skillLevel || sessionDetails.skillLevel,
          notes: sessionInfo.notes || sessionDetails.notes,
          coach: {
            id: selectedCoach.id,
            name: selectedCoach.name,
            price: selectedCoach.price
          }
        }];
      }

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

  const handleRemoveSession = (dateKey, timeKey) => {
    setSelectedBlocks((prev) => {
      const existing = prev[dateKey] || [];
      const updated = existing.filter(entry => entry.time !== timeKey);

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

  const handletoggleTime = (time, duration, sessionInfo) =>
    handleSelectTime(selectedDate, time, duration, sessionInfo);

  const getSelectedTimesForDate = (date) => {
    if (!date) return [];
    const dateKey = format(date, "yyyy-MM-dd");
    const entries = selectedBlocks[dateKey] || [];
    return entries.map(entry => entry.time);
  };

  const hasSelectedBlocks = Object.keys(selectedBlocks).length > 0;

  return (
    <div className={bookingSection.bookingOuter}>
      <h2 className={bookingSection.h2}>Book Your Training Session</h2>

      {/* Show booking messages */}
      {bookingMessage && (
        <div className={`mb-4 p-4 rounded-lg ${
          bookingMessage.includes('❌')
            ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
            : 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800'
        }`}>
          {bookingMessage}
        </div>
      )}

      <div className={bookingSection.bookingInner}>
        <div className={bookingSection.session}>
          <TrainerProfile trainer={selectedCoach}/>
          <SessionDetails
            sessionDurations={sessionDurations}
            onSessionDetailsChange={setSessionDetails}
          />
        </div>

        <div className="md:w-2/3 space-y-6">
          <CalendarSection
            coachAvailability={coachAvailability}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />

          {selectedDate && (
            <TimeSlots
              coachAvailability={coachAvailability}
              selectedDate={selectedDate}
              selectedTimes={getSelectedTimesForDate(selectedDate)}
              onToggleTime={handletoggleTime}
              sessionDurations={sessionDurations}
              selectedDuration={selectedDuration}
              onDurationChange={setSelectedDuration}
              selectedCoach={selectedCoach}
              sessionDetails={sessionDetails}
            />
          )}

          {hasSelectedBlocks && (
            <BookingSummary
              selectedBlocks={selectedBlocks}
              onClear={handleClearAll}
              onRemoveSession={handleRemoveSession}
            />
          )}

          {hasSelectedBlocks && (
            <>
              <ClientInfoForm
                clientInfo={clientInfo}
                onClientInfoChange={setClientInfo}
              />

              <button
                onClick={handleCompleteBooking}
                disabled={isBooking}
                className={`w-full font-medium py-3 px-6 rounded-lg transition ${
                  isBooking
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isBooking ? '⏳ Creating Booking...' : '✅ Complete Booking'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}