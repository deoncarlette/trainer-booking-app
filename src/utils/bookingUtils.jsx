// utils/bookingUtils.js

/**
 * Utility functions for booking management
 */

// Generate a unique booking number
export const generateBookingNumber = (prefix = 'BK', coachId = null) => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

  if (coachId) {
    // Include coach initials for multi-coach systems
    const coachInitials = coachId.slice(0, 2).toUpperCase();
    return `${prefix}${coachInitials}${timestamp.toString().slice(-6)}${random}`;
  }

  // Standard format: BK + last 6 digits of timestamp + 3 random digits
  return `${prefix}${timestamp.toString().slice(-6)}${random}`;
};

// Generate a shorter booking number for display
export const generateShortBookingNumber = (coachId = null) => {
  const timestamp = Date.now();
  const last4 = timestamp.toString().slice(-4);

  if (coachId) {
    const coachInitial = coachId.charAt(0).toUpperCase();
    return `${coachInitial}${last4}`;
  }

  return `#${last4}`;
};

// Format booking number for display
export const formatBookingNumber = (booking) => {
  // If booking has a specific booking number, use it
  if (booking.bookingNumber) {
    return booking.bookingNumber;
  }

  // If booking has bookingId, format it nicely
  if (booking.bookingId) {
    return booking.bookingId.replace('booking_', '#');
  }

  // Fallback: use the booking ID with prefix
  return `#${booking.id}`;
};

// Get booking display info
export const getBookingDisplayInfo = (booking) => {
  const bookingNumber = formatBookingNumber(booking);
  const clientName = `${booking.firstName || ''} ${booking.lastName || ''}`.trim() || 'Client';
  const date = booking.date;
  const status = booking.status || 'pending';

  return {
    bookingNumber,
    clientName,
    date,
    status,
    displayTitle: `${bookingNumber} - ${clientName}`,
    shortTitle: `${bookingNumber.slice(-6)} - ${clientName.split(' ')[0]}`
  };
};

// Search bookings by number or client name
export const searchBookings = (bookings, searchTerm) => {
  if (!searchTerm) return bookings;

  const term = searchTerm.toLowerCase();

  return bookings.filter(booking => {
    const info = getBookingDisplayInfo(booking);
    return (
      info.bookingNumber.toLowerCase().includes(term) ||
      info.clientName.toLowerCase().includes(term) ||
      booking.email?.toLowerCase().includes(term) ||
      booking.phone?.includes(term)
    );
  });
};

// Sort bookings by various criteria
export const sortBookings = (bookings, sortBy = 'date', direction = 'asc') => {
  return [...bookings].sort((a, b) => {
    let valueA, valueB;

    switch (sortBy) {
      case 'date':
        valueA = new Date(`${a.date}T${a.timeSlot?.start || '00:00'}`);
        valueB = new Date(`${b.date}T${b.timeSlot?.start || '00:00'}`);
        break;
      case 'client':
        valueA = `${a.firstName || ''} ${a.lastName || ''}`.trim().toLowerCase();
        valueB = `${b.firstName || ''} ${b.lastName || ''}`.trim().toLowerCase();
        break;
      case 'status':
        const statusOrder = { pending: 1, confirmed: 2, completed: 3, cancelled: 4, rejected: 5 };
        valueA = statusOrder[a.status || 'pending'] || 999;
        valueB = statusOrder[b.status || 'pending'] || 999;
        break;
      case 'bookingNumber':
        valueA = formatBookingNumber(a);
        valueB = formatBookingNumber(b);
        break;
      case 'created':
        valueA = new Date(a.createdAt || 0);
        valueB = new Date(b.createdAt || 0);
        break;
      default:
        valueA = a[sortBy];
        valueB = b[sortBy];
    }

    if (valueA < valueB) return direction === 'asc' ? -1 : 1;
    if (valueA > valueB) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

// Get booking statistics
export const getBookingStats = (bookings) => {
  const stats = {
    total: bookings.length,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    rejected: 0,
    totalRevenue: 0,
    averageSessionLength: 0
  };

  let totalDuration = 0;

  bookings.forEach(booking => {
    const status = booking.status || 'pending';
    stats[status] = (stats[status] || 0) + 1;

    // Calculate revenue (use custom rate if available)
    const hourlyRate = booking.customHourlyRate || 75; // fallback rate
    const duration = parseInt(booking.timeSlot?.duration || 60);
    const sessionRevenue = (hourlyRate * duration) / 60;

    if (status === 'confirmed' || status === 'completed') {
      stats.totalRevenue += sessionRevenue;
    }

    totalDuration += duration;
  });

  stats.averageSessionLength = bookings.length > 0 ? Math.round(totalDuration / bookings.length) : 0;

  return stats;
};

// Validate booking data
export const validateBookingData = (bookingData) => {
  const errors = [];

  if (!bookingData.firstName?.trim()) {
    errors.push('First name is required');
  }

  if (!bookingData.lastName?.trim()) {
    errors.push('Last name is required');
  }

  if (!bookingData.date) {
    errors.push('Date is required');
  }

  if (!bookingData.timeSlot?.start) {
    errors.push('Start time is required');
  }

  if (bookingData.email && !isValidEmail(bookingData.email)) {
    errors.push('Valid email is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Simple email validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Export all utilities
export default {
  generateBookingNumber,
  generateShortBookingNumber,
  formatBookingNumber,
  getBookingDisplayInfo,
  searchBookings,
  sortBookings,
  getBookingStats,
  validateBookingData
};