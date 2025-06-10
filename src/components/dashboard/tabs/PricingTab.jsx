import React, { useState } from 'react';
import { dashboard } from '../../../utils';

export default function PricingTab({ coach, onPricingUpdate, loading }) {
  const [hourlyRate, setHourlyRate] = useState(coach.price || coach.hourlyRate || '');
  const [fiveHourDiscount, setFiveHourDiscount] = useState(coach.discounts?.fiveHour || 5);
  const [tenHourDiscount, setTenHourDiscount] = useState(coach.discounts?.tenHour || 10);

  const handleSavePricing = async () => {
    // Convert empty string or 0 to default of 50
    const finalHourlyRate = !hourlyRate || hourlyRate === 0 ? 50 : parseInt(hourlyRate);

    const pricingData = {
      hourlyRate: finalHourlyRate,
      discounts: {
        fiveHour: parseInt(fiveHourDiscount) || 5,
        tenHour: parseInt(tenHourDiscount) || 10
      }
    };

    if (onPricingUpdate) {
      await onPricingUpdate(pricingData);
      // Update local state with the final values
      setHourlyRate(finalHourlyRate);
    }
  };

  const handleHourlyRateChange = (e) => {
    const value = e.target.value;
    // Allow empty string or valid numbers
    if (value === '' || (!isNaN(value) && parseInt(value) >= 0)) {
      setHourlyRate(value === '' ? '' : parseInt(value));
    }
  };

  const handleDiscountChange = (setter) => (e) => {
    const value = e.target.value;
    if (value === '' || (!isNaN(value) && parseInt(value) >= 0 && parseInt(value) <= 100)) {
      setter(value === '' ? '' : parseInt(value));
    }
  };

  // Calculate package prices using current discount values
  const calculatePackagePrice = (hours, discount) => {
    const rate = hourlyRate || 0;
    const discountPercent = discount || 0;
    return (rate * hours * (1 - discountPercent / 100)).toFixed(0);
  };

  const calculatePricePerHour = (discount) => {
    const rate = hourlyRate || 0;
    const discountPercent = discount || 0;
    return (rate * (1 - discountPercent / 100)).toFixed(0);
  };

  const packages = [
    {
      title: "Single Session",
      description: "1 hour training session",
      price: hourlyRate || 0,
      pricePerHour: null
    },
    {
      title: "5-Hour Package",
      description: `${fiveHourDiscount}% discount applied`,
      price: calculatePackagePrice(5, fiveHourDiscount),
      pricePerHour: calculatePricePerHour(fiveHourDiscount)
    },
    {
      title: "10-Hour Package",
      description: `${tenHourDiscount}% discount applied`,
      price: calculatePackagePrice(10, tenHourDiscount),
      pricePerHour: calculatePricePerHour(tenHourDiscount)
    }
  ];

  return (
    <div className={dashboard.section.container}>
      <div className={dashboard.section.header}>
        <h3 className={dashboard.section.title}>Pricing Management</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Set your hourly rate and package discounts. Default rate is $50/hour if left empty.
        </p>
      </div>

      <div className={dashboard.section.content}>
        <div className={dashboard.form.group}>
          {/* All Pricing Controls in Black Container */}
          <div className="border dark:border-stone-700 rounded-lg p-4 bg-gray-50 dark:bg-black">
            <div className="space-y-4 lg:space-y-0 lg:flex lg:items-end lg:space-x-8">
              {/* Hourly Rate */}
              <div className="flex-shrink-0">
                <label className={dashboard.form.label}>
                  Hourly Rate
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 dark:text-gray-400">$</span>
                  <input
                    type="text"
                    value={hourlyRate}
                    onChange={handleHourlyRateChange}
                    placeholder="50"
                    className="w-20 lg:w-24 px-3 py-2 border border-gray-300 dark:border-stone-600 rounded bg-white dark:bg-stone-900 text-gray-900 dark:text-white text-center"
                  />
                  <span className="text-gray-500 dark:text-gray-400">/hr</span>
                </div>
                {(!hourlyRate || hourlyRate === 0) && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Defaults to $50
                  </p>
                )}
              </div>

              {/* 5-Hour Discount */}
              <div className="flex-shrink-0">
                <label className={dashboard.form.label}>
                  5-Hour Discount
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={fiveHourDiscount}
                    onChange={handleDiscountChange(setFiveHourDiscount)}
                    placeholder="5"
                    className="w-20 lg:w-24 px-3 py-2 border border-gray-300 dark:border-stone-600 rounded bg-white dark:bg-stone-900 text-gray-900 dark:text-white text-center"
                  />
                  <span className="text-gray-500 dark:text-gray-400">%</span>
                </div>
              </div>

              {/* 10-Hour Discount */}
              <div className="flex-shrink-0">
                <label className={dashboard.form.label}>
                  10-Hour Discount
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={tenHourDiscount}
                    onChange={handleDiscountChange(setTenHourDiscount)}
                    placeholder="10"
                    className="w-20 lg:w-24 px-3 py-2 border border-gray-300 dark:border-stone-600 rounded bg-white dark:bg-stone-900 text-gray-900 dark:text-white text-center"
                  />
                  <span className="text-gray-500 dark:text-gray-400">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Package Preview Section */}
          <div className="space-y-3">
            <h4 className="font-medium dark:text-white">Package Preview</h4>
            <div className="space-y-3">
              {packages.map((pkg, index) => (
                <div key={index} className="border dark:border-stone-700 rounded-lg p-3 sm:p-4 bg-gray-50 dark:bg-black">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium dark:text-white">{pkg.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{pkg.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg dark:text-white">${pkg.price}</p>
                      {pkg.pricePerHour && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          ${pkg.pricePerHour}/hour
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className={dashboard.form.buttonGroup}>
            <button
              onClick={handleSavePricing}
              disabled={loading}
              className={`${dashboard.form.primaryButton} disabled:opacity-50 disabled:cursor-not-allowed ${
                loading ? 'cursor-wait' : ''
              }`}
            >
              {loading ? 'Updating...' : 'Update Pricing'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}