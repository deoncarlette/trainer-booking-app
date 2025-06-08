import React from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { dashboard } from '../../utils/classnames';

export default function DashboardHeader({ coach }) {
  return (
    <header className={dashboard.header.container}>
      <div className={dashboard.header.inner}>
        <div className={dashboard.header.content}>
          <div className={dashboard.header.left}>
            {/* Coach profile photo */}
            <div className="relative">
              <img
                src={coach.photoURL || coach.image || coach.avatar || '/default-avatar.png'}
                alt={coach.name}
                className={dashboard.header.avatar}
                onError={(e) => {
                  e.target.src = '/default-avatar.png';
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className={dashboard.header.title}>
                <span className="hidden sm:inline">Coach Dashboard</span>
                <span className="sm:hidden">Dashboard</span>
              </h1>
              <p className={dashboard.header.subtitle}>
                <span className="hidden sm:inline">Welcome back, {coach.name || 'Coach'}</span>
                <span className="sm:hidden">{coach.name || 'Coach'}</span>
              </p>
            </div>
          </div>

          <div className={dashboard.header.right}>
            <button className={dashboard.header.iconButton}>
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            {/* Link to public coach profile */}
            <Link
              to={`/coaches/${coach.id}`}
              className={dashboard.header.primaryButton}
            >
              <span className="hidden sm:inline">View Public Profile</span>
              <span className="sm:hidden">Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}