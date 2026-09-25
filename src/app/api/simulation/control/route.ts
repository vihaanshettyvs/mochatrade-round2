import { NextResponse } from 'next/server';
import { supabaseAdmin, SIMULATION_TIMELINE, executeSimulationStep } from '@/lib/simulation/engine';

export async function POST(req: Request) {
  try {
    const { action, incidentId, stepIndex } = await req.json();

    if (!incidentId) {
      return NextResponse.json({ error: 'incidentId is required' }, { status: 400 });
    }

    // Direct step jump (e.g. step x2/x5 fast forward)
    if (action === 'JUMP_TO_STEP') {
      const idx = typeof stepIndex === 'number' ? stepIndex : 0;
      const step = SIMULATION_TIMELINE[idx] || SIMULATION_TIMELINE[0];
      await executeSimulationStep(incidentId, step);
      return NextResponse.json({ success: true, action: 'JUMP_TO_STEP', stepIndex: idx });
    }

    // Trigger "LIQUIDATION SPIKE" button
    if (action === 'TRIGGER_SPIKE') {
      const timestamp = new Date().toISOString();
      await supabaseAdmin.from('signals').insert({
        incident_id: incidentId,
        timestamp,
        type: 'LIQUIDATION_RATE',
        value: 250,
        threshold: 80,
        status: 'CRITICAL',
      });
      await supabaseAdmin.from('incidents').update({ severity: 'CRITICAL' }).eq('id', incidentId);
      return NextResponse.json({ success: true, action: 'TRIGGER_SPIKE' });
    }

    // Trigger "PRICE DIVERGENCE" button
    if (action === 'TRIGGER_DIVERGENCE') {
      const timestamp = new Date().toISOString();
      await supabaseAdmin.from('signals').insert({
        incident_id: incidentId,
        timestamp,
        type: 'PRICE_DIVERGENCE',
        value: 3.5,
        threshold: 1.5,
        status: 'CRITICAL',
      });
      return NextResponse.json({ success: true, action: 'TRIGGER_DIVERGENCE' });
    }

    // Trigger "ABNORMAL LIQUIDATION" case creation
    if (action === 'TRIGGER_ABNORMAL_CASE') {
      const caseRef = `CASE-${Math.floor(1000 + Math.random() * 9000)}`;
      await supabaseAdmin.from('liquidation_cases').insert({
        incident_id: incidentId,
        case_ref: caseRef,
        asset: 'BTC-PERP',
        liquidation_price: 57400.0,
        reference_price: 61200.0,
        divergence_pct: 6.2,
        tier: 'UNASSIGNED',
        status: 'PENDING_REVIEW',
        evidence: {
          orderbook_depth: 'VERY_THIN',
          sources: ['Binance', 'Coinbase', 'Pyth Network', 'Chainlink'],
          notes: 'Severe wick triggered during liquidity hole.',
        },
      });
      return NextResponse.json({ success: true, action: 'TRIGGER_ABNORMAL_CASE', caseRef });
    }

    return NextResponse.json({ error: 'Invalid control action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}