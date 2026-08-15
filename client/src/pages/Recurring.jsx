import React, { useState } from 'react';


const Recurring = () => {
  // Static mock data for recurring payments since there is no backend for it in this phase
  const [payments] = useState([
    {
      id: 1,
      name: 'Rent',
      amount: 12000,
      icon: 'home',
      dueDate: '1st of every month',
      status: 'Active',
      colorClass: 'text-on-surface-variant group-hover:text-primary-container',
      bgClass: 'bg-primary-container/10 text-primary-container'
    },
    {
      id: 2,
      name: 'Netflix',
      amount: 649,
      icon: 'movie',
      dueDate: 'In 3 days (15th)',
      status: 'Upcoming',
      colorClass: 'text-on-surface-variant group-hover:text-primary-container',
      bgClass: 'bg-surface-container-high text-on-surface border border-white/10'
    },
    {
      id: 3,
      name: 'Internet',
      amount: 999,
      icon: 'wifi',
      dueDate: '12th of every month',
      status: 'Due Tomorrow',
      colorClass: 'text-on-surface-variant group-hover:text-primary-container',
      bgClass: 'bg-primary-container text-on-primary-container shadow-[0_0_10px_rgba(0,245,160,0.3)]',
      showProgress: true
    },
    {
      id: 4,
      name: 'Car EMI',
      amount: 8500,
      icon: 'directions_car',
      dueDate: 'Resumes Aug 25',
      status: 'Paused',
      colorClass: 'text-on-surface-variant',
      bgClass: 'bg-surface-variant text-on-surface-variant border border-white/10',
      isPaused: true
    }
  ]);

  const totalMonthly = payments.reduce((acc, curr) => !curr.isPaused ? acc + curr.amount : acc, 0);

  return (
    <>
      <div className="p-margin-mobile md:p-margin-desktop max-w-[1600px] mx-auto min-h-[calc(100vh-80px)]">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h1 className="font-headline-md text-headline-md text-primary mb-2">Recurring Payments</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-6 md:mb-2">Manage your subscriptions</p>
            <div className="flex gap-8 items-center">
              <div>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block">Total Monthly</span>
                <span className="font-currency-md text-currency-md text-on-surface">₹{totalMonthly.toLocaleString()}</span>
              </div>
              <div className="h-8 w-px bg-white/10"></div>
              <div>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block">Upcoming (7 days)</span>
                <span className="font-currency-md text-currency-md text-primary-container">₹999</span>
              </div>
            </div>
          </div>
          <button className="w-full md:w-auto bg-primary-container text-on-primary-container hover:opacity-90 transition-opacity font-body-md text-body-md font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,245,160,0.2)]">
            <span className="material-symbols-outlined">add_circle</span>
            Add Recurring Payment
          </button>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-gutter">
          
          {/* Subscriptions List */}
          <div className="xl:col-span-2 space-y-4">
            {payments.map(payment => (
              <div key={payment.id} className={`bg-surface-container/50 border border-white/10 p-6 rounded-xl hover:bg-surface-container transition-colors group flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden ${payment.isPaused ? 'opacity-75 grayscale hover:grayscale-0 hover:opacity-100' : ''}`}>
                {payment.showProgress && (
                  <div className="absolute bottom-0 left-0 h-1 bg-surface-container-highest w-full">
                    <div className="h-full bg-primary-container w-[90%]"></div>
                  </div>
                )}
                
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center shrink-0 border border-white/5 group-hover:border-primary-container/50 transition-colors">
                    <span className={`material-symbols-outlined text-2xl ${payment.colorClass}`}>{payment.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-1">{payment.name}</h3>
                    <div className="flex items-center gap-3">
                      <span className={`font-label-sm text-label-sm px-2 py-1 rounded-md uppercase tracking-wider ${payment.bgClass}`}>
                        {payment.status}
                      </span>
                      <span className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">{payment.isPaused ? 'pause_circle' : 'calendar_month'}</span>
                        {payment.dueDate}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-left sm:text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                  <span className={`font-currency-md text-currency-md text-on-surface block ${payment.isPaused ? 'line-through decoration-white/30' : ''}`}>₹{payment.amount.toLocaleString()}</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">Monthly</span>
                </div>
              </div>
            ))}
          </div>

          {/* Side Panel (Settings & Summary) */}
          <div className="space-y-gutter">
            {/* Reminders Card */}
            <div className="bg-surface-container/50 border border-white/10 p-6 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container" style={{fontVariationSettings: "'FILL' 1"}}>notifications_active</span>
                Reminders
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-body-md text-body-md text-on-surface">Email Notifications</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">3 days before due date</p>
                  </div>
                  <button className="w-12 h-6 bg-primary-container rounded-full relative transition-colors focus:outline-none">
                    <div className="w-4 h-4 bg-on-primary-container rounded-full absolute top-1 right-1 transition-transform"></div>
                  </button>
                </div>
                <div className="h-px w-full bg-white/5"></div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-body-md text-body-md text-on-surface">Push Notifications</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">On due date</p>
                  </div>
                  <button className="w-12 h-6 bg-primary-container rounded-full relative transition-colors focus:outline-none">
                    <div className="w-4 h-4 bg-on-primary-container rounded-full absolute top-1 right-1 transition-transform"></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Abstract Visual / Summary */}
            <div className="bg-surface-container/30 border border-white/5 p-6 rounded-xl flex flex-col items-center justify-center text-center py-12 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-container/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="material-symbols-outlined text-[64px] text-primary-container/30 mb-4">account_balance</span>
              <h4 className="font-headline-md text-headline-md text-on-surface mb-2">Automate Your Bills</h4>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-[200px]">Link your accounts to automatically detect and track recurring payments.</p>
              <button className="mt-6 border border-primary-container/50 text-primary-container hover:bg-primary-container/10 transition-colors font-label-sm text-label-sm py-2 px-6 rounded-full relative z-10">
                Link Accounts
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Recurring;
