import React from 'react';
import { Bell } from 'lucide-react';
import { dashboard } from '../../utils/classnames';

export default function DashboardHeader({ coach }) {
  return (
    <header className={dashboard.header.container}>
      <div className={dashboard.header.inner}>
        <div className={dashboard.header.content}>
          <div className={dashboard.header.left}>
            <img
              src={coach.image || coach.avatar || '/default-avatar.png'}
              alt={coach.name}
              className={dashboard.header.avatar}
              onError={(e) => {
                e.target.src = '/default-avatar.png';
              }}
            />
            <div>
              <h1 className={dashboard.header.title}>
                Coach Dashboard
              </h1>
              <p className={dashboard.header.subtitle}>
                Welcome back, {coach.name || 'Coach'}
              </p>
            </div>
          </div>

          <div className={dashboard.header.right}>
            <button className={dashboard.header.iconButton}>
              <Bell className="w-5 h-5" />
            </button>
            <button className={dashboard.header.primaryButton}>
              View Public Profile
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}