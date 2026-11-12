import { drawHorizontalNineSlice } from './horizontalNineSlice';

describe('drawHorizontalNineSlice', () => {
  test('preserves cap proportions while stretching only the center', () => {
    const drawImage = jest.fn();
    const context = { drawImage } as unknown as CanvasRenderingContext2D;
    const image = {} as HTMLImageElement;

    drawHorizontalNineSlice(context, image, {
      sourceWidth: 100,
      sourceHeight: 40,
      sourceCapWidth: 18,
      x: 10,
      y: 20,
      width: 100,
      height: 20
    });

    expect(drawImage).toHaveBeenNthCalledWith(1, image, 0, 0, 18, 40, 10, 20, 9, 20);
    expect(drawImage).toHaveBeenNthCalledWith(2, image, 18, 0, 64, 40, 19, 20, 82, 20);
    expect(drawImage).toHaveBeenNthCalledWith(3, image, 82, 0, 18, 40, 101, 20, 9, 20);
  });

  test('collapses the center rather than overlapping caps for narrow destinations', () => {
    const drawImage = jest.fn();
    const context = { drawImage } as unknown as CanvasRenderingContext2D;

    drawHorizontalNineSlice(context, {} as HTMLImageElement, {
      sourceWidth: 100,
      sourceHeight: 40,
      sourceCapWidth: 18,
      x: 0,
      y: 0,
      width: 12,
      height: 40
    });

    expect(drawImage).toHaveBeenCalledTimes(2);
  });
});
