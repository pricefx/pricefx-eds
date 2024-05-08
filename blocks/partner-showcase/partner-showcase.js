import { LEFTCHEVRON, RIGHTCHEVRON } from '../../scripts/constants.js';

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
  partnerShowcaseWrapper.append(filterControls);

  const flexContainer = document.createElement('div');
  flexContainer.classList.add('flex-container');
  partnerShowcaseWrapper.append(flexContainer);

  const filter = document.createElement('div');
  filter.classList.add('ps-filter-wrapper');
  filter.id = 'ps-filter-menu';
  filter.setAttribute('aria-labelledby', 'ps-filter-menu-toggle');
  filter.setAttribute('aria-hidden', 'false');
  flexContainer.append(filter);

  const partnerShowcaseContent = document.createElement('div');
  partnerShowcaseContent.classList.add('partner-showcase-content');
  const partnersContainer = document.createElement('ul');
  partnersContainer.classList.add('ps-partners-container');
  flexContainer.append(partnerShowcaseContent);
  partnerShowcaseContent.append(partnersContainer);

  const paginationContainer = document.createElement('div');
  paginationContainer.classList.add('pagination-wrapper');
  partnerShowcaseContent.append(paginationContainer);

  filterControls.innerHTML = `
    <button class="ps-filter-menu-toggle" id="ps-filter-menu-toggle" aria-controls="ps-filter-menu" aria-expanded="true"><span class="filter-icon"></span><span class="toggle-label">Hide Filters</span></button>
  `;

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
    <button class="pagination-prev" aria-label="Previous Page">${LEFTCHEVRON}</button>
    <ul class="pagination-page-list">
      <li class="pagination-page" id="ps-page-1"><button>1</button></li>
      <li class="pagination-page" id="ps-page-2"><button>2</button></li>
      <li class="pagination-page" id="ps-page-3"><button>3</button></li>
      <li class="pagination-page"><span>...</span></li>
      <li class="pagination-page" id="ps-page-6"><button>6</button></li>
    </ul>
    <button class="pagination-next" aria-label="Nexst Page">${RIGHTCHEVRON}</button>
  `;
}
