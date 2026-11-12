import { createTestAppElements } from '../test/appFixtures';
import { createTestGameState } from '../test/fixtures';
import { createCodeVisualizer } from './codeVisualizer';
import { RuntimeSystem, RuntimeSystemRegistry } from './systemRegistry';
import { createTraceCollector } from './traceCollector';

describe('createCodeVisualizer', () => {
  it('renders the system registry and live frame details', () => {
    const elements = createTestAppElements();
    const trace = createTraceCollector(() => 1);
    const visualizer = createCodeVisualizer({
      root: elements.codeVisualizer,
      pipeline: elements.codePipeline,
      frame: elements.codeFrame,
      phase: elements.codePhase,
      entities: elements.codeEntities,
      events: elements.codeEvents,
      inspectorTitle: elements.codeInspectorTitle,
      inspectorDescription: elements.codeInspectorDescription,
      inspectorSource: elements.codeInspectorSource
    });
    trace.beginFrame();
    trace.start(RuntimeSystem.BALLS);
    trace.end(RuntimeSystem.BALLS);

    visualizer.update(createTestGameState({ events: ['brick-hit'] }), trace, 100);

    expect(elements.codePipeline.querySelectorAll('button')).toHaveLength(RuntimeSystemRegistry.length);
    expect(elements.codeFrame.textContent).toBe('Frame 1');
    expect(elements.codeEvents.textContent).toBe('brick-hit');
    expect(elements.codePipeline.querySelector<HTMLElement>('[data-system="bricks"]')?.dataset.event).toBe('true');
  });

  it('shows source details when a system is selected', () => {
    const elements = createTestAppElements();
    createCodeVisualizer({
      root: elements.codeVisualizer,
      pipeline: elements.codePipeline,
      frame: elements.codeFrame,
      phase: elements.codePhase,
      entities: elements.codeEntities,
      events: elements.codeEvents,
      inspectorTitle: elements.codeInspectorTitle,
      inspectorDescription: elements.codeInspectorDescription,
      inspectorSource: elements.codeInspectorSource
    });

    elements.codePipeline.querySelector<HTMLButtonElement>('[data-system="render"]')?.click();

    expect(elements.codeInspectorTitle.textContent).toBe('Render');
    expect(elements.codeInspectorSource.textContent).toContain('render/gameRenderer.ts');
  });
});
