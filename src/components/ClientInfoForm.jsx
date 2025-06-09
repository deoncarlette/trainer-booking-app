import React, { useState } from "react";

export default function ClientInfoForm({ onClientInfoChange, clientInfo = {} }) {
  const [formData, setFormData] = useState({
    firstName: clientInfo.firstName || '',
    lastName: clientInfo.lastName || '',
    email: clientInfo.email || '',
    phone: clientInfo.phone || '',
    notes: clientInfo.notes || ''
  });

  const handleChange = (field, value) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);

    // Pass the updated data back to parent component
    if (onClientInfoChange) {
      onClientInfoChange(updatedData);
    }
  };

  return (
    <div className="bg-white text-gray-900 dark:bg-stone-900 dark:text-stone-100 rounded-lg p-4">
      <h3 className="font-medium mb-3">Contact Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="bg-gray-100 dark:bg-stone-800 dark:text-stone-100 px-3 py-2 rounded border border-gray-600"
          placeholder="First Name*"
          value={formData.firstName}
          onChange={(e) => handleChange('firstName', e.target.value)}
          required
        />
        <input
          className="bg-gray-100 dark:bg-stone-800 dark:text-stone-100 px-3 py-2 rounded border border-gray-600"
          placeholder="Last Name*"
          value={formData.lastName}
          onChange={(e) => handleChange('lastName', e.target.value)}
          required
        />
        <input
          className="bg-gray-100 dark:bg-stone-800 dark:text-stone-100 px-3 py-2 rounded border border-gray-600"
          placeholder="Email Address*"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          required
        />
        <input
          className="bg-gray-100 dark:bg-stone-800 dark:text-stone-100 px-3 py-2 rounded border border-gray-600"
          placeholder="Phone Number"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
        />
      </div>

      {/* Additional notes field spanning full width */}
      <div className="mt-4">
        <textarea
          className="w-full bg-gray-100 dark:bg-stone-800 dark:text-stone-100 px-3 py-2 rounded border border-gray-600"
          placeholder="Special requests or additional notes (optional)"
          rows="3"
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
        />
      </div>

      {/* Payment status note */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>Payment:</strong> Payment will be collected at the time of your training session.
        </p>
      </div>
    </div>
  );
}