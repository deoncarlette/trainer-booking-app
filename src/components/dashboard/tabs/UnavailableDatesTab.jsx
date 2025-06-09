import React from 'react';
import { X, Trash2, Save } from 'lucide-react';
import { dashboard } from '../../../utils';
import { DateInput } from './AvailabilityComponents';

export default function UnavailableDatesTab({
                                              unavailableDates,
                                              setUnavailableDates,
                                              onUnavailableDatesUpdate,
                                              loading
                                            }) {
  const today = new Date().toISOString().split('T')[0];

  const addUnavailableDate = () => {
    // Find the next available date that isn't already in the list
    let newDate = today;
    let dateToAdd = new Date(today);

    // Keep incrementing the date until we find one that's not already added
    while ((unavailableDates || []).includes(newDate)) {
      dateToAdd.setDate(dateToAdd.getDate() + 1);
      newDate = dateToAdd.toISOString().split('T')[0];
    }

    setUnavailableDates(prev => [...(prev || []), newDate].sort());
  };

  const removeUnavailableDate = (date) => {
    setUnavailableDates(prev => (prev || []).filter(d => d !== date));
  };

  const updateUnavailableDate = (oldDate, newDate) => {
    if (newDate !== oldDate && !(unavailableDates || []).includes(newDate)) {
      setUnavailableDates(prev =>
        (prev || []).map(d => d === oldDate ? newDate : d).sort()
      );
    }
  };

  const saveUnavailableDates = async () => {
    if (onUnavailableDatesUpdate) {
      await onUnavailableDatesUpdate(unavailableDates);
    }
  };

  return (
    <>
      <div className="mb-6">
        <button
          onClick={addUnavailableDate}
          className="inline-flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors space-x-2"
        >
          <X className="w-4 h-4" />
          <span>Add Unavailable Date</span>
        </button>
      </div>

      {(unavailableDates || []).length === 0 ? (
        <div className="text-center py-8">
          <X className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No unavailable dates set</p>
          <p className="text-sm text-gray-400 mt-2">Block out dates when you're not available for training sessions</p>
        </div>
      ) : (
        <div className="space-y-3">
          {(unavailableDates || []).sort().map(date => (
            <div key={date} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-black border dark:border-stone-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <DateInput
                  value={date}
                  onChange={(newDate) => updateUnavailableDate(date, newDate)}
                  min={today}
                  className="font-medium"
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })})
                </span>
              </div>
              <button
                onClick={() => removeUnavailableDate(date)}
                className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <h4 className="font-medium text-red-900 dark:text-red-300 mb-2">
          Unavailable Dates
        </h4>
        <p className="text-sm text-red-800 dark:text-red-400">
          Mark dates when you're completely unavailable. These dates will be blocked from booking regardless of your weekly or custom availability settings.
        </p>
      </div>

      <div className="mt-6">
        <button
          onClick={saveUnavailableDates}
          disabled={loading}
          className={`${dashboard.form.primaryButton} flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] w-full sm:w-auto text-base ${
            loading ? 'cursor-wait' : ''
          }`}
        >
          <Save className="w-5 h-5"/>
          <span>{loading ? 'Saving...' : 'Save Unavailable Dates'}</span>
        </button>
      </div>
    </>
  );
}