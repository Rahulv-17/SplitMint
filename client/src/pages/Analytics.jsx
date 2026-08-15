import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import axios from 'axios';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';


const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`${API}/api/analytics`);

        setAnalytics(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const trendData = [
    { name: 'Jan', total: 4000 },
    { name: 'Feb', total: 3000 },
    { name: 'Mar', total: 5000 },
    { name: 'Apr', total: 2780 },
    { name: 'May', total: 6000 },
    { name: 'Jun', total: 4500 },
    { name: 'Jul', total: 7000 },
    { name: 'Aug', total: 8500 },
    { name: 'Sep', total: 6200 },
    { name: 'Oct', total: (analytics?.totalOutflow || 0) > 0 ? analytics.totalOutflow : 24850 },
  ];

  const cashflowData = [
    { name: 'May', income: 4000, expense: 2400 },
    { name: 'Jun', income: 3000, expense: 1398 },
    { name: 'Jul', income: 2000, expense: 9800 },
    { name: 'Aug', income: 2780, expense: 3908 },
    { name: 'Sep', income: 1890, expense: 4800 },
    { name: 'Oct', income: analytics?.income || 2390, expense: analytics?.totalOutflow || 3800 },
  ];

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <p className="text-on-surface-variant">Loading analytics...</p>
        </div>
      </MainLayout>
    );
  }

  const categoryBreakdown = analytics?.categoryBreakdown || {};
  const categories = Object.keys(categoryBreakdown).map(key => ({
    name: key,
    value: categoryBreakdown[key]
  })).sort((a, b) => b.value - a.value);

  const getCategoryColor = (index) => {
    const colors = ['bg-primary', 'bg-secondary-container', 'bg-tertiary-container', 'bg-outline', 'bg-error'];
    return colors[index % colors.length];
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Food & Dining': return 'restaurant';
      case 'Travel': return 'flight_takeoff';
      case 'Transport': return 'directions_car';
      case 'Shopping': return 'shopping_bag';
      case 'Entertainment': return 'movie';
      default: return 'receipt_long';
    }
  };

  const getCategoryIconColor = (index) => {
    const colors = ['text-primary', 'text-secondary-container', 'text-tertiary-container', 'text-outline', 'text-error'];
    return colors[index % colors.length];
  };

  return (
    <MainLayout>
      <div className="p-margin-mobile md:p-margin-desktop flex flex-col gap-16 max-w-7xl mx-auto w-full min-h-[calc(100vh-80px)]">
        {/* Page Header & Key Metrics */}
        <section className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <p className="text-on-surface-variant font-label-sm uppercase tracking-widest mb-2">Total Outflow (YTD)</p>
              <h2 className="font-display-lg text-display-lg text-on-surface flex items-baseline gap-2">
                ₹{analytics?.totalOutflow.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).split('.')[0]}.
                <span className="text-on-surface-variant text-2xl">
                  {analytics?.totalOutflow.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).split('.')[1] || '00'}
                </span>
              </h2>
            </div>
            <div className="flex bg-surface-container rounded-lg p-1 ghost-border">
              <button className="px-4 py-1.5 rounded-md text-on-surface-variant hover:text-on-surface font-label-sm transition-colors">1M</button>
              <button className="px-4 py-1.5 rounded-md text-on-surface-variant hover:text-on-surface font-label-sm transition-colors">3M</button>
              <button className="px-4 py-1.5 rounded-md bg-surface-variant text-on-surface font-label-sm">YTD</button>
              <button className="px-4 py-1.5 rounded-md text-on-surface-variant hover:text-on-surface font-label-sm transition-colors">ALL</button>
            </div>
          </div>

          {/* Mini KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-surface-container-low p-6 rounded-xl ghost-border flex flex-col gap-2">
              <span className="text-on-surface-variant font-label-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">trending_up</span> Income
              </span>
              <span className="font-currency-md text-currency-md text-primary">₹{analytics?.income.toLocaleString()}</span>
            </div>
            <div className="bg-surface-container-low p-6 rounded-xl ghost-border flex flex-col gap-2">
              <span className="text-on-surface-variant font-label-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">trending_down</span> Expenses
              </span>
              <span className="font-currency-md text-currency-md text-on-surface">₹{analytics?.totalOutflow.toLocaleString()}</span>
            </div>
            <div className="bg-surface-container-low p-6 rounded-xl ghost-border flex flex-col gap-2">
              <span className="text-on-surface-variant font-label-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">savings</span> Savings Rate
              </span>
              <span className="font-currency-md text-currency-md text-on-surface">{analytics?.savingsRate}%</span>
            </div>
            <div className="bg-surface-container-low p-6 rounded-xl ghost-border flex flex-col gap-2">
              <span className="text-on-surface-variant font-label-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">bolt</span> Avg Daily
              </span>
              <span className="font-currency-md text-currency-md text-on-surface">₹{analytics?.avgDaily}</span>
            </div>
          </div>
        </section>

        {/* Monthly Spending Trend */}
        <section className="bg-surface-container-low rounded-2xl p-6 md:p-8 ghost-border">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-headline-md text-headline-md text-on-surface">Monthly Trend</h3>
          </div>
          <div className="w-full h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f5a0" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#00f5a0" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#849588" tick={{fill: '#849588', fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{backgroundColor: '#12131a', border: '1px solid rgba(255,255,255,0.1)'}} />
                <Area type="monotone" dataKey="total" stroke="#00f5a0" strokeWidth={2} fillOpacity={1} fill="url(#colorTrend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Bento Grid for Secondary Metrics */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Income vs Expenses */}
          <div className="lg:col-span-2 bg-surface-container-low rounded-2xl p-6 ghost-border flex flex-col h-full min-h-[350px]">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-6">Cashflow Analysis</h3>
            <div className="flex-1 w-full relative min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashflowData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="#849588" tick={{fill: '#849588', fontSize: 12}} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#12131a', border: '1px solid rgba(255,255,255,0.1)'}} />
                  <Bar dataKey="income" fill="#00F5A0" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="expense" fill="#33343c" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 mt-4 text-xs font-label-sm">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-primary-container"></span> Income</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-surface-variant"></span> Expenses</div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-surface-container-low rounded-2xl p-6 ghost-border flex flex-col min-h-[350px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-on-surface">Categories</h3>
            </div>
            <div className="flex flex-col gap-4 overflow-y-auto pr-2">
              {categories.length === 0 ? (
                <p className="text-on-surface-variant text-sm">No expenses yet to categorize.</p>
              ) : (
                categories.map((category, index) => {
                  const percentage = analytics.totalOutflow > 0 ? (category.value / analytics.totalOutflow) * 100 : 0;
                  return (
                    <div key={category.name} className="flex flex-col gap-2">
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-medium text-on-surface flex items-center gap-2">
                          <span className={`material-symbols-outlined text-sm ${getCategoryIconColor(index)}`}>{getCategoryIcon(category.name)}</span> {category.name}
                        </span>
                        <span className="text-sm font-bold text-on-surface">₹{category.value.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden">
                        <div className={`${getCategoryColor(index)} h-full rounded-full`} style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Analytics;
