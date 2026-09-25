'use client';

import React, { useState } from 'react';

interface IntroStagingProps {
  onUnlock: () => void;
}

export default function IntroStaging({ onUnlock }: IntroStagingProps) {
  const [authenticating, setAuthenticating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleBiometricAuth = () => {
    setAuthenticating(true);
    let current = 0;
    const interval = setInterval(() => {
      current += 15;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(onUnlock, 600); // Smooth transition out to the main dashboard
      }
      setProgress(current);
    }, 120);
  };

  return (
    <div className="relative flex h-screen w-screen items-center justify-center bg-slate-950 overflow-hidden font-mono text-emerald-400">
      {/* Living background grid mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#052e16_1px,transparent_1px),linear-gradient(to_bottom,#052e16_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 animate-pulse" />

      <div className="relative z-10 max-w-lg w-full p-8 border border-emerald-500/30 bg-slate-900/80 backdrop-blur-xl shadow-[0_0_50px_rgba(16,185,129,0.15)] rounded-2xl">
        <div className="flex items-center justify-between mb-6 border-b border-emerald-500/20 pb-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-emerald-500/60">System Security // Level 02</span>
            <h1 className="text-xl font-black tracking-wider text-white drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
              MOCHATRADE INCIDENT COMMAND
            </h1>
          </div>
          <div className="h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
        </div>

        <p className="text-sm text-slate-400 mb-8 leading-relaxed">
          Brought to you by <strong className="text-emerald-400">Team Money Follows</strong>. Authorize node connection to access live liquidation monitors and multi-agent incident channels.
        </p>

        {/* Biometric / Cryptographic Action Box */}
        <div className="space-y-6">
          <div className="p-4 rounded-lg bg-slate-950/60 border border-emerald-500/20 text-xs text-emerald-500/80 font-mono">
            <p>&gt; SECURE_HANDSHAKE: INITIALIZED</p>
            <p>&gt; TARGET: BTC_ETH_PERPS_GRID</p>
            <p>&gt; STATUS: AWAITING_BIOMETRIC_SIGNATURE</p>
          </div>

          {!authenticating ? (
            <button
              onClick={handleBiometricAuth}
              className="w-full py-4 px-6 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500 text-emerald-400 font-bold tracking-widest uppercase transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center justify-center space-x-3 group cursor-pointer"
            >
              <svg className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.115 6.848l.015-.04c.334-.951.588-1.968.74-3.04M12 15V3m0 12a9 9 0 100-18 9 9 0 000 18z" />
              </svg>
              <span>Initialize Biometric Handshake</span>
            </button>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-semibold text-emerald-400">
                <span>DECRYPTING CIPHER...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-emerald-500/30">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-100 shadow-[0_0_15px_rgba(16,185,129,0.8)]" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}