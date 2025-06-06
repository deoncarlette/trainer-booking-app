import React from "react";
import BookingItem from "./BookingItem";

export default function BookingList({ bookings }) {
  if (!bookings?.length) {
    return <p className="text-sm text-gray-400">No upcoming bookings.</p>;
  }

  return (
    <ul className="space-y-2">
      {bookings.map((booking, idx) => (
        <BookingItem key={idx} booking={booking} />
      ))}
    </ul>
  );
}
