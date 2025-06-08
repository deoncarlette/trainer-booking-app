import React, { useState } from 'react';
import { format, parse, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { dashboard, components } from '../../utils/classnames';

export default function BookingsTab({ coach, bookings }) {
  const [filter, setFilter] = useState('all');
  const hourlyRate = coach.price || coach.hourlyRate || 0;

  const filteredBookings = bookings.filter(booking => {
    const today = new Date();

    if (filter === 'today') {
      const todayString = today.toLocaleDateString('en-CA'); // en-CA gives YYYY-MM-DD format
      return booking.date === todayString;
    }

    if (filter === 'week') {
      // Get Sunday-Saturday week
      const weekStart = startOfWeek(today, { weekStartsOn: 0 }); // 0 = Sunday
      const weekEnd = endOfWeek(today, { weekStartsOn: 0 });

      const bookingDate = new Date(`${booking.date}T12:00:00`);

      console.log('Week filter:', {
        weekStart,
        weekEnd,
        bookingDateString: booking.date,
        bookingDate,
        isInRange: bookingDate >= weekStart && bookingDate <= weekEnd
      });

      return bookingDate >= weekStart && bookingDate <= weekEnd;
    }

    if (filter === 'month') {
      // Get current calendar month
      const monthStart = startOfMonth(today);
      const monthEnd = endOfMonth(today);

      const bookingDate = new Date(`${booking.date}T12:00:00`);

      console.log('Month filter:', {
        monthStart,
        monthEnd,
        bookingDateString: booking.date,
        bookingDate,
        isInRange: bookingDate >= monthStart && bookingDate <= monthEnd
      });

      return bookingDate >= monthStart && bookingDate <= monthEnd;
    }

    return true; // 'all'
  });

  console.log("filteredBookings", filteredBookings)

  // Enhanced sorting to handle both ISO datetime strings and time-only strings
  const sortedBookings = filteredBookings.sort((a, b) => {
    const getDateTime = (booking) => {
      const timeSlot = booking.timeSlot;
      if (!timeSlot) return new Date(`${booking.date}T00:00:00`);

      // Check if start time is ISO datetime string
      if (timeSlot.start && timeSlot.start.includes('T')) {
        try {
          return parseISO(timeSlot.start);
        } catch (error) {
          console.warn('Failed to parse ISO datetime:', timeSlot.start);
        }
      }

      // Fallback to time-only format
      const timeString = timeSlot.start || booking.time || '00:00';
      return new Date(`${booking.date}T${timeString}`);
    };

    return getDateTime(a) - getDateTime(b); // Ascending order (earliest first)
  });

  console.log("sortedBookings", sortedBookings)

  const getInitials = (firstName, lastName) => {
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    return first + last || 'C';
  };

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
      } else {
        // Handle time-only format
        const [startHour, startMin] = timeSlot.start.split(':').map(Number);
        const [endHour, endMin] = timeSlot.end.split(':').map(Number);

        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;

        return Math.max(endMinutes - startMinutes, 0);
      }

      // Calculate difference in minutes for ISO datetime
      const diffMs = endDate - startDate;
      return Math.max(Math.round(diffMs / (1000 * 60)), 0);
    } catch (error) {
      console.warn('Failed to calculate duration:', timeSlot, error);
      return 60; // fallback duration
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    try {
      // Use consistent date parsing to avoid timezone issues
      const date = new Date(`${dateString}T12:00:00`);// Use noon to avoid timezone edge cases
      console.log("Formatted date:", date, dateString)
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      return dateString; // fallback to original
    }
  };

  // Function to get the date range text based on current filter
  const getDateRangeText = () => {
    const today = new Date();

    switch (filter) {
      case 'today':
        return format(today, 'MMM d, yyyy');

      case 'week':
        const weekStart = startOfWeek(today, { weekStartsOn: 0 }); // Sunday
        const weekEnd = endOfWeek(today, { weekStartsOn: 0 }); // Saturday
        return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;

      case 'month':
        return format(today, 'MMMM yyyy');

      default:
        return null; // No date range for 'all'
    }
  };

  const filterButtons = [
    { id: 'all', label: 'All' },
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' }
  ];

  return (
    <div className={dashboard.section.container}>
      <div className={dashboard.section.header}>
        <div>
          <h3 className={dashboard.section.title}>
            Upcoming Bookings
            {getDateRangeText() && (
              <span className="text-lg font-normal text-gray-600 dark:text-gray-400 ml-2">
                ({getDateRangeText()})
              </span>
            )}
          </h3>
        </div>
        <div className={dashboard.filters.container}>
          {filterButtons.map(button => (
            <button
              key={button.id}
              onClick={() => setFilter(button.id)}
              className={`${dashboard.filters.button.base} ${
                filter === button.id
                  ? dashboard.filters.button.active
                  : dashboard.filters.button.inactive
              }`}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>

      {sortedBookings.length === 0 ? (
        <p className={dashboard.section.emptyState}>
          No bookings found for the selected filter.
        </p>
      ) : (
        <div className={dashboard.section.content}>
          {sortedBookings.map(booking => (
            <div key={booking.id} className="border dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {getInitials(booking.firstName, booking.lastName)}
                  </div>
                  <div>
                    <p className="font-medium dark:text-white">{getFullName(booking.firstName, booking.lastName)}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {booking.sessionDetails?.technique || "Training Session"}
                      {booking.sessionDetails?.skillLevel && ` - ${booking.sessionDetails.skillLevel}`}
                    </p>
                  </div>
                </div>
                <span className={`${components.badge} ${dashboard.status[booking.status] || dashboard.status.pending}`}>
                  {booking.status || 'pending'}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Date</p>
                  <p className="dark:text-white">{formatDate(booking.date)}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Time</p>
                  <p className="dark:text-white">{formatTimeSlot(booking.timeSlot)}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Duration</p>
                  <p className="dark:text-white">{calculateDuration(booking.timeSlot)}min</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Revenue</p>
                  <p className="dark:text-white">
                    ${(hourlyRate * calculateDuration(booking.timeSlot) / 60).toFixed(0)}
                  </p>
                </div>
              </div>

              {booking.notes && (
                <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Notes: {booking.notes}</p>
                </div>
              )}

              <div className={dashboard.actions.container}>
                <button className={dashboard.actions.edit}>
                  Edit
                </button>
                <button className={dashboard.actions.delete}>
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}