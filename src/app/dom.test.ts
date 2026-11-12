import { getAppElements } from './dom';

const appMarkup = `
  <main id="game-shell">
    <canvas id="game"></canvas><section id="menu"></section><section id="pause-menu"></section>
    <p id="gameplay-hint"></p><p id="menu-message"></p><p id="menu-high-score"><strong></strong></p>
    <p id="menu-hint"></p><button id="start"></button><button id="audio"></button>
    <button id="trail-style"></button><button id="pause"></button><button id="resume"></button>
    <button id="restart"></button><input id="reduced-motion"><div id="touch-actions"></div>
    <button id="dash"></button><section id="upgrade-menu"></section><div id="upgrade-options"></div>
    <label id="debug-level-control"></label><select id="debug-level"></select>
    <aside id="code-visualizer"><div id="code-pipeline"></div><small id="code-frame"></small>
      <strong id="code-phase"></strong><span id="code-entities"></span><p id="code-events"></p>
      <h2 id="code-inspector-title"></h2><p id="code-inspector-description"></p><code id="code-inspector-source"></code>
    </aside>
  </main>`;

describe('getAppElements', () => {
  afterEach(() => jest.restoreAllMocks());

  it('resolves the application DOM contract and drawing context', () => {
    document.body.innerHTML = appMarkup;
    const context = {} as CanvasRenderingContext2D;
    jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context);

    const elements = getAppElements();

    expect(elements.context).toBe(context);
    expect(elements.canvas.id).toBe('game');
    expect(elements.startButton.id).toBe('start');
  });

  it('reports a missing required element', () => {
    document.body.innerHTML = '<canvas id="game"></canvas>';
    jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({} as CanvasRenderingContext2D);

    expect(() => getAppElements()).toThrow('Missing required element: #menu');
  });
});
