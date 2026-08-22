import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddRecurringModal from '../components/AddRecurringModal';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Recurring = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPayments = async () => {
    try {
      const res = await axios.get(`${API}/api/recurring`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPayments(res.data);
    } catch (error) {
      console.error('Error fetching recurring payments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const totalMonthly = payments.reduce((acc, curr) => curr.isActive ? acc + curr.amount : acc, 0);

  if (loading) {
    return (
      <>
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <p className="text-on-surface-variant">Loading recurring expenses...</p>
        </div>
      </>
    );
  }

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
            </div>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto bg-primary-container text-on-primary-container hover:opacity-90 transition-opacity font-body-md text-body-md font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,245,160,0.2)]">
            <span className="material-symbols-outlined">add_circle</span>
            Add Recurring Payment
          </button>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-gutter">
          
          {/* Subscriptions List */}
          <div className="xl:col-span-2 space-y-4">
            {payments.length === 0 ? (
              <div className="py-12 flex flex-col items-center gap-3 text-center border border-white/5 border-dashed rounded-xl">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant">event_repeat</span>
                <p className="text-on-surface-variant">No recurring payments set up.</p>
              </div>
            ) : (
              payments.map(payment => (
                <div key={payment._id} className={`bg-surface-container/50 border border-white/10 p-6 rounded-xl hover:bg-surface-container transition-colors group flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden ${!payment.isActive ? 'opacity-75 grayscale hover:grayscale-0 hover:opacity-100' : ''}`}>
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center shrink-0 border border-white/5 group-hover:border-primary-container/50 transition-colors">
                      <span className="material-symbols-outlined text-2xl text-on-surface-variant group-hover:text-primary-container">sync</span>
                    </div>
                    <div>
                      <h3 className="font-headline-md text-headline-md text-on-surface mb-1">{payment.description}</h3>
                      <div className="flex items-center gap-3">
                        <span className={`font-label-sm text-label-sm px-2 py-1 rounded-md uppercase tracking-wider ${payment.isActive ? 'bg-primary-container/10 text-primary-container' : 'bg-surface-variant text-on-surface-variant'}`}>
                          {payment.isActive ? 'Active' : 'Paused'}
                        </span>
                        <span className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                          {new Date(payment.nextPaymentDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left sm:text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                    <span className={`font-currency-md text-currency-md text-on-surface block ${!payment.isActive ? 'line-through decoration-white/30' : ''}`}>₹{payment.amount.toLocaleString()}</span>
                    <span className="font-body-md text-body-md text-on-surface-variant capitalize">{payment.frequency}</span>
                  </div>
                </div>
              ))
            )}
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

          </div>
        </div>
      </div>
      
      <AddRecurringModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdded={fetchPayments}
      />
    </>
  );
};

export default Recurring;
