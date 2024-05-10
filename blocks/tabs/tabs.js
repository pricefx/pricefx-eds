import { toClassName } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

function hasWrapper(el) {
  return !!el.firstElementChild && window.getComputedStyle(el.firstElementChild).display === 'block';
}

async function processTab(tab, index, block, tablist) {
  if (index === 0) {
    if (tab.textContent) {
      block.classList.add(tab.textContent);
      tab.remove();
    }
    return;
  }

  const id = toClassName(tab.textContent);
  const tabpanel = block.children[index];

  if (tabpanel.querySelector('a')) {
    const link = tabpanel.querySelector('a').href;

    if (link.includes('/fragments/')) {
      const url = new URL(link);
      const fragmentPath = url.pathname;

      const fragmentBlock = await loadFragment(fragmentPath);
      if (fragmentBlock) {
        const lastChild = tabpanel.lastElementChild;
        const fragmentChild = fragmentBlock.querySelector('.section');
        if (fragmentChild) {
          lastChild.innerHTML = fragmentChild.innerHTML;
        }
      }
    }
  }
  tabpanel.className = 'tabs-panel';
  tabpanel.id = `tabpanel-${id}`;
  tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
  tabpanel.setAttribute('role', 'tabpanel');
  tabpanel.setAttribute('aria-hidden', index !== 1);
  if (!hasWrapper(tabpanel.lastElementChild)) {
    tabpanel.lastElementChild.innerHTML = `<p>${tabpanel.lastElementChild.innerHTML}</p>`;
  }

  const button = document.createElement('button');
  button.className = 'tabs-tab';
  button.id = `tab-${id}`;
  button.innerHTML = tab.innerText;
  button.setAttribute('aria-controls', `tabpanel-${id}`);
  button.setAttribute('aria-selected', index === 1);
  button.setAttribute('role', 'tab');
  button.setAttribute('type', 'button');

  button.addEventListener('click', () => {
    block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
      panel.setAttribute('aria-hidden', true);
    });
    tablist.querySelectorAll('button').forEach((btn) => {
      btn.setAttribute('aria-selected', false);
    });
    tabpanel.setAttribute('aria-hidden', false);
    button.setAttribute('aria-selected', true);
  });
  tablist.append(button);
  tab.remove();
}

export default async function decorate(block) {
  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');

  const tabs = Array.from(block.children).map((child) => child.firstElementChild);
  await tabs.reduce(async (previousPromise, tab, index) => {
    await previousPromise;
    return processTab(tab, index, block, tablist);
  }, Promise.resolve());

  block.prepend(tablist);
}
