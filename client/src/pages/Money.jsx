import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import Expenses from './Expenses';
import Budgets from './Budgets';
import Recurring from './Recurring';
import { motion, AnimatePresence } from 'framer-motion';

const Money = () => {
  const [activeTab, setActiveTab] = useState('Expenses');

  const tabs = [
    { id: 'Expenses', icon: 'receipt_long' },
    { id: 'Budgets', icon: 'account_balance_wallet' },
    { id: 'Recurring', icon: 'history' }
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'Expenses': return <Expenses />;
      case 'Budgets': return <Budgets />;
      case 'Recurring': return <Recurring />;
      default: return <Expenses />;
    }
  };

  return (
    <MainLayout>
      <div className="w-full">
        {/* Navigation Tabs */}
        <div className="sticky top-20 z-30 bg-surface/80 backdrop-blur-xl border-b border-white/10 px-margin-mobile md:px-margin-desktop py-4 mb-2">
          <div className="max-w-7xl mx-auto flex gap-6 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-2 pb-4 px-2 -mb-[17px] transition-colors border-b-2 font-label-sm tracking-wide ${
                  activeTab === tab.id 
                    ? 'border-primary text-primary font-bold' 
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                {tab.id}
              </button>
            ))}
          </div>
        </div>
        
        {/* Tab Content with animation */}
        <div className="max-w-7xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </MainLayout>
  );
};

export default Money;
