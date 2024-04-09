import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

export default async function decorate(block) {
  const breadCrumbMeta = getMetadata('footer');
  block.textContent = '';

  // load breadcrumb fragment
  const breadCrumbPath = breadCrumbMeta.breadcrumb;
  const fragment = await loadFragment(breadCrumbPath);

  // decorate breadcrumb DOM
  const breadCrumb = document.createElement('div');
  while (fragment.firstElementChild) {
    breadCrumb.append(fragment.firstElementChild);
  }

  block.append(breadCrumb);
}
