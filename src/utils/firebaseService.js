// services/firebaseService.js
import { doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // your Firebase config

export const updateCoachProfile = async (coachId, profileData) => {
  try {
    const coachRef = doc(db, 'trainers', `coach_${coachId}`);
    await updateDoc(coachRef, profileData);
    return { success: true };
  } catch (error) {
    console.error('Error updating coach profile:', error);
    return { success: false, error: error.message };
  }
};

export const updateCoachAvailability = async (coachId, availabilityData) => {
  try {
    // Use coach_${coachId} as the document ID to match your Firebase structure
    const availabilityRef = doc(db, 'availability', `coach_${coachId}`);

    // Only update the weeklyAvailability field, preserve other fields
    await updateDoc(availabilityRef, {
      weeklyAvailability: availabilityData
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating availability:', error);
    return { success: false, error: error.message };
  }
};

// New function to update custom availability (for specific dates)
export const updateCustomAvailability = async (coachId, customAvailabilityData) => {
  try {
    const availabilityRef = doc(db, 'availability', `coach_${coachId}`);
    await updateDoc(availabilityRef, {
      customAvailability: customAvailabilityData
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating custom availability:', error);
    return { success: false, error: error.message };
  }
};

// New function to update unavailable dates
export const updateUnavailableDates = async (coachId, unavailableDates) => {
  try {
    const availabilityRef = doc(db, 'availability', `coach_${coachId}`);
    await updateDoc(availabilityRef, {
      unavailableDates: unavailableDates
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating unavailable dates:', error);
    return { success: false, error: error.message };
  }
};

export const updateCoachPricing = async (coachId, pricingData) => {
  try {
    const coachRef = doc(db, 'trainers', `coach_${coachId}`);
    await updateDoc(coachRef, {
      price: pricingData.hourlyRate,
      discounts: pricingData.discounts,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating pricing:', error);
    return { success: false, error: error.message };
  }
};

export const updateBookingStatus = async (coachId, bookingId, status) => {
  try {
    const coachRef = doc(db, 'coach_dale', `coach_${coachId}`);
    await updateDoc(coachRef, {
      [`bookings.${bookingId}.status`]: status,
      [`bookings.${bookingId}.updatedAt`]: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating booking:', error);
    return { success: false, error: error.message };
  }
};

export const addBooking = async (coachId, bookingData) => {
  try {
    const coachRef = doc(db, 'bookings', `coach_${coachId}`);

    // Generate a unique booking ID and number
    const timestamp = Date.now().toString();
    const bookingId = timestamp;
    const bookingNumber = `BK${timestamp.slice(-8)}`; // Last 8 digits for shorter number

    // Structure the booking data according to your Firebase schema
    const newBooking = {
      bookingId: `booking_${bookingId}`,
      bookingNumber: bookingNumber, // NEW: Add booking number
      clientId: bookingData.clientId,
      firstName: bookingData.firstName,
      lastName: bookingData.lastName,
      email: bookingData.email || '', // Add email field
      phone: bookingData.phone || '', // Add phone field
      date: bookingData.date, // Format: "2025-06-17"
      timeSlot: {
        start: bookingData.timeSlot.start, // Format: "2025-06-17T16:00:00-05:00"
        end: bookingData.timeSlot.end,     // Format: "2025-06-17T17:00:00-05:00"
        duration: bookingData.timeSlot.duration // Format: "60"
      },
      sessionDetails: {
        technique: bookingData.sessionDetails?.technique || "Shooting Technique",
        skillLevel: bookingData.sessionDetails?.skillLevel || "Beginner",
        notes: bookingData.sessionDetails?.notes || ""
      },
      status: "pending", // FORCE STATUS TO PENDING FOR NEW BOOKINGS
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Include custom pricing if provided
    if (bookingData.customHourlyRate) {
      newBooking.customHourlyRate = bookingData.customHourlyRate;
    }

    // Include payment info if provided
    if (bookingData.paymentInfo) {
      newBooking.paymentInfo = {
        status: bookingData.paymentInfo.status || 'unpaid',
        totalAmount: bookingData.paymentInfo.totalAmount || 0,
        amountPaid: bookingData.paymentInfo.amountPaid || 0,
        amountDue: bookingData.paymentInfo.amountDue || 0,
        lastUpdated: new Date().toISOString()
      };
    }

    // Add the new booking to the bookings map
    await updateDoc(coachRef, {
      [`bookings.${bookingId}`]: newBooking
    });

    return {
      success: true,
      bookingId: bookingId,
      bookingNumber: bookingNumber,
      booking: newBooking
    };
  } catch (error) {
    console.error('Error adding booking:', error);
    return { success: false, error: error.message };
  }
};

// Alternative function if you want to specify your own booking ID
export const addBookingWithId = async (coachId, bookingId, bookingData) => {
  try {
    const coachRef = doc(db, 'bookings', `coach_${coachId}`);

    // Generate booking number if not provided
    const bookingNumber = bookingData.bookingNumber || `BK${bookingId.slice(-8)}`;

    // Structure the booking data according to your Firebase schema
    const newBooking = {
      bookingId: `booking_${bookingId}`,
      bookingNumber: bookingNumber, // NEW: Add booking number
      clientId: bookingData.clientId,
      firstName: bookingData.firstName,
      lastName: bookingData.lastName,
      email: bookingData.email || '',
      phone: bookingData.phone || '',
      date: bookingData.date,
      timeSlot: {
        start: bookingData.timeSlot.start,
        end: bookingData.timeSlot.end,
        duration: bookingData.timeSlot.duration
      },
      sessionDetails: {
        technique: bookingData.sessionDetails?.technique || "Shooting Technique",
        skillLevel: bookingData.sessionDetails?.skillLevel || "Beginner",
        notes: bookingData.sessionDetails?.notes || ""
      },
      status: "pending", // FORCE STATUS TO PENDING FOR NEW BOOKINGS
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Include custom pricing if provided
    if (bookingData.customHourlyRate) {
      newBooking.customHourlyRate = bookingData.customHourlyRate;
    }

    // Include payment info if provided
    if (bookingData.paymentInfo) {
      newBooking.paymentInfo = bookingData.paymentInfo;
    }

    await updateDoc(coachRef, {
      [`bookings.${bookingId}`]: newBooking
    });

    return {
      success: true,
      bookingId: bookingId,
      bookingNumber: bookingNumber,
      booking: newBooking
    };
  } catch (error) {
    console.error('Error adding booking:', error);
    return { success: false, error: error.message };
  }
};

// Confirm a pending booking
export const confirmBooking = async (coachId, bookingId) => {
  try {
    const coachRef = doc(db, 'bookings', `coach_${coachId}`);
    await updateDoc(coachRef, {
      [`bookings.${bookingId}.status`]: "confirmed",
      [`bookings.${bookingId}.confirmedAt`]: new Date().toISOString(),
      [`bookings.${bookingId}.updatedAt`]: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error('Error confirming booking:', error);
    return { success: false, error: error.message };
  }
};

// Reject a pending booking
export const rejectBooking = async (coachId, bookingId, rejectionReason = '') => {
  try {
    const coachRef = doc(db, 'bookings', `coach_${coachId}`);
    await updateDoc(coachRef, {
      [`bookings.${bookingId}.status`]: "rejected",
      [`bookings.${bookingId}.rejectionReason`]: rejectionReason,
      [`bookings.${bookingId}.rejectedAt`]: new Date().toISOString(),
      [`bookings.${bookingId}.updatedAt`]: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error('Error rejecting booking:', error);
    return { success: false, error: error.message };
  }
};

// Cancel a confirmed booking
export const cancelBooking = async (coachId, bookingId, cancellationReason = '') => {
  try {
    const coachRef = doc(db, 'bookings', `coach_${coachId}`);
    await updateDoc(coachRef, {
      [`bookings.${bookingId}.status`]: "cancelled",
      [`bookings.${bookingId}.cancellationReason`]: cancellationReason,
      [`bookings.${bookingId}.cancelledAt`]: new Date().toISOString(),
      [`bookings.${bookingId}.updatedAt`]: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return { success: false, error: error.message };
  }
};

// NEW: Edit/Update a booking
export const updateBooking = async (coachId, bookingId, updateData) => {
  try {
    const coachRef = doc(db, 'bookings', `coach_${coachId}`);

    // Prepare the update object with proper nested field syntax
    const updateObject = {
      [`bookings.${bookingId}.updatedAt`]: new Date().toISOString()
    };

    // Add each field from updateData to the update object
    Object.keys(updateData).forEach(key => {
      if (key === 'timeSlot' && typeof updateData[key] === 'object') {
        // Handle timeSlot object
        Object.keys(updateData[key]).forEach(timeKey => {
          updateObject[`bookings.${bookingId}.timeSlot.${timeKey}`] = updateData[key][timeKey];
        });
      } else if (key === 'sessionDetails' && typeof updateData[key] === 'object') {
        // Handle sessionDetails object
        Object.keys(updateData[key]).forEach(sessionKey => {
          updateObject[`bookings.${bookingId}.sessionDetails.${sessionKey}`] = updateData[key][sessionKey];
        });
      } else if (key === 'paymentInfo' && typeof updateData[key] === 'object') {
        // Handle paymentInfo object - NEW: Added this section
        Object.keys(updateData[key]).forEach(paymentKey => {
          updateObject[`bookings.${bookingId}.paymentInfo.${paymentKey}`] = updateData[key][paymentKey];
        });
      } else {
        // Handle simple fields
        updateObject[`bookings.${bookingId}.${key}`] = updateData[key];
      }
    });

    console.log('🔧 Updating booking with data:', updateObject); // Debug log

    await updateDoc(coachRef, updateObject);
    return { success: true };
  } catch (error) {
    console.error('Error updating booking:', error);
    return { success: false, error: error.message };
  }
};

// Reschedule a booking
export const rescheduleBooking = async (coachId, bookingId, newDate, newTimeSlot) => {
  try {
    const coachRef = doc(db, 'bookings', `coach_${coachId}`);
    await updateDoc(coachRef, {
      [`bookings.${bookingId}.date`]: newDate,
      [`bookings.${bookingId}.timeSlot`]: newTimeSlot,
      [`bookings.${bookingId}.status`]: "rescheduled",
      [`bookings.${bookingId}.rescheduledAt`]: new Date().toISOString(),
      [`bookings.${bookingId}.updatedAt`]: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error('Error rescheduling booking:', error);
    return { success: false, error: error.message };
  }
};

// Get all pending bookings for a coach
export const getPendingBookings = (coachBookings) => {
  if (!coachBookings || !coachBookings.bookings) return [];

  return Object.entries(coachBookings.bookings)
    .filter(([_, booking]) => (booking.status || 'pending') === 'pending') // Handle undefined status
    .map(([bookingId, bookingData]) => ({
      id: bookingId,
      ...bookingData
    }))
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // Oldest first
};

// Get bookings by status
export const getBookingsByStatus = (coachBookings, status) => {
  if (!coachBookings || !coachBookings.bookings) return [];

  return Object.entries(coachBookings.bookings)
    .filter(([_, booking]) => (booking.status || 'pending') === status) // Handle undefined status
    .map(([bookingId, bookingData]) => ({
      id: bookingId,
      ...bookingData
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // Chronological order
};

// NEW: Get all bookings with normalized status
export const getAllBookingsWithStatus = (coachBookings) => {
  if (!coachBookings || !coachBookings.bookings) return [];

  return Object.entries(coachBookings.bookings)
    .map(([bookingId, bookingData]) => ({
      id: bookingId,
      ...bookingData,
      status: bookingData.status || 'pending' // Normalize undefined status to pending
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};