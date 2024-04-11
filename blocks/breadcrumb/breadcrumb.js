import { createElement } from '../../scripts/scripts.js';

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

    if (i >= startLevel) {
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
    pathLink.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
    <path d="M3 12.5L5 10.5M5 10.5L12 3.5L19 10.5M5 10.5V20.5C5 21.0523 5.44772 21.5 6 21.5H9M19 10.5L21 12.5M19 10.5V20.5C19 21.0523 18.5523 21.5 18 21.5H15M9 21.5C9.55228 21.5 10 21.0523 10 20.5V16.5C10 15.9477 10.4477 15.5 11 15.5H13C13.5523 15.5 14 15.9477 14 16.5V20.5C14 21.0523 14.4477 21.5 15 21.5M9 21.5H15" stroke="#484D56" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  }
  return pathLink;
};

export default async function decorate(block) {
  const hideBreadcrumb = block.querySelector("div[data-aue-prop='hideBreadcrumb']")?.textContent.trim() || 'false';
  const hideCurrentPage = block.querySelector("div[data-aue-prop='hideCurrentPage']")?.textContent.trim() || 'false';
  const startLevel = block.querySelector("div[data-aue-prop='navigationStartLevel']")?.textContent.trim() || 1;
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

    breadcrumb.innerHTML =
      breadcrumbLinks.join(`<span class="breadcrumb-separator"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
    <path d="M14 5.5L21 12.5M21 12.5L14 19.5M21 12.5L3 12.5" stroke="#484D56" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg></span>`);
    block.append(breadcrumb);
  }, 500);
}
