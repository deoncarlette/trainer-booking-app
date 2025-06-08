import React from 'react';
import { Calendar, Users, DollarSign, TrendingUp } from 'lucide-react';
import { format, parse, parseISO } from 'date-fns';
import { dashboard } from '../../utils/classnames';

export default function OverviewTab({ coach, stats }) {
  const { todayBookings, todayCount, weekCount, totalEarnings } = stats;
  const hourlyRate = coach.price || coach.hourlyRate || 0;

  const getFullName = (firstName, lastName) => {
    if (!firstName && !lastName) return 'Client';
    return `${firstName || ''} ${lastName || ''}`.trim();
  };

  // Enhanced time formatting to handle both ISO datetime strings and time-only strings
  const formatTime = (timeString) => {
    if (!timeString) return 'TBA';

    try {
      // Check if it's an ISO datetime string
      if (timeString.includes('T')) {
        const date = parseISO(timeString);
        return format(date, "h:mm a");
      }

      // Handle time-only format (HH:mm)
      return format(parse(timeString, "HH:mm", new Date()), "h:mm a");
    } catch (error) {
      console.warn('Failed to format time:', timeString, error);
      return timeString; // fallback to original if parsing fails
    }
  };

  const formatTimeSlot = (timeSlot) => {
    if (!timeSlot) return 'TBA';

    const start = timeSlot.start ? formatTime(timeSlot.start) : '';
    const end = timeSlot.end ? formatTime(timeSlot.end) : '';

    if (start && end) {
      return `${start} - ${end}`;
    }
    return start || end || 'TBA';
  };

  // Enhanced duration calculation to handle new duration field and ISO datetime strings
  const calculateDuration = (timeSlot) => {
    if (!timeSlot) return 60;

    // If duration is explicitly provided, use it
    if (timeSlot.duration) {
      return parseInt(timeSlot.duration);
    }

    // Calculate duration from start and end times
    if (!timeSlot.start || !timeSlot.end) return 60;

    try {
      let startDate, endDate;

      // Handle ISO datetime strings
      if (timeSlot.start.includes('T') && timeSlot.end.includes('T')) {
        startDate = parseISO(timeSlot.start);
        endDate = parseISO(timeSlot.end);

        // Calculate difference in minutes for ISO datetime
        const diffMs = endDate - startDate;
        return Math.max(Math.round(diffMs / (1000 * 60)), 0);
      } else {
        // Handle time-only format
        const [startHour, startMin] = timeSlot.start.split(':').map(Number);
        const [endHour, endMin] = timeSlot.end.split(':').map(Number);

        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;

        return Math.max(endMinutes - startMinutes, 0);
      }
    } catch (error) {
      console.warn('Failed to calculate duration:', timeSlot, error);
      return 60; // fallback duration
    }
  };

  const statsData = [
    {
      label: "Today's Sessions",
      value: todayCount,
      icon: Calendar,
      color: "text-blue-500"
    },
    {
      label: "This Week",
      value: weekCount,
      icon: Users,
      color: "text-green-500"
    },
    {
      label: "Week Earnings",
      value: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(totalEarnings || 0),
      icon: DollarSign,
      color: "text-yellow-500"
    },
    {
      label: "Hourly Rate",
      value: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(hourlyRate || 0),
      icon: TrendingUp,
      color: "text-purple-500"
    }
  ];

  return (
    <div className={dashboard.section.content}>
      {/* Stats Cards */}
      <div className={dashboard.stats.grid}>
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={dashboard.stats.card}>
              <div className={dashboard.stats.content}>
                <p className={dashboard.stats.label}>{stat.label}</p>
                <p className={dashboard.stats.value}>{stat.value}</p>
              </div>
              <Icon className={`${dashboard.stats.icon} ${stat.color}`} />
            </div>
          );
        })}
      </div>

      {/* Today's Schedule */}
      <div className={dashboard.section.container}>
        <h3 className={dashboard.section.title}>Today's Schedule</h3>
        {todayBookings.length === 0 ? (
          <p className={dashboard.section.emptyState}>No sessions scheduled for today</p>
        ) : (
          <div className={dashboard.section.content}>
            {todayBookings.map(booking => (
              <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <div>
                  <p className="font-medium dark:text-white">{getFullName(booking.firstName, booking.lastName)}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Training Session</p>
                </div>
                <div className="text-right">
                  <p className="font-medium dark:text-white">{formatTimeSlot(booking.timeSlot)}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{calculateDuration(booking.timeSlot)}min</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}