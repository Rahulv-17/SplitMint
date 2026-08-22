import React, { useState, useEffect } from 'react';

import CreateBudgetModal from '../components/CreateBudgetModal';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBudgets = async () => {
    try {
      const res = await axios.get(`${API}/api/budgets`);
      setBudgets(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleBudgetCreated = (newBudget) => {
    // We fetch again to get the spent amount
    fetchBudgets();
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Food & Drinks': return 'bg-orange-400';
      case 'Travel': return 'bg-blue-400';
      case 'Shopping': return 'bg-error';
      case 'Utilities': return 'bg-purple-400';
      default: return 'bg-primary';
    }
  };

  const getCategoryIconColor = (category) => {
    switch(category) {
      case 'Food & Drinks': return 'text-orange-400 bg-orange-500/10';
      case 'Travel': return 'text-blue-400 bg-blue-500/10';
      case 'Shopping': return 'text-error bg-error-container/20';
      case 'Utilities': return 'text-purple-400 bg-purple-500/10';
      default: return 'text-primary bg-primary/10';
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Food & Drinks': return 'restaurant';
      case 'Travel': return 'commute';
      case 'Shopping': return 'shopping_bag';
      case 'Utilities': return 'description';
      case 'Accommodation': return 'hotel';
      case 'Transport': return 'directions_car';
      default: return 'account_balance_wallet';
    }
  };

  const totalBudget = budgets.reduce((acc, curr) => acc + curr.limit, 0);
  const totalSpent = budgets.reduce((acc, curr) => acc + (curr.spent || 0), 0);
  const totalRemaining = totalBudget - totalSpent;
  const totalPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <>
      <div className="flex-1 overflow-y-auto p-margin-mobile md:p-margin-desktop max-w-7xl mx-auto w-full space-y-8 min-h-[calc(100vh-80px)]">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-background md:font-display-lg md:text-display-lg">Budgets</h2>
            <p className="text-on-surface-variant mt-2 font-body-md">Managing your spending for this month</p>
          </div>
          <button 
            className="bg-primary-container text-on-primary-container font-body-md font-medium py-3 px-6 rounded-full hover:opacity-90 transition-transform active:scale-95 flex items-center justify-center gap-2 w-full sm:w-auto shrink-0" 
            onClick={() => setIsModalOpen(true)}
          >
            <span className="material-symbols-outlined">add</span>
            Create Budget
          </button>
        </div>

        {/* Monthly Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-low p-6 rounded-2xl ghost-border relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-[120px]">account_balance_wallet</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-on-surface-variant font-label-sm">Total Budget</p>
            </div>
            <h3 className="text-on-surface font-display-lg text-4xl mb-2">₹{totalBudget.toLocaleString()}</h3>
          </div>
          
          <div className="bg-surface-container-low p-6 rounded-2xl ghost-border relative overflow-hidden group border-b-4 border-b-primary-container">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-[120px]">payments</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-on-surface-variant font-label-sm">Spending</p>
            </div>
            <h3 className="text-on-surface font-display-lg text-4xl mb-4">₹{totalSpent.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</h3>
            <div className="w-full h-1.5 bg-surface-container-highest rounded-full">
              <div className="h-full bg-primary-container rounded-full" style={{ width: `${Math.min(totalPercentage, 100)}%` }}></div>
            </div>
          </div>
          
          <div className="bg-surface-container-low p-6 rounded-2xl ghost-border relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-[120px]">savings</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-on-surface-variant font-label-sm">Remaining</p>
            </div>
            <h3 className="text-on-surface font-display-lg text-4xl mb-2">₹{totalRemaining.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</h3>
          </div>
        </div>

        {/* Categories List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-on-surface font-headline-md">Categories</h4>
          </div>
          
          {loading ? (
             <p className="text-on-surface-variant">Loading budgets...</p>
          ) : budgets.length === 0 ? (
             <p className="text-on-surface-variant">No budgets created yet.</p>
          ) : (
            <div className="space-y-4">
              {budgets.map(budget => {
                const percentage = (budget.spent / budget.limit) * 100;
                const isOverBudget = percentage > 100;
                const borderClass = isOverBudget ? 'border-l-4 border-l-error' : '';
                
                return (
                  <div key={budget._id} className={`bg-surface-container-low p-5 rounded-2xl ghost-border ${borderClass}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg flex items-center justify-center ${getCategoryIconColor(budget.category)}`}>
                          <span className="material-symbols-outlined text-sm">{getCategoryIcon(budget.category)}</span>
                        </div>
                        <div>
                          <p className="text-on-surface font-medium text-sm mb-0.5">{budget.category}</p>
                          <p className="text-on-surface-variant font-label-sm text-[10px]">₹{budget.spent.toLocaleString()} spent / ₹{budget.limit.toLocaleString()} limit</p>
                        </div>
                      </div>
                      <p className={`${isOverBudget ? 'text-error' : 'text-on-surface'} font-bold text-sm`}>{percentage.toFixed(0)}%</p>
                    </div>
                    <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                      <div className={`h-full ${isOverBudget ? 'bg-error' : getCategoryColor(budget.category)} rounded-full transition-all duration-1000`} style={{ width: `${Math.min(percentage, 100)}%` }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
      
      <CreateBudgetModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onBudgetCreated={handleBudgetCreated}
      />
    </>
  );
};

export default Budgets;
