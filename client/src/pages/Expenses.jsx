import React, { useState, useEffect } from 'react';

import AddExpenseModal from '../components/AddExpenseModal';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Expenses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All'); // 'All', 'Personal', 'Group'
  const [deletingId, setDeletingId] = useState(null);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${API}/api/expenses`);
      setExpenses(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
    
    // Listen to global expense added event (from MainLayout global modal)
    const handleGlobalExpenseAdded = (e) => {
      handleExpenseAdded(e.detail);
    };
    window.addEventListener('expenseAdded', handleGlobalExpenseAdded);
    return () => window.removeEventListener('expenseAdded', handleGlobalExpenseAdded);
  }, []);

  const handleExpenseAdded = (newExpense) => {
    setExpenses(prevExpenses => [newExpense, ...prevExpenses]);
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    setDeletingId(id);
    try {
      await axios.delete(`${API}/api/expenses/${id}`);
      setExpenses(expenses.filter(e => e._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to delete expense');
    } finally {
      setDeletingId(null);
    }
  };

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

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Food & Dining': return 'text-primary bg-primary/10';
      case 'Travel': return 'text-secondary-container bg-secondary-container/10';
      case 'Transport': return 'text-tertiary-fixed-dim bg-tertiary-fixed-dim/10';
      case 'Shopping': return 'text-error bg-error/10';
      case 'Entertainment': return 'text-yellow-400 bg-yellow-400/10';
      default: return 'text-on-surface-variant bg-surface-container-highest';
    }
  };

  // Fix P1: Apply search + filter
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'All' ||
      (filter === 'Personal' && !expense.group) ||
      (filter === 'Group' && !!expense.group);
    return matchesSearch && matchesFilter;
  });

  const filterBtns = ['All', 'Personal', 'Group'];

  return (
    <>
      <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto min-h-[calc(100vh-80px)]">

        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8">
          {/* Search */}
          <div className="relative w-full md:w-96 flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[20px]">search</span>
            <input
              className="w-full bg-surface-container-lowest/60 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-primary-container focus:ring-0 text-on-background transition-all outline-none font-body-md placeholder:text-on-surface-variant/40"
              placeholder="Search expenses..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 items-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {filterBtns.map(btn => (
              <button
                key={btn}
                onClick={() => setFilter(btn)}
                className={`shrink-0 px-4 py-2 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-colors ${
                  filter === btn
                    ? 'border border-primary/30 bg-primary/10 text-primary'
                    : 'border border-white/10 text-on-surface-variant hover:text-on-background hover:border-white/30'
                }`}
              >
                {btn === 'All' ? 'All Expenses' : btn}
              </button>
            ))}
            <button
              className="shrink-0 bg-primary-container text-black px-4 py-2 rounded font-label-sm text-label-sm font-bold flex items-center gap-2 hover:bg-primary transition-colors ml-4"
              onClick={() => setIsModalOpen(true)}
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add Expense
            </button>
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
          <p className="text-on-surface-variant text-xs mb-6">
            {filteredExpenses.length} {filteredExpenses.length === 1 ? 'expense' : 'expenses'}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        )}

        {/* Expense List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-on-surface-variant">Loading expenses...</p>
          ) : filteredExpenses.length === 0 ? (
            <div className="col-span-full py-12 text-center border border-white/5 rounded-xl border-dashed">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 block">receipt_long</span>
              {expenses.length === 0
                ? <p className="text-on-surface-variant mb-4">No expenses yet.</p>
                : <p className="text-on-surface-variant mb-4">No expenses match your search.</p>
              }
              {expenses.length === 0 && (
                <button onClick={() => setIsModalOpen(true)} className="text-primary hover:underline">
                  Start tracking your spending
                </button>
              )}
            </div>
          ) : (
            filteredExpenses.map((expense) => (
              <div
                key={expense._id}
                className="glass-panel p-5 rounded-xl hover:bg-surface-container-low transition-colors group cursor-pointer relative overflow-hidden border border-white/10"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryColor(expense.category).split(' ')[1]} ${getCategoryColor(expense.category).split(' ')[0]}`}>
                      <span className="material-symbols-outlined text-[18px]">{getCategoryIcon(expense.category)}</span>
                    </div>
                    <div>
                      <h3 className="font-headline-md text-[16px] text-on-background group-hover:text-primary transition-colors">{expense.description}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${getCategoryColor(expense.category)}`}>
                          {expense.category}
                        </span>
                        <span className="text-on-surface-variant text-[11px]">
                          {new Date(expense.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Delete button */}
                  <button
                    onClick={() => handleDeleteExpense(expense._id)}
                    disabled={deletingId === expense._id}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-error/10 text-on-surface-variant hover:text-error"
                    title="Delete expense"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {deletingId === expense._id ? 'hourglass_empty' : 'delete'}
                    </span>
                  </button>
                </div>

                <div className="flex justify-between items-end mt-4 border-t border-white/5 pt-4">
                  <span className="text-on-surface-variant text-[12px] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">
                      {expense.group ? 'group' : 'person'}
                    </span>
                    {expense.group ? 'Group' : 'Personal'}
                  </span>
                  <span className="font-currency-md text-currency-md text-on-background text-lg font-bold">
                    ₹{expense.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onExpenseAdded={handleExpenseAdded}
      />
    </>
  );
};

export default Expenses;
