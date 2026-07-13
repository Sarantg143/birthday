/**
 * Dynamically loads all images from src/assets/images/
 * Supports jpg, jpeg, png, gif, webp, and svg formats.
 */

const imageModules = import.meta.glob('../assets/images/*.{jpg,jpeg,png,gif,webp,svg}', {
  eager: true,
  import: 'default',
});

/**
 * Returns an array of image URLs loaded from the assets folder.
 * @returns {string[]}
 */
export function loadImages() {
  const images = Object.values(imageModules);
  return images.length > 0 ? images : [];
}

/**
 * Returns the profile image (profile.*) or the first available image.
 * @returns {string|null}
 */
export function getProfileImage() {
  const entries = Object.entries(imageModules);
  const profileEntry = entries.find(([path]) =>
    path.toLowerCase().includes('profile')
  );
  if (profileEntry) return profileEntry[1];
  const images = loadImages();
  return images.length > 0 ? images[0] : null;
}

/**
 * Returns gallery images (all except profile image).
 * @returns {string[]}
 */
export function getGalleryImages() {
  const entries = Object.entries(imageModules);
  const gallery = entries
    .filter(([path]) => !path.toLowerCase().includes('profile'))
    .map(([, url]) => url);
  return gallery.length > 0 ? gallery : loadImages();
}
