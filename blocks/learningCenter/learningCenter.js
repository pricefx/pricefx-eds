const isDesktop = window.matchMedia('(min-width: 986px)');

// Reset Filter Accordions to Default State
const resetFilterAccordions = (filterToggle) => {
  const filterContent = filterToggle.nextElementSibling;
  const contentScroll = filterContent.scrollHeight;

  filterContent.style.visibility = 'visible';
  filterContent.style.maxHeight = `${contentScroll}px`;

  filterContent.setAttribute('aria-hidden', 'false');
  filterToggle.setAttribute('aria-expanded', 'true');
};

// Toggle Filter Accordions
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

// Toggle Filter Sidebar
const toggleFilterMenu = (filterMenuToggle, filterMenu) => {
  const filterMenuToggleAriaExpanded = filterMenuToggle.attributes[3].value;
  const setfilterMenuToggleAriaExpanded = filterMenuToggleAriaExpanded === 'false' ? 'true' : 'false';
  filterMenuToggle.setAttribute('aria-expanded', setfilterMenuToggleAriaExpanded);

  if (filterMenuToggleAriaExpanded === 'false') {
    filterMenu.focus();
    filterMenuToggle.innerHTML = `<span class="filter-icon"></span><span class="toggle-label">Hide Filter</span>`;
  } else {
    filterMenu.blur();
    filterMenuToggle.innerHTML = `<span class="filter-icon"></span><span class="toggle-label">Show Filter</span>`;
    const filterAccordions = document.querySelectorAll('.filter-category-toggle');
    filterAccordions.forEach((accordion) => {
      resetFilterAccordions(accordion);
    });
  }

  const filterMenuAriaHidden = filterMenu.attributes[3].value;
  const setFilterMenuAriaHidden = filterMenuAriaHidden === 'false' ? 'true' : 'false';
  filterMenu.setAttribute('aria-hidden', setFilterMenuAriaHidden);
};

