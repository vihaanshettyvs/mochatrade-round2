import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function useRealtimeIncident(incidentId: string | null) {
  const [incident, setIncident] = useState<any>(null);
  const [signals, setSignals] = useState<any[]>([]);
  const [decisions, setDecisions] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);

  useEffect(() => {
    if (!incidentId) return;

    // 1. Fetch initial state on component load
    const fetchData = async () => {
      const { data: inc } = await supabase.from('incidents').select('*').eq('id', incidentId).single();
      const { data: sigs } = await supabase.from('signals').select('*').eq('incident_id', incidentId).order('timestamp', { ascending: false });
      const { data: decs } = await supabase.from('decisions').select('*').eq('incident_id', incidentId).order('timestamp', { ascending: false });
      const { data: lCases } = await supabase.from('liquidation_cases').select('*').eq('incident_id', incidentId).order('created_at', { ascending: false });

      if (inc) setIncident(inc);
      if (sigs) setSignals(sigs);
      if (decs) setDecisions(decs);
      if (lCases) setCases(lCases);
    };

    fetchData();

    // 2. Establish Realtime WebSocket Connection
    const channel = supabase
      .channel(`incident-room-${incidentId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'incidents', filter: `id=eq.${incidentId}` }, (payload) => {
        setIncident(payload.new);
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'signals', filter: `incident_id=eq.${incidentId}` }, (payload) => {
        setSignals((prev) => [payload.new, ...prev]);
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'decisions', filter: `incident_id=eq.${incidentId}` }, (payload) => {
        setDecisions((prev) => [payload.new, ...prev]);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'liquidation_cases', filter: `incident_id=eq.${incidentId}` }, (payload) => {
        const newCase = payload.new as { id: string; [key: string]: any };

        setCases((prev) => {
          const index = prev.findIndex((c) => c.id === newCase.id);

          if (index >= 0) {
            const updated = [...prev];
            updated[index] = newCase;
            return updated;
          }

          return [newCase, ...prev];
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [incidentId]);

  return { incident, signals, decisions, cases };
}