import React from "react";

export default function PaymentForm() {
  return (
    <div className="bg-white text-gray-900 dark:bg-stone-900 dark:text-stone-100 rounded-lg p-4">
      <h3 className="font-medium mb-3">Payment Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="bg-gray-100 dark:bg-stone-800 dark:text-stone-100 px-3 py-2 rounded border border-gray-600" placeholder="Name on Card" />
        <input className="bg-gray-100 dark:bg-stone-800 dark:text-stone-100 px-3 py-2 rounded border border-gray-600" placeholder="Card Number" />
        <input className="bg-gray-100 dark:bg-stone-800 dark:text-stone-100 px-3 py-2 rounded border border-gray-600" placeholder="Expiry Date" />
        <input className="bg-gray-100 dark:bg-stone-800 dark:text-stone-100 px-3 py-2 rounded border border-gray-600" placeholder="CVC" />
      </div>
    </div>
  );
}
