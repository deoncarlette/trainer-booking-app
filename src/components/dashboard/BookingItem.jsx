import React from "react";
import { format } from "date-fns";

export default function BookingItem({ booking }) {
  return (
    <li className="p-3 border border-gray-700 rounded-md">
      <p className="text-sm">
        <strong>{booking.student}</strong> -{" "}
        {format(new Date(booking.date), "MMMM d, yyyy")} at {booking.time}
      </p>
    </li>
  );
}