// Decorates Learning Center on DOM
export default async function decorate(block) {
  // block.innerHTML = '';
  const placeholderLearningCenter = document.createElement('div');
  placeholderLearningCenter.classList.add('learning-center-wrapper');
  block.append(placeholderLearningCenter);

  const placeholderFilterControls = document.createElement('div');
  placeholderFilterControls.classList.add('filter-controls');
  placeholderLearningCenter.append(placeholderFilterControls);

  const flexContainer = document.createElement('div');
  flexContainer.classList.add('flex-container');
  placeholderLearningCenter.append(flexContainer);

  const placeholderFilter = document.createElement('div');
  placeholderFilter.classList.add('filter-wrapper');
  placeholderFilter.id = 'filter-menu';
  placeholderFilter.setAttribute('aria-labelledby', 'filter-menu-toggle');
  placeholderFilter.setAttribute('aria-hidden', 'false');
  flexContainer.append(placeholderFilter);

  const placeholderContent = document.createElement('div');
  placeholderContent.classList.add('learning-center-content');
  flexContainer.append(placeholderContent);

  placeholderFilterControls.innerHTML = `
    <button class="filter-menu-toggle" id="filter-menu-toggle" aria-controls="filter-menu" aria-expanded="true"><span class="filter-icon"></span><span class="toggle-label">Hide Filter</span></button>
    <div class="sort-content-wrapper">
      <label for="sort-content" class="sr-only">Short by</label>
      <select name="sort-content" id="sort-content">
        <option value="" selected disabled>Sort by</option>
        <optgroup label="Date">
          <option value="date-desc">Date (New → Old)</option>
          <option value="date-asc">Date (Old → New)</option>
        </optgroup>
        <optgroup label="Title">
          <option value="title-desc">Title (A → Z)</option>
          <option value="title-asc">Title (Z → A)</option>
        </optgroup>
      </select>
    </div>
  `;
  const filterMenuToggle = document.querySelector('.filter-menu-toggle');
  filterMenuToggle.addEventListener('click', () => {
    toggleFilterMenu(filterMenuToggle, placeholderFilter);
  });

  if (!isDesktop.matches && filterMenuToggle.getAttribute('aria-expanded') === 'true') {
    filterMenuToggle.setAttribute('aria-expanded', 'false');
    placeholderFilter.setAttribute('aria-hidden', 'true');
  }

  placeholderFilter.innerHTML = `
    <div class="filter-search-wrapper">
      <label for="filter-search" class="sr-only">Search</label>
      <input type="text" name="filter-search" id="filter-search" placeholder="Search" />
      <button type="submit"></button>
    </div>
    <div class="filter-category">
      <button class="filter-category-toggle" id="filter-category-1-toggle" aria-controls="filter-category-1-content" aria-expanded="true">Filter by Content Type <span class="accordion-icon"></span></button>
      <ul class="filter-category-content" id="filter-category-1-content" aria-labelledby="filter-category-1-toggle" aria-hidden="false">
        <li class="filter-category-item">
          <input type="radio" id="filter-all" name="filter-type" value="filter-all" />
          <label for="filter-all">All</label>
        </li>
        <li class="filter-category-item">
          <input type="radio" id="filter-analyst-reports" name="filter-type" value="filter-analyst-reports" />
          <label for="filter-analyst-reports">Analyst Reports</label>
        </li>
        <li class="filter-category-item">
          <input type="radio" id="filter-articles" name="filter-type" value="filter-articles" />
          <label for="filter-articles">Articles</label>
        </li>
        <li class="filter-category-item">
          <input type="radio" id="filter-ebooks" name="filter-type" value="filter-ebooks" />
          <label for="filter-ebooks">E-Books</label>
        </li>
        <li class="filter-category-item">
          <input type="radio" id="filter-podcasts" name="filter-type" value="filter-podcasts" />
          <label for="filter-podcasts">Podcasts</label>
        </li>
        <li class="filter-category-item">
          <input type="radio" id="filter-case-study" name="filter-type" value="filter-case-study" />
          <label for="filter-case-study">Case Study</label>
        </li>
        <li class="filter-category-item">
          <input type="radio" id="filter-videos" name="filter-type" value="filter-videos" />
          <label for="filter-videos">Videos</label>
        </li>
      </ul>
    </div>
    <div class="filter-category">
      <button class="filter-category-toggle" id="filter-category-2-toggle" aria-controls="filter-category-2-content" aria-expanded="true">Filter by Industry <span class="accordion-icon"></span></button>
      <ul class="filter-category-content" id="filter-category-2-content" aria-labelledby="filter-category-2-toggle" aria-hidden="false">
        <li class="filter-category-item">
          <input type="radio" id="filter-discrete-manufacturing" name="filter-industry" value="filter-discrete-manufacturing" />
          <label for="filter-discrete-manufacturing">Discrete Manufacturing</label>
        </li>
        <li class="filter-category-item">
          <input type="radio" id="filter-distribution" name="filter-industry" value="filter-distribution" />
          <label for="filter-distribution">Distribution</label>
        </li>
        <li class="filter-category-item">
          <input type="radio" id="filter-food-and-beverage" name="filter-industry" value="filter-food-and-beverage" />
          <label for="filter-food-and-beverage">Food and Beverage</label>
        </li>
        <li class="filter-category-item">
          <input type="radio" id="filter-chemicals" name="filter-industry" value="filter-chemicals" />
          <label for="filter-chemicals">Chemicals</label>
        </li>
        <li class="filter-category-item">
          <input type="radio" id="filter-retail" name="filter-industry" value="filter-retail" />
          <label for="filter-retail">Retail</label>
        </li>
      </ul>
    </div>
    <div class="filter-category">
      <button class="filter-category-toggle" id="filter-category-3-toggle" aria-controls="filter-category-3-content" aria-expanded="true">Filter by Role <span class="accordion-icon"></span></button>
      <ul class="filter-category-content" id="filter-category-3-content" aria-labelledby="filter-category-3-toggle" aria-hidden="false">
        <li class="filter-category-item">
          <input type="radio" id="filter-c-suite" name="filter-role" value="filter-c-suite" />
          <label for="filter-c-suite">C-Suite</label>
        </li>
        <li class="filter-category-item">
          <input type="radio" id="filter-finance-leaders" name="filter-role" value="filter-finance-leaders" />
          <label for="filter-finance-leaders">Finance Leaders</label>
        </li>
        <li class="filter-category-item">
          <input type="radio" id="filter-pricing-professional" name="filter-role" value="filter-pricing-professional" />
          <label for="filter-pricing-professional">Pricing Professional</label>
        </li>
        <li class="filter-category-item">
          <input type="radio" id="filter-sales-and-marketing" name="filter-role" value="filter-sales-and-marketing" />
          <label for="filter-sales-and-marketing">Sales and Marketing</label>
        </li>
      </ul>
    </div>
    <div class="filter-category">
      <button class="filter-category-toggle" id="filter-category-4-toggle" aria-controls="filter-category-4-content" aria-expanded="true">Life at Pricefx <span class="accordion-icon"></span></button>
      <ul class="filter-category-content" id="filter-category-4-content" aria-labelledby="filter-category-4-toggle" aria-hidden="false">
        <li class="filter-category-item">
          <input type="radio" id="filter-pfx-all" name="filter-pfx" value="filter-pfx-all" />
          <label for="filter-pfx-all">All</label>
        </li>
        <li class="filter-category-item">
          <input type="radio" id="filter-pfx-culture" name="filter-pfx" value="filter-pfx-culture" />
          <label for="filter-pfx-culture">Culture</label>
        </li>
      </ul>
    </div>
  `;
  const filterContents = document.querySelectorAll('.filter-category-content');
  filterContents.forEach((content) => {
    const contentScroll = content.scrollHeight;
    content.style.visibility = 'visible';
    content.style.maxHeight = `${contentScroll}px`;
  });

  const filterAccordionToggles = document.querySelectorAll('.filter-category-toggle');
  filterAccordionToggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      toggleFilterAccordion(toggle);
    });
  });

  placeholderContent.innerHTML = `
    <div class="featured-article">
      <div class="article-image"><img src="https://s3-alpha-sig.figma.com/img/4235/533a/eb03da8498827e68548e694c8568f248?Expires=1714953600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=hrblGrQhCThrV63jZ6mNcLAtihHcdtxOtUj~LvOsGBnJx4gnWGDTfq-c3EmRkcVFBrD05bArgScAZpkOl7JCeu7eTyQg6FoI7Ou63iaFqjbGzUR22-BdnqaERgOL81R3XxBG4eRLwS37nxV145MWT4xK48v5Qt6p1ixUMfxM60IHeW4nF7-4cWBdKvYUdZjNQ4F~2uoSGweWWCxL11XE5-~2oySQ5z8PS2VrNh04CsVj1~a7HXuL5QhpbWCRv1vtg5k7hdHBYw51G32T8N1oyoh30JGLuQyi4IicGxYtMtQANjLJDWuwktBibjK8Ad5Gczf1XE3rt7OhGNzAIUJSZQ__" alt="Article title"></div>
      <div class="article-content">
        <div class="article-details">
          <p class="article-subtitle">Articles</p>
          <h3 class="article-title">Pricefx Reviews: The Good, the Bad, the Ugly & Our Responses</h3>
          <p class="article-info">By <a class="article-author-link" href="/">Jose Paez</a> on April 25, 2023</p>
        </div>
        <div class="article-cta-container">
          <a class="article-link" href="/">Read Now</a>
          <p class="article-readtime">12 min read</p>
        </div>
      </div>
    </div>
    <div class="articles-container">
      <div class="article-card">
        <div class="article-image"><img src="https://s3-alpha-sig.figma.com/img/4235/533a/eb03da8498827e68548e694c8568f248?Expires=1714953600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=hrblGrQhCThrV63jZ6mNcLAtihHcdtxOtUj~LvOsGBnJx4gnWGDTfq-c3EmRkcVFBrD05bArgScAZpkOl7JCeu7eTyQg6FoI7Ou63iaFqjbGzUR22-BdnqaERgOL81R3XxBG4eRLwS37nxV145MWT4xK48v5Qt6p1ixUMfxM60IHeW4nF7-4cWBdKvYUdZjNQ4F~2uoSGweWWCxL11XE5-~2oySQ5z8PS2VrNh04CsVj1~a7HXuL5QhpbWCRv1vtg5k7hdHBYw51G32T8N1oyoh30JGLuQyi4IicGxYtMtQANjLJDWuwktBibjK8Ad5Gczf1XE3rt7OhGNzAIUJSZQ__" alt="Article title"></div>
        <div class="article-content">
          <p class="article-subtitle">Articles</p>
          <h3 class="article-title">Pricefx Reviews: The Good, the Bad, the Ugly & Our Responses</h3>
          <p class="article-info">By <a class="article-author-link" href="/">Jose Paez</a> on April 25, 2023</p>
        </div>
        <div class="article-cta-container">
          <a class="article-link" href="/">Read Now</a>
          <p class="article-readtime">12 min read</p>
        </div>
      </div>
      <div class="article-card">
        <div class="article-image"><img src="https://s3-alpha-sig.figma.com/img/4235/533a/eb03da8498827e68548e694c8568f248?Expires=1714953600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=hrblGrQhCThrV63jZ6mNcLAtihHcdtxOtUj~LvOsGBnJx4gnWGDTfq-c3EmRkcVFBrD05bArgScAZpkOl7JCeu7eTyQg6FoI7Ou63iaFqjbGzUR22-BdnqaERgOL81R3XxBG4eRLwS37nxV145MWT4xK48v5Qt6p1ixUMfxM60IHeW4nF7-4cWBdKvYUdZjNQ4F~2uoSGweWWCxL11XE5-~2oySQ5z8PS2VrNh04CsVj1~a7HXuL5QhpbWCRv1vtg5k7hdHBYw51G32T8N1oyoh30JGLuQyi4IicGxYtMtQANjLJDWuwktBibjK8Ad5Gczf1XE3rt7OhGNzAIUJSZQ__" alt="Article title"></div>
        <div class="article-content">
          <p class="article-subtitle">Articles</p>
          <h3 class="article-title">Pricefx Reviews: The Good, the Bad, the Ugly & Our Responses</h3>
          <p class="article-info">By <a class="article-author-link" href="/">Jose Paez</a> on April 25, 2023</p>
        </div>
        <div class="article-cta-container">
          <a class="article-link" href="/">Read Now</a>
          <p class="article-readtime">12 min read</p>
        </div>
      </div>
      <div class="article-card">
        <div class="article-image"><img src="https://s3-alpha-sig.figma.com/img/4235/533a/eb03da8498827e68548e694c8568f248?Expires=1714953600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=hrblGrQhCThrV63jZ6mNcLAtihHcdtxOtUj~LvOsGBnJx4gnWGDTfq-c3EmRkcVFBrD05bArgScAZpkOl7JCeu7eTyQg6FoI7Ou63iaFqjbGzUR22-BdnqaERgOL81R3XxBG4eRLwS37nxV145MWT4xK48v5Qt6p1ixUMfxM60IHeW4nF7-4cWBdKvYUdZjNQ4F~2uoSGweWWCxL11XE5-~2oySQ5z8PS2VrNh04CsVj1~a7HXuL5QhpbWCRv1vtg5k7hdHBYw51G32T8N1oyoh30JGLuQyi4IicGxYtMtQANjLJDWuwktBibjK8Ad5Gczf1XE3rt7OhGNzAIUJSZQ__" alt="Article title"></div>
        <div class="article-content">
          <p class="article-subtitle">Articles</p>
          <h3 class="article-title">Pricefx Reviews: The Good, the Bad, the Ugly & Our Responses</h3>
          <p class="article-info">By <a class="article-author-link" href="/">Jose Paez</a> on April 25, 2023</p>
        </div>
        <div class="article-cta-container">
          <a class="article-link" href="/">Read Now</a>
          <p class="article-readtime">12 min read</p>
        </div>
      </div>
      <div class="article-card">
        <div class="article-image"><img src="https://s3-alpha-sig.figma.com/img/4235/533a/eb03da8498827e68548e694c8568f248?Expires=1714953600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=hrblGrQhCThrV63jZ6mNcLAtihHcdtxOtUj~LvOsGBnJx4gnWGDTfq-c3EmRkcVFBrD05bArgScAZpkOl7JCeu7eTyQg6FoI7Ou63iaFqjbGzUR22-BdnqaERgOL81R3XxBG4eRLwS37nxV145MWT4xK48v5Qt6p1ixUMfxM60IHeW4nF7-4cWBdKvYUdZjNQ4F~2uoSGweWWCxL11XE5-~2oySQ5z8PS2VrNh04CsVj1~a7HXuL5QhpbWCRv1vtg5k7hdHBYw51G32T8N1oyoh30JGLuQyi4IicGxYtMtQANjLJDWuwktBibjK8Ad5Gczf1XE3rt7OhGNzAIUJSZQ__" alt="Article title"></div>
        <div class="article-content">
          <p class="article-subtitle">Articles</p>
          <h3 class="article-title">Pricefx Reviews: The Good, the Bad, the Ugly & Our Responses</h3>
          <p class="article-info">By <a class="article-author-link" href="/">Jose Paez</a> on April 25, 2023</p>
        </div>
        <div class="article-cta-container">
          <a class="article-link" href="/">Read Now</a>
          <p class="article-readtime">12 min read</p>
        </div>
      </div>
      <div class="article-card">
        <div class="article-image"><img src="https://s3-alpha-sig.figma.com/img/4235/533a/eb03da8498827e68548e694c8568f248?Expires=1714953600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=hrblGrQhCThrV63jZ6mNcLAtihHcdtxOtUj~LvOsGBnJx4gnWGDTfq-c3EmRkcVFBrD05bArgScAZpkOl7JCeu7eTyQg6FoI7Ou63iaFqjbGzUR22-BdnqaERgOL81R3XxBG4eRLwS37nxV145MWT4xK48v5Qt6p1ixUMfxM60IHeW4nF7-4cWBdKvYUdZjNQ4F~2uoSGweWWCxL11XE5-~2oySQ5z8PS2VrNh04CsVj1~a7HXuL5QhpbWCRv1vtg5k7hdHBYw51G32T8N1oyoh30JGLuQyi4IicGxYtMtQANjLJDWuwktBibjK8Ad5Gczf1XE3rt7OhGNzAIUJSZQ__" alt="Article title"></div>
        <div class="article-content">
          <p class="article-subtitle">Articles</p>
          <h3 class="article-title">Pricefx Reviews: The Good, the Bad, the Ugly & Our Responses</h3>
          <p class="article-info">By <a class="article-author-link" href="/">Jose Paez</a> on April 25, 2023</p>
        </div>
        <div class="article-cta-container">
          <a class="article-link" href="/">Read Now</a>
          <p class="article-readtime">12 min read</p>
        </div>
      </div>
    </div>
  `;
}
