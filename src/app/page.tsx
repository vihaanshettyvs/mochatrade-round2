'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence,motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Check,
  ChevronRight,
  Clock3,
  Command,
  Database,
  FileText,
  Gauge,
  GitBranch,
  Layers3,
  LifeBuoy,
  MessageSquare,
  Play,
  Radio,
  Search,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Terminal,
  Timer,
  TrendingDown,
  Zap,
  X,
} from 'lucide-react';

import { useMarketFeed } from '@/hooks/useMarketFeed';

type Tab = 'landing' | 'dashboard' | 'market' | 'playbook';

const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Command', icon: <Command size={15} /> },
  { id: 'market', label: 'Market', icon: <BarChart3 size={15} /> },
  { id: 'playbook', label: 'Playbook', icon: <FileText size={15} /> },
];

function StatusDot({ color = 'live' }: { color?: 'live' | 'warning' | 'critical' }) {
  return (
    <span
      className={`inline-block h-1.5 w-1.5 rounded-full ${
        color === 'critical'
          ? 'bg-critical'
          : color === 'warning'
            ? 'bg-warning'
            : 'bg-live'
      }`}
    />
  );
}

function SectionLabel({
  children,
  right,
}: {
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {children}
      </div>
      {right}
    </div>
  );
}

function MiniChart({ price }: { price?: number }) {
  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => {
    if (!price) return;

    setHistory((prev) => {
      const next = [...prev, price];

      if (next.length > 40) {
        next.shift();
      }

      return next;
    });
  }, [price]);

  const points = history.length > 1 ? history : [price ?? 0, price ?? 0];

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const linePoints = points
    .map((value, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * 600;
      const y = 135 - ((value - min) / range) * 110;

      return `${x},${y}`;
    })
    .join(' ');

  const areaPoints = `0,150 ${linePoints} 600,150`;

  const first = points[0];
  const last = points[points.length - 1];
  const movement = first ? ((last - first) / first) * 100 : 0;

  return (
    <div className="relative h-32 w-full overflow-hidden">
      <div className="absolute inset-0 flex flex-col justify-between">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="border-t border-slate-800/60" />
        ))}
      </div>

      <svg
        viewBox="0 0 600 150"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
          </linearGradient>
        </defs>

        <polygon
          points={areaPoints}
          fill="url(#chartFill)"
        />

        <polyline
          points={linePoints}
          fill="none"
          stroke="#fb7185"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        <line
          x1="0"
          y1="76"
          x2="600"
          y2="76"
          stroke="#64748b"
          strokeOpacity="0.25"
          strokeDasharray="5 6"
        />
      </svg>

      <div className="absolute right-0 top-1/2 rounded bg-critical/10 px-1.5 py-0.5 font-mono text-[9px] text-rose-300">
        {movement >= 0 ? '+' : ''}
        {movement.toFixed(2)}%
      </div>
    </div>
  );
}
type IncidentPhase =
  | 'DETECTED'
  | 'CONTAINMENT'
  | 'COMMUNICATION'
  | 'REVIEW'
  | 'DECISION'
  | 'CLOSED';

