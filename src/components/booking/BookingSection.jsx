// src/components/booking/BookingSection.jsx - Simplified version
import React, { useState } from "react";
import { bookingSummary } from "../../utils/classnames";
import { Card, CardHeader, CardTitle, CardContent, Button } from "../ui";
import { TrainerProfile } from "../trainer";
import { SessionDetails, CalendarSection, TimeSlots } from "./";
import { ClientInfoForm } from "../booking";
import BookingSummary from "./BookingSummary";
import { addBooking } from "../../utils";
import { format } from "date-fns";



export default function BookingSection({ selectedCoach, coachAvailability }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedBlocks, setSelectedBlocks] = useState({});
  const [sessionDetails, setSessionDetails] = useState({
    technique: 'Shooting Technique',
    skillLevel: 'Beginner',
    notes: ''
  });
  const [clientInfo, setClientInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [isBooking, setIsBooking] = useState(false);
  const [bookingMessage, setBookingMessage] = useState('');

  if (!selectedCoach) {
    return (
      <Card>
        <CardContent>
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-stone-900 dark:text-white mb-2">
              Select a Trainer
            </h3>
            <p className="text-stone-500 dark:text-stone-400">
              Choose a trainer above to book your training session.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const sessionDurations = {
    min: selectedCoach?.minSessionDuration || 30,
    max: selectedCoach?.maxSessionDuration || 120
  };

  const handleSelectTime = (date, time, duration = 60, sessionInfo = {}) => {
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

      return { ...prev, [dateKey]: updated };
    });
  };

  const handleCompleteBooking = async () => {
    if (!clientInfo.firstName || !clientInfo.lastName || !clientInfo.email) {
      setBookingMessage('Please fill in all required fields (First Name, Last Name, Email)');
      setTimeout(() => setBookingMessage(''), 5000);
      return;
    }

    setIsBooking(true);
    setBookingMessage('');

    try {
      const bookingPromises = [];

      Object.entries(selectedBlocks).forEach(([date, timeSlots]) => {
        timeSlots.forEach((slot) => {
          const calculateEndTime = (startTime, durationMinutes) => {
            const [hours, minutes] = startTime.split(':').map(Number);
            const startDate = new Date();
            startDate.setHours(hours, minutes, 0, 0);
            const endDate = new Date(startDate.getTime() + (durationMinutes * 60000));
            return `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
          };

          const bookingData = {
            clientId: `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            firstName: clientInfo.firstName,
            lastName: clientInfo.lastName,
            email: clientInfo.email,
            phone: clientInfo.phone,
            date: date,
            timeSlot: {
              start: `${date}T${slot.time}:00-05:00`,
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
      const allSuccessful = results.every(result => result.success);

      if (allSuccessful) {
        setBookingMessage('📋 Booking request submitted! Your coach will review and confirm your session shortly.');
        setSelectedBlocks({});
        setClientInfo({ firstName: '', lastName: '', email: '', phone: '', notes: '' });
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

  const getSelectedTimesForDate = (date) => {
    if (!date) return [];
    const dateKey = format(date, "yyyy-MM-dd");
    const entries = selectedBlocks[dateKey] || [];
    return entries.map(entry => entry.time);
  };

  const hasSelectedBlocks = Object.keys(selectedBlocks).length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book Your Training Session</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Show booking messages */}
        {bookingMessage && (
          <div className={`mb-6 p-4 rounded-lg ${
            bookingMessage.includes('❌')
              ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
              : 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800'
          }`}>
            {bookingMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Coach Info & Session Details */}
          <div className="space-y-6">
            <TrainerProfile trainer={selectedCoach} />
            <SessionDetails
              sessionDurations={sessionDurations}
              onSessionDetailsChange={setSessionDetails}
            />
          </div>

          {/* Right Column - Calendar & Booking */}
          <div className="lg:col-span-2 space-y-6">
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
                onToggleTime={(time, duration, sessionInfo) =>
                  handleSelectTime(selectedDate, time, duration, sessionInfo)
                }
                sessionDurations={sessionDurations}
                selectedCoach={selectedCoach}
                sessionDetails={sessionDetails}
              />
            )}

            {hasSelectedBlocks && (
              <>
                <BookingSummary
                  selectedBlocks={selectedBlocks}
                  onClear={() => setSelectedBlocks({})}
                  onRemoveSession={(dateKey, timeKey) => {
                    setSelectedBlocks((prev) => {
                      const existing = prev[dateKey] || [];
                      const updated = existing.filter(entry => entry.time !== timeKey);

                      if (updated.length === 0) {
                        const { [dateKey]: removed, ...rest } = prev;
                        return rest;
                      }

                      return { ...prev, [dateKey]: updated };
                    });
                  }}
                />

                <ClientInfoForm
                  clientInfo={clientInfo}
                  onClientInfoChange={setClientInfo}
                />

                <Button
                  onClick={handleCompleteBooking}
                  disabled={isBooking}
                  size="lg"
                  className="w-full"
                  loading={isBooking}
                >
                  {isBooking ? 'Creating Booking...' : '✅ Complete Booking'}
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}