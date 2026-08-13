import React from 'react';
import { motion } from 'framer-motion';
import { Award, ShoppingBag } from 'lucide-react';

export function DashboardTabs({ activeTab, setActiveTab, ordersCount }) {
  const tabs = [
    { id: 'loyalty', label: 'My Loyalty Points', icon: Award, badge: null },
    { id: 'orders', label: 'Previous Orders', icon: ShoppingBag, badge: ordersCount },
  ];

  return (
    <div className="bg-cream-light p-2 rounded-full border-2 border-primary/15 shadow-md flex items-center justify-center gap-1 sm:gap-2 max-w-2xl mx-auto">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex-1 py-3 px-3 sm:px-5 rounded-full font-heading font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors focus:outline-none ${
              isActive ? 'text-cream' : 'text-dark/70 hover:text-dark'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeDashboardTab"
                className="absolute inset-0 bg-primary rounded-full shadow-md -z-0"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}

            <span className="relative z-10 flex items-center gap-1.5">
              <Icon className={`w-4 h-4 ${isActive ? 'text-accent' : 'text-primary'}`} />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[1] || tab.label}</span>
              {tab.badge !== null && tab.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-accent text-dark' : 'bg-primary/10 text-primary'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
