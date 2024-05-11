import ffetch from '../../scripts/ffetch.js';
import { createOptimizedPicture } from '../../scripts/aem.js';
import { LEFTCHEVRON, RIGHTCHEVRON } from '../../scripts/constants.js';

const isDesktop = window.matchMedia('(min-width: 986px)');

/**
 * Reset Filter Accordions to Default State
 * @param {Element} filterToggle The CTA that show/hide the Filter Category
 */
const resetFilterAccordions = (filterToggle) => {
  const filterContent = filterToggle.nextElementSibling;
  const filterOptions = filterContent.querySelectorAll('input');
  const filterHasChecked = [...filterOptions].some((input) => !input.id.includes('all') && input.checked);
  const contentScroll = filterContent.scrollHeight;

  if (filterHasChecked) {
    filterContent.style.visibility = 'visible';
    filterContent.style.maxHeight = `${contentScroll}px`;

    filterContent.setAttribute('aria-hidden', 'false');
    filterToggle.setAttribute('aria-expanded', 'true');
  } else {
    filterContent.style.visibility = 'hidden';
    filterContent.style.maxHeight = '0px';

    filterContent.setAttribute('aria-hidden', 'true');
    filterToggle.setAttribute('aria-expanded', 'false');
  }
};

/**
 * Toggle Filter Accordions
 * @param {Element} toggle The CTA that show/hide the Filter Category
 */
const toggleFilterAccordion = (toggle) => {
  const content = toggle.nextElementSibling;
  const contentScroll = content.scrollHeight;

  if (!content.style.maxHeight) {
    content.style.visibility = 'hidden';
    content.style.maxHeight = '0px';
  } else if (content.style.maxHeight === '0px') {
    content.style.visibility = 'visible';
    content.style.maxHeight = `${contentScroll}px`;
  } else {
    content.style.visibility = 'hidden';
    content.style.maxHeight = '0px';
  }

  const ariaHiddenState = content.attributes[3].value;
  const setAriaHidden = ariaHiddenState === 'true' ? 'false' : 'true';
  content.setAttribute('aria-hidden', setAriaHidden);

  const ariaExpandedState = toggle.attributes[3].value;
  const setAriaExpanded = ariaExpandedState === 'false' ? 'true' : 'false';
  toggle.setAttribute('aria-expanded', setAriaExpanded);
};

/**
 * Toggle Filter Sidebar
 * @param {Element} filterMenuToggle The CTA that show/hide the Filter Menu
 * @param {Element} filterMenu The element container for the Filter
 */
const toggleFilterMenu = (filterMenuToggle, filterMenu, contentWrapper) => {
  const filterMenuToggleAriaExpanded = filterMenuToggle.attributes[3].value;
  const setfilterMenuToggleAriaExpanded = filterMenuToggleAriaExpanded === 'false' ? 'true' : 'false';
  filterMenuToggle.setAttribute('aria-expanded', setfilterMenuToggleAriaExpanded);

  if (filterMenuToggleAriaExpanded === 'false') {
    filterMenu.classList.toggle('hidden', false);
    contentWrapper.classList.toggle('partner-showcase-content--full-width', false);
    filterMenu.focus();
    filterMenuToggle.innerHTML = `<span class="filter-icon"></span><span class="toggle-label">Hide Filters</span>`;
  } else {
    filterMenu.blur();
    filterMenuToggle.innerHTML = `<span class="filter-icon"></span><span class="toggle-label">Show Filter</span>`;
    const filterAccordions = document.querySelectorAll('.ps-filter-category-toggle');
    filterAccordions.forEach((accordion) => {
      resetFilterAccordions(accordion);
    });
    setTimeout(() => {
      filterMenu.classList.toggle('hidden', true);
    }, '300');
    contentWrapper.classList.toggle('partner-showcase-content--full-width', true);
  }

  const filterMenuAriaHidden = filterMenu.attributes[3].value;
  const setFilterMenuAriaHidden = filterMenuAriaHidden === 'false' ? 'true' : 'false';
  filterMenu.setAttribute('aria-hidden', setFilterMenuAriaHidden);
};

// Close Mobile Navigation on ESC Key
const closeMobileFilterOnEscape = (e) => {
  if (e.code === 'Escape' && !isDesktop.matches) {
    const filterMenuToggle = document.getElementById('ps-filter-menu-toggle');
    const filterMenu = document.getElementById('ps-filter-menu');
    if (filterMenuToggle.getAttribute('aria-expanded') === 'true') {
      filterMenuToggle.setAttribute('aria-expanded', 'false');
      filterMenu.setAttribute('aria-hidden', 'true');
      const filterAccordions = document.querySelectorAll('.ps-filter-category-toggle');
      filterAccordions.forEach((accordion) => {
        resetFilterAccordions(accordion);
      });
    }
  }
};
window.addEventListener('keydown', closeMobileFilterOnEscape);

/**
 * Decorates Learning Center on DOM
 * @param {Element} block The Learning Center block element
 */
export default async function decorate(block) {
  // const [
  //   featuredPartner,
  //   searchPath,
  //   searchPlaceholder,
  //   partnersPath,
  //   numberOfPartners,
  //   sortBy,
  //   filterOneTitle,
  //   filterOneMultiSelect,
  //   filterOneTags,
  //   filterTwoTitle,
  //   filterTwoMultiSelect,
  //   filterTwoTags,
  //   filterThreeTitle,
  //   filterThreeMultiSelect,
  //   filterThreeTags,
  //   filterFourTitle,
  //   filterFourMultiSelect,
  //   filterFourTags,
  // ] = block.children;
  block.innerHTML = '';

  const main = document.querySelector('main');
  const partnerShowcaseWrapper = document.createElement('div');
  partnerShowcaseWrapper.classList.add('partner-showcase');
  main.append(partnerShowcaseWrapper);

  const filterControls = document.createElement('div');
  filterControls.classList.add('ps-filter-controls');
  block.append(filterControls);

  // Creates a div container for flex-box styling use
  const flexContainer = document.createElement('div');
  flexContainer.classList.add('flex-container');
  block.append(flexContainer);

  // Creates a div container for the actual Filter Menu
  const filter = document.createElement('div');
  filter.classList.add('ps-filter-wrapper');
  filter.id = 'ps-filter-menu';
  filter.setAttribute('aria-labelledby', 'ps-filter-menu-toggle');
  filter.setAttribute('aria-hidden', 'false');
  flexContainer.append(filter);

  // Creates a div container to hold Partner Cards
  const partnerShowcaseContent = document.createElement('div');
  partnerShowcaseContent.classList.add('partner-showcase-content');
  const partnersContainer = document.createElement('ul');
  partnersContainer.classList.add('ps-partners-container');
  flexContainer.append(partnerShowcaseContent);
  partnerShowcaseContent.append(partnersContainer);

  // Creates a div container to hold pagination
  const paginationContainer = document.createElement('div');
  paginationContainer.classList.add('pagination-wrapper');
  partnerShowcaseContent.append(paginationContainer);

  filterControls.innerHTML = `
    <button class="ps-filter-menu-toggle" id="ps-filter-menu-toggle" aria-controls="ps-filter-menu" aria-expanded="true"><span class="filter-icon"></span><span class="toggle-label">Hide Filters</span></button>
  `;

  // Click event for Filter Menu Toggle
  const filterMenuToggle = document.querySelector('.ps-filter-menu-toggle');
  filterMenuToggle.addEventListener('click', () => {
    toggleFilterMenu(filterMenuToggle, filter, partnerShowcaseContent);
  });

  // Watch for screen size change and switch between Desktop and Mobile Filter
  window.addEventListener('resize', () => {
    if (!isDesktop.matches && filterMenuToggle.getAttribute('aria-expanded') === 'true') {
      filterMenuToggle.setAttribute('aria-expanded', 'false');
      filterMenuToggle.setAttribute('aria-label', 'Toggle Filter Menu');
      filter.setAttribute('aria-hidden', 'true');
    } else if (isDesktop.matches && filterMenuToggle.getAttribute('aria-expanded') === 'false') {
      filterMenuToggle.setAttribute('aria-expanded', 'true');
      filter.setAttribute('aria-hidden', 'false');
    }
  });
  if (!isDesktop.matches && filterMenuToggle.getAttribute('aria-expanded') === 'true') {
    filterMenuToggle.setAttribute('aria-expanded', 'false');
    filterMenuToggle.setAttribute('aria-label', 'Toggle Filter Menu');
    filter.setAttribute('aria-hidden', 'true');
  }

  // Render Filter Categories
  const renderFilterCategory = (
    filterNum,
    filterCategoryLabel,
    filterIsMultiSelect,
    filterCategoryOptions,
    filterCategoryName,
    isHidden,
  ) => {
    const optionsArray = filterCategoryOptions.textContent.trim().split(',');
    let filterOptionsMarkup = '';
    optionsArray.forEach((option) => {
      const optionSplit = option.split('/')[2];
      const optionReplaceHypen = optionSplit.replaceAll('-', ' ');
      const optionReplaceAmpersand = optionSplit.replaceAll('&', 'and');
      const optionTextTransform =
        optionReplaceHypen.length <= 4 ? optionReplaceHypen.toUpperCase() : optionReplaceHypen;
      if (filterIsMultiSelect.textContent.trim() === 'false') {
        filterOptionsMarkup += `
          <li class="ps-filter-category-item">
            <input type="radio" id="filter-${optionSplit.includes('&') ? `${filterCategoryName}-${optionReplaceAmpersand}` : `${filterCategoryName}-${optionSplit}`}" name="filter-${filterCategoryName}" value="${optionSplit.includes('&') ? optionReplaceAmpersand : optionSplit}" data-filter-category="filter-${filterCategoryName}" />
            <label for="filter-${optionSplit.includes('&') ? `${filterCategoryName}-${optionReplaceAmpersand}` : `${filterCategoryName}-${optionSplit}`}">${optionTextTransform}</label>
          </li>
        `;
      } else {
        filterOptionsMarkup += `
          <li class="ps-filter-category-item">
            <input type="checkbox" id="filter-${optionSplit.includes('&') ? `${filterCategoryName}-${optionReplaceAmpersand}` : `${filterCategoryName}-${optionSplit}`}" name="${optionSplit}" value="${optionSplit.includes('&') ? optionReplaceAmpersand : optionSplit}" data-filter-category="filter-${filterCategoryName}" />
            <label for="filter-${optionSplit.includes('&') ? `${filterCategoryName}-${optionReplaceAmpersand}` : `${filterCategoryName}-${optionSplit}`}">${optionTextTransform}</label>
          </li>
        `;
      }
    });

    const markup = `
      <div class="ps-filter-category">
        <button class="ps-filter-category-toggle" id="ps-filter-category-${filterNum}-toggle" aria-controls="ps-filter-category-${filterNum}-content" aria-expanded=${isHidden === true ? 'false' : 'true'}>${filterCategoryLabel.textContent.trim()}<span class="accordion-icon"></span></button>
        <ul class="ps-filter-category-content" id="ps-filter-category-${filterNum}-content" aria-labelledby="ps-filter-category-${filterNum}-toggle" aria-hidden=${isHidden}>
          ${
            filterIsMultiSelect.textContent.trim() === 'false'
              ? `<li class="ps-filter-category-item">
                <input type="radio" id="filter-all-${filterCategoryName}" name="filter-${filterCategoryName}" value="filter-all-${filterCategoryName}" data-filter-category="filter-${filterCategoryName}" checked />
                <label for="filter-all-${filterCategoryName}">All</label>
              </li>`
              : ``
          }
            ${filterOptionsMarkup}
        </ul>
      </div>
    `;
    return markup;
  };

  // Click event for Filter Menu Toggle
  const filterMenuToggle = document.querySelector('.ps-filter-menu-toggle');
  filterMenuToggle.addEventListener('click', () => {
    toggleFilterMenu(filterMenuToggle, filter, partnerShowcaseContent);
  });

  // Watch for screen size change and switch between Desktop and Mobile Filter
  window.addEventListener('resize', () => {
    if (!isDesktop.matches && filterMenuToggle.getAttribute('aria-expanded') === 'true') {
      filterMenuToggle.setAttribute('aria-expanded', 'false');
      filterMenuToggle.setAttribute('aria-label', 'Toggle Filter Menu');
      filter.setAttribute('aria-hidden', 'true');
    } else if (isDesktop.matches && filterMenuToggle.getAttribute('aria-expanded') === 'false') {
      filterMenuToggle.setAttribute('aria-expanded', 'true');
      filter.setAttribute('aria-hidden', 'false');
    }
  });
  if (!isDesktop.matches && filterMenuToggle.getAttribute('aria-expanded') === 'true') {
    filterMenuToggle.setAttribute('aria-expanded', 'false');
    filterMenuToggle.setAttribute('aria-label', 'Toggle Filter Menu');
    filter.setAttribute('aria-hidden', 'true');
  }

  // Render Filter Categories
  const renderFilterCategory = (
    filterNum,
    filterCategoryLabel,
    filterIsMultiSelect,
    filterCategoryOptions,
    filterCategoryName,
    isHidden,
  ) => {
    const optionsArray = filterCategoryOptions.textContent.trim().split(',');
    let filterOptionsMarkup = '';
    optionsArray.forEach((option) => {
      const optionSplit = option.split('/')[2];
      const optionReplaceHypen = optionSplit.replaceAll('-', ' ');
      const optionReplaceAmpersand = optionSplit.replaceAll('&', 'and');
      const optionTextTransform =
        optionReplaceHypen.length <= 4 ? optionReplaceHypen.toUpperCase() : optionReplaceHypen;
      if (filterIsMultiSelect.textContent.trim() === 'false') {
        filterOptionsMarkup += `
          <li class="ps-filter-category-item">
            <input type="radio" id="filter-${optionSplit.includes('&') ? `${filterCategoryName}-${optionReplaceAmpersand}` : `${filterCategoryName}-${optionSplit}`}" name="filter-${filterCategoryName}" value="${optionSplit.includes('&') ? optionReplaceAmpersand : optionSplit}" data-filter-category="filter-${filterCategoryName}" />
            <label for="filter-${optionSplit.includes('&') ? `${filterCategoryName}-${optionReplaceAmpersand}` : `${filterCategoryName}-${optionSplit}`}">${optionTextTransform}</label>
          </li>
        `;
      } else {
        filterOptionsMarkup += `
          <li class="ps-filter-category-item">
            <input type="checkbox" id="filter-${optionSplit.includes('&') ? `${filterCategoryName}-${optionReplaceAmpersand}` : `${filterCategoryName}-${optionSplit}`}" name="${optionSplit}" value="${optionSplit.includes('&') ? optionReplaceAmpersand : optionSplit}" data-filter-category="filter-${filterCategoryName}" />
            <label for="filter-${optionSplit.includes('&') ? `${filterCategoryName}-${optionReplaceAmpersand}` : `${filterCategoryName}-${optionSplit}`}">${optionTextTransform}</label>
          </li>
        `;
      }
    });

    const markup = `
      <div class="ps-filter-category">
        <button class="ps-filter-category-toggle" id="ps-filter-category-${filterNum}-toggle" aria-controls="ps-filter-category-${filterNum}-content" aria-expanded=${isHidden === true ? 'false' : 'true'}>${filterCategoryLabel.textContent.trim()}<span class="accordion-icon"></span></button>
        <ul class="ps-filter-category-content" id="ps-filter-category-${filterNum}-content" aria-labelledby="ps-filter-category-${filterNum}-toggle" aria-hidden=${isHidden}>
          ${
            filterIsMultiSelect.textContent.trim() === 'false'
              ? `<li class="ps-filter-category-item">
                <input type="radio" id="filter-all-${filterCategoryName}" name="filter-${filterCategoryName}" value="filter-all-${filterCategoryName}" data-filter-category="filter-${filterCategoryName}" checked />
                <label for="filter-all-${filterCategoryName}">All</label>
              </li>`
              : ``
          }
            ${filterOptionsMarkup}
        </ul>
      </div>
    `;
    return markup;
  };

  // TODO: Fix titleZa value in component-models.json and the below render logic
  filter.innerHTML = `
    <div class="ps-sort-content-wrapper">
      <label for="ps-sort-content" class="sr-only">Short by</label>
      <select name="ps-sort-content" id="ps-sort-content">
        <optgroup label="Date">
        <option value="desc-date">Sort by: Date (New → Old)</option>
        <option value="asc-date">Sort by: Date (Old → New)</option>
        </optgroup>
        <optgroup label="Title">
        <option value="asc-title">Sort by: Title (A → Z)</option>
        <option value="desc-title">Sort by: Title (Z → A)</option>
        </optgroup>
      </select>
    </div>
    <div class="ps-filter-category">
      <button class="ps-filter-category-toggle" id="ps-filter-category-1-toggle" aria-controls="ps-filter-category-1-content" aria-expanded="true">Filter by Geographies<span class="accordion-icon"></span></button>
      <ul class="ps-filter-category-content" id="ps-filter-category-1-content" aria-labelledby="ps-filter-category-1-toggle" aria-hidden="false">
        <li class="ps-filter-category-item">
          <input type="radio" id="filter-all-geographies" name="filter-geographies" value="filter-all-geographies" data-ps-filter-category="filter-geographies" checked />
          <label for="filter-all-geographies">All</label>
        </li>
        <li class="ps-filter-category-item">
          <input type="radio" id="filter-dach" name="filter-geographies" value="dach" data-ps-filter-category="filter-geographies" />
          <label for="filter-dach">DACH</label>
        </li>
        <li class="ps-filter-category-item">
          <input type="radio" id="filter-emea" name="filter-geographies" value="emea" data-ps-filter-category="filter-geographies" />
          <label for="filter-emea">EMEA</label>
        </li>
        <li class="ps-filter-category-item">
          <input type="radio" id="filter-north-america" name="filter-geographies" value="north-america" data-ps-filter-category="filter-geographies" />
          <label for="filter-north-america">North America</label>
        </li>
      </ul>
    </div>
    <div class="ps-filter-category">
      <button class="ps-filter-category-toggle" id="ps-filter-category-3-toggle" aria-controls="ps-filter-category-3-content" aria-expanded="true">Filter by Industries<span class="accordion-icon"></span></button>
      <ul class="ps-filter-category-content" id="ps-filter-category-3-content" aria-labelledby="ps-filter-category-3-toggle" aria-hidden="false">
        <li class="ps-filter-category-item">
          <input type="radio" id="filter-all-industries" name="filter-industries" value="filter-all-industries" data-ps-filter-category="filter-industries" checked />
          <label for="filter-all-industries">All</label>
        </li>
        <li class="ps-filter-category-item">
          <input type="radio" id="filter-industry-1" name="filter-industries" value="industry-1" data-ps-filter-category="filter-industries" />
          <label for="filter-industry-1">Industry One</label>
        </li>
        <li class="ps-filter-category-item">
          <input type="radio" id="filter-industry-2" name="filter-industries" value="industry-2" data-ps-filter-category="filter-industries" />
          <label for="filter-industry-2">Industry Two</label>
        </li>
        <li class="ps-filter-category-item">
          <input type="radio" id="filter-industry-3" name="filter-industries" value="industry-3" data-ps-filter-category="filter-industries" />
          <label for="filter-industry-3">Industry Three</label>
        </li>
        <li class="ps-filter-category-item">
          <input type="radio" id="filter-industry-4" name="filter-industries" value="industry-4" data-ps-filter-category="filter-industries" />
          <label for="filter-industry-4">Industry Four</label>
        </li>
      </ul>
    </div>
    <div class="ps-filter-category">
      <button class="ps-filter-category-toggle" id="ps-filter-category-4-toggle" aria-controls="ps-filter-category-4-content" aria-expanded="true">Filter by Partner Type<span class="accordion-icon"></span></button>
      <ul class="ps-filter-category-content" id="ps-filter-category-4-content" aria-labelledby="ps-filter-category-4-toggle" aria-hidden="false">
        <li class="ps-filter-category-item">
          <input type="radio" id="filter-all-partners" name="filter-partners" value="filter-all-partners" data-ps-filter-category="filter-partners" checked />
          <label for="filter-all-partners">All</label>
        </li>
        <li class="ps-filter-category-item">
          <input type="radio" id="filter-partner-1" name="filter-partners" value="partner-1" data-ps-filter-category="filter-partners" />
          <label for="filter-partner-1">Partner One</label>
        </li>
        <li class="ps-filter-category-item">
          <input type="radio" id="filter-partner-2" name="filter-partners" value="partner-2" data-ps-filter-category="filter-partners" />
          <label for="filter-partner-2">Partner Two</label>
        </li>
        <li class="ps-filter-category-item">
          <input type="radio" id="filter-partner-3" name="filter-partners" value="partner-3" data-ps-filter-category="filter-partners" />
          <label for="filter-partner-3">Partner Three</label>
        </li>
        <li class="ps-filter-category-item">
          <input type="radio" id="filter-partner-4" name="filter-partners" value="partner-4" data-ps-filter-category="filter-partners" />
          <label for="filter-partner-4">Partner Four</label>
        </li>
      </ul>
    </div>
    <div class="ps-filter-category">
      <button class="ps-filter-category-toggle" id="ps-filter-category-5-toggle" aria-controls="ps-filter-category-5-content" aria-expanded="true">Filter by Specializations<span class="accordion-icon"></span></button>
      <ul class="ps-filter-category-content" id="ps-filter-category-5-content" aria-labelledby="ps-filter-category-5-toggle" aria-hidden="false">
        <li class="ps-filter-category-item">
          <input type="checkbox" id="filter-specialization-one" name="specialization-one" value="specialization-one" data-ps-filter-category="filter-specializations" />
          <label for="filter-specialization-one">Specialization One</label>
        </li>
        <li class="ps-filter-category-item">
          <input type="checkbox" id="filter-specialization-two" name="specialization-two" value="specialization-two" data-ps-filter-category="filter-specializations" />
          <label for="filter-specialization-two">Specialization Two</label>
        </li>
        <li class="ps-filter-category-item">
          <input type="checkbox" id="filter-specialization-three" name="specialization-three" value="specialization-three" data-ps-filter-category="filter-specializations" />
          <label for="filter-specialization-three">Specialization Three</label>
        </li>
        <li class="ps-filter-category-item">
          <input type="checkbox" id="filter-specialization-four" name="specialization-four" value="specialization-four" data-ps-filter-category="filter-specializations" />
          <label for="filter-specialization-four">Specialization Four</label>
        </li>
        <li class="ps-filter-category-item">
          <input type="checkbox" id="filter-specialization-five" name="specialization-five" value="specialization-five" data-ps-filter-category="filter-specializations" />
          <label for="filter-specialization-five">Specialization Five</label>
        </li>
      </ul>
    </div>
  `;

  partnersContainer.innerHTML = `
    <li class="partner-card">
      <div class="partner-image"><img src="https://main--pricefx-eds--pricefx.hlx.live/learning-center/media_11996b9ef72021a10feff7cea83066a75572b7ef3.png?width=1200&amp;format=pjpg&amp;optimize=medium" alt="Article Image Alt"></div>
      <div class="partner-card-content">
        <div class="partner-categories">
          <a class="partner-categories-item" href="/" target="_blank">Robot Process Automation</a>
          <a class="partner-categories-item" href="/" target="_blank">Data Preparation</a>
          <a class="partner-categories-item" href="/" target="_blank">Data Science</a>
        </div>
        <div class="partner-cta-container">
          <a class="partner-link" href="/" target="_blank">Learn More</a>
        </div>
      </div>
    </li>
    <li class="partner-card">
      <div class="partner-image"><img src="https://main--pricefx-eds--pricefx.hlx.live/learning-center/media_11996b9ef72021a10feff7cea83066a75572b7ef3.png?width=1200&amp;format=pjpg&amp;optimize=medium" alt="Article Image Alt"></div>
      <div class="partner-card-content">
        <div class="partner-categories">
          <a class="partner-categories-item" href="/" target="_blank">Robot Process Automation</a>
          <a class="partner-categories-item" href="/" target="_blank">Data Preparation</a>
        </div>
        <div class="partner-cta-container">
          <a class="partner-link" href="/" target="_blank">Learn More</a>
        </div>
      </div>
    </li>
    <li class="partner-card">
      <div class="partner-image"><img src="https://main--pricefx-eds--pricefx.hlx.live/learning-center/media_11996b9ef72021a10feff7cea83066a75572b7ef3.png?width=1200&amp;format=pjpg&amp;optimize=medium" alt="Article Image Alt"></div>
      <div class="partner-card-content">
        <div class="partner-categories">
          <a class="partner-categories-item" href="/" target="_blank">Robot Process Automation</a>
          <a class="partner-categories-item" href="/" target="_blank">Data Preparation</a>
          <a class="partner-categories-item" href="/" target="_blank">Data Science</a>
        </div>
        <div class="partner-cta-container">
          <a class="partner-link" href="/" target="_blank">Learn More</a>
        </div>
      </div>
    </li>
    <li class="partner-card">
      <div class="partner-image"><img src="https://main--pricefx-eds--pricefx.hlx.live/learning-center/media_11996b9ef72021a10feff7cea83066a75572b7ef3.png?width=1200&amp;format=pjpg&amp;optimize=medium" alt="Article Image Alt"></div>
      <div class="partner-card-content">
        <div class="partner-categories">
          <a class="partner-categories-item" href="/" target="_blank">Robot Process Automation</a>
          <a class="partner-categories-item" href="/" target="_blank">Data Preparation</a>
          <a class="partner-categories-item" href="/" target="_blank">Data Science</a>
        </div>
        <div class="partner-cta-container">
          <a class="partner-link" href="/" target="_blank">Learn More</a>
        </div>
      </div>
    </li>
    <li class="partner-card">
      <div class="partner-image"><img src="https://main--pricefx-eds--pricefx.hlx.live/learning-center/media_11996b9ef72021a10feff7cea83066a75572b7ef3.png?width=1200&amp;format=pjpg&amp;optimize=medium" alt="Article Image Alt"></div>
      <div class="partner-card-content">
        <div class="partner-categories">
          <a class="partner-categories-item" href="/" target="_blank">Robot Process Automation</a>
        </div>
        <div class="partner-cta-container">
          <a class="partner-link" href="/" target="_blank">Learn More</a>
        </div>
      </div>
    </li>
    <li class="partner-card">
      <div class="partner-image"><img src="https://main--pricefx-eds--pricefx.hlx.live/learning-center/media_11996b9ef72021a10feff7cea83066a75572b7ef3.png?width=1200&amp;format=pjpg&amp;optimize=medium" alt="Article Image Alt"></div>
      <div class="partner-card-content">
        <div class="partner-categories">
          <a class="partner-categories-item" href="/" target="_blank">Robot Process Automation</a>
          <a class="partner-categories-item" href="/" target="_blank">Data Preparation</a>
          <a class="partner-categories-item" href="/" target="_blank">Data Science</a>
        </div>
        <div class="partner-cta-container">
          <a class="partner-link" href="/" target="_blank">Learn More</a>
        </div>
      </div>
    </li>
    <li class="partner-card">
      <div class="partner-image"><img src="https://main--pricefx-eds--pricefx.hlx.live/learning-center/media_11996b9ef72021a10feff7cea83066a75572b7ef3.png?width=1200&amp;format=pjpg&amp;optimize=medium" alt="Article Image Alt"></div>
      <div class="partner-card-content">
        <div class="partner-categories">
          <a class="partner-categories-item" href="/" target="_blank">Robot Process Automation</a>
          <a class="partner-categories-item" href="/" target="_blank">Data Preparation</a>
          <a class="partner-categories-item" href="/" target="_blank">Data Science</a>
        </div>
        <div class="partner-cta-container">
          <a class="partner-link" href="/" target="_blank">Learn More</a>
        </div>
      </div>
    </li>
  `;

  paginationContainer.innerHTML = `
    ${Number(numberOfPartners.textContent.trim()) > defaultSortedPartners.length ? '' : `<button class="pagination-prev hidden" aria-label="Previous Page">${LEFTCHEVRON}</button>`}
    <ul class="pagination-pages-list">
      ${renderPages(numberOfPartners.textContent.trim(), defaultSortedPartners, 1)}
    </ul>
    ${Number(numberOfPartners.textContent.trim()) > defaultSortedPartners.length ? '' : `<button class="pagination-next" aria-label="Nexst Page">${RIGHTCHEVRON}</button>`}
  `;
}