type TimelineStep = {
  phase: IncidentPhase;
  label: string;
};
function IncidentTimeline({
  phase,
  timestamps,
}: {
  phase: IncidentPhase;
  timestamps: Partial<Record<IncidentPhase, string>>;
}) {
  const steps: TimelineStep[] = [
    { phase: 'DETECTED', label: 'Detected' },
    { phase: 'CONTAINMENT', label: 'Containment' },
    { phase: 'COMMUNICATION', label: 'Communication' },
    { phase: 'REVIEW', label: 'Review' },
    { phase: 'DECISION', label: 'Decision' },
    { phase: 'CLOSED', label: 'Resolved' },
  ];

  const currentIndex = steps.findIndex((step) => step.phase === phase);

  return (
    <div className="space-y-1">
      {steps.map((step, index) => {
        const completed =
          currentIndex >= 0 && index < currentIndex;

        const active = step.phase === phase;

        return (
          <motion.div
            key={step.phase}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.04 }}
            className="flex items-center gap-3"
          >
            <div className="relative flex w-4 justify-center">
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{
                    scaleY: completed || active ? 1 : 0,
                  }}
                  transition={{ duration: 0.35 }}
                  style={{ originY: 0 }}
                  className="absolute top-3 h-7 w-px bg-emerald-500/40"
                />
              )}

              <motion.div
                animate={{
                  scale: active ? 1.35 : 1,
                }}
                transition={{ duration: 0.2 }}
                className={`relative z-10 h-2 w-2 rounded-full ${
                  completed
                    ? 'bg-emerald-400'
                    : active
                      ? 'bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,.7)]'
                      : 'bg-slate-700'
                }`}
              />
            </div>

            <div
              className={`flex flex-1 items-center justify-between border-b border-slate-800/60 py-2 ${
                active ? 'bg-amber-500/[0.02]' : ''
              }`}
            >
              <span
                className={`text-xs font-medium ${
                  active
                    ? 'text-white'
                    : completed
                      ? 'text-slate-300'
                      : 'text-slate-600'
                }`}
              >
                {step.label}
              </span>

              <span className="font-mono text-[9px] text-slate-600">
                {timestamps[step.phase] ??
                  (active ? 'ACTIVE' : 'Pending')}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function Metric({
  label,
  value,
  sub,
  critical,
}: {
  label: string;
  value: string;
  sub: string;
  critical?: boolean;
}) {
  return (
    <div className="rounded-lg border border-slate-800 bg-black/20 p-3">
      <div className="mb-1 text-[9px] uppercase tracking-wider text-slate-500">
        {label}
      </div>

      <div
        className={`mt-1 font-mono text-xl font-bold tracking-tight ${
          critical ? 'text-rose-400' : 'text-slate-100'
        }`}
      >
        {value}
      </div>

      <div className="mt-1 text-[9px] text-slate-600">{sub}</div>
    </div>
  );
}

export default function Page() {
const tickers = useMarketFeed();

const [unlocked, setUnlocked] = useState(false);
const [activeTab, setActiveTab] = useState<Tab>('dashboard');

const [isSimOpen, setIsSimOpen] = useState(false);
const [caseOpen, setCaseOpen] = useState(false);

const [incidentId, setIncidentId] = useState<string | null>(null);

const [incidentPhase, setIncidentPhase] =
  useState<IncidentPhase>('DETECTED');

const [incidentEnded, setIncidentEnded] = useState(false);
const [caseResolved, setCaseResolved] = useState(false);

const [simStatus, setSimStatus] = useState('READY');
const [apiCode, setApiCode] = useState('API 200');

const [commsSent, setCommsSent] = useState(false);
type CommandType =
  | 'ACTIVATE_CONTAINMENT'
  | 'SEND_COMMUNICATION'
  | 'END_INCIDENT';

const [stagedCommand, setStagedCommand] = useState<{
  type: CommandType;
  label: string;
  target: string;
  reason: string;
} | null>(null);

const [previewOpen, setPreviewOpen] = useState(false);
const [commandBusy, setCommandBusy] = useState(false);
const [commandMessage, setCommandMessage] = useState('');

function stageCommand(
  type: CommandType,
  label: string,
  reason: string
) {
  setStagedCommand({
    type,
    label,
    target: 'BTC-PERP',
    reason,
  });

  setPreviewOpen(false);
  setCommandMessage('');
}
async function commitCommand() {
  if (!stagedCommand) return;

  if (!incidentId) {
    setCommandMessage('NO ACTIVE INCIDENT');
    return;
  }

  setCommandBusy(true);
  setCommandMessage('EXECUTING...');

  const res = await fetch('/api/decisions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      incidentId,
      decisionType: stagedCommand.type,
      actor: 'COMMANDER',
      rationale: stagedCommand.reason,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    setCommandMessage(data.error || 'COMMAND FAILED');
    setCommandBusy(false);
    return;
  }
  if (data.incidentId) {
  setIncidentId(data.incidentId);
}

  setCommandMessage('EXECUTED');

  if (stagedCommand.type === 'ACTIVATE_CONTAINMENT') {
    setIncidentPhase('CONTAINMENT');
  }

  if (stagedCommand.type === 'SEND_COMMUNICATION') {
    setCommsSent(true);
    setIncidentPhase('COMMUNICATION');
  }

  if (stagedCommand.type === 'END_INCIDENT') {
    setIncidentEnded(true);
    setIncidentPhase('CLOSED');
  }

  setCommandBusy(false);

  setTimeout(() => {
    setStagedCommand(null);
    setPreviewOpen(false);
    setCommandMessage('');
  }, 1200);
}

const [phaseTimestamps, setPhaseTimestamps] =
  useState<Partial<Record<IncidentPhase, string>>>({
    DETECTED: new Date().toLocaleTimeString(),
  });

  const btc =
    tickers.find((t) => t.symbol.toUpperCase().includes('BTC')) ?? tickers[0];

const triggerSimulation = async (scenario: string) => {
  setSimStatus(`RUNNING ${scenario}`);

  try {
    const res = await fetch('/api/simulation/trigger', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        incidentId,
      }),
    });

    const data = await res.json();

    setApiCode(`API ${res.status}`);

    if (!res.ok) {
      throw new Error(data.error || 'Simulation failed');
    }

    if (data.incidentId) {
      setIncidentId(data.incidentId);
    }

    setSimStatus(`${scenario} COMPLETE`);
  } catch (error) {
    console.error(error);
    setApiCode('API 500');
    setSimStatus('SIMULATION ERROR');
  }
};


  if (!unlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070a0f] px-4">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-900">
              <ShieldAlert size={20} className="text-rose-400" />
            </div>

            <div>
              <div className="text-sm font-bold tracking-[0.18em] text-white">
                MOCHATRADE
              </div>
              <div className="text-[9px] uppercase tracking-[0.18em] text-slate-600">
                Incident Command System
              </div>
            </div>
          </div>

          <div className="mt-panel overflow-hidden">
            <div className="border-b border-slate-800 p-6">
              <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                <StatusDot />
                Secure operations node
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-white">
                Restricted Command Access
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Initialize a secure session to access the live incident
                command environment.
              </p>
            </div>

            <div className="space-y-2 p-6">
              {[
                ['Market feed', 'CONNECTED'],
                ['Incident engine', 'READY'],
                ['Realtime channel', 'CONNECTED'],
              ].map(([name, status]) => (
                <div
                  key={name}
                  className="flex items-center justify-between rounded-lg border border-slate-800 bg-black/20 px-3 py-2.5"
                >
                  <span className="text-xs text-slate-500">{name}</span>
                  <span className="flex items-center gap-2 font-mono text-[9px] text-emerald-400">
                    <StatusDot />
                    {status}
                  </span>
                </div>
              ))}

              <button
                onClick={() => setTimeout(() => setUnlocked(true), 700)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-100 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 transition hover:bg-white"
              >
                Initialize secure session
                <ChevronRight size={15} />
              </button>
            </div>
          </div>

          <div className="mt-4 text-center font-mono text-[9px] text-slate-700">
            MOCHATRADE // IC-01 // SIMULATION ENVIRONMENT
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#070a0f]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-[1500px] px-4 lg:px-6">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-700 bg-slate-900">
                <Activity size={15} className="text-emerald-400" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold tracking-[0.16em] text-white">
                    MOCHATRADE
                  </span>
                  <span className="rounded border border-slate-700 px-1.5 py-0.5 font-mono text-[8px] text-slate-500">
                    IC-01
                  </span>
                </div>
                <div className="hidden text-[8px] uppercase tracking-[0.18em] text-slate-600 sm:block">
                  Unified Incident Command
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 rounded-md border border-emerald-500/15 bg-emerald-500/5 px-2.5 py-1.5 sm:flex">
                <StatusDot />
                <span className="font-mono text-[9px] text-emerald-400">
                  LIVE FEED
                </span>
              </div>

              <div className="rounded-xl border border-red-400/20 bg-red-400/[0.025] shadow-[0_0_45px_rgba(239,68,68,0.06)] border-rose-500/20 bg-rose-500/5 px-2.5 py-1.5 font-mono text-[9px] font-bold text-rose-400">
                CRITICAL
              </div>

              <div className="hidden items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900/50 px-2.5 py-1.5 font-mono text-[9px] text-slate-500 sm:flex">
                <Clock3 size={11} />
                T+08:52
              </div>
            </div>
          </div>

          {/* NAV */}
          <div className="flex gap-1 pb-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`mt-nav-item flex items-center gap-2 rounded-md border border-transparent px-3 py-2 text-[10px] font-semibold uppercase tracking-wider ${
                  activeTab === item.id ? 'active' : ''
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => setIsSimOpen(true)}
                className="mt-action flex items-center gap-2 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 hover:border-slate-600 hover:text-white"
              >
                <Zap size={13} />
                Simulation
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-4 py-5 lg:px-6">
        {/* COMMAND */}
        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* INCIDENT STRIP */}
            <div className="mt-panel mt-critical overflow-hidden">
              <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400">
                    <Siren size={19} />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-[9px] font-mono tracking-[0.2em] text-emerald-300">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                        </span>
                        LIVE COMMAND LINK
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-white">
                        {incidentEnded ? 'Incident Resolved' : 'Active Incident'}
                      </span>

                      <span className="font-mono text-[9px] text-slate-600">
                        {incidentId ?? 'NO ACTIVE INCIDENT'}
                      </span>
                    </div>

                    <div className="mt-1 text-xs text-slate-500">
                      Derivatives liquidation cascade · AP-SOUTH-1
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-2 rounded-md border border-rose-500/20 bg-rose-500/5 px-2.5 py-1.5 font-mono text-[9px] text-rose-400">
                    <StatusDot color="critical" />
                    {incidentEnded ? 'ARCHIVED' : 'ACTIVE'}
                  </span>

                  {!incidentEnded && (
                    <button
                      onClick={() => {
                        stageCommand(
                            'END_INCIDENT',
                            'End incident',
                            'Incident conditions have returned to an acceptable operating state.'
                            )
                        }}
                      className="mt-action mt-action-danger rounded-md px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider"
                    >
                      End incident
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* MAIN 3 COLUMN */}
            <div className="grid gap-4 xl:grid-cols-[0.85fr_1.7fr_0.9fr]">
              {/* INCIDENT */}
              <div className="mt-panel p-4">
                <SectionLabel
                  right={
                    <span className="font-mono text-[9px] text-slate-600">
                      T+08:52
                    </span>
                  }
                >
                  <Timer size={12} />
                  Incident state
                </SectionLabel>

                <div className="mb-5">
                  <div className="text-[10px] uppercase tracking-wider text-slate-600">
                    Current severity
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-2xl font-bold tracking-tight text-rose-400">
                      CRITICAL
                    </span>
                    <span className="rounded bg-rose-500/10 px-1.5 py-0.5 font-mono text-[9px] text-rose-400">
                      86 / 100
                    </span>
                  </div>
                </div>

                <IncidentTimeline
                    phase={incidentPhase}
                    timestamps={phaseTimestamps}
                />

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <Metric
                    label="Affected venues"
                    value="4"
                    sub="cross-venue"
                  />
                  <Metric
                    label="Open cases"
                    value={caseResolved ? '0' : '1'}
                    sub="requiring review"
                    critical
                  />
                </div>
              </div>

              {/* MARKET */}
              <div className="mt-panel overflow-hidden">
                <div className="border-b border-slate-800 p-4">
                  <SectionLabel
                    right={
                      <span className="flex items-center gap-1.5 font-mono text-[9px] text-emerald-400">
                        <StatusDot />
                        REALTIME
                      </span>
                    }
                  >
                    <Radio size={12} />
                    Market state
                  </SectionLabel>

                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <div className="font-mono text-[10px] text-slate-500">
                        BTC-PERP
                      </div>

                      <div className="mt-1 font-mono text-3xl font-bold tracking-tight text-white">
                        $
                        {btc?.price
                          ? btc.price.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : '—'}
                      </div>

                      <div className="mt-1 flex items-center gap-2">
                        <span className="flex items-center gap-1 font-mono text-xs text-rose-400">
                          <ArrowDownRight size={13} />
                          {btc?.change24h ?? '-8.42'}%
                        </span>
                        <span className="text-[9px] text-slate-600">
                          24H change
                        </span>
                      </div>
                    </div>

                    <div className="hidden text-right sm:block">
                      <div className="text-[9px] uppercase tracking-wider text-slate-600">
                        Market regime
                      </div>
                      <div className="mt-1 text-xs font-bold text-rose-400">
                        VOLATILITY PEAK
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <MiniChart price={btc?.price} />

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <Metric
                      label="Liquidations"
                      value="128/min"
                      sub="+214% velocity"
                      critical
                    />
                    <Metric
                      label="Divergence"
                      value="1.84%"
                      sub="reference gap"
                      critical
                    />
                    <Metric
                      label="Support"
                      value="43"
                      sub="+380% volume"
                    />
                  </div>
                </div>
              </div>
              {/* RESPONSE */}
              <div className="mt-panel p-4">
                <SectionLabel>
                  <ShieldAlert size={12} />
                  Response control
                </SectionLabel>

                <div className="mb-3 rounded-lg border border-amber-500/15 bg-amber-500/5 p-3">
                  <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-amber-400">
                    <AlertTriangle size={12} />
                    Threshold exceeded
                  </div>

                  <p className="mt-1.5 text-[10px] leading-4 text-slate-500">
                    Containment recommendation requires operator confirmation.
                  </p>
                </div>

                {/* RESPONSE BUTTONS */}
                <div className="space-y-2">
                  <button
                    onClick={() =>
                      stageCommand(
                        'ACTIVATE_CONTAINMENT',
                        'Activate containment',
                        'Liquidation velocity and market divergence exceeded containment thresholds.'
                      )
                    }
                    className="mt-action mt-action-primary flex w-full items-center justify-between rounded-lg px-3 py-3 text-[10px] font-bold uppercase tracking-wider"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck size={14} />
                      Activate containment
                    </span>

                    <ChevronRight size={13} />
                  </button>

                  <button
                    onClick={() => setCaseOpen(true)}
                    className="mt-action mt-action-danger flex w-full items-center justify-between rounded-lg px-3 py-3 text-[10px] font-bold uppercase tracking-wider"
                  >
                    <span className="flex items-center gap-2">
                      <Search size={14} />
                      Investigate case
                    </span>

                    <ChevronRight size={13} />
                  </button>

                  <button
                    onClick={() =>
                      stageCommand(
                        'SEND_COMMUNICATION',
                        'Send market update',
                        'Customer-facing communication is required following the containment event.'
                      )
                    }
                    className="mt-action flex w-full items-center justify-between rounded-lg px-3 py-3 text-[10px] font-bold uppercase tracking-wider"
                  >
                    <span className="flex items-center gap-2">
                      <MessageSquare size={14} />
                      {commsSent ? 'Update dispatched' : 'Send update'}
                    </span>

                    {commsSent ? (
                      <Check size={13} />
                    ) : (
                      <ChevronRight size={13} />
                    )}
                  </button>
                </div>

                {/* STAGED COMMAND */}
                <AnimatePresence>
                  {stagedCommand && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -8, height: 0 }}
                      className="mt-3 overflow-hidden rounded-xl border border-cyan-400/30 bg-cyan-400/[0.04] p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />

                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-300">
                              Command staged
                            </span>
                          </div>

                          <div className="mt-2 text-sm font-semibold text-white">
                            {stagedCommand.label}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setStagedCommand(null);
                            setPreviewOpen(false);
                          }}
                          className="text-[9px] font-bold tracking-widest text-white/30 hover:text-white"
                        >
                          CANCEL
                        </button>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <div className="rounded-lg border border-white/10 bg-black/20 p-2">
                          <div className="text-[8px] tracking-widest text-white/30">
                            TARGET
                          </div>

                          <div className="mt-1 font-mono text-xs text-white">
                            {stagedCommand.target}
                          </div>
                        </div>

                        <div className="rounded-lg border border-white/10 bg-black/20 p-2">
                          <div className="text-[8px] tracking-widest text-white/30">
                            ACTOR
                          </div>

                          <div className="mt-1 font-mono text-xs text-white">
                            COMMANDER
                          </div>
                        </div>

                        <div className="rounded-lg border border-white/10 bg-black/20 p-2">
                          <div className="text-[8px] tracking-widest text-white/30">
                            CONF.
                          </div>

                          <div className="mt-1 font-mono text-xs text-cyan-300">
                            94.7%
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 rounded-lg border border-white/10 bg-black/20 p-3">
                        <div className="text-[8px] tracking-widest text-white/30">
                          RATIONALE
                        </div>

                        <div className="mt-1 text-xs leading-relaxed text-white/60">
                          {stagedCommand.reason}
                        </div>
                      </div>

                      {!previewOpen ? (
                        <button
                          onClick={() => setPreviewOpen(true)}
                          className="mt-3 w-full rounded-lg border border-cyan-400/30 bg-cyan-400/10 py-2.5 text-[9px] font-bold uppercase tracking-widest text-cyan-300 transition hover:bg-cyan-400/20"
                        >
                          Review command →
                        </button>
                      ) : (
                        <div className="mt-3 rounded-lg border border-amber-400/20 bg-amber-400/[0.04] p-3">
                          <div className="text-[9px] font-bold uppercase tracking-widest text-amber-300">
                            Command preview
                          </div>

                          <div className="mt-2 space-y-1 text-xs text-white/60">
                            <div>• Write decision to audit log</div>
                            <div>• Update incident state</div>
                            <div>• Advance response timeline</div>
                          </div>

                          <div className="mt-3 flex gap-2">
                            <button
                              onClick={() => setPreviewOpen(false)}
                              className="flex-1 rounded-lg border border-white/10 py-2.5 text-[9px] font-bold uppercase tracking-widest text-white/40 hover:text-white"
                            >
                              Back
                            </button>

                            <button
                              disabled={commandBusy}
                              onClick={commitCommand}
                              className="flex-1 rounded-lg bg-white py-2.5 text-[9px] font-bold uppercase tracking-widest text-black transition hover:bg-cyan-100 disabled:opacity-50"
                            >
                              {commandBusy ? 'Executing...' : 'Commit'}
                            </button>
                          </div>

                        <AnimatePresence mode="wait">
                            {commandMessage && (
                                <motion.div
                                key={commandMessage}
                                initial={{ opacity: 0, scale: 0.96, y: 4 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.96 }}
                                className={`mt-3 rounded-lg border px-3 py-2 font-mono text-[9px] font-bold tracking-wider ${
                                    commandMessage === 'EXECUTED'
                                    ? 'border-emerald-400/20 bg-emerald-400/5 text-emerald-300'
                                    : commandMessage === 'EXECUTING...'
                                        ? 'border-cyan-400/20 bg-cyan-400/5 text-cyan-300'
                                        : 'border-rose-400/20 bg-rose-400/5 text-rose-300'
                                }`}
                                >
                                <div className="flex items-center gap-2">
                                    {commandMessage === 'EXECUTING...' && (
                                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
                                    )}

                                    {commandMessage === 'EXECUTED' && (
                                    <Check size={12} />
                                    )}

                                    {commandMessage !== 'EXECUTING...' &&
                                    commandMessage !== 'EXECUTED' && (
                                        <X size={12} />
                                    )}

                                    {commandMessage}
                                </div>
                                </motion.div>
                            )}
                            </AnimatePresence>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* SYSTEM RECOMMENDATION */}
                <div className="mt-4 border-t border-slate-800 pt-4">
                  <div className="text-[9px] uppercase tracking-wider text-slate-600">
                    System recommendation
                  </div>

                  <div className="mt-1 text-xs font-medium text-slate-300">
                    Reduce new-risk exposure
                  </div>

                  <div className="mt-1 font-mono text-[9px] text-emerald-400">
                    CONFIDENCE 94.7%
                  </div>
                </div>
              </div>
            </div>

            {/* LOWER GRID */}
            <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
              {/* SIGNAL STREAM */}
              <div className="mt-panel p-4">
                <SectionLabel
                  right={
                    <span className="font-mono text-[9px] text-emerald-400">
                      2ms
                    </span>
                  }
                >
                  <Activity size={12} />
                  Live signal stream
                </SectionLabel>

                <div className="space-y-2">
  {[
    {
      time: '14:32:08',
      sensor: 'S01',
      event: 'LIQUIDATION SPIKE',
      value: '+4.82%',
      color: 'rose',
    },
    {
      time: '14:32:11',
      sensor: 'S02',
      event: 'PRICE DESYNC',
      value: '312ms',
      color: 'amber',
    },
    {
      time: '14:32:14',
      sensor: 'S03',
      event: 'ORDER FLOW SHIFT',
      value: 'HIGH',
      color: 'cyan',
    },
    {
      time: '14:32:17',
      sensor: 'S04',
      event: 'MARKET RECOVERY',
      value: '+0.41%',
      color: 'emerald',
    },
  ].map((signal, index) => (
    <motion.div
      key={signal.time}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`group relative overflow-hidden rounded-lg border border-slate-800/80 bg-slate-950/60 p-3 transition hover:border-slate-700 ${
        index === 0 ? 'shadow-[0_0_24px_rgba(244,63,94,0.06)]' : ''
      }`}
    >
      <div
        className={`absolute left-0 top-0 h-full w-0.5 ${
          signal.color === 'rose'
            ? 'bg-rose-400'
            : signal.color === 'amber'
              ? 'bg-amber-400'
              : signal.color === 'cyan'
                ? 'bg-cyan-400'
                : 'bg-emerald-400'
        }`}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] text-slate-600">
            {signal.time}
          </span>

          <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[9px] text-slate-400">
            {signal.sensor}
          </span>
        </div>

        <span className="flex items-center gap-1.5 font-mono text-[8px] text-live">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-live" />
          LIVE
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-wide text-slate-200">
          {signal.event}
        </span>

        <span
          className={`font-mono text-[10px] font-bold ${
            signal.color === 'rose'
              ? 'text-rose-400'
              : signal.color === 'amber'
                ? 'text-amber-400'
                : signal.color === 'cyan'
                  ? 'text-cyan-400'
                  : 'text-emerald-400'
          }`}
        >
          {signal.value}
        </span>
      </div>
    </motion.div>
  ))}
