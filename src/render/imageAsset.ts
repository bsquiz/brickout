export const loadImageAsset = (url: string, label: string): HTMLImageElement => {
  const image = new Image();
  image.addEventListener('error', () => {
    console.error(`Unable to load ${label} image asset: ${url}`);
  }, { once: true });
  image.src = url;
  return image;
};
