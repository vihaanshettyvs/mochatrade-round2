'use client';

import React from 'react';

interface PlaybookViewProps {
  setActiveTab: (tab: 'landing' | 'dashboard' | 'market' | 'playbook') => void;
}

export default function PlaybookView({ setActiveTab }: PlaybookViewProps) {
  return (
    <div className="space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-amber-900/40 pb-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="text-amber-400 flex items-center gap-1 font-bold cursor-pointer"
        >
          ← RETURN TO COCKPIT
        </button>
        <span className="text-amber-300 px-2.5 py-0.5 bg-amber-500/20 border border-amber-500/40 rounded-full font-bold">
          DEFCON-2 ARMED
        </span>
      </div>

      <div className="tactile-card p-4 rounded-xl space-y-2">
        <div className="flex justify-between text-amber-200/70">
          <span>RUNBOOK_V4.2 // INCIDENT DRILL</span>
          <span className="text-amber-400 font-bold">T+00:11:42 ELAPSED</span>
        </div>
        <h2 className="text-base font-black text-white uppercase">🛡️ Derivatives Liquidation Anomaly</h2>
        <p className="text-amber-100/85 leading-relaxed">
          Cross-venue tick latency divergence on AP-SOUTH-1. Automated containment threshold exceeded.
        </p>
      </div>
    </div>
  );
}