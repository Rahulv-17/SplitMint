import React, { useState, useEffect, useContext } from 'react';
import MainLayout from '../layouts/MainLayout';
import CreateGroupModal from '../components/CreateGroupModal';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';


const Groups = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fetchGroups = async () => {
    try {
      const res = await axios.get(`${API}/api/groups`);

      setGroups(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleGroupCreated = (newGroup) => {
    setGroups([newGroup, ...groups]);
  };

  return (
    <MainLayout>
      <div className="p-margin-mobile md:p-margin-desktop flex-1 min-h-[calc(100vh-80px)]">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-background md:font-display-lg md:text-display-lg">Groups</h2>
            <p className="text-on-surface-variant mt-2 font-body-md">Manage your shared expenses and trip balances.</p>
          </div>
          <button 
            className="bg-primary-container text-on-primary-container font-body-md font-medium py-3 px-6 rounded-full hover:opacity-90 transition-transform active:scale-95 flex items-center justify-center gap-2 w-full sm:w-auto shrink-0" 
            onClick={() => setIsModalOpen(true)}
          >
            <span className="material-symbols-outlined">add</span>
            Create Group
          </button>
        </div>

        {/* Bento Grid / Group Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
          {loading ? (
            <p className="text-on-surface-variant">Loading groups...</p>
          ) : groups.length === 0 ? (
            <div className="col-span-full py-12 text-center border border-white/5 rounded-xl border-dashed">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4">group</span>
              <p className="text-on-surface-variant mb-4">You are not part of any groups.</p>
              <button onClick={() => setIsModalOpen(true)} className="text-primary hover:underline">Create your first group</button>
            </div>
          ) : (
            groups.map(group => (
              <Link to={`/groups/${group._id}`} key={group._id} className="bg-surface-container/50 border border-white/10 rounded-xl p-6 hover:bg-surface-container transition-colors cursor-pointer group relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-currency-md text-currency-md text-on-background">{group.name}</h3>
                    <p className="text-on-surface-variant font-label-sm mt-1">{group.description || 'No description'}</p>
                  </div>
                  <div className="flex -space-x-3">
                    {group.members.slice(0, 3).map((member, i) => (
                      <div key={member._id} className="w-8 h-8 rounded-full border-2 border-surface-container bg-surface-bright flex items-center justify-center text-xs text-on-surface-variant overflow-hidden">
                        {member.name.charAt(0)}
                      </div>
                    ))}
                    {group.members.length > 3 && (
                      <div className="w-8 h-8 rounded-full border-2 border-surface-container bg-surface-bright flex items-center justify-center text-label-sm text-on-surface-variant">
                        +{group.members.length - 3}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="relative z-10 pt-4 border-t border-white/5 flex justify-between items-end">
                  <div>
                    <p className="text-on-surface-variant font-label-sm mb-1 uppercase tracking-wider">Members</p>
                    <p className="font-body-lg text-body-lg text-on-background">{group.members.length}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-on-surface-variant font-label-sm mb-1 uppercase tracking-wider">Status</p>
                    <p className="font-currency-md text-currency-md text-on-surface-variant text-sm">Active</p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
      
      <CreateGroupModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onGroupCreated={handleGroupCreated}
      />
    </MainLayout>
  );
};

export default Groups;
