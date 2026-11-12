import { RuntimeSystem } from './systemRegistry';
import { createTraceCollector } from './traceCollector';

describe('createTraceCollector', () => {
  it('records system durations without growing the entry collection', () => {
    const times = [10, 10.25, 20, 20.75];
    const trace = createTraceCollector(() => times.shift() ?? 0);
    trace.beginFrame();
    trace.start(RuntimeSystem.BALLS);
    trace.end(RuntimeSystem.BALLS);
    const entryCount = trace.getEntries().length;

    trace.beginFrame();
    trace.start(RuntimeSystem.RENDER);
    trace.end(RuntimeSystem.RENDER);

    expect(trace.getFrameNumber()).toBe(2);
    expect(trace.getEntries()).toHaveLength(entryCount);
    expect(trace.getEntries().find(({ id }) => id === RuntimeSystem.BALLS)).toMatchObject({ durationMs: 0, ran: false });
    expect(trace.getEntries().find(({ id }) => id === RuntimeSystem.RENDER)).toMatchObject({ durationMs: 0.75, ran: true });
  });
});
