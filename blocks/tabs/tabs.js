import { toClassName } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

async function loadTabContent(tabPanel, fragmentPath) {
  if (fragmentPath.includes('/fragments/')) {
    const fragmentBlock = await loadFragment(fragmentPath);
    if (fragmentBlock) {
      const fragmentContent = fragmentBlock.querySelector('.section');
      if (fragmentContent) {
        tabPanel.innerHTML = fragmentContent.innerHTML;
      }
    }
  }
}

async function createTab, index, block, tablist) {
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

      await loadTabContent(tabpanel, fragmentPath);
    }
  }

  tabpanel.classList.add('tabs-panel');
  tabpanel.id = `tabpanel-${id}`;
  tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
  tabpanel.setAttribute('role', 'tabpanel');
  tabpanel.setAttribute('aria-hidden', index !== 1);

  const button = document.createElement('button');
  button.className = 'tabs-tab';
  button.id = `tab-${id}`;
  button.innerHTML = tab.innerText;
  button.setAttribute('aria-controls', `tabpanel-${id}`);
  button.setAttribute('aria-selected', index === 1);
  button.setAttribute('role', 'tab');
  button.setAttribute('type', 'button');

  button.addEventListener('click', () => {
    block.querySelectorAll('.tabs-panel').forEach((panel) => {
      panel.setAttribute('aria-hidden', true);
    });
    tablist.querySelectorAll('.tabs-tab').forEach((btn) => {
      btn.setAttribute('aria-selected', false);
    });
    tabpanel.setAttribute('aria-hidden', false);
    button.setAttribute('aria-selected', true);
  });

  tablist.appendChild(button);
}

export default async function decorate(block) {
  const tablist = document.createElement('nav');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');

  const tabs = Array.from(block.children).map((child) => child.firstElementChild);
  tabs.forEach((tab, index) => createTab(tab, index, block, tablist));

  block.prepend(tablist);
}
