import React from "react";

export default function StatCard({ label, value }) {
  return (
    <div className="p-4 bg-green-900 rounded-lg text-white text-center">
      <p className="text-sm font-medium">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
