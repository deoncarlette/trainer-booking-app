import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { Calendar, Clock, DollarSign, Users, Settings, Bell, TrendingUp } from 'lucide-react';
import { format } from "date-fns";
import {
  updateCoachProfile,
  updateCoachAvailability,
  updateCustomAvailability,
  updateUnavailableDates,
  updateCoachPricing,
  confirmBooking,
  rejectBooking,
  cancelBooking,
  updateBooking,
  addBooking
} from '../../utils/firebaseService'; // Fixed import path
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { dashboard } from '../../utils/classnames'; // Fixed import path

// Individual Components
import DashboardHeader from '../dashboard/DashboardHeader';
import DashboardNavigation from '../dashboard/DashboardNavigation';
import OverviewTab from '../dashboard/tabs/OverviewTab';
import BookingsTab from '../dashboard/tabs/BookingsTab';
import AvailabilityTab from '../dashboard/tabs/AvailabilityTab';
import PricingTab from '../dashboard/tabs/PricingTab';
import ProfileTab from '../dashboard/tabs/ProfileTab';

export default function DashboardPage({ trainers = [], bookings = [], availability = [], onDataReload }) {
  const { trainerId } = useParams();
  const coachId = trainerId || "nique";

  // 🔥 MOVED ALL HOOKS TO THE TOP - This fixes the hooks error!
  const [activeTab, setActiveTab] = useState('overview');
  const [editingProfile, setEditingProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Get coach data from Firebase props
  const coach = useMemo(() => {
    return trainers.find(t => t.id === coachId) || {};
  }, [trainers, coachId]);

  // Get coach-specific bookings
  const coachBookingData = useMemo(() => {
    return bookings.find(booking => booking.id === coachId) || null;
  }, [bookings, coachId]);

  const coachBookings = useMemo(() => {
    if (!coachBookingData?.bookings) return [];

    // Convert bookings map to array with keys as booking IDs
    return Object.entries(coachBookingData.bookings).map(([bookingId, bookingData]) => ({
      id: bookingId,
      ...bookingData,
      // Normalize status - treat undefined as pending
      status: bookingData.status || 'pending'
    }));
  }, [coachBookingData]);

  // Get coach-specific availability
  const coachAvailability = useMemo(() => {
    return availability.find(avail => avail.id === coachId) || {};
  }, [availability, coachId]);

  // Calculate stats
  const stats = useMemo(() => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    const todayBookings = coachBookings.filter(b => b.date === todayString);

    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const weekBookings = coachBookings.filter(b => {
      const bookingDate = new Date(b.date);
      return bookingDate >= today && bookingDate <= weekFromNow;
    });

    const totalEarnings = weekBookings.reduce((sum, booking) => {
      const hourlyRate = coach.price || coach.hourlyRate || 0;
      return sum + (hourlyRate * (booking.duration || 60) / 60);
    }, 0);

    return {
      todayBookings,
      weekBookings,
      totalEarnings,
      todayCount: todayBookings.length,
      weekCount: weekBookings.length
    };
  }, [coachBookings, coach]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'availability', label: 'Availability', icon: Clock },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'profile', label: 'Profile', icon: Settings }
  ];

  // Restore active tab after page reload (if using fallback)
  useEffect(() => {
    const savedTab = sessionStorage.getItem('coachDashboardActiveTab');
    if (savedTab && tabs.find(tab => tab.id === savedTab)) {
      setActiveTab(savedTab);
      sessionStorage.removeItem('coachDashboardActiveTab');
    }
  }, [tabs]); // Added tabs to dependencies

  // 🔥 MOVED EARLY RETURN AFTER ALL HOOKS - This was the main issue!
  // Now we handle the "no coach" case with conditional rendering instead of early return
  const hasValidCoach = coach && coach.id;

  const handleProfileUpdate = async (profileData) => {
    setLoading(true);
    const result = await updateCoachProfile(coachId, profileData);

    if (result.success) {
      setMessage('Profile updated successfully!');
    } else {
      setMessage(`Error: ${result.error}`);
    }

    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleAvailabilityUpdate = async (availabilityData) => {
    setLoading(true);
    const result = await updateCoachAvailability(coachId, availabilityData);

    if (result.success) {
      setMessage('Availability updated successfully!');
    } else {
      setMessage(`Error: ${result.error}`);
    }

    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleCustomAvailabilityUpdate = async (customData) => {
    setLoading(true);
    const result = await updateCustomAvailability(coachId, customData);

    if (result.success) {
      setMessage('Custom Availability updated successfully!');
    } else {
      setMessage(`Error: ${result.error}`);
    }

    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleUnavailableUpdate = async (unavailableData) => {
    setLoading(true);
    const result = await updateUnavailableDates(coachId, unavailableData);

    if (result.success) {
      setMessage('Unavailable Dates updated successfully!');
    } else {
      setMessage(`Error: ${result.error}`);
    }

    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handlePricingUpdate = async (pricingData) => {
    setLoading(true);
    const result = await updateCoachPricing(coachId, pricingData);

    if (result.success) {
      setMessage('Pricing updated successfully!');
    } else {
      setMessage(`Error: ${result.error}`);
    }

    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleConfirmBooking = async (bookingId) => {
    setLoading(true);
    const result = await confirmBooking(coachId, bookingId);

    if (result.success) {
      setMessage('✅ Booking confirmed successfully!');
    } else {
      setMessage(`❌ Error: ${result.error}`);
    }

    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleRejectBooking = async (bookingId, rejectionReason) => {
    setLoading(true);
    const result = await rejectBooking(coachId, bookingId, rejectionReason);

    if (result.success) {
      setMessage('✅ Booking request rejected.');
    } else {
      setMessage(`❌ Error: ${result.error}`);
    }

    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleEditBooking = async (bookingId, updateData) => {
    setLoading(true);
    const result = await updateBooking(coachId, bookingId, updateData);

    if (result.success) {
      setMessage('✅ Booking updated successfully!');
    } else {
      setMessage(`❌ Error: ${result.error}`);
    }

    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleCancelBooking = async (bookingId, cancellationReason) => {
    setLoading(true);
    const result = await cancelBooking(coachId, bookingId, cancellationReason);

    if (result.success) {
      setMessage('✅ Booking cancelled successfully.');
    } else {
      setMessage(`❌ Error: ${result.error}`);
    }

    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleAddSession = async (sessionData) => {
    setLoading(true);
    const result = await addBooking(coachId, sessionData);

    if (result.success) {
      setMessage('✅ Session added successfully!');
    } else {
      setMessage(`❌ Error: ${result.error}`);
    }

    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleUpdatePayment = async (bookingId, paymentData) => {
    setLoading(true);

    // Use more explicit payment update
    const updateObject = {
      [`bookings.${bookingId}.paymentInfo.status`]: paymentData.status,
      [`bookings.${bookingId}.paymentInfo.totalAmount`]: paymentData.totalAmount,
      [`bookings.${bookingId}.paymentInfo.amountPaid`]: paymentData.amountPaid,
      [`bookings.${bookingId}.paymentInfo.amountDue`]: Math.max(paymentData.totalAmount - paymentData.amountPaid, 0),
      [`bookings.${bookingId}.paymentInfo.lastUpdated`]: new Date().toISOString(),
      [`bookings.${bookingId}.updatedAt`]: new Date().toISOString()
    };

    console.log('💳 Payment update data:', updateObject);

    try {
      const coachRef = doc(db, 'bookings', `coach_${coachId}`);
      await updateDoc(coachRef, updateObject);
      setMessage('✅ Payment updated successfully!');
    } catch (error) {
      console.error('Payment update error:', error);
      setMessage(`❌ Error: ${error.message}`);
    }

    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleForceReload = () => {
    if (onDataReload) {
      console.log('🔄 Forcing data reload...');
      onDataReload();
      // Note: activeTab state is preserved, so we stay on current tab
    } else {
      console.log('🔄 Fallback: Reloading page...');
      // Store current tab before reload
      sessionStorage.setItem('coachDashboardActiveTab', activeTab);
      window.location.reload();
    }
  };

  // Handle profile navigation from header
  const handleProfileNavigation = () => {
    setActiveTab('profile');
  };

  const renderActiveTab = () => {
    const commonProps = {
      coach,
      bookings: coachBookings,
      availability: coachAvailability,
      stats,
      loading,
      onProfileUpdate: handleProfileUpdate,
      onAvailabilityUpdate: handleAvailabilityUpdate,
      onCustomAvailabilityUpdate: handleCustomAvailabilityUpdate,
      onUnavailableDatesUpdate: handleUnavailableUpdate,
      onPricingUpdate: handlePricingUpdate,
      onConfirmBooking: handleConfirmBooking,
      onRejectBooking: handleRejectBooking,
      onEditBooking: handleEditBooking,
      onCancelBooking: handleCancelBooking,
      onAddSession: handleAddSession,
      onUpdatePayment: handleUpdatePayment,
      onForceReload: handleForceReload
    };

    switch (activeTab) {
      case 'overview':
        return <OverviewTab {...commonProps} />;
      case 'bookings':
        return <BookingsTab {...commonProps} />;
      case 'availability':
        return <AvailabilityTab {...commonProps} />;
      case 'pricing':
        return <PricingTab {...commonProps} />;
      case 'profile':
        return <ProfileTab {...commonProps} editingProfile={editingProfile} setEditingProfile={setEditingProfile} />;
      default:
        return <OverviewTab {...commonProps} />;
    }
  };

  // 🔥 CONDITIONAL RENDERING INSTEAD OF EARLY RETURN
  // This ensures all hooks run consistently every render
  if (!hasValidCoach) {
    return (
      <div className={dashboard.layout}>
        <div className={dashboard.mainContent}>
          <div className={dashboard.section.container}>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-stone-700 dark:text-stone-300">Coach not found</h2>
              <p className="text-stone-500 dark:text-stone-400">Coach ID: {coachId}</p>
              <p className="text-stone-500 dark:text-stone-400 mt-2">
                Available trainers: {trainers.map(t => t.id).join(', ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normal dashboard rendering
  return (
    <div className={dashboard.layout}>
      <DashboardHeader coach={coach} onProfileClick={handleProfileNavigation} />

      {/* Show loading/success messages */}
      {message && (
        <div className={`fixed top-4 right-4 p-3 rounded-lg shadow-lg z-50 ${
          message.includes('Error') || message.includes('❌')
            ? 'bg-red-500 text-white'
            : 'bg-green-500 text-white'
        }`}>
          {message}
        </div>
      )}

      <DashboardNavigation
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className={dashboard.mainContent}>
        {renderActiveTab()}
      </main>
    </div>
  );
}