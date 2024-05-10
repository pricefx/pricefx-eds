import { toClassName } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

async function loadTabContent(tabPanel, fragmentPath) {
  if (fragmentPath.includes('/fragments/')) {
    const fragmentBlock = await loadFragment(fragmentPath);
    if (fragmentBlock) {
      tabPanel.innerHTML = fragmentBlock.innerHTML;
    }
  }
}

async function processTab(tab, index, block, tablist) {
  const id = toClassName(tab.textContent);
  const tabpanel = block.children[index];

  // Pre-create tab button and set attributes
  const button = document.createElement('button');
  button.className = 'tabs-tab';
  button.id = `tab-${id}`;
  button.setAttribute('aria-controls', `tabpanel-${id}`);
  button.setAttribute('role', 'tab');
  button.setAttribute('type', 'button');

  if (index === 0 && tab.textContent) {
    block.classList.add(tab.textContent);
    tab.remove();
    return;
  }

  if (tabpanel.querySelector('a')) {
    const link = tabpanel.querySelector('a').href;
    if (link.includes('/fragments/')) {
      const url = new URL(link);
      const fragmentPath = url.pathname;
      await loadTabContent(tabpanel, fragmentPath);
    }
  }

  // Set remaining button attributes based on state
  button.innerHTML = tab.innerText;
  button.setAttribute('aria-selected', index === 1);
  tabpanel.classList.add('tabs-panel');
  tabpanel.id = `tabpanel-${id}`;
  tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
  tabpanel.setAttribute('role', 'tabpanel');
  tabpanel.setAttribute('aria-hidden', index !== 1);

  // Add event listener and append to list
  button.addEventListener('click', () => {
    block.querySelectorAll('.tabs-panel').forEach((panel) => {
      // ... existing click logic
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

  // Pre-create empty tab panels
  const tabPanels = tabs.map(() => document.createElement('div'));

  // Process tabs and populate content/attributes
  tabs.forEach((tab, index) => {
    processTab(tab, index, block, tablist);
    block.replaceChild(tabPanels[index], tab); // Replace existing tab with panel
  });

  block.prepend(tablist);
}
