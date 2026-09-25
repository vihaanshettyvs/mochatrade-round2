import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/simulation/engine';

export async function POST(req: Request) {
  try {
    const { incidentId, decisionType, actor, rationale, caseId, tier } = await req.json();

    if (!incidentId || !decisionType) {
      return NextResponse.json({ error: 'incidentId and decisionType are required' }, { status: 400 });
    }

    const timestamp = new Date().toISOString();

    // 1. Record Decision in Audit Log
    const { data: decision, error: decError } = await supabaseAdmin
      .from('decisions')
      .insert({
        incident_id: incidentId,
        timestamp,
        actor: actor || 'OPERATOR',
        decision_type: decisionType,
        rationale: rationale || null,
        status: 'EXECUTED',
      })
      .select()
      .single();

    if (decError) throw decError;

    // 2. Perform phase/state transition based on the action
    if (decisionType === 'ACTIVATE_CONTAINMENT') {
      await supabaseAdmin
        .from('incidents')
        .update({ phase: 'CONTAINMENT', current_action: 'CONTAINMENT_ACTIVE' })
        .eq('id', incidentId);
    } else if (decisionType === 'SEND_COMMUNICATION') {
      await supabaseAdmin
        .from('incidents')
        .update({ phase: 'COMMUNICATION', current_action: 'CUSTOMER_UPDATE_SENT' })
        .eq('id', incidentId);
    } else if (decisionType === 'CLASSIFY_CASE' && caseId && tier) {
      await supabaseAdmin
        .from('liquidation_cases')
        .update({ tier, status: 'RESOLVED' })
        .eq('id', caseId);
    } else if (decisionType === 'END_INCIDENT') {
      await supabaseAdmin
        .from('incidents')
        .update({ phase: 'CLOSED', status: 'RESOLVED', current_action: 'INCIDENT_RESOLVED' })
        .eq('id', incidentId);
    }

    return NextResponse.json({ success: true, decision });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}