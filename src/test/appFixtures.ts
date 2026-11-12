import type { AppElements } from '../app/dom';

const createElement = <T extends HTMLElement>(tagName: string): T => document.createElement(tagName) as T;

export const createTestAppElements = (): AppElements => {
  const canvas = createElement<HTMLCanvasElement>('canvas');
  const context = {} as CanvasRenderingContext2D;
  return {
    canvas,
    context,
    menu: createElement('section'),
    gameShell: createElement('main'),
    pauseMenu: createElement('section'),
    gameplayHint: createElement('p'),
    menuMessage: createElement('p'),
    menuHighScore: createElement('strong'),
    menuHint: createElement('p'),
    startButton: createElement('button'),
    audioButton: createElement('button'),
    trailButton: createElement('button'),
    pauseButton: createElement('button'),
    resumeButton: createElement('button'),
    restartButton: createElement('button'),
    reducedMotionInput: createElement('input'),
    touchActions: createElement('div'),
    dashButton: createElement('button'),
    upgradeMenu: createElement('section'),
    upgradeOptions: createElement('div'),
    debugLevelControl: createElement('label'),
    debugLevelSelect: createElement('select'),
    codeVisualizer: createElement('aside'),
    codePipeline: createElement('div'),
    codeFrame: createElement('small'),
    codePhase: createElement('strong'),
    codeEntities: createElement('span'),
    codeEvents: createElement('p'),
    codeInspectorTitle: createElement('h2'),
    codeInspectorDescription: createElement('p'),
    codeInspectorSource: createElement('code')
  };
};
