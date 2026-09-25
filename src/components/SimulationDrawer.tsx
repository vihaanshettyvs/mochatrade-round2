'use client';

import React, { useState } from 'react';

interface SimulationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SimulationDrawer({ isOpen, onClose }: SimulationDrawerProps) {
  const [statusMessage, setStatusMessage] = useState('STATUS: IDLE // READY FOR INJECTION');
  const [apiResponseCode, setApiResponseCode] = useState('API 200');

  const triggerSimulation = async (scenario: string) => {
    setStatusMessage(`EXECUTING SCENARIO: ${scenario}...`);
    try {
      const res = await fetch('/api/simulation/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario }),
      });
      const data = await res.json();
      setApiResponseCode(`API ${res.status}`);
      setStatusMessage(`SUCCESS: Step executed for ${scenario}`);
      console.log('Simulation response:', data);
    } catch (err) {
      setApiResponseCode('API 500');
      setStatusMessage(`ERROR: Failed to trigger simulation`);
      console.error(err);
    }
  };

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 bg-[#1d0e21]/95 backdrop-blur-2xl border-t-2 border-amber-500/80 p-4 shadow-[0_-15px_50px_rgba(0,0,0,0.9)] transform transition-transform duration-300 max-w-xl mx-auto rounded-t-2xl ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex items-center justify-between pb-3 border-b border-amber-900/40 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-bold">⚡ STRESS INJECTOR LAB</span>
          <span className="text-[10px] text-amber-300 bg-[#2f1435] px-2 py-0.5 rounded-full border border-amber-500/40">
            TESTNET READY
          </span>
        </div>
        <button className="text-amber-200/70 hover:text-white px-2 cursor-pointer" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="py-3 space-y-3 font-mono text-xs">
        <div className="p-2.5 bg-[#140816] rounded-lg border border-amber-900/50 text-amber-200 flex items-center justify-between">
          <span>{statusMessage}</span>
          <span className="text-emerald-400 font-bold">{apiResponseCode}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            className="interactive-btn py-2.5 px-3 bg-red-950/70 hover:bg-crimson-600 text-crimson-300 hover:text-white border border-crimson-500/50 rounded-lg font-bold text-left shadow-sm cursor-pointer"
            onClick={() => triggerSimulation('SPIKE')}
          >
            <div>💥 LIQUIDATION NUKE</div>
            <div className="text-[10px] text-amber-200/60 mt-0.5">+250/min stress fill</div>
          </button>
          <button
            className="interactive-btn py-2.5 px-3 bg-[#2b1230] hover:bg-[#3d1a45] text-amber-300 border border-amber-500/40 rounded-lg font-bold text-left shadow-sm cursor-pointer"
            onClick={() => triggerSimulation('DESYNC')}
          >
            <div>📉 DUMP IT / DESYNC</div>
            <div className="text-[10px] text-amber-200/60 mt-0.5">3.50% divergence</div>
          </button>
          <button
            className="interactive-btn col-span-2 py-2.5 px-3 bg-emerald-950/70 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/50 rounded-lg font-bold text-center shadow-sm cursor-pointer"
            onClick={() => triggerSimulation('RECOVERY')}
          >
            <div>🛡️ STABILIZE &amp; RECOVER (RESET TO NOMINAL)</div>
          </button>
        </div>
      </div>
    </div>
  );
}