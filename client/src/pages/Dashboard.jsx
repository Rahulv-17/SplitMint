import React, { useState, useEffect, useContext } from 'react';
import MainLayout from '../layouts/MainLayout';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AuthContext } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Static mock data for activity feed
  const [activities] = useState([
    {
      id: 1,
      user: 'Rahul',
      action: 'added an expense in',
      target: 'Goa Trip',
      detail: 'Dinner at Britto\'s',
      time: '2 hours ago',
      amount: 2400,
      tag: 'Food',
      icon: 'add_circle',
      colorClass: 'text-primary',
      bgClass: 'bg-primary/10 border-primary/20'
    },
    {
      id: 2,
      user: 'Arjun',
      action: 'settled up with you',
      target: '',
      detail: 'Via UPI',
      time: '5 hours ago',
      amount: 800,
      tag: 'Settlement',
      icon: 'handshake',
      colorClass: 'text-secondary-container',
      bgClass: 'bg-secondary-container/10 border-secondary-container/20',
      amountColor: 'text-secondary-container'
    },
    {
      id: 3,
      user: 'Priya',
      action: 'updated',
      target: 'Apartment Rent',
      detail: 'Changed split ratio',
      time: 'Yesterday',
      icon: 'edit',
      colorClass: 'text-on-surface-variant',
      bgClass: 'bg-surface-bright border-white/10'
    }
  ]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(`${API}/api/dashboard`);
        setSummary(res.data);
      } catch (err) {
        setError('Failed to load dashboard.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Food & Dining': return 'restaurant';
      case 'Travel': return 'flight';
      case 'Transport': return 'directions_car';
      case 'Shopping': return 'shopping_bag';
      case 'Entertainment': return 'movie';
      default: return 'receipt_long';
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-on-surface-variant text-sm">Loading dashboard...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const weeklyData = summary?.weeklyData || [
    { name: 'Week 1', total: 0 },
    { name: 'Week 2', total: 0 },
    { name: 'Week 3', total: 0 },
    { name: 'Week 4', total: 0 },
  ];

  return (
    <MainLayout>
      <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto">
        <p className="text-on-surface-variant font-body-lg hidden md:block mb-10">
          Welcome back, <span className="text-on-surface font-medium">{user?.name?.split(' ')[0]}</span>. Here's your financial overview.
        </p>

        {/* Smart Insight Banner */}
        {summary?.youOwe > 0 || summary?.youAreOwed > 0 ? (
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-8 flex items-start gap-4">
            <span className="material-symbols-outlined text-primary mt-1">lightbulb</span>
            <div>
              <p className="font-body-lg text-primary">Smart Insight</p>
              <p className="text-on-surface-variant text-sm">
                {summary?.youOwe > 0
                  ? `You owe ₹${summary.youOwe.toLocaleString()} across your groups. Consider settling up soon.`
                  : `You are owed ₹${summary.youAreOwed.toLocaleString()} — great job staying on top of finances!`
                }
              </p>
            </div>
          </div>
        ) : null}

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-between h-36">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
              <span className="font-label-sm text-[11px] uppercase tracking-wider">This Month</span>
            </div>
            <div className="font-display-lg text-2xl text-error">₹{(summary?.totalExpenses || 0).toLocaleString()}</div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-between h-36">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px]">savings</span>
              <span className="font-label-sm text-[11px] uppercase tracking-wider">All Time</span>
            </div>
            <div className="font-display-lg text-2xl text-on-surface">₹{(summary?.allTimeExpenses || 0).toLocaleString()}</div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-between h-36">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px]">south_west</span>
              <span className="font-label-sm text-[11px] uppercase tracking-wider">You Are Owed</span>
            </div>
            <div className="font-display-lg text-2xl text-primary">+₹{(summary?.youAreOwed || 0).toLocaleString()}</div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-between h-36 relative overflow-hidden">
            <div className="flex items-center gap-2 text-on-surface-variant z-10">
              <span className="material-symbols-outlined text-[18px]">north_east</span>
              <span className="font-label-sm text-[11px] uppercase tracking-wider">You Owe</span>
            </div>
            <div className="font-display-lg text-2xl text-error z-10">₹{(summary?.youOwe || 0).toLocaleString()}</div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-error/5 rounded-full blur-2xl" />
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Weekly Spending Chart */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/10 flex flex-col min-h-[360px]">
            <h3 className="font-headline-md text-headline-md mb-6">Monthly Spending</h3>
            <div className="flex-1 w-full h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f5a0" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#00f5a0" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#849588" tick={{ fill: '#b9cbbd', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#12131a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    formatter={(v) => [`₹${v.toLocaleString()}`, 'Spending']}
                  />
                  <Area type="monotone" dataKey="total" stroke="#00f5a0" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Budgets */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-headline-md text-headline-md">Budgets</h3>
              <Link to="/budgets" className="text-xs text-primary hover:underline">View All</Link>
            </div>
            {!summary?.budgets?.length ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
                <span className="material-symbols-outlined text-3xl text-on-surface-variant">pie_chart</span>
                <p className="text-on-surface-variant text-sm">No budgets set yet</p>
                <Link to="/budgets" className="text-primary text-xs hover:underline">Create a budget</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {summary.budgets.map((budget) => (
                  <div key={budget.category}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-on-surface flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-primary">{getCategoryIcon(budget.category)}</span>
                        {budget.category}
                      </span>
                      <span className="text-on-surface-variant">₹{budget.spent.toLocaleString()} / ₹{budget.limit.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${budget.percentage >= 90 ? 'bg-error' : budget.percentage >= 70 ? 'bg-yellow-400' : 'bg-primary'}`}
                        style={{ width: `${budget.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Group Finances & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Group Balances */}
          <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/10">
              <h3 className="font-headline-md text-headline-md mb-2">Group Finances</h3>
              <div className="flex gap-6 mt-4">
                <div>
                  <p className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider mb-1">You are owed</p>
                  <p className="text-xl font-bold text-primary">+₹{(summary?.youAreOwed || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider mb-1">You owe</p>
                  <p className="text-xl font-bold text-error">₹{(summary?.youOwe || 0).toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4 flex-1 bg-surface/30">
              {!summary?.groups?.length ? (
                <div className="py-8 flex flex-col items-center gap-3 text-center">
                  <span className="material-symbols-outlined text-3xl text-on-surface-variant">group</span>
                  <p className="text-on-surface-variant text-sm">No groups yet</p>
                  <Link to="/groups" className="text-primary text-xs hover:underline">Create a group</Link>
                </div>
              ) : (
                summary.groups.map((group) => (
                  <Link to={`/groups/${group._id}`} key={group._id} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-surface-container-high flex items-center justify-center">
                        <span className="material-symbols-outlined text-on-surface-variant">group</span>
                      </div>
                      <div>
                        <p className="font-body-md font-medium text-on-surface group-hover:text-primary transition-colors">{group.name}</p>
                        <p className="text-xs text-on-surface-variant">{group.memberCount} members</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${group.netBalance >= 0 ? 'text-primary' : 'text-error'}`}>
                        {group.netBalance >= 0 ? '+' : ''}₹{Math.abs(group.netBalance).toLocaleString()}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Recent Expenses */}
          <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h3 className="font-headline-md text-headline-md">Recent Expenses</h3>
              <Link to="/expenses" className="text-sm text-primary hover:underline">View All</Link>
            </div>
            <div className="flex-1 divide-y divide-white/5">
              {!summary?.recentExpenses?.length ? (
                <div className="p-6 flex flex-col items-center gap-3 text-center">
                  <span className="material-symbols-outlined text-3xl text-on-surface-variant">receipt_long</span>
                  <p className="text-on-surface-variant text-sm">No expenses yet</p>
                  <Link to="/expenses" className="text-primary text-xs hover:underline">Add your first expense</Link>
                </div>
              ) : (
                summary.recentExpenses.map((expense) => (
                  <div key={expense._id} className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-[18px]">{getCategoryIcon(expense.category)}</span>
                      </div>
                      <div>
                        <p className="font-body-md text-on-surface text-sm">{expense.description}</p>
                        <p className="text-xs text-on-surface-variant">{new Date(expense.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-error">-₹{expense.amount.toLocaleString()}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        {/* Recent Activity Feed */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline-md text-headline-md text-on-background">Recent Activity</h2>
          </div>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="glass-panel p-6 rounded-2xl flex items-start gap-4 hover:bg-surface-container transition-colors duration-300 group cursor-pointer relative overflow-hidden border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border z-10 ${activity.bgClass}`}>
                  <span className={`material-symbols-outlined ${activity.colorClass}`}>{activity.icon}</span>
                </div>
                <div className="flex-1 z-10">
                  <p className="font-body-lg text-body-lg text-on-surface">
                    <span className="font-semibold text-white">{activity.user}</span> {activity.action} {activity.target && <span className="text-primary cursor-pointer hover:underline">{activity.target}</span>}
                  </p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">{activity.detail} • {activity.time}</p>
                </div>
                {activity.amount && (
                  <div className="text-right z-10">
                    <p className={`font-currency-md text-currency-md ${activity.amountColor || 'text-error'}`}>₹{activity.amount.toLocaleString()}</p>
                    {activity.tag && (
                      <span className="inline-block mt-2 px-2 py-1 bg-surface-container-high rounded-md text-[10px] uppercase tracking-wider text-on-surface-variant border border-white/5">{activity.tag}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
