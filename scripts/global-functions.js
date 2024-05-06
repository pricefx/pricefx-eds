/**
 * Function to identify the AEM environment based on the URL.
 * @returns {string} Environment mode (author or publish)
 */
export function environmentMode() {
  if (window.location.hostname.includes('adobeaemcloud')) {
    return 'author';
  }
  return 'publish';
}

/**
 * Function to identify the AEM Edit Mode (universal-editor) based on the URL.
 * @returns {Boolean} Edit mode (edit or preview)
 */
export function editMode() {
  if (window.location.href.includes('/canvas/author') || window.location.search.includes('?ref=')) {
    return true;
  }
  return false;
}
