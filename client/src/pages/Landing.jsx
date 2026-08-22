import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

const Landing = () => {
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-white/10 h-20 flex justify-between items-center px-margin-mobile md:px-margin-desktop">
        <Logo className="h-8 text-primary" />
        <div className="flex gap-4">
          <Link to="/login" className="font-label-sm text-label-sm px-4 py-2 border border-outline-variant rounded-lg hover:bg-white/5 transition-colors text-on-surface flex items-center">
            Log In
          </Link>
          <Link to="/signup" className="font-label-sm text-label-sm px-4 py-2 bg-primary-container text-on-primary-container rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center">
            Get Started
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 mt-20 flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full max-w-7xl px-margin-mobile md:px-margin-desktop py-20 md:py-24 flex flex-col items-center text-center relative">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none opacity-50"></div>
          
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg max-w-4xl mb-6 text-on-surface font-bold leading-tight">
            Your money. Your groups. One smarter way to split it.
          </h1>
          
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-10">
            Track expenses, manage budgets, split group costs, simplify debts, and understand your finances in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-16 relative z-10 w-full sm:w-auto">
            <Link to="/signup" className="bg-primary-container text-on-primary-container font-label-sm text-label-sm px-8 py-4 rounded-xl font-bold hover:opacity-90 transition-transform active:scale-[0.98] text-center shadow-[0_0_20px_rgba(0,245,160,0.2)]">
              Get Started Free
            </Link>
            <Link to="/login" className="border border-outline-variant font-label-sm text-label-sm px-8 py-4 rounded-xl hover:bg-surface-variant transition-colors text-on-surface text-center">
              Log In to Dashboard
            </Link>
          </div>

          {/* Hero UI Mockup */}
          <div className="w-full max-w-5xl bg-surface-container-low border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative text-left">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none"></div>
            <div className="h-12 border-b border-white/5 flex items-center px-4 gap-2 bg-surface">
              <div className="w-3 h-3 rounded-full bg-error"></div>
              <div className="w-3 h-3 rounded-full bg-tertiary-fixed-dim"></div>
              <div className="w-3 h-3 rounded-full bg-primary-container"></div>
            </div>
            
            <div className="p-8 flex flex-col md:flex-row gap-8">
              {/* Fake Sidebar */}
              <div className="w-48 hidden md:flex flex-col gap-4 border-r border-white/5 pr-4">
                <div className="h-8 w-2/3 bg-primary/20 rounded-lg"></div>
                <div className="h-4 w-full bg-surface-variant rounded mt-4"></div>
                <div className="h-4 w-5/6 bg-surface-variant rounded"></div>
                <div className="h-4 w-full bg-surface-variant rounded"></div>
              </div>
              
              {/* Fake Content */}
              <div className="flex-1 flex flex-col gap-6">
                <div className="flex gap-4">
                  <div className="flex-1 h-32 bg-surface border border-white/5 rounded-xl flex flex-col p-4 justify-between">
                    <span className="text-on-surface-variant text-xs uppercase tracking-wider">Total Balance</span>
                    <span className="font-currency-md text-3xl font-bold text-primary-container">₹72,000.00</span>
                  </div>
                  <div className="flex-1 h-32 bg-surface border border-white/5 rounded-xl flex flex-col p-4 justify-between">
                    <span className="text-on-surface-variant text-xs uppercase tracking-wider">Savings Rate</span>
                    <span className="font-currency-md text-3xl font-bold text-secondary-fixed">100.0%</span>
                  </div>
                </div>
                <div className="h-48 bg-surface border border-white/5 rounded-xl w-full flex items-center justify-center text-on-surface-variant text-sm">
                  Interactive Financial Analytics & Debt Optimization Graph
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="w-full max-w-7xl px-margin-mobile md:px-margin-desktop py-24">
          <h2 className="text-3xl font-bold text-center mb-16 text-on-surface font-headline-md">Designed for modern financial clarity</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
            
            {/* Personal Finance */}
            <div className="md:col-span-2 bg-surface-container-low border border-white/10 rounded-2xl p-8 flex flex-col relative overflow-hidden group hover:border-primary/30 transition-colors">
              <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
              <span className="material-symbols-outlined text-primary-container text-4xl mb-4">account_balance_wallet</span>
              <h3 className="font-headline-md text-xl font-semibold mb-2">Personal Finance & Budgeting</h3>
              <p className="text-on-surface-variant text-body-md mb-6 max-w-md">Track income, categorize expenses, set monthly category budgets, and monitor savings goals in real-time.</p>
              <div className="mt-auto flex gap-2">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-md text-xs border border-primary/20">Food & Drinks</span>
                <span className="px-3 py-1 bg-tertiary-container/10 text-tertiary-container rounded-md text-xs border border-tertiary-container/20">Shopping</span>
              </div>
            </div>

            {/* Group Expenses */}
            <div className="bg-surface-container-low border border-white/10 rounded-2xl p-8 flex flex-col group hover:border-secondary/30 transition-colors">
              <span className="material-symbols-outlined text-secondary text-4xl mb-4">group</span>
              <h3 className="font-headline-md text-xl font-semibold mb-2">Collaborative Group Split</h3>
              <p className="text-on-surface-variant text-body-md">Split dinners, trips, or rent seamlessly with friends and roommates in real-time.</p>
            </div>

            {/* Debt Simplification */}
            <div className="bg-surface-container-low border border-white/10 rounded-2xl p-8 flex flex-col group hover:border-primary-fixed/30 transition-colors">
              <span className="material-symbols-outlined text-primary-fixed text-4xl mb-4">conversion_path</span>
              <h3 className="font-headline-md text-xl font-semibold mb-2">Smart Debt Optimization</h3>
              <p className="text-on-surface-variant text-body-md">A owes B, and B owes C? SplitMint automatically simplifies the math to a single transaction!</p>
            </div>

            {/* Analytics & AI */}
            <div className="md:col-span-2 bg-surface-container-low border border-white/10 rounded-2xl p-8 flex flex-col group hover:border-tertiary-fixed/30 transition-colors relative overflow-hidden">
              <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-surface-bright/20 to-transparent"></div>
              <span className="material-symbols-outlined text-tertiary-fixed text-4xl mb-4 relative z-10">query_stats</span>
              <h3 className="font-headline-md text-xl font-semibold mb-2 relative z-10">Real-Time Sync & Insights</h3>
              <p className="text-on-surface-variant text-body-md max-w-md relative z-10">Socket.io powered live updates, category spending trends, and recurring bill reminders.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 py-12 px-margin-mobile md:px-margin-desktop bg-surface-container mt-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Logo className="h-8 text-primary" />
            </div>
            <p className="text-on-surface-variant text-sm max-w-[200px] mb-5 leading-relaxed">
              Track expenses, manage budgets, split group costs, and understand your finances in one place.
            </p>
            <div className="flex gap-3 mt-6">
              <a href="https://www.instagram.com/being.rahulistic/" target="_blank" rel="noreferrer" 
                 className="p-2.5 rounded-full transition-colors flex items-center justify-center h-10 w-10 text-on-surface-variant border border-white/5 hover:text-primary hover:border-primary hover:bg-primary/5 bg-white/5"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://www.linkedin.com/in/rahulvaddi/" target="_blank" rel="noreferrer" 
                 className="p-2.5 rounded-full transition-colors flex items-center justify-center h-10 w-10 text-on-surface-variant border border-white/5 hover:text-primary hover:border-primary hover:bg-primary/5 bg-white/5"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="https://github.com/Rahulv-17" target="_blank" rel="noreferrer" 
                 className="p-2.5 rounded-full transition-colors flex items-center justify-center h-10 w-10 text-on-surface-variant border border-white/5 hover:text-primary hover:border-primary hover:bg-primary/5 bg-white/5"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
            </div>
          </div>
          
          {[
            { title: 'Product', links: ['Dashboard', 'Groups', 'Analytics', 'Recurring'] },
            { title: 'Resources', links: ['Help Center', 'API Documentation', 'Community'] },
            { title: 'Company', links: ['About Us', 'Privacy Policy', 'Terms of Service', 'Contact'] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="font-label-sm text-xs tracking-widest uppercase text-on-surface-variant mb-4 font-bold">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-on-surface-variant text-sm hover:text-primary transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-white/5">
          <p className="text-on-surface-variant text-xs">© 2026 SplitMint Premium Finance. All rights reserved.</p>
          <p className="text-on-surface-variant text-xs">Made by Rahul Vaddi</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