</div>
              </div>

              {/* SURVEILLANCE */}
              <div className="mt-panel p-4">
                <SectionLabel>
                  <Gauge size={12} />
                  Surveillance
                </SectionLabel>

                <div className="grid grid-cols-2 gap-2">
                  <Metric
                    label="Liquidations"
                    value="128"
                    sub="/ minute"
                    critical
                  />
                  <Metric
                    label="Support tickets"
                    value="43"
                    sub="new events"
                  />
                  <Metric
                    label="Ref divergence"
                    value="1.84%"
                    sub="spread gap"
                    critical
                  />
                  <Metric
                    label="Latency"
                    value="14ms"
                    sub="feed health"
                  />
                </div>

                <div className="mt-3 rounded-lg border border-slate-800 bg-black/20 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[9px] uppercase tracking-wider text-slate-600">
                      System health
                    </span>
                    <span className="text-[9px] font-bold text-emerald-400">
                      OPERATIONAL
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full w-[96%] rounded-full bg-emerald-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* CASE */}
            <div className="mt-panel p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-amber-500/10 text-amber-400">
                    <FileText size={16} />
                  </div>

                  <div>
                    <div className="text-xs font-bold text-white">
                      Abnormal liquidation case
                    </div>
                    <div className="mt-0.5 font-mono text-[9px] text-slate-600">
                      LC-0042 · BTC-PERP · 42.50 BTC
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`rounded border px-2 py-1 font-mono text-[9px] ${
                      caseResolved
                        ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400'
                        : 'border-amber-500/20 bg-amber-500/5 text-amber-400'
                    }`}
                  >
                    {caseResolved ? 'RESOLVED' : 'REVIEW REQUIRED'}
                  </span>

                  <button
                    onClick={() => setCaseOpen(true)}
                    className="mt-action rounded-md border border-slate-700 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-300 hover:border-slate-600 hover:text-white"
                  >
                    Open case
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* MARKET */}
        {activeTab === 'market' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-emerald-400">
                Market intelligence
              </div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">
                Cross-Venue Market State
              </h1>
              <p className="mt-1 text-xs text-slate-600">
                Live market feed connected to the incident command environment.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
              <div className="mt-panel p-5">
                <SectionLabel
                  right={
                    <span className="flex items-center gap-1.5 font-mono text-[9px] text-emerald-400">
                      <StatusDot />
                      LIVE
                    </span>
                  }
                >
                  <BarChart3 size={12} />
                  Live crypto perpetuals
                </SectionLabel>

                <div className="mb-3 flex items-end justify-between">
                  <div>
                    <div className="font-mono text-[10px] text-slate-500">
                      BTC-PERP
                    </div>
                    <div className="mt-1 font-mono text-4xl font-bold text-white">
                      $
                      {btc?.price
                        ? btc.price.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : '—'}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-lg font-bold text-rose-400">
                      {btc?.change24h ?? '-8.42'}%
                    </div>
                    <div className="text-[9px] text-slate-600">24H</div>
                  </div>
                </div>

                <div className="h-64">
                  <MiniChart price={btc?.price} />
                </div>
              </div>

              <div className="mt-panel p-5">
                <SectionLabel>
                  <Layers3 size={12} />
                  Diagnostics
                </SectionLabel>

                <div className="space-y-3">
                  {[
                    ['Liquidation velocity', '128/min', '+214%', 'critical'],
                    ['Reference divergence', '1.84%', 'THRESHOLD', 'critical'],
                    ['Book depth', '$38.4M', 'DEGRADED', 'warning'],
                    ['Feed latency', '14ms', 'HEALTHY', 'live'],
                    ['Volatility index', '88.4', 'PEAK', 'warning'],
                  ].map(([label, value, status, kind]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between border-b border-slate-800/70 pb-3"
                    >
                      <div>
                        <div className="text-[10px] text-slate-500">
                          {label}
                        </div>
                        <div className="mt-1 font-mono text-sm font-semibold text-slate-200">
                          {value}
                        </div>
                      </div>

                      <span
                        className={`font-mono text-[8px] font-bold ${
                          kind === 'critical'
                            ? 'text-rose-400'
                            : kind === 'warning'
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-panel overflow-hidden">
              <div className="border-b border-slate-800 px-4 py-3">
                <SectionLabel>
                  <Database size={12} />
                  Live venue feed
                </SectionLabel>
              </div>

              <div className="divide-y divide-slate-800/70">
                {tickers.map((t) => (
                  <div
                    key={t.symbol}
                    className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-800 bg-slate-900 font-mono text-[9px] font-bold text-slate-400">
                        {t.symbol.substring(0, 3)}
                      </div>

                      <div>
                        <div className="font-mono text-xs font-bold text-slate-200">
                          {t.symbol}
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-[9px]">
                            <span
                                className={
                                t.status === 'CRITICAL_SPIKE'
                                    ? 'text-rose-400'
                                    : t.status === 'HIGH_VOLATILITY'
                                    ? 'text-amber-400'
                                    : 'text-emerald-400'
                                }
                            >
                                {t.status.replace('_', ' ')}
                            </span>

                            <span className="text-slate-700">·</span>

                            <span className="text-slate-600">
                                Δ {t.tickDelta >= 0 ? '+' : ''}
                                {t.tickDelta}
                            </span>
                            </div>
                      </div>
                    </div>

                    <div className="text-right">
                        <div className="font-mono text-xs text-slate-300">
                            $
                            {t.price.toLocaleString(undefined, {
                            minimumFractionDigits: t.price < 1 ? 4 : 2,
                            maximumFractionDigits: t.price < 1 ? 4 : 2,
                            })}
                        </div>

                        <div className="mt-0.5 font-mono text-[8px] text-slate-700">
                            LIVE TICK
                        </div>
                        </div>

                    <div
                      className={`flex min-w-20 justify-end gap-1 font-mono text-[10px] font-bold ${
                        t.change24h >= 0
                          ? 'text-emerald-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {t.change24h >= 0 ? (
                        <ArrowUpRight size={12} />
                      ) : (
                        <ArrowDownRight size={12} />
                      )}
                      {t.change24h}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* PLAYBOOK */}
        {activeTab === 'playbook' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-amber-400">
                Operational playbook
              </div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">
                First 60 Minutes
              </h1>
              <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-600">
                A structured response sequence for protecting users, containing
                risk, communicating clearly, and preserving an auditable record.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                ['T+00', 'DETECT', 'Identify abnormal price movement and liquidation acceleration.', 'rose'],
                ['T+05', 'CONTAIN', 'Reduce additional exposure and activate risk controls.', 'amber'],
                ['T+10', 'COMMUNICATE', 'Publish confirmed information and set expectations.', 'cyan'],
                ['T+20', 'REMEDIATE', 'Investigate abnormal liquidations against reference evidence.', 'violet'],
                ['T+60', 'DECIDE', 'Record policy decisions, outstanding cases and next actions.', 'emerald'],
              ].map(([time, title, description, color]) => (
                <div key={time} className="mt-panel p-5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-slate-600">
                      {time}
                    </span>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        color === 'rose'
                          ? 'bg-rose-400'
                          : color === 'amber'
                            ? 'bg-amber-400'
                            : color === 'cyan'
                              ? 'bg-cyan-400'
                              : color === 'violet'
                                ? 'bg-violet-400'
                                : 'bg-emerald-400'
                      }`}
                    />
                  </div>

                  <h2 className="mt-4 text-lg font-semibold text-white">
                    {title}
                  </h2>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* SIMULATION DRAWER */}
      {isSimOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-3 backdrop-blur-sm sm:items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-panel w-full max-w-lg overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-slate-800 p-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Zap size={14} className="text-amber-400" />
                  Stress Injection Lab
                </div>
                <div className="mt-1 font-mono text-[9px] text-slate-600">
                  DETERMINISTIC SIMULATION ENVIRONMENT
                </div>
              </div>

              <button
                onClick={() => setIsSimOpen(false)}
                className="rounded-md p-2 text-slate-600 hover:bg-slate-800 hover:text-white"
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-3 p-4">
              <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-black/20 px-3 py-2.5">
                <motion.div
                    animate={
                        simStatus.includes('RUNNING')
                        ? { opacity: [0.5, 1, 0.5] }
                        : { opacity: 1 }
                    }
                    transition={
                        simStatus.includes('RUNNING')
                        ? { duration: 1, repeat: Infinity }
                        : { duration: 0.2 }
                    }
                    className="font-mono text-[9px] font-bold tracking-wider text-cyan-300"
                    >
                    {simStatus}
                    </motion.div>
                <span className="font-mono text-[9px] font-bold text-emerald-400">
                  {apiCode}
                </span>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  onClick={() => triggerSimulation('SPIKE')}
                  className="mt-action mt-action-danger rounded-lg p-4 text-left"
                >
                  <div className="flex items-center gap-2 text-xs font-bold uppercase">
                    <TrendingDown size={15} />
                    Liquidation spike
                  </div>
                  <div className="mt-1 text-[9px] text-slate-600">
                    Inject high liquidation velocity
                  </div>
                </button>

                <button
                  onClick={() => triggerSimulation('DESYNC')}
                  className="mt-action rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-left text-amber-400 hover:bg-amber-500/10"
                >
                  <div className="flex items-center gap-2 text-xs font-bold uppercase">
                    <GitBranch size={15} />
                    Price desync
                  </div>
                  <div className="mt-1 text-[9px] text-slate-600">
                    Inject cross-venue divergence
                  </div>
                </button>

                <button
                  onClick={() => triggerSimulation('RECOVERY')}
                  className="mt-action mt-action-success rounded-lg p-4 text-left sm:col-span-2"
                >
                  <div className="flex items-center gap-2 text-xs font-bold uppercase">
                    <ShieldCheck size={15} />
                    Market recovery
                  </div>
                  <div className="mt-1 text-[9px] text-slate-600">
                    Return the scenario to nominal conditions
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* CASE MODAL */}
      {caseOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-panel w-full max-w-md"
          >
            <div className="flex items-center justify-between border-b border-slate-800 p-4">
              <div>
                <div className="text-xs font-bold text-white">
                  Abnormal Liquidation
                </div>
                <div className="mt-1 font-mono text-[9px] text-slate-600">
                  CASE LC-0042
                </div>
              </div>

              <button
                onClick={() => setCaseOpen(false)}
                className="text-slate-600 hover:text-white"
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-3 p-4">
              <div className="rounded-lg border border-slate-800 bg-black/20 p-3">
                <div className="text-[9px] uppercase tracking-wider text-slate-600">
                  Evidence
                </div>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[9px] text-slate-600">Asset</div>
                    <div className="mt-1 text-xs font-semibold text-white">
                      BTC-PERP
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-600">Size</div>
                    <div className="mt-1 font-mono text-xs text-white">
                      42.50 BTC
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-600">Execution</div>
                    <div className="mt-1 font-mono text-xs text-rose-400">
                      ₹8,41,200
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-600">Slippage</div>
                    <div className="mt-1 font-mono text-xs text-rose-400">
                      +2.11%
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setCaseResolved(true);
                  setCaseOpen(false);
                }}
                className="mt-action mt-action-success flex w-full items-center justify-center gap-2 rounded-lg py-3 text-[10px] font-bold uppercase tracking-wider"
              >
                <Check size={14} />
                Mark case reviewed
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}