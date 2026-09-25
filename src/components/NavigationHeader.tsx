'use client';

import React from 'react';

interface NavigationHeaderProps {
  activeTab: 'landing' | 'dashboard' | 'market' | 'playbook';
  setActiveTab: (tab: 'landing' | 'dashboard' | 'market' | 'playbook') => void;
}

export default function NavigationHeader({ activeTab, setActiveTab }: NavigationHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#190a1c]/85 backdrop-blur-2xl border-b border-amber-500/35 px-4 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.75),0_0_20px_rgba(244,63,94,0.12)] transition-colors duration-500">
      <div className="max-w-xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center space-x-2.5 cursor-pointer group"
          onClick={() => setActiveTab('landing')}
        >
          <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500/30 to-orange-700/50 border border-amber-400/60 shadow-[0_0_16px_rgba(255,140,20,0.4)]">
            <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 animate-pulse shadow-[0_0_10px_#fbbf24]" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xs sm:text-sm tracking-wider uppercase text-white font-mono flex items-center gap-1.5 group-hover:text-amber-300 transition-colors">
              MOCHATRADE <span className="text-[9px] bg-amber-950/90 text-amber-300 border border-amber-500/50 px-1.5 rounded font-mono font-bold shadow-sm">IC-01</span>
            </span>
            <span className="text-[8px] font-mono text-amber-200/70 tracking-widest -mt-0.5">UNIFIED INCIDENT PROTOCOL</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/50 text-[11px] font-bold shadow-[0_0_12px_rgba(251,191,36,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" /> DEFCON-2
          </span>
        </div>
      </div>

      {/* QUICK TAB BAR ROUTER */}
      <div className="max-w-xl mx-auto mt-2 pt-2 border-t border-amber-900/40">
        <nav className="grid grid-cols-4 gap-1.5 text-[11px] font-mono">
          <button 
            onClick={() => setActiveTab('landing')}
            className={`nav-btn py-1.5 px-1 rounded-lg text-center ${activeTab === 'landing' ? 'active font-bold text-white' : 'text-amber-100/90'}`}
          >
            <span>🌐 01. PORTAL</span>
          </button>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`nav-btn py-1.5 px-1 rounded-lg text-center ${activeTab === 'dashboard' ? 'active font-bold text-white' : 'text-amber-100/90'}`}
          >
            <span>🕹️ 02. COCKPIT</span>
          </button>
          <button 
            onClick={() => setActiveTab('market')}
            className={`nav-btn py-1.5 px-1 rounded-lg text-center ${activeTab === 'market' ? 'active font-bold text-white' : 'text-amber-100/90'}`}
          >
            <span>📊 03. MARKET</span>
          </button>
          <button 
            onClick={() => setActiveTab('playbook')}
            className={`nav-btn py-1.5 px-1 rounded-lg text-center ${activeTab === 'playbook' ? 'active font-bold text-white' : 'text-amber-100/90'}`}
          >
            <span>📖 04. PLAYBOOK</span>
          </button>
        </nav>
      </div>
    </header>
  );
}