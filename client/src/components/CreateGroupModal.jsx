import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CreateGroupModal = ({ isOpen, onClose, onGroupCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const res = await axios.get(`${API}/api/users/search?q=${searchQuery}`);
          setSearchResults(res.data);
          setShowDropdown(true);
        } catch (err) {
          console.error("Search failed:", err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  if (!isOpen) return null;

  const handleClose = () => {
    setName(''); 
    setDescription(''); 
    setSearchQuery(''); 
    setSelectedMembers([]); 
    setError(''); 
    setSearchResults([]);
    onClose();
  };

  const handleAddMember = (user) => {
    if (!selectedMembers.some(m => m._id === user._id)) {
      setSelectedMembers([...selectedMembers, user]);
    }
    setSearchQuery('');
    setSearchResults([]);
    setShowDropdown(false);
  };

  const handleRemoveMember = (userId) => {
    setSelectedMembers(selectedMembers.filter(m => m._id !== userId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const emails = selectedMembers.map(m => m.email);

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
      <div className="relative z-10 w-full max-w-md bg-surface-container border border-white/10 rounded-xl p-6 shadow-2xl overflow-visible">
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
              className="w-full bg-surface-container-lowest/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary-container focus:ring-0 text-on-background transition-all outline-none font-body-md placeholder:text-on-surface-variant/40" 
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
              className="w-full bg-surface-container-lowest/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary-container focus:ring-0 text-on-background transition-all outline-none font-body-md placeholder:text-on-surface-variant/40" 
              placeholder="Trip to Goa" 
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="relative" ref={dropdownRef}>
            <label className="block text-label-sm text-on-surface-variant mb-2 uppercase tracking-wider">Add Members</label>
            
            {/* Selected Members Chips */}
            {selectedMembers.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedMembers.map(member => (
                  <div key={member._id} className="flex items-center gap-2 bg-surface border border-white/10 rounded-full pl-1 pr-3 py-1">
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} className="w-6 h-6 rounded-full object-cover" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm text-on-background">{member.name}</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveMember(member._id)}
                      className="text-on-surface-variant hover:text-error transition-colors flex items-center mt-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <input 
              className="w-full bg-surface-container-lowest/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary-container focus:ring-0 text-on-background transition-all outline-none font-body-md placeholder:text-on-surface-variant/40" 
              placeholder="Search by name or email..." 
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.length < 2) setShowDropdown(false);
              }}
              onFocus={() => {
                if (searchResults.length > 0) setShowDropdown(true);
              }}
            />
            
            {/* Search Results Dropdown */}
            {showDropdown && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-surface-container-high border border-white/10 rounded-lg shadow-xl max-h-60 overflow-y-auto z-50">
                {isSearching ? (
                  <div className="p-4 text-center text-on-surface-variant text-sm">Searching...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map(user => (
                    <div 
                      key={user._id} 
                      className="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 last:border-0"
                      onClick={() => handleAddMember(user)}
                    >
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center text-lg font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 overflow-hidden">
                        <div className="text-on-background font-medium truncate">{user.name}</div>
                        <div className="text-on-surface-variant text-sm truncate">{user.email}</div>
                      </div>
                      {selectedMembers.some(m => m._id === user._id) && (
                        <span className="material-symbols-outlined text-primary">check_circle</span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-on-surface-variant text-sm">No users found</div>
                )}
              </div>
            )}
          </div>
          <div className="pt-4 flex gap-4 justify-end">
            <button 
              className="px-6 py-2 rounded-full border border-white/10 text-on-background hover:bg-white/5 transition-colors font-body-md" 
              onClick={handleClose} 
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
