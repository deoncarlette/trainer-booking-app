import React, { useState, useMemo } from 'react';
import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, DollarSign, Users, Settings, Bell, TrendingUp } from 'lucide-react';
import { format } from "date-fns";
import { dashboard } from '../utils/classnames';

// Individual Components
import DashboardHeader from './dashboard/DashboardHeader';
import DashboardNavigation from './dashboard/DashboardNavigation';
import OverviewTab from './dashboard/OverviewTab';
import BookingsTab from './dashboard/BookingsTab';
import AvailabilityTab from './dashboard/AvailabilityTab';
import PricingTab from './dashboard/PricingTab';
import ProfileTab from './dashboard/ProfileTab';

export default function CoachesDashboard({ trainers = [], bookings = [], availability = []}) {
  const { trainerId } = useParams()
  console.log("paramId", trainerId)
  const coachId= trainerId || "nique";
  console.log("trainers", trainers)
  console.log(trainers.map(t => t.id)); // Make sure "nique" is one of them
  console.log("coachId", coachId)

  const [activeTab, setActiveTab] = useState('overview');
  const [editingProfile, setEditingProfile] = useState(false);

  // Get coach data from Firebase props
  const coach = useMemo(() => {
    return trainers.find(t => t.id === coachId) || {};
  }, [trainers, coachId]);

  // Get coach-specific bookings
  const coachBookings = useMemo(() => {
    return bookings.filter(booking => booking.id === coachId) || [];
  }, [bookings, coachId]);
  console.log("coachBookings", coachBookings)

  // Get coach-specific availability
  const coachAvailability = useMemo(() => {
    return availability.find(avail => avail.id === coachId) || {};
  }, [availability, coachId]);
  console.log("coachAvailability", coachAvailability)

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

  // Early return if no coach data
  if (!coach || !coach.id) {
    return (
      <div className={dashboard.layout}>
        <div className={dashboard.mainContent}>
          <div className={dashboard.section.container}>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Coach not found</h2>
              <p className="text-gray-500 dark:text-gray-400">Coach ID: {coachId}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderActiveTab = () => {
    const commonProps = {
      coach,
      bookings: coachBookings,
      availability: coachAvailability,
      stats
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

  return (
    <div className={dashboard.layout}>
      <DashboardHeader coach={coach} />
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