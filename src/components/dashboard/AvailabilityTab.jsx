import React, { useState, useEffect } from 'react';
import { Calendar, Plus, X } from 'lucide-react';
import { dashboard } from '../../utils/classnames';

// Import the existing components (we'll create these separately)
import WeeklyScheduleTab from './WeeklyScheduleTab';
import CustomDatesTab from './CustomDatesTab';
import UnavailableDatesTab from './UnavailableDatesTab';

export default function AvailabilityTab({
                                          availability: initialAvailability,
                                          onAvailabilityUpdate,
                                          onCustomAvailabilityUpdate,
                                          onUnavailableDatesUpdate,
                                          loading
                                        }) {
  const [activeTab, setActiveTab] = useState('weekly');
  const [weeklyAvailability, setWeeklyAvailability] = useState({});
  const [customAvailability, setCustomAvailability] = useState({});
  const [unavailableDates, setUnavailableDates] = useState([]);

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  // Initialize availability from Firebase data
  useEffect(() => {
    if (initialAvailability?.weeklyAvailability) {
      setWeeklyAvailability(initialAvailability.weeklyAvailability);
    } else {
      // Default availability structure
      const defaultAvailability = {};
      days.forEach(day => {
        defaultAvailability[day] = {};
      });
      setWeeklyAvailability(defaultAvailability);
    }

    if (initialAvailability?.customAvailability) {
      setCustomAvailability(initialAvailability.customAvailability);
    } else {
      setCustomAvailability({});
    }

    if (initialAvailability?.unavailableDates && Array.isArray(initialAvailability.unavailableDates)) {
      setUnavailableDates(initialAvailability.unavailableDates);
    } else {
      setUnavailableDates([]);
    }
  }, [initialAvailability]);

  // Tab configuration
  const tabs = [
    { id: 'weekly', label: 'Weekly Schedule', icon: Calendar },
    { id: 'custom', label: 'Custom Dates', icon: Plus },
    { id: 'unavailable', label: 'Unavailable', icon: X }
  ];

  return (
    <div className={dashboard.section.container}>
      <div className={dashboard.section.header}>
        <h3 className={dashboard.section.title}>Availability Management</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Manage your weekly schedule, custom dates, and unavailable periods.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className={dashboard.section.content}>
        {activeTab === 'weekly' && (
          <WeeklyScheduleTab
            weeklyAvailability={weeklyAvailability}
            setWeeklyAvailability={setWeeklyAvailability}
            onAvailabilityUpdate={onAvailabilityUpdate}
            loading={loading}
          />
        )}

        {activeTab === 'custom' && (
          <CustomDatesTab
            customAvailability={customAvailability}
            setCustomAvailability={setCustomAvailability}
            onCustomAvailabilityUpdate={onCustomAvailabilityUpdate}
            loading={loading}
          />
        )}

        {activeTab === 'unavailable' && (
          <UnavailableDatesTab
            unavailableDates={unavailableDates}
            setUnavailableDates={setUnavailableDates}
            onUnavailableDatesUpdate={onUnavailableDatesUpdate}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}