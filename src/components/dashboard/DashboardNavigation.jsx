import React from 'react';
import { dashboard } from '../../utils';

export default function DashboardNavigation({ tabs, activeTab, setActiveTab }) {
  return (
    <nav className={dashboard.navigation.container}>
      <div className={dashboard.navigation.inner}>
        <div className={`${dashboard.navigation.tabs} dashboard-nav-tabs`}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${dashboard.navigation.tab.base} ${
                  isActive ? dashboard.navigation.tab.active : dashboard.navigation.tab.inactive
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}