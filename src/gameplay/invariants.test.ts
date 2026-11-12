import { createTestGameState } from '../test/fixtures';
import { getStateInvariantErrors } from './invariants';

describe('game state invariants', () => {
  test('accepts a valid state', () => expect(getStateInvariantErrors(createTestGameState())).toEqual([]));

  test('reports non-finite entities', () => {
    const state = createTestGameState();
    state.ball.x = Number.NaN;
    expect(getStateInvariantErrors(state)).toContain('invalid ball');
  });
});
