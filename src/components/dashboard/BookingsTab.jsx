import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, User, Calendar, MessageSquare, Edit, Trash2, Plus, DollarSign } from 'lucide-react';
import { dashboard, components } from '../../utils/classnames';
import EditBookingModal from './EditBookingModal';
import AddSessionModal from './AddSessionModal';

export default function BookingsTab({
                                      coach,
                                      bookings,
                                      onConfirmBooking,
                                      onRejectBooking,
                                      onEditBooking,
                                      onCancelBooking,
                                      onAddSession, // NEW: Add session handler
                                      onUpdatePayment, // NEW: Update payment handler
                                      loading,
                                      onForceReload // NEW: Force reload prop
                                    }) {
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [rejectionReasons, setRejectionReasons] = useState({});
  const [actionLoading, setActionLoading] = useState({});
  const [editingBooking, setEditingBooking] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState({});

  const hourlyRate = coach.price || coach.hourlyRate || 0;

  // Helper functions for date formatting
  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    try {
      const date = new Date(`${dateString}T12:00:00`);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) + ' at ' + date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'TBA';
    try {
      if (timeString.includes('T')) {
        const date = new Date(timeString);
        return date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit'
        });
      }
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      });
    } catch (error) {
      return timeString;
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

  const calculateDuration = (timeSlot) => {
    if (!timeSlot) return 60;
    if (timeSlot.duration) {
      return parseInt(timeSlot.duration);
    }
    if (!timeSlot.start || !timeSlot.end) return 60;
    try {
      let startDate, endDate;
      if (timeSlot.start.includes('T') && timeSlot.end.includes('T')) {
        startDate = new Date(timeSlot.start);
        endDate = new Date(timeSlot.end);
      } else {
        const [startHour, startMin] = timeSlot.start.split(':').map(Number);
        const [endHour, endMin] = timeSlot.end.split(':').map(Number);
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        return Math.max(endMinutes - startMinutes, 0);
      }
      const diffMs = endDate - startDate;
      return Math.max(Math.round(diffMs / (1000 * 60)), 0);
    } catch (error) {
      return 60;
    }
  };

  const getInitials = (firstName, lastName) => {
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    return first + last || 'C';
  };

  const getFullName = (firstName, lastName) => {
    if (!firstName && !lastName) return 'Client';
    return `${firstName || ''} ${lastName || ''}`.trim();
  };

  // Normalize booking status - treat undefined/null status as 'pending'
  const normalizeBookingStatus = (booking) => {
    return booking.status || 'pending';
  };

  // Filter bookings by date range
  const filteredByDate = bookings.filter(booking => {
    const today = new Date();
    const bookingDate = new Date(`${booking.date}T12:00:00`);

    if (filter === 'today') {
      const todayString = today.toLocaleDateString('en-CA');
      return booking.date === todayString;
    }

    if (filter === 'week') {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      return bookingDate >= weekStart && bookingDate <= weekEnd;
    }

    if (filter === 'month') {
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
      return bookingDate >= monthStart && bookingDate <= monthEnd;
    }

    return true;
  });

  // Filter by status - FIXED to handle bookings without status
  const filteredBookings = filteredByDate.filter(booking => {
    if (statusFilter === 'all') return true;
    const bookingStatus = normalizeBookingStatus(booking);
    return bookingStatus === statusFilter;
  });

  // Sort bookings
  const sortedBookings = filteredBookings.sort((a, b) => {
    const getDateTime = (booking) => {
      const timeSlot = booking.timeSlot;
      if (!timeSlot) return new Date(`${booking.date}T00:00:00`);

      if (timeSlot.start && timeSlot.start.includes('T')) {
        try {
          return new Date(timeSlot.start);
        } catch (error) {
          console.warn('Failed to parse ISO datetime:', timeSlot.start);
        }
      }

      const timeString = timeSlot.start || booking.time || '00:00';
      return new Date(`${booking.date}T${timeString}`);
    };

    return getDateTime(a) - getDateTime(b);
  });

  // Get status counts for the badges - FIXED to handle bookings without status
  const getStatusCounts = () => {
    const counts = bookings.reduce((acc, booking) => {
      const status = normalizeBookingStatus(booking);
      acc[status] = (acc[status] || 0) + 1;
      acc.all = (acc.all || 0) + 1;
      return acc;
    }, { all: 0 });
    return counts;
  };

  const statusCounts = getStatusCounts();

  // Handle booking actions with force reload
  const handleConfirm = async (bookingId) => {
    setActionLoading(prev => ({ ...prev, [bookingId]: 'confirming' }));
    if (onConfirmBooking) {
      await onConfirmBooking(bookingId);
      // Force reload after action
      if (onForceReload) {
        setTimeout(() => onForceReload(), 1000);
      }
    }
    setActionLoading(prev => ({ ...prev, [bookingId]: null }));
  };

  const handleReject = async (bookingId) => {
    const reason = rejectionReasons[bookingId] || '';
    setActionLoading(prev => ({ ...prev, [bookingId]: 'rejecting' }));
    if (onRejectBooking) {
      await onRejectBooking(bookingId, reason);
      // Force reload after action
      if (onForceReload) {
        setTimeout(() => onForceReload(), 1000);
      }
    }
    setRejectionReasons(prev => ({ ...prev, [bookingId]: '' }));
    setActionLoading(prev => ({ ...prev, [bookingId]: null }));
  };

  // NEW: Handle edit booking with modal
  const handleEdit = (booking) => {
    setEditingBooking(booking);
    setIsEditModalOpen(true);
  };

  // NEW: Handle save from edit modal
  const handleEditSave = async (bookingId, updateData) => {
    if (onEditBooking) {
      await onEditBooking(bookingId, updateData);
      setIsEditModalOpen(false);
      setEditingBooking(null);
      // Force reload after edit
      if (onForceReload) {
        setTimeout(() => onForceReload(), 1000);
      }
    }
  };

  // NEW: Handle add session
  const handleAddSession = async (sessionData) => {
    if (onAddSession) {
      await onAddSession(sessionData);
      setIsAddModalOpen(false);
      // Force reload after adding
      if (onForceReload) {
        setTimeout(() => onForceReload(), 1000);
      }
    }
  };

  // NEW: Handle payment update
  const handlePaymentUpdate = async (bookingId, paymentData) => {
    if (onUpdatePayment) {
      await onUpdatePayment(bookingId, paymentData);
      setEditingPayment(prev => ({ ...prev, [bookingId]: false }));
      // Force reload after payment update
      if (onForceReload) {
        setTimeout(() => onForceReload(), 1000);
      }
    }
  };

  // Helper function to generate/format booking number
  const getBookingNumber = (booking) => {
    // If booking has a specific booking number, use it
    if (booking.bookingNumber) return booking.bookingNumber;

    // If booking has bookingId, format it nicely
    if (booking.bookingId) {
      return booking.bookingId.replace('booking_', '#');
    }

    // Fallback: use the booking ID with prefix
    return `#${booking.id}`;
  };
  const getPaymentStatus = (booking) => {
    const paymentInfo = booking.paymentInfo;
    if (!paymentInfo) return { status: 'unknown', color: 'gray', text: 'Unknown' };

    const { status, totalAmount = 0, amountPaid = 0 } = paymentInfo;

    if (status === 'paid' || amountPaid >= totalAmount) {
      return { status: 'paid', color: 'green', text: 'Paid' };
    } else if (status === 'partial' || amountPaid > 0) {
      return { status: 'partial', color: 'yellow', text: `Partial (${amountPaid.toFixed(2)})` };
    } else {
      return { status: 'unpaid', color: 'red', text: 'Unpaid' };
    }
  };
  const handleCancel = async (bookingId) => {
    const reason = prompt('Please provide a cancellation reason (optional):') || '';

    if (confirm('Are you sure you want to cancel this booking?')) {
      if (onCancelBooking) {
        await onCancelBooking(bookingId, reason);
        // Force reload after cancel
        if (onForceReload) {
          setTimeout(() => onForceReload(), 1000);
        }
      }
    }
  };

  const updateRejectionReason = (bookingId, reason) => {
    setRejectionReasons(prev => ({ ...prev, [bookingId]: reason }));
  };

  const filterButtons = [
    { id: 'all', label: 'All' },
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' }
  ];

  const statusButtons = [
    { id: 'all', label: 'All', count: statusCounts.all || 0, color: 'gray' },
    { id: 'pending', label: 'Pending', count: statusCounts.pending || 0, color: 'yellow' },
    { id: 'confirmed', label: 'Confirmed', count: statusCounts.confirmed || 0, color: 'green' },
    { id: 'rejected', label: 'Rejected', count: statusCounts.rejected || 0, color: 'red' },
    { id: 'cancelled', label: 'Cancelled', count: statusCounts.cancelled || 0, color: 'gray' }
  ];

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    };
    return statusClasses[status] || statusClasses.pending;
  };

  const renderBookingCard = (booking) => {
    const bookingStatus = normalizeBookingStatus(booking);
    const isPending = bookingStatus === 'pending';
    const isConfirmed = bookingStatus === 'confirmed';
    const paymentStatus = getPaymentStatus(booking);
    const hourlyRate = coach.price || coach.hourlyRate || 0;
    const sessionRevenue = hourlyRate * calculateDuration(booking.timeSlot) / 60;

    return (
      <div key={booking.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="flex items-center space-x-3 mb-2 sm:mb-0">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                {getFullName(booking.firstName, booking.lastName)}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                {getBookingNumber(booking)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {booking.email}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(bookingStatus)}`}>
              {bookingStatus}
            </span>
            {/* Payment Status Badge */}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              paymentStatus.color === 'green' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                paymentStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                  paymentStatus.color === 'red' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
            }`}>
              💳 {paymentStatus.text}
            </span>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(booking.date)}</span>
            </div>
          </div>
        </div>

        {/* Session details */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Time
            </span>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {formatTimeSlot(booking.timeSlot)}
            </p>
          </div>

          <div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Duration
            </span>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {calculateDuration(booking.timeSlot)} minutes
            </p>
          </div>

          <div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Focus
            </span>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {booking.sessionDetails?.technique || 'General Training'}
            </p>
          </div>

          <div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Revenue
            </span>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              ${sessionRevenue.toFixed(0)}
            </p>
          </div>
        </div>

        {/* Payment Details */}
        {booking.paymentInfo && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                Payment Details
              </span>
              <button
                onClick={() => setEditingPayment(prev => ({ ...prev, [booking.id]: !prev[booking.id] }))}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                {editingPayment[booking.id] ? 'Cancel' : 'Update'}
              </button>
            </div>

            {editingPayment[booking.id] ? (
              /* Payment Edit Form */
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs text-gray-600 dark:text-gray-400">Status</label>
                    <select
                      defaultValue={booking.paymentInfo.status}
                      className="w-full text-xs px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                      onChange={(e) => {
                        const newStatus = e.target.value;
                        const totalAmount = booking.paymentInfo.totalAmount || sessionRevenue;
                        let amountPaid = booking.paymentInfo.amountPaid || 0;

                        if (newStatus === 'paid') amountPaid = totalAmount;
                        if (newStatus === 'unpaid') amountPaid = 0;

                        handlePaymentUpdate(booking.id, {
                          status: newStatus,
                          amountPaid: amountPaid,
                          totalAmount: totalAmount
                        });
                      }}
                    >
                      <option value="unpaid">Unpaid</option>
                      <option value="partial">Partial</option>
                      <option value="paid">Paid</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 dark:text-gray-400">Amount Paid</label>
                    <input
                      type="number"
                      defaultValue={booking.paymentInfo.amountPaid || 0}
                      min="0"
                      max={booking.paymentInfo.totalAmount || sessionRevenue}
                      step="0.01"
                      className="w-full text-xs px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                      onBlur={(e) => {
                        const amountPaid = parseFloat(e.target.value) || 0;
                        const totalAmount = booking.paymentInfo.totalAmount || sessionRevenue;
                        let status = 'unpaid';
                        if (amountPaid >= totalAmount) status = 'paid';
                        else if (amountPaid > 0) status = 'partial';

                        handlePaymentUpdate(booking.id, {
                          status: status,
                          amountPaid: amountPaid,
                          totalAmount: totalAmount
                        });
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 dark:text-gray-400">Total</label>
                    <input
                      type="text"
                      value={`${(booking.paymentInfo.totalAmount || sessionRevenue).toFixed(2)}`}
                      readOnly
                      className="w-full text-xs px-2 py-1 border rounded bg-gray-50 dark:bg-gray-600"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Payment Display */
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Total:</span>
                  <span className="font-medium ml-1">${(booking.paymentInfo.totalAmount || sessionRevenue).toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Paid:</span>
                  <span className="font-medium ml-1 text-green-600">${(booking.paymentInfo.amountPaid || 0).toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Due:</span>
                  <span className="font-medium ml-1 text-red-600">
                    ${Math.max((booking.paymentInfo.totalAmount || sessionRevenue) - (booking.paymentInfo.amountPaid || 0), 0).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Notes if any */}
        {booking.sessionDetails?.notes && (
          <div className="mb-4">
            <div className="flex items-start space-x-2">
              <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Client Notes
                </span>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                  {booking.sessionDetails.notes}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Request timestamp for pending bookings */}
        {isPending && booking.createdAt && (
          <div className="mb-4">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Requested on {formatDateTime(booking.createdAt)}
            </span>
          </div>
        )}

        {/* CONDITIONAL BUTTON RENDERING */}
        {isPending ? (
          /* PENDING BOOKINGS: Show Accept/Reject */
          <>
            {/* Rejection reason input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rejection reason (optional)
              </label>
              <textarea
                value={rejectionReasons[booking.id] || ''}
                onChange={(e) => updateRejectionReason(booking.id, e.target.value)}
                placeholder="If rejecting, provide a reason to help the client understand..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                rows="2"
              />
            </div>

            {/* Accept/Reject buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleConfirm(booking.id)}
                disabled={actionLoading[booking.id] || loading}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium rounded-lg transition-colors space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>
                  {actionLoading[booking.id] === 'confirming' ? 'Accepting...' : 'Accept'}
                </span>
              </button>

              <button
                onClick={() => handleReject(booking.id)}
                disabled={actionLoading[booking.id] || loading}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium rounded-lg transition-colors space-x-2"
              >
                <XCircle className="w-4 h-4" />
                <span>
                  {actionLoading[booking.id] === 'rejecting' ? 'Rejecting...' : 'Reject'}
                </span>
              </button>
            </div>
          </>
        ) : (
          /* CONFIRMED/OTHER BOOKINGS: Show Edit/Cancel */
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => handleEdit(booking)}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>

            <button
              onClick={() => handleCancel(booking.id)}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={dashboard.section.container}>
      <div className={dashboard.section.header}>
        <h3 className={dashboard.section.title}>Booking Management</h3>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Session</span>
        </button>
      </div>

      {/* Date Filter Buttons */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {filterButtons.map(button => (
            <button
              key={button.id}
              onClick={() => setFilter(button.id)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === button.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>

      {/* Status Filter Buttons */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {statusButtons.map(button => (
            <button
              key={button.id}
              onClick={() => setStatusFilter(button.id)}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors space-x-2 ${
                statusFilter === button.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span>{button.label}</span>
              {button.count > 0 && (
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  statusFilter === button.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                }`}>
                  {button.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* DEBUG INFO - Remove this in production */}
      {/*<div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border text-sm">*/}
      {/*  <strong>Debug Info:</strong><br/>*/}
      {/*  Total bookings: {bookings.length}<br/>*/}
      {/*  Filtered bookings: {sortedBookings.length}<br/>*/}
      {/*  Status counts: {JSON.stringify(statusCounts)}<br/>*/}
      {/*  Current filters: Date={filter}, Status={statusFilter}*/}
      {/*</div>*/}

      {/* Bookings List */}
      {sortedBookings.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
            No Bookings Found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {statusFilter === 'pending'
              ? 'No pending booking requests to review.'
              : `No ${statusFilter === 'all' ? '' : statusFilter} bookings found for the selected time period.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedBookings.map(renderBookingCard)}
        </div>
      )}

      {/* Add Session Modal */}
      <AddSessionModal
        coach={coach}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddSession}
        loading={loading}
      />

      {/* Edit Booking Modal */}
      <EditBookingModal
        booking={editingBooking}
        coach={coach}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingBooking(null);
        }}
        onSave={handleEditSave}
        loading={loading}
      />
    </div>
  );
}