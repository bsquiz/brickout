import { BUILD_BASE } from './paths';

describe('production asset paths', () => {
  test('uses a document-relative build base', () => {
    expect(BUILD_BASE).toBe('./');
  });
});
