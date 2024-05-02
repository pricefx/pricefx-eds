/**
 * Function to identify the AEM environment based on the URL.
 * @returns {string} Environment mode (author or publish)
 */
export default function environmentMode() {
  if (window.location.hostname.includes('adobeaemcloud')) {
    return 'author';
  }
  return 'publish';
}

/**
 * Loads JS logic.
 * @param {string} data loads all js logic
 */
export function loadScriptLogic(data) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.append(data);
    script.onload = resolve;
    script.onerror = reject;
    resolve();
  });
}
