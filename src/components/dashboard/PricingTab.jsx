import React, { useState } from 'react';
import { dashboard } from '../../utils/classnames';

export default function PricingTab({ coach }) {
  const [hourlyRate, setHourlyRate] = useState(coach.price || coach.hourlyRate || 0);

  const handleSavePricing = () => {
    // Here you would save to Firebase
    console.log('Saving pricing:', { hourlyRate });
  };

  const packages = [
    {
      title: "Single Session",
      description: "1 hour training session",
      price: hourlyRate,
      pricePerSession: null
    },
    {
      title: "5-Session Package",
      description: "5% discount applied",
      price: (hourlyRate * 5 * 0.95).toFixed(0),
      pricePerSession: (hourlyRate * 0.95).toFixed(0)
    },
    {
      title: "10-Session Package",
      description: "10% discount applied",
      price: (hourlyRate * 10 * 0.9).toFixed(0),
      pricePerSession: (hourlyRate * 0.9).toFixed(0)
    }
  ];

  return (
    <div className={dashboard.section.container}>
      <h3 className={dashboard.section.title}>Pricing Management</h3>

      <div className={dashboard.form.group}>
        <div>
          <label className={dashboard.form.label}>
            Hourly Rate
          </label>
          <div className="flex items-center space-x-3">
            <span className="text-gray-500 dark:text-gray-400">$</span>
            <input
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(parseInt(e.target.value) || 0)}
              className="w-32 px-3 py-2 border dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
            />
            <span className="text-gray-500 dark:text-gray-400">per hour</span>
          </div>
        </div>

        <div>
          <h4 className="font-medium dark:text-white mb-3">Session Packages</h4>
          <div className={dashboard.section.content}>
            {packages.map((pkg, index) => (
              <div key={index} className="flex items-center justify-between p-3 border dark:border-gray-700 rounded">
                <div>
                  <p className="font-medium dark:text-white">{pkg.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{pkg.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium dark:text-white">${pkg.price}</p>
                  {pkg.pricePerSession && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">${pkg.pricePerSession}/session</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSavePricing}
          className={dashboard.form.primaryButton}
        >
          Update Pricing
        </button>
      </div>
    </div>
  );
}