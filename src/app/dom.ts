export type AppElements = {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  menu: HTMLElement;
  gameShell: HTMLElement;
  pauseMenu: HTMLElement;
  gameplayHint: HTMLParagraphElement;
  menuMessage: HTMLParagraphElement;
  menuHighScore: HTMLElement;
  menuHint: HTMLParagraphElement;
  startButton: HTMLButtonElement;
  audioButton: HTMLButtonElement;
  trailButton: HTMLButtonElement;
  pauseButton: HTMLButtonElement;
  resumeButton: HTMLButtonElement;
  restartButton: HTMLButtonElement;
  reducedMotionInput: HTMLInputElement;
  touchActions: HTMLElement;
  dashButton: HTMLButtonElement;
  upgradeMenu: HTMLElement;
  upgradeOptions: HTMLElement;
  debugLevelControl: HTMLLabelElement;
  debugLevelSelect: HTMLSelectElement;
  codeVisualizer: HTMLElement;
  codePipeline: HTMLElement;
  codeFrame: HTMLElement;
  codePhase: HTMLElement;
  codeEntities: HTMLElement;
  codeEvents: HTMLElement;
  codeInspectorTitle: HTMLElement;
  codeInspectorDescription: HTMLElement;
  codeInspectorSource: HTMLElement;
};

const requireElement = <T extends Element>(root: ParentNode, selector: string): T => {
  const element = root.querySelector<T>(selector);
  if (element === null) throw new Error(`Missing required element: ${selector}`);
  return element;
};

export const getAppElements = (root: Document = document): AppElements => {
  const canvas = requireElement<HTMLCanvasElement>(root, '#game');
  const context = canvas.getContext('2d');
  if (context === null) throw new Error('2D canvas rendering is unavailable');

  return {
    canvas,
    context,
    menu: requireElement(root, '#menu'),
    gameShell: requireElement(root, '#game-shell'),
    pauseMenu: requireElement(root, '#pause-menu'),
    gameplayHint: requireElement(root, '#gameplay-hint'),
    menuMessage: requireElement(root, '#menu-message'),
    menuHighScore: requireElement(root, '#menu-high-score strong'),
    menuHint: requireElement(root, '#menu-hint'),
    startButton: requireElement(root, '#start'),
    audioButton: requireElement(root, '#audio'),
    trailButton: requireElement(root, '#trail-style'),
    pauseButton: requireElement(root, '#pause'),
    resumeButton: requireElement(root, '#resume'),
    restartButton: requireElement(root, '#restart'),
    reducedMotionInput: requireElement(root, '#reduced-motion'),
    touchActions: requireElement(root, '#touch-actions'),
    dashButton: requireElement(root, '#dash'),
    upgradeMenu: requireElement(root, '#upgrade-menu'),
    upgradeOptions: requireElement(root, '#upgrade-options'),
    debugLevelControl: requireElement(root, '#debug-level-control'),
    debugLevelSelect: requireElement(root, '#debug-level'),
    codeVisualizer: requireElement(root, '#code-visualizer'),
    codePipeline: requireElement(root, '#code-pipeline'),
    codeFrame: requireElement(root, '#code-frame'),
    codePhase: requireElement(root, '#code-phase'),
    codeEntities: requireElement(root, '#code-entities'),
    codeEvents: requireElement(root, '#code-events'),
    codeInspectorTitle: requireElement(root, '#code-inspector-title'),
    codeInspectorDescription: requireElement(root, '#code-inspector-description'),
    codeInspectorSource: requireElement(root, '#code-inspector-source')
  };
};
