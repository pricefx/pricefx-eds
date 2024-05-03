/*
 * Fragment Block
 * Include content on a page as a fragment.
 * https://www.aem.live/developer/block-collection/fragment
 */

import { decorateMain } from '../../scripts/scripts.js';
import { loadBlocks } from '../../scripts/aem.js';

/**
 * Loads a fragment.
 * @param {string} path The path to the fragment
 * @returns {HTMLElement} The root element of the fragment
 */
export async function loadFragment(path) {
  if (path && path.startsWith('/')) {
    const resp = await fetch(`${path}.plain.html`);
    if (resp.ok) {
      const main = document.createElement('main');
      main.innerHTML = await resp.text();

      // reset base path for media to fragment base
      const resetAttributeBase = (tag, attr) => {
        main.querySelectorAll(`${tag}[${attr}^="./media_"]`).forEach((elem) => {
          elem[attr] = new URL(elem.getAttribute(attr), new URL(path, window.location)).href;
        });
      };
      resetAttributeBase('img', 'src');
      resetAttributeBase('source', 'srcset');

      decorateMain(main);
      await loadBlocks(main);
      return main;
    }
  }
  return null;
}

export default async function decorate(block) {
  const [fragmentPath] = block.children;

  if (!fragmentPath || !fragmentPath.textContent) {
    block.textContent = 'Please configure the fragment path';
    return;
  }

  const path = fragmentPath.textContent.trim();
  const fragment = await loadFragment(path);

  if (fragment) {
    const fragmentContainer = block.querySelector(':scope .fragment'); // Look for a container element with class "fragment" within the block
    if (fragmentContainer) {
      fragmentContainer.innerHTML = ''; // Clear existing content in the container
      fragmentContainer.appendChild(fragment); // Append the fragment content as a child
    }
  }
}
