export type HorizontalNineSlice = {
  sourceWidth: number;
  sourceHeight: number;
  sourceCapWidth: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

export const drawHorizontalNineSlice = (
  context: CanvasRenderingContext2D,
  image: CanvasImageSource,
  slice: HorizontalNineSlice
): void => {
  const sourceCenterWidth = Math.max(0, slice.sourceWidth - slice.sourceCapWidth * 2);
  const scaledCapWidth = slice.sourceCapWidth * slice.height / slice.sourceHeight;
  const destinationCapWidth = Math.min(slice.width / 2, scaledCapWidth);
  const destinationCenterWidth = Math.max(0, slice.width - destinationCapWidth * 2);

  context.drawImage(
    image,
    0,
    0,
    slice.sourceCapWidth,
    slice.sourceHeight,
    slice.x,
    slice.y,
    destinationCapWidth,
    slice.height
  );
  if (sourceCenterWidth > 0 && destinationCenterWidth > 0) {
    context.drawImage(
      image,
      slice.sourceCapWidth,
      0,
      sourceCenterWidth,
      slice.sourceHeight,
      slice.x + destinationCapWidth,
      slice.y,
      destinationCenterWidth,
      slice.height
    );
  }
  context.drawImage(
    image,
    slice.sourceWidth - slice.sourceCapWidth,
    0,
    slice.sourceCapWidth,
    slice.sourceHeight,
    slice.x + slice.width - destinationCapWidth,
    slice.y,
    destinationCapWidth,
    slice.height
  );
};
