import { Constants } from '../constants';
import type { GameEventType, GameState } from '../gameplay/types';
import { RuntimeSystem, RuntimeSystemRegistry, type RuntimeSystemDefinition, type RuntimeSystemId } from './systemRegistry';
import type { TraceCollector, TraceEntry } from './traceCollector';

export type CodeVisualizerElements = {
  root: HTMLElement;
  pipeline: HTMLElement;
  frame: HTMLElement;
  phase: HTMLElement;
  entities: HTMLElement;
  events: HTMLElement;
  inspectorTitle: HTMLElement;
  inspectorDescription: HTMLElement;
  inspectorSource: HTMLElement;
};

export type CodeVisualizer = {
  update: (state: GameState, trace: TraceCollector, timestamp: number) => void;
  destroy: () => void;
};

const eventSystems: Partial<Record<GameEventType, RuntimeSystemId>> = {
  [Constants.Id.GameEvent.WALL_HIT]: RuntimeSystem.BALLS,
  [Constants.Id.GameEvent.PADDLE_HIT]: RuntimeSystem.BALLS,
  [Constants.Id.GameEvent.PERFECT_RETURN]: RuntimeSystem.BALLS,
  [Constants.Id.GameEvent.BRICK_HIT]: RuntimeSystem.BRICKS,
  [Constants.Id.GameEvent.POWERUP]: RuntimeSystem.POWERUPS,
  [Constants.Id.GameEvent.LASER]: RuntimeSystem.PROJECTILES,
  [Constants.Id.GameEvent.ALIEN_WARNING]: RuntimeSystem.ALIENS,
  [Constants.Id.GameEvent.ALIEN_SHOT]: RuntimeSystem.ALIENS,
  [Constants.Id.GameEvent.ALIEN_HIT]: RuntimeSystem.ALIENS,
  [Constants.Id.GameEvent.NEAR_MISS]: RuntimeSystem.ALIENS,
  [Constants.Id.GameEvent.LIFE_LOST]: RuntimeSystem.PHASE,
  [Constants.Id.GameEvent.LEVEL_WON]: RuntimeSystem.COMPLETION
};

const formatDuration = (durationMs: number): string => durationMs < 0.01 ? '<0.01 ms' : `${durationMs.toFixed(2)} ms`;

export const createCodeVisualizer = (elements: CodeVisualizerElements): CodeVisualizer => {
  const nodes = new Map<RuntimeSystemId, HTMLButtonElement>();
  const eventPulseUntil = new Map<RuntimeSystemId, number>();
  const removeListeners: Array<() => void> = [];
  let selectedSystem = RuntimeSystem.BALLS as RuntimeSystemId;
  let lastUpdateAt = Number.NEGATIVE_INFINITY;
  let latestEntries: readonly TraceEntry[] = [];

  const showInspector = (definition: RuntimeSystemDefinition): void => {
    selectedSystem = definition.id;
    elements.inspectorTitle.textContent = definition.label;
    elements.inspectorDescription.textContent = definition.description;
    const entry = latestEntries.find(({ id }) => id === definition.id);
    elements.inspectorSource.textContent = `${definition.source} · ${formatDuration(entry?.durationMs ?? 0)}`;
    nodes.forEach((node, id) => { node.setAttribute('aria-pressed', String(id === selectedSystem)); });
  };

  const nodeElements = RuntimeSystemRegistry.map((definition) => {
    const button = elements.root.ownerDocument.createElement('button');
    const label = elements.root.ownerDocument.createElement('strong');
    const duration = elements.root.ownerDocument.createElement('span');
    button.type = 'button';
    button.className = 'code-node';
    button.dataset.system = definition.id;
    button.style.setProperty('--system-color', definition.color);
    button.setAttribute('aria-pressed', 'false');
    label.textContent = definition.label;
    duration.textContent = 'waiting';
    button.append(label, duration);
    const select = (): void => showInspector(definition);
    button.addEventListener('click', select);
    removeListeners.push(() => button.removeEventListener('click', select));
    nodes.set(definition.id, button);
    return button;
  });
  elements.pipeline.replaceChildren(...nodeElements);
  showInspector(RuntimeSystemRegistry.find(({ id }) => id === selectedSystem) ?? RuntimeSystemRegistry[0]!);

  return {
    update: (state, trace, timestamp) => {
      if (timestamp - lastUpdateAt < Constants.Debug.Visualizer.UPDATE_INTERVAL_MS) return;
      lastUpdateAt = timestamp;
      latestEntries = trace.getEntries();
      state.events.forEach((event) => {
        const system = eventSystems[event];
        if (system !== undefined) eventPulseUntil.set(system, timestamp + Constants.Debug.Visualizer.EVENT_PULSE_MS);
      });
      latestEntries.forEach((entry) => {
        const node = nodes.get(entry.id);
        if (node === undefined) return;
        node.dataset.ran = String(entry.ran);
        node.dataset.event = String((eventPulseUntil.get(entry.id) ?? 0) > timestamp);
        node.style.setProperty('--duration-ratio', String(Math.min(1, entry.durationMs / Constants.Debug.Visualizer.FULL_DURATION_BAR_MS)));
        const duration = node.querySelector('span');
        if (duration !== null) duration.textContent = entry.ran ? formatDuration(entry.durationMs) : 'skipped';
      });
      const selected = RuntimeSystemRegistry.find(({ id }) => id === selectedSystem);
      if (selected !== undefined) showInspector(selected);
      elements.frame.textContent = `Frame ${trace.getFrameNumber().toLocaleString('en-US')}`;
      elements.phase.textContent = state.phase;
      elements.entities.textContent = `${1 + state.extraBalls.length} ball · ${state.bricks.length} bricks · ${state.powerups.length + state.projectiles.length + state.enemyBullets.length} transient`;
      elements.events.textContent = state.events.length > 0 ? state.events.join(' · ') : 'No events this frame';
    },
    destroy: () => {
      removeListeners.forEach((remove) => remove());
      nodes.clear();
      eventPulseUntil.clear();
    }
  };
};
