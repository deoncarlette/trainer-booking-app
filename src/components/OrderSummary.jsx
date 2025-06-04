import React from "react";

export default function OrderSummary() {
  return (
    <div className="bg-white text-gray-900 bg-gray-100 dark:bg-stone-800 dark:text-stone-100 rounded-lg p-4">
      <h4 className="font-medium mb-2">Order Summary</h4>
      <div className="text-sm space-y-1">
        <div className="flex justify-between">
          <span>Training Session (60 min)</span>
          <span>$65.00</span>
        </div>
        <div className="flex justify-between">
          <span>Service Fee</span>
          <span>$3.25</span>
        </div>
        <div className="flex justify-between font-medium text-base pt-2 border-t border-gray-600 mt-2">
          <span>Total</span>
          <span>$68.25</span>
        </div>
      </div>
    </div>
  );
}
