import { NextResponse } from 'next/server';
import { supabaseAdmin, SIMULATION_TIMELINE, executeSimulationStep } from '@/lib/simulation/engine';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    let { incidentId, stepIndex } = body;

    // Create a new incident if none passed
    if (!incidentId) {
      const { data: newIncident, error } = await supabaseAdmin
        .from('incidents')
        .insert({
          phase: 'DETECTED',
          severity: 'HIGH',
          status: 'ACTIVE',
          trigger: 'FLASH_CRASH_SIMULATION',
          current_action: 'MONITOR_LIQUIDATIONS',
          market_change: -2.10,
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase Insert Error (incidents):', error);
        return NextResponse.json({ error: error.message, details: error }, { status: 500 });
      }

      if (!newIncident) {
        return NextResponse.json({ error: 'Failed to create incident row' }, { status: 500 });
      }

      incidentId = newIncident.id;
    }

    const currentStepIndex = typeof stepIndex === 'number' ? stepIndex : 0;
    const step = SIMULATION_TIMELINE[currentStepIndex] || SIMULATION_TIMELINE[0];

    await executeSimulationStep(incidentId, step);

    return NextResponse.json({
      success: true,
      incidentId,
      stepIndex: currentStepIndex,
      stepExecuted: step,
      nextStepIndex: currentStepIndex + 1 < SIMULATION_TIMELINE.length ? currentStepIndex + 1 : null,
    });
  } catch (err: any) {
    console.error('Simulation Trigger Exception:', err);
    return NextResponse.json({ error: err.message || 'Unknown error occurred', stack: err.stack }, { status: 500 });
  }
}