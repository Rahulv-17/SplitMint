import React, { useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CreateGroupModal = ({ isOpen, onClose, onGroupCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [memberEmails, setMemberEmails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    setName(''); setDescription(''); setMemberEmails(''); setError('');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const emails = memberEmails.split(',').map(e => e.trim()).filter(e => e);

    try {
      const res = await axios.post(`${API}/api/groups`, {
        name,
        description,
        memberEmails: emails
      });
      onGroupCreated(res.data);
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative z-10 w-full max-w-md bg-surface-container border border-white/10 rounded-xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-headline-md text-headline-md text-on-background">Create New Group</h3>
          <button className="text-on-surface-variant hover:text-on-background" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        {error && <p className="text-error mb-4 text-sm">{error}</p>}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-label-sm text-on-surface-variant mb-2 uppercase tracking-wider">Group Name</label>
            <input 
              className="w-full bg-surface border-b border-white/10 text-on-background px-4 py-3 focus:outline-none focus:border-primary transition-colors" 
              placeholder="e.g. Summer Vacation" 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-label-sm text-on-surface-variant mb-2 uppercase tracking-wider">Description</label>
            <input 
              className="w-full bg-surface border-b border-white/10 text-on-background px-4 py-3 focus:outline-none focus:border-primary transition-colors" 
              placeholder="Trip to Goa" 
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-label-sm text-on-surface-variant mb-2 uppercase tracking-wider">Members (Emails, comma separated)</label>
            <input 
              className="w-full bg-surface border-b border-white/10 text-on-background px-4 py-3 focus:outline-none focus:border-primary transition-colors" 
              placeholder="friend@example.com, friend2@example.com" 
              type="text"
              value={memberEmails}
              onChange={(e) => setMemberEmails(e.target.value)}
            />
          </div>
          <div className="pt-4 flex gap-4 justify-end">
            <button 
              className="px-6 py-2 rounded-full border border-white/10 text-on-background hover:bg-white/5 transition-colors font-body-md" 
              onClick={onClose} 
              type="button"
            >
              Cancel
            </button>
            <button 
              className="px-6 py-2 rounded-full bg-primary-container text-on-primary-container font-body-md font-medium hover:opacity-90 transition-opacity flex justify-center items-center min-w-[100px]" 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;
