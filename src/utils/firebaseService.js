// services/firebaseService.js
import { doc, updateDoc, setDoc } from 'firebase/firestore';
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