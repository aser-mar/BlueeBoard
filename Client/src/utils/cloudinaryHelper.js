export const getPublicIdFromUrl = (url) => {
  if (!url) return null;

  try {
    /**
     * Example URL:
     * https://res.cloudinary.com/demo/image/upload/v123456/uploads/image.jpg
     */

    const parts = url.split("/");

    // get last part: image.jpg
    const fileWithExt = parts.pop();

    // get folder (uploads)
    const folder = parts.pop();

    if (!fileWithExt || !folder) return null;

    const fileName = fileWithExt.split(".")[0];

    return `${folder}/${fileName}`;
  } catch (error) {
    console.log("PUBLIC_ID ERROR:", error);
    return null;
  }
};