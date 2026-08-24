export const FALLBACK_IMAGE = "/no-image.png";

/**
 * Returns the best src string for a product image object/string.
 * Covers failure mode 1 & 2: missing, null, undefined, or empty-URL images.
 * Use onImageError for failure mode 3 (load error).
 *
 * @param {object|string|null|undefined} img - image object ({ url: "..." }) or raw URL string
 * @returns {string} resolved URL or fallback
 */
export const getProductImageUrl = (img) => {
  if (!img) return FALLBACK_IMAGE;
  const url = img.url || img;
  if (typeof url !== "string" || !url.trim()) return FALLBACK_IMAGE;
  return url;
};

/**
 * onError handler for <img> elements.
 * Covers failure mode 3: valid-looking URL that fails to load.
 *
 * @param {React.SyntheticEvent} e
 */
export const onImageError = (e) => {
  if (e.target.src !== window.location.origin + FALLBACK_IMAGE) {
    e.target.src = FALLBACK_IMAGE;
  }
};

// Legacy alias kept for any existing consumers
export const getImageUrl = (img) => {
  if (!img) return FALLBACK_IMAGE;
  return img.url || img;
};