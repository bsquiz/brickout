import { RuntimeSystemRegistry, type RuntimeSystemId } from './systemRegistry';

export type TraceEntry = {
  id: RuntimeSystemId;
  durationMs: number;
  ran: boolean;
};

export type TraceCollector = {
  beginFrame: () => void;
  start: (system: RuntimeSystemId) => void;
  end: (system: RuntimeSystemId) => void;
  getEntries: () => readonly TraceEntry[];
  getFrameNumber: () => number;
};

export const createTraceCollector = (now: () => number = () => performance.now()): TraceCollector => {
  const entries = RuntimeSystemRegistry.map<TraceEntry>(({ id }) => ({ id, durationMs: 0, ran: false }));
  const entriesById = new Map(entries.map((entry) => [entry.id, entry]));
  const startedAt = new Map<RuntimeSystemId, number>();
  let frameNumber = 0;

  return {
    beginFrame: () => {
      frameNumber += 1;
      startedAt.clear();
      entries.forEach((entry) => {
        entry.durationMs = 0;
        entry.ran = false;
      });
    },
    start: (system) => {
      startedAt.set(system, now());
    },
    end: (system) => {
      const startTime = startedAt.get(system);
      const entry = entriesById.get(system);
      if (startTime === undefined || entry === undefined) return;
      entry.durationMs += Math.max(0, now() - startTime);
      entry.ran = true;
      startedAt.delete(system);
    },
    getEntries: () => entries,
    getFrameNumber: () => frameNumber
  };
};
