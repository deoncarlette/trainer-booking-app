import React from 'react';
import { Calendar, Users, DollarSign, TrendingUp } from 'lucide-react';
import { dashboard } from '../../utils/classnames';

export default function OverviewTab({ coach, stats }) {
  const { todayBookings, todayCount, weekCount, totalEarnings } = stats;
  const hourlyRate = coach.price || coach.hourlyRate || 0;

  const statsData = [
    {
      label: "Today's Sessions",
      value: todayCount,
      icon: Calendar,
      color: "text-blue-500"
    },
    {
      label: "This Week",
      value: weekCount,
      icon: Users,
      color: "text-green-500"
    },
    {
      label: "Week Earnings",
      value: `${totalEarnings.toFixed(0)}`,
      icon: DollarSign,
      color: "text-yellow-500"
    },
    {
      label: "Hourly Rate",
      value: `${hourlyRate}`,
      icon: TrendingUp,
      color: "text-purple-500"
    }
  ];

  return (
    <div className={dashboard.section.content}>
      {/* Stats Cards */}
      <div className={dashboard.stats.grid}>
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={dashboard.stats.card}>
              <div className={dashboard.stats.content}>
                <p className={dashboard.stats.label}>{stat.label}</p>
                <p className={dashboard.stats.value}>{stat.value}</p>
              </div>
              <Icon className={`${dashboard.stats.icon} ${stat.color}`} />
            </div>
          );
        })}
      </div>

      {/* Today's Schedule */}
      <div className={dashboard.section.container}>
        <h3 className={dashboard.section.title}>Today's Schedule</h3>
        {todayBookings.length === 0 ? (
          <p className={dashboard.section.emptyState}>No sessions scheduled for today</p>
        ) : (
          <div className={dashboard.section.content}>
            {todayBookings.map(booking => (
              <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <div>
                  <p className="font-medium dark:text-white">{booking.clientName || 'Client'}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{booking.type || 'Training Session'}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium dark:text-white">{booking.time || 'TBA'}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{booking.duration || 60}min</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}