import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const MainLayout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', icon: 'insert_chart', path: '/dashboard' },
    { name: 'Money', icon: 'account_balance_wallet', path: '/money' },
    { name: 'Groups', icon: 'group', path: '/groups' },
    { name: 'Analytics', icon: 'query_stats', path: '/analytics' },
  ];

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen overflow-x-hidden flex">
      {/* SideNavBar */}
      <nav className="w-sidebar-width h-screen fixed left-0 top-0 bg-surface/80 dark:bg-surface/80 backdrop-blur-xl border-r border-white/10 flex-col py-margin-desktop px-6 z-50 hidden md:flex">
        <div className="mb-12">
          <h1 className="font-display-lg text-display-lg font-bold text-primary">SplitMint</h1>
          <p className="font-body-md text-on-surface-variant">Premium Finance</p>
        </div>
        
        <button onClick={() => window.dispatchEvent(new CustomEvent('openAddExpense'))} className="w-full bg-primary-container text-on-primary-container font-headline-md text-[18px] py-3 rounded-lg mb-8 hover:opacity-90 transition-opacity flex justify-center items-center text-black font-bold">
          + Add Expense
        </button>
        
        <ul className="flex flex-col gap-2 flex-grow">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link 
                to={item.path} 
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors hover:scale-[0.98] duration-200 ${
                  location.pathname === item.path 
                    ? 'text-primary font-bold border-r-2 border-primary bg-primary/10' 
                    : 'text-on-surface-variant font-body-md hover:bg-primary/10 hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === item.path ? "'FILL' 1" : "" }}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        
        <div className="mt-auto flex flex-col gap-2 pt-8 border-t border-white/10">
          <Link to="/settings" className="flex items-center gap-4 px-4 py-3 rounded-lg text-on-surface-variant font-body-md hover:bg-primary/10 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">settings</span>
            Settings
          </Link>
          <button onClick={logout} className="flex items-center gap-4 px-4 py-3 rounded-lg text-on-surface-variant font-body-md hover:bg-error/10 hover:text-error transition-colors w-full text-left">
            <span className="material-symbols-outlined">logout</span>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-sidebar-width min-h-screen pb-24 md:pb-8">
        {/* TopAppBar (Mobile & Desktop Header) */}
        <header className="flex justify-between items-center h-20 px-margin-mobile md:px-margin-desktop docked full-width top-0 sticky z-40 bg-surface/80 dark:bg-surface/80 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center gap-4">
            <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg font-bold text-primary block md:hidden">SplitMint</h2>
            <h2 className="font-headline-md text-headline-md text-on-surface hidden md:block">
              Good evening, {user?.name?.split(' ')[0]} 👋
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-on-surface-variant hover:text-primary transition-opacity opacity-80 hover:opacity-100 hidden md:block">
              <span className="material-symbols-outlined text-[28px]">search</span>
            </button>
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold ghost-border overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0) || 'U'
              )}
            </div>
          </div>
        </header>

        {children}
      </main>

      {/* Mobile Bottom Navigation Shell */}
      <nav className="fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-xl border-t border-white/10 md:hidden z-50 flex justify-around py-3 px-4 pb-safe">
        <Link to="/dashboard" className={`flex flex-col items-center gap-1 ${location.pathname === '/dashboard' ? 'text-primary' : 'text-on-surface-variant hover:text-primary transition-colors'}`}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === '/dashboard' ? "'FILL' 1" : "" }}>insert_chart</span>
          <span className="text-[10px] font-medium">Dashboard</span>
        </Link>
        <Link to="/money" className={`flex flex-col items-center gap-1 ${location.pathname === '/money' ? 'text-primary' : 'text-on-surface-variant hover:text-primary transition-colors'}`}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === '/money' ? "'FILL' 1" : "" }}>account_balance_wallet</span>
          <span className="text-[10px] font-medium">Money</span>
        </Link>
        <div className="relative -top-5">
          <Link to="/money" className="w-14 h-14 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-[28px] text-black">add</span>
          </Link>
        </div>
        <Link to="/groups" className={`flex flex-col items-center gap-1 ${location.pathname === '/groups' ? 'text-primary' : 'text-on-surface-variant hover:text-primary transition-colors'}`}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === '/groups' ? "'FILL' 1" : "" }}>group</span>
          <span className="text-[10px] font-medium">Groups</span>
        </Link>
        <Link to="/settings" className={`flex flex-col items-center gap-1 ${location.pathname === '/settings' ? 'text-primary' : 'text-on-surface-variant hover:text-primary transition-colors'}`}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === '/settings' ? "'FILL' 1" : "" }}>settings</span>
          <span className="text-[10px] font-medium">Settings</span>
        </Link>
      </nav>
    </div>
  );
};

export default MainLayout;
