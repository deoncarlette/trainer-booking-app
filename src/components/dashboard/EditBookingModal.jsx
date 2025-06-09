import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, MessageSquare } from 'lucide-react';
import { dashboard } from '../../utils/classnames';

export default function EditBookingModal({
                                           booking,
                                           coach,
                                           isOpen,
                                           onClose,
                                           onSave,
                                           loading
                                         }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    date: '',
    startTime: '',
    endTime: '',
    duration: 60,
    technique: 'General Training',
    skillLevel: 'Beginner',
    notes: '',
    customHourlyRate: 0, // NEW: Custom pricing
    useCustomRate: false, // NEW: Toggle for custom pricing
    paymentStatus: 'unpaid', // NEW: Payment status
    amountPaid: 0 // NEW: Amount paid
  });

  // Populate form when booking changes
  useEffect(() => {
    if (booking) {
      // Extract time from timeSlot
      const getTimeFromSlot = (timeString) => {
        if (!timeString) return '';
        if (timeString.includes('T')) {
          return new Date(timeString).toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
          });
        }
        return timeString;
      };

      const calculateDuration = (start, end) => {
        if (!start || !end) return 60;
        try {
          const startDate = new Date(`2000-01-01T${start}`);
          const endDate = new Date(`2000-01-01T${end}`);
          return Math.max((endDate - startDate) / (1000 * 60), 30);
        } catch {
          return 60;
        }
      };

      const startTime = getTimeFromSlot(booking.timeSlot?.start);
      const endTime = getTimeFromSlot(booking.timeSlot?.end);

      // Check if booking has custom pricing
      const hasCustomRate = booking.customHourlyRate && booking.customHourlyRate !== (coach.price || coach.hourlyRate);

      // Extract payment information
      const paymentInfo = booking.paymentInfo || {};
      const sessionTotal = (hasCustomRate ? booking.customHourlyRate : (coach.price || coach.hourlyRate || 0)) *
        (booking.timeSlot?.duration ? parseInt(booking.timeSlot.duration) : 60) / 60;

      setFormData({
        firstName: booking.firstName || '',
        lastName: booking.lastName || '',
        email: booking.email || '',
        phone: booking.phone || '',
        date: booking.date || '',
        startTime: startTime,
        endTime: endTime,
        duration: booking.timeSlot?.duration ? parseInt(booking.timeSlot.duration) : calculateDuration(startTime, endTime),
        technique: booking.sessionDetails?.technique || 'General Training',
        skillLevel: booking.sessionDetails?.skillLevel || 'Beginner',
        notes: booking.sessionDetails?.notes || '',
        customHourlyRate: booking.customHourlyRate || (coach.price || coach.hourlyRate || 0),
        useCustomRate: hasCustomRate,
        paymentStatus: paymentInfo.status || 'unpaid',
        amountPaid: paymentInfo.amountPaid || 0
      });
    }
  }, [booking]);

  // Calculate end time when start time or duration changes
  useEffect(() => {
    if (formData.startTime && formData.duration) {
      try {
        const [hours, minutes] = formData.startTime.split(':').map(Number);
        const startDate = new Date();
        startDate.setHours(hours, minutes, 0, 0);

        const endDate = new Date(startDate.getTime() + (formData.duration * 60000));
        const endTime = endDate.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit'
        });

        setFormData(prev => ({ ...prev, endTime }));
      } catch (error) {
        console.warn('Error calculating end time:', error);
      }
    }
  }, [formData.startTime, formData.duration]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked :
        type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Only validate fields that were originally required or have been filled
    const requiredFields = [];

    // Always require name and date/time
    if (!formData.firstName) requiredFields.push('First Name');
    if (!formData.lastName) requiredFields.push('Last Name');
    if (!formData.date) requiredFields.push('Date');
    if (!formData.startTime) requiredFields.push('Start Time');

    // Only require email if it was originally provided OR if user has entered it
    if (booking.email && !formData.email) {
      requiredFields.push('Email');
    }

    if (requiredFields.length > 0) {
      alert(`Please fill in the following required fields: ${requiredFields.join(', ')}`);
      return;
    }

    // Calculate session total for payment info
    const sessionTotal = (formData.useCustomRate ? formData.customHourlyRate : (coach.price || coach.hourlyRate || 0)) * formData.duration / 60;

    // Prepare update data (only include fields that have values)
    const updateData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      date: formData.date,
      timeSlot: {
        start: `${formData.date}T${formData.startTime}:00-05:00`,
        end: `${formData.date}T${formData.endTime}:00-05:00`,
        duration: formData.duration.toString()
      },
      sessionDetails: {
        technique: formData.technique,
        skillLevel: formData.skillLevel,
        notes: formData.notes
      },
      paymentInfo: {
        status: formData.paymentStatus,
        totalAmount: sessionTotal,
        amountPaid: formData.amountPaid,
        amountDue: Math.max(sessionTotal - formData.amountPaid, 0),
        lastUpdated: new Date().toISOString()
      }
    };

    // Only include email and phone if they have values
    if (formData.email.trim()) {
      updateData.email = formData.email;
    }
    if (formData.phone.trim()) {
      updateData.phone = formData.phone;
    }

    // Include custom pricing if enabled
    if (formData.useCustomRate && formData.customHourlyRate !== (coach.price || coach.hourlyRate)) {
      updateData.customHourlyRate = parseFloat(formData.customHourlyRate);
    }

    console.log('📤 Sending update data:', updateData); // Debug log

    await onSave(booking.id, updateData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Edit Booking
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Client Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Client Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email {booking?.email ? '*' : '(optional)'}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required={!!booking?.email} // Only required if originally had email
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Scheduling */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Scheduling
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Time *
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duration (minutes)
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                  <option value="120">120 minutes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Session Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Session Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Focus/Technique
                </label>
                <select
                  name="technique"
                  value={formData.technique}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Shooting Technique">Shooting Technique</option>
                  <option value="Ball Handling">Ball Handling</option>
                  <option value="Defense">Defense</option>
                  <option value="Conditioning">Conditioning</option>
                  <option value="Game Strategy">Game Strategy</option>
                  <option value="General Training">General Training</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Skill Level
                </label>
                <select
                  name="skillLevel"
                  value={formData.skillLevel}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Elite">Elite</option>
                </select>
              </div>
            </div>
          </div>

          {/* Custom Pricing */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              💰 Pricing
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="useCustomRate"
                  name="useCustomRate"
                  checked={formData.useCustomRate}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="useCustomRate" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Use custom hourly rate for this session
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {formData.useCustomRate ? 'Custom Hourly Rate' : 'Standard Hourly Rate'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="number"
                      name="customHourlyRate"
                      value={formData.customHourlyRate}
                      onChange={handleInputChange}
                      disabled={!formData.useCustomRate}
                      min="0"
                      step="0.01"
                      className={`w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 ${
                        formData.useCustomRate
                          ? 'bg-white dark:bg-gray-700'
                          : 'bg-gray-50 dark:bg-gray-600 cursor-not-allowed'
                      }`}
                    />
                  </div>
                  {!formData.useCustomRate && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Standard rate: ${coach.price || coach.hourlyRate || 0}/hour
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Session Total
                  </label>
                  <div className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-600">
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      ${((formData.useCustomRate ? formData.customHourlyRate : (coach.price || coach.hourlyRate || 0)) * formData.duration / 60).toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                      (${formData.useCustomRate ? formData.customHourlyRate : (coach.price || coach.hourlyRate || 0)}/hr × {formData.duration} min)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              💳 Payment Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Status
                </label>
                <select
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="unpaid">Unpaid</option>
                  <option value="partial">Partially Paid</option>
                  <option value="paid">Fully Paid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount Paid
                </label>
                <input
                  type="number"
                  name="amountPaid"
                  value={formData.amountPaid}
                  onChange={handleInputChange}
                  min="0"
                  max={(formData.useCustomRate ? formData.customHourlyRate : (coach.price || coach.hourlyRate || 0)) * formData.duration / 60}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Session Total
                </label>
                <input
                  type="text"
                  value={`${((formData.useCustomRate ? formData.customHourlyRate : (coach.price || coach.hourlyRate || 0)) * formData.duration / 60).toFixed(2)}`}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-gray-100 font-bold"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Notes
            </h3>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="3"
              placeholder="Additional notes or special requests..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Payment Summary */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Session Total:</span>
              <span className="font-bold text-gray-900 dark:text-gray-100">
                ${((formData.useCustomRate ? formData.customHourlyRate : (coach.price || coach.hourlyRate || 0)) * formData.duration / 60).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Amount Paid:</span>
              <span className="font-bold text-green-600 dark:text-green-400">${formData.amountPaid.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-600 pt-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Amount Due:</span>
              <span className={`font-bold ${
                Math.max(((formData.useCustomRate ? formData.customHourlyRate : (coach.price || coach.hourlyRate || 0)) * formData.duration / 60) - formData.amountPaid, 0) > 0
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-green-600 dark:text-green-400'
              }`}>
                ${Math.max(((formData.useCustomRate ? formData.customHourlyRate : (coach.price || coach.hourlyRate || 0)) * formData.duration / 60) - formData.amountPaid, 0).toFixed(2)}
              </span>
            </div>
            {formData.useCustomRate && (
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium pt-1 border-t border-gray-200 dark:border-gray-600">
                💰 Custom Rate Applied: ${formData.customHourlyRate}/hour
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}