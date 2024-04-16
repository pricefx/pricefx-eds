import { createElement } from '../../scripts/scripts.js';
import { HOME, RIGHTARROW } from '../../scripts/constants.js';

const getPageTitle = async (url) => {
  const resp = await fetch(url);
  if (resp.ok) {
    const html = document.createElement('div');
    html.innerHTML = await resp.text();
    return html.querySelector('title').innerText;
  }

  return '';
};

const getAllPathsExceptCurrent = async (paths, startLevel) => {
  const result = [];
  // remove first and last slash characters
  const pathsList = paths.replace(/^\/|\/$/g, '').split('/');
  let pathVal = '';

  for (let i = 0; i <= pathsList.length - 2; i += 1) {
    pathVal = `${pathVal}/${pathsList[i]}`;
    let url = `${window.location.origin}${pathVal}`;
    if (window.location.host.includes('author')) {
      url = `${window.location.origin}${pathVal}.html`;
    }

    if (i >= startLevel - 1) {
      // eslint-disable-next-line no-await-in-loop
      const name = await getPageTitle(url);
      if (name) {
        result.push({ pathVal, name, url });
      }
    }
  }
  return result;
};

const createLink = (path) => {
  const pathLink = document.createElement('a');
  pathLink.href = path.url;

  if (path.name !== 'HomePage') {
    pathLink.innerText = path.name;
  } else {
    pathLink.title = path.label;
    pathLink.innerHTML = HOME;
  }
  return pathLink;
};

export default async function decorate(block) {
  const hideBreadcrumb = block.children[0]?.querySelector('p')?.textContent.trim() || 'false';
  const hideCurrentPage = block.children[2]?.querySelector('p')?.textContent.trim() || 'false';
  const startLevel = block.children[1]?.querySelector('p')?.textContent.trim() || 1;
  block.innerHTML = '';

  if (hideBreadcrumb === 'true') {
    return;
  }
  const breadcrumb = createElement('nav', '', {
    'aria-label': 'Breadcrumb',
  });
  const HomeLink = createLink({ path: '', name: 'HomePage', url: window.location.origin, label: 'Home' });
  const breadcrumbLinks = [HomeLink.outerHTML];

  window.setTimeout(async () => {
    const path = window.location.pathname;
    const paths = await getAllPathsExceptCurrent(path, startLevel);
    paths.forEach((pathPart) => breadcrumbLinks.push(createLink(pathPart).outerHTML));
    if (hideCurrentPage === 'false') {
      const currentPath = document.createElement('span');
      currentPath.innerText = document.querySelector('title').innerText;
      breadcrumbLinks.push(currentPath.outerHTML);
    }

    breadcrumb.innerHTML = breadcrumbLinks.join(RIGHTARROW);
    block.append(breadcrumb);
  }, 500);
}
