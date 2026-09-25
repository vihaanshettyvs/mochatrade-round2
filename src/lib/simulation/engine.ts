import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export interface CrashEventStep {
  t_offset: number;
  phase: 'NORMAL' | 'DETECTED' | 'CONTAINMENT' | 'COMMUNICATION' | 'REVIEW' | 'DECISION' | 'STABILIZED' | 'CLOSED';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  market_change: number;
  liquidations_per_min: number;
  ticket_rate: number;
  price_divergence: number;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  action_recommended?: string;
  trigger_abnormal_case?: boolean;
}

export const SIMULATION_TIMELINE: CrashEventStep[] = [
  {
    t_offset: 0,
    phase: 'DETECTED',
    severity: 'MEDIUM',
    market_change: -2.10,
    liquidations_per_min: 15,
    ticket_rate: 5,
    price_divergence: 0.20,
    sentiment: 'NEUTRAL',
    action_recommended: 'MONITOR_LIQUIDATIONS',
  },
  {
    t_offset: 120,
    phase: 'DETECTED',
    severity: 'HIGH',
    market_change: -5.80,
    liquidations_per_min: 65,
    ticket_rate: 18,
    price_divergence: 0.60,
    sentiment: 'NEGATIVE',
    action_recommended: 'PREPARE_CONTAINMENT',
  },
  {
    t_offset: 300,
    phase: 'CONTAINMENT',
    severity: 'CRITICAL',
    market_change: -11.40,
    liquidations_per_min: 140,
    ticket_rate: 42,
    price_divergence: 1.25,
    sentiment: 'NEGATIVE',
    action_recommended: 'ACTIVATE_CONTAINMENT',
  },
  {
    t_offset: 480,
    phase: 'CONTAINMENT',
    severity: 'CRITICAL',
    market_change: -14.20,
    liquidations_per_min: 185,
    ticket_rate: 85,
    price_divergence: 1.80,
    sentiment: 'NEGATIVE',
    action_recommended: 'PREPARE_PUBLIC_COMMS',
  },
  {
    t_offset: 600,
    phase: 'COMMUNICATION',
    severity: 'CRITICAL',
    market_change: -16.50,
    liquidations_per_min: 160,
    ticket_rate: 95,
    price_divergence: 2.10,
    sentiment: 'NEGATIVE',
    action_recommended: 'SEND_PUBLIC_UPDATE',
  },
  {
    t_offset: 1200,
    phase: 'REVIEW',
    severity: 'HIGH',
    market_change: -12.10,
    liquidations_per_min: 90,
    ticket_rate: 60,
    price_divergence: 2.45,
    sentiment: 'NEGATIVE',
    action_recommended: 'REVIEW_ABNORMAL_LIQUIDATION',
    trigger_abnormal_case: true,
  },
  {
    t_offset: 2100,
    phase: 'STABILIZED',
    severity: 'MEDIUM',
    market_change: -7.80,
    liquidations_per_min: 35,
    ticket_rate: 25,
    price_divergence: 0.40,
    sentiment: 'NEUTRAL',
    action_recommended: 'FINAL_POLICY_DECISION',
  },
];

export async function executeSimulationStep(incidentId: string, step: CrashEventStep) {
  const timestamp = new Date().toISOString();

  await supabaseAdmin
    .from('incidents')
    .update({
      phase: step.phase,
      severity: step.severity,
      market_change: step.market_change,
      current_action: step.action_recommended || null,
      trigger: `T+${Math.floor(step.t_offset / 60)}m threshold update`,
    })
    .eq('id', incidentId);

  const signalsToInsert = [
    {
      incident_id: incidentId,
      timestamp,
      type: 'LIQUIDATION_RATE',
      value: step.liquidations_per_min,
      threshold: 80,
      status: step.liquidations_per_min > 80 ? 'CRITICAL' : 'NORMAL',
    },
    {
      incident_id: incidentId,
      timestamp,
      type: 'TICKET_RATE',
      value: step.ticket_rate,
      threshold: 30,
      status: step.ticket_rate > 30 ? 'WARNING' : 'NORMAL',
    },
    {
      incident_id: incidentId,
      timestamp,
      type: 'PRICE_DIVERGENCE',
      value: step.price_divergence,
      threshold: 1.5,
      status: step.price_divergence > 1.5 ? 'CRITICAL' : 'NORMAL',
    },
  ];

  await supabaseAdmin.from('signals').insert(signalsToInsert);

  await supabaseAdmin.from('decisions').insert({
    incident_id: incidentId,
    timestamp,
    actor: 'SIMULATOR',
    decision_type: 'PHASE_ADVANCE',
    rationale: `Advanced to phase ${step.phase}. Market drop ${step.market_change}%, Liq rate ${step.liquidations_per_min}/min.`,
    status: 'EXECUTED',
  });

  if (step.trigger_abnormal_case) {
    const caseRef = `CASE-${Math.floor(1000 + Math.random() * 9000)}`;
    await supabaseAdmin.from('liquidation_cases').insert({
      incident_id: incidentId,
      case_ref: caseRef,
      asset: 'BTC-PERP',
      liquidation_price: 58200.0,
      reference_price: 61400.0,
      divergence_pct: step.price_divergence,
      tier: 'UNASSIGNED',
      status: 'PENDING_REVIEW',
      evidence: {
        orderbook_depth: 'THIN',
        sources: ['Binance', 'Coinbase', 'Pyth Network'],
        notes: 'Wick occurred during liquidity hole.',
      },
    });
  }
}