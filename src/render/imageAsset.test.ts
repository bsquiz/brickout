import { loadImageAsset } from './imageAsset';

describe('loadImageAsset', () => {
  const OriginalImage = globalThis.Image;

  afterEach(() => {
    globalThis.Image = OriginalImage;
    jest.restoreAllMocks();
  });

  test('creates a labeled image and reports loading failures', () => {
    const addEventListener = jest.fn();
    const image = { addEventListener, src: '' } as unknown as HTMLImageElement;
    globalThis.Image = jest.fn(() => image) as unknown as typeof Image;
    const error = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(loadImageAsset('/assets/example.png', 'example sprite')).toBe(image);
    expect(image.src).toBe('/assets/example.png');
    expect(addEventListener).toHaveBeenCalledWith('error', expect.any(Function), { once: true });

    const listener = addEventListener.mock.calls[0]?.[1] as (() => void) | undefined;
    listener?.();
    expect(error).toHaveBeenCalledWith('Unable to load example sprite image asset: /assets/example.png');
  });
});
