import React, { useState } from 'react';
import { format } from 'date-fns';
import { dashboard, components } from '../../utils/classnames';

export default function BookingsTab({ coach, bookings }) {
  const [filter, setFilter] = useState('all');
  const hourlyRate = coach.price || coach.hourlyRate || 0;

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      return booking.date === today;
    }
    if (filter === 'week') {
      const today = new Date();
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      const bookingDate = new Date(booking.date);
      return bookingDate >= today && bookingDate <= weekFromNow;
    }
    return true; // 'all'
  });

  const getInitials = (name) => {
    if (!name) return 'C';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const filterButtons = [
    { id: 'all', label: 'All' },
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'Week' }
  ];

  return (
    <div className={dashboard.section.container}>
      <div className={dashboard.section.header}>
        <h3 className={dashboard.section.title}>Upcoming Bookings</h3>
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

      {filteredBookings.length === 0 ? (
        <p className={dashboard.section.emptyState}>
          No bookings found for the selected filter.
        </p>
      ) : (
        <div className={dashboard.section.content}>
          {filteredBookings.map(booking => (
            <div key={booking.id} className="border dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {getInitials(booking.clientName)}
                  </div>
                  <div>
                    <p className="font-medium dark:text-white">{booking.clientName || 'Client'}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{booking.type || 'Training Session'}</p>
                  </div>
                </div>
                <span className={`${components.badge} ${dashboard.status[booking.status] || dashboard.status.pending}`}>
                  {booking.status || 'pending'}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Date</p>
                  <p className="dark:text-white">
                    {booking.date ? format(new Date(booking.date), 'MMM d, yyyy') : 'TBA'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Time</p>
                  <p className="dark:text-white">{booking.time || 'TBA'}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Duration</p>
                  <p className="dark:text-white">{booking.duration || 60}min</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Revenue</p>
                  <p className="dark:text-white">
                    ${(hourlyRate * (booking.duration || 60) / 60).toFixed(0)}
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