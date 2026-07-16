export const getImageUrl = (img) => {
  if (!img) return "/no-image.png";
  return img.url || img;
};