import React, { useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// groupId prop: if provided, the expense is a group expense
const AddExpenseModal = ({ isOpen, onClose, onExpenseAdded, groupId = null }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    // Reset state on close
    setAmount('');
    setDescription('');
    setCategory('');
    setDate(new Date().toISOString().split('T')[0]);
    setError('');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid amount greater than 0');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        amount: Number(amount),
        description,
        category,
        date,
      };
      if (groupId) {
        payload.group = groupId;
      }

      const res = await axios.post(`${API}/api/expenses`, payload);
      onExpenseAdded(res.data);
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-lg bg-surface-container p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="font-headline-md text-[22px] text-on-background">Add Expense</h2>
            {groupId && <p className="text-xs text-on-surface-variant mt-1">This expense will be added to the group</p>}
          </div>
          <button className="text-on-surface-variant hover:text-white transition-colors" onClick={handleClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl text-xs flex items-center bg-error/10 border border-error/20 text-error mb-4">
            <span className="material-symbols-outlined text-base mr-2">error_outline</span>
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Amount */}
          <div className="flex flex-col items-center justify-center py-4">
            <span className="text-on-surface-variant text-label-sm uppercase tracking-widest mb-2">Amount</span>
            <div className="flex items-center gap-2 border-b-2 border-surface-variant focus-within:border-primary-container pb-2 transition-colors">
              <span className="text-on-surface-variant text-[32px]">₹</span>
              <input
                className="bg-transparent text-[48px] font-display-lg text-white w-48 text-center outline-none border-none p-0 focus:ring-0 placeholder-surface-variant/30"
                placeholder="0.00"
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Description */}
            <div className="space-y-2">
              <label className="text-on-surface-variant text-label-sm block">Description</label>
              <input
                className="w-full bg-surface-container-lowest/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary-container focus:ring-0 text-on-background transition-all outline-none font-body-md placeholder:text-on-surface-variant/40"
                placeholder="What was this for?"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-on-surface-variant text-label-sm block">Category</label>
              <div className="relative">
                <select
                  className="w-full bg-surface-container-lowest/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary-container focus:ring-0 text-on-background transition-all outline-none font-body-md appearance-none"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option disabled value="">Select category</option>
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Travel">Travel</option>
                  <option value="Transport">Transport</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Rent">Rent</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Other">Other</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="text-on-surface-variant text-label-sm block">Date</label>
            <input
              className="w-full bg-surface-container-lowest/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary-container focus:ring-0 text-on-background transition-all outline-none font-body-md [color-scheme:dark]"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              className="flex-1 py-3 px-4 rounded-lg border border-white/20 text-white font-label-sm text-label-sm hover:bg-white/5 transition-colors"
              onClick={handleClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="flex-1 py-3 px-4 rounded-lg bg-primary-container text-black font-label-sm text-label-sm font-bold hover:bg-primary transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  Save Expense
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
