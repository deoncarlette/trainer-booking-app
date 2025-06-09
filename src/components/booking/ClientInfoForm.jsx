// src/components/booking/ClientInfoForm.jsx - Updated
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, Input, Textarea } from "../ui";

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

    if (onClientInfoChange) {
      onClientInfoChange(updatedData);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name *"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            required
          />
          <Input
            label="Last Name *"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            required
          />
          <Input
            label="Email Address *"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
          />
          <Input
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </div>

        <div className="mt-4">
          <Textarea
            label="Special requests or additional notes (optional)"
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            rows={3}
          />
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>Payment:</strong> Payment will be collected at the time of your training session.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}