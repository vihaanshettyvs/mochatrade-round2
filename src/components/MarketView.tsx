'use client';

import React from 'react';

interface MarketViewProps {
  setActiveTab: (tab: 'landing' | 'dashboard' | 'market' | 'playbook') => void;
}

export default function MarketView({ setActiveTab }: MarketViewProps) {
  return (
    <div className="space-y-4 font-mono">
      <div className="flex items-center justify-between border-b border-amber-900/40 pb-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="text-xs text-amber-400 flex items-center gap-1 font-bold cursor-pointer"
        >
          ← RETURN TO COCKPIT
        </button>
        <span className="text-[11px] text-emerald-400 flex items-center gap-1.5 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/40">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> L3 FEED ACTIVE
        </span>
      </div>

      <div className="tactile-card p-4 rounded-xl space-y-2">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm font-bold text-white">
              BTC-PERP <span className="text-amber-300/60 font-normal">MOCHA//DESK</span>
            </div>
            <div className="text-xs text-amber-200/70">24H AGG VOL: $1.42B · VOLATILITY (VIX): 88.4</div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-red-950/85 text-amber-300 border border-amber-500/50 text-[10px] font-bold">
            DEVIATION ALERT
          </span>
        </div>
      </div>

      {/* CROSS-VENUE ARBITRAGE MATRIX */}
      <div className="space-y-2 text-xs">
        <div className="flex justify-between items-center text-amber-200/80">
          <span className="font-bold uppercase text-amber-100">🌐 Cross-Venue Arbitrage Matrix</span>
          <span className="text-[10px] text-amber-400">4 VENUES · L3 POLL: 14ms</span>
        </div>
        <div className="tactile-card p-3 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-center">
              BN
            </div>
            <div>
              <div className="font-bold text-white">Binance BTC/USDT <span className="text-emerald-400 text-[10px]">14ms</span></div>
              <div className="text-[10px] text-amber-200/60">Ref Divergence: -0.12% // Book Depth: $38.4M</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-white">$64,210.00</div>
          </div>
        </div>
      </div>
    </div>
  );
}