'use client';

import React from 'react';

export default function DashboardView() {
  return (
    <div className="space-y-4">
      {/* INCIDENT ACTIVE BANNER */}
      <div className="p-3.5 bg-gradient-to-r from-red-950/80 via-[#271227]/85 to-amber-950/70 border border-crimson-500/50 rounded-xl flex items-center justify-between shadow-[0_8px_32px_rgba(229,57,85,0.35)] backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-crimson-400 block animate-ping" />
          <div>
            <div className="text-xs font-black text-white font-mono flex items-center gap-1.5">
              <span>INCIDENT ACTIVE</span> <span className="text-amber-300/80 font-normal">#INC-2026-0884</span>
            </div>
            <div className="text-[11px] text-amber-200 font-mono">Derivatives Liquidation Cascade (AP-SOUTH)</div>
          </div>
        </div>
      </div>

      {/* MARKET STATE CRITICAL CARD */}
      <div className="tactile-card p-4 rounded-xl space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 text-base">⚠️</span>
            <span className="text-xs font-bold font-mono tracking-wider text-white uppercase">Market State: Critical</span>
          </div>
          <span className="px-2.5 py-0.5 bg-gradient-to-r from-red-950/85 to-amber-950/85 text-amber-300 border border-amber-500/50 rounded-full text-[10px] font-mono font-bold shadow-sm">
            VOLATILITY PEAK
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-1 font-mono">
          <div className="p-2.5 bg-[#170b1a]/90 rounded-lg border border-amber-900/50 shadow-inner">
            <div className="text-[10px] text-amber-200/70">BTC INDEX SLIP</div>
            <div className="text-base font-bold text-crimson-400 mt-0.5">-8.42%</div>
            <div className="text-[10px] text-amber-200/50">₹8,41,200</div>
          </div>
          <div className="p-2.5 bg-[#170b1a]/90 rounded-lg border border-amber-900/50 shadow-inner">
            <div className="text-[10px] text-amber-200/70">LIQUIDATIONS</div>
            <div className="text-base font-bold text-amber-400 mt-0.5">128/min</div>
            <div className="text-[10px] text-amber-300/85">↑ 214% velocity</div>
          </div>
          <div className="p-2.5 bg-[#170b1a]/90 rounded-lg border border-amber-900/50 shadow-inner">
            <div className="text-[10px] text-amber-200/70">REF DIVERGENCE</div>
            <div className="text-base font-bold text-crimson-400 mt-0.5">1.84%</div>
            <div className="text-[10px] text-amber-400/90">SPREAD GAP</div>
          </div>
        </div>
      </div>

      {/* SURVEILLANCE SIGNALS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-amber-200/70">
          <span className="font-bold text-amber-100 uppercase flex items-center gap-1.5">📡 Surveillance Signals</span>
          <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> STREAM SYNC 2ms
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="tactile-card p-3 rounded-xl space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-amber-200/70">Liquidations</span>
              <span className="text-crimson-400 font-bold">↑ 214%</span>
            </div>
            <div className="text-lg font-bold font-mono text-white">
              128<span className="text-xs text-amber-300/60">/min</span>
            </div>
          </div>
          <div className="tactile-card p-3 rounded-xl space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-amber-200/70">Support Tickets</span>
              <span className="text-amber-400 font-bold">↑ 380%</span>
            </div>
            <div className="text-lg font-bold font-mono text-white">
              43 <span className="text-xs text-amber-300/60">New</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}