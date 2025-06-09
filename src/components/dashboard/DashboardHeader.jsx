import React from 'react';
import { Bell, Settings } from 'lucide-react';
import { dashboard } from '../../utils/classnames';

export default function DashboardHeader({ coach, onProfileClick }) {
  const getCoachInitials = (coach) => {
    if (!coach.name) return coach.id?.charAt(0)?.toUpperCase() || 'C';

    const nameParts = coach.name.split(' ');
    if (nameParts.length >= 2) {
      return nameParts[0].charAt(0).toUpperCase() + nameParts[1].charAt(0).toUpperCase();
    }
    return coach.name.charAt(0).toUpperCase();
  };

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick(); // This will switch to the profile tab
    }
  };

  return (
    <header className={dashboard.header.container}>
      <div className={dashboard.header.inner}>
        <div className={dashboard.header.content}>
          {/* Left side - Coach info */}
          <div className={dashboard.header.left}>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full flex-shrink-0">
              <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                {getCoachInitials(coach)}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className={dashboard.header.title}>
                Coach Dashboard
              </h1>
              <p className={dashboard.header.subtitle}>
                Welcome back, {coach.name || `Coach ${coach.id}`}
              </p>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className={dashboard.header.right}>
            {/* Notifications */}
            <button className={dashboard.header.iconButton}>
              <Bell className="w-5 h-5" />
            </button>

            {/* Profile Settings - Links to Profile Tab */}
            <button
              onClick={handleProfileClick}
              className={dashboard.header.primaryButton}
            >
              {/*<Settings className="w-4 h-4 mr-2 flex-shrink-0" />*/}
              <span>Profile</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}