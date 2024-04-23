import ffetch from '../../scripts/ffetch.js';
import { SEARCH } from '../../scripts/constants.js';

const isDesktop = window.matchMedia('(min-width: 986px)');

// Fetch Header content from JSON endpoint
const headerData = await ffetch('/header.json').all();

// Toggle Header opacity based on scroll position
window.addEventListener('scroll', () => {
  const scrollPosition = window.scrollY;
  const headerEl = document.querySelector('header');

  if (scrollPosition >= 107) {
    headerEl.classList.add('header-opacity');
  } else {
    headerEl.classList.remove('header-opacity');
  }
});

/**
 * Reset All Mobile Navigation Accordions
 * @param {Element} navToggle The toggle that show/hide the mobile navigation
 */
const resetAllMobileNavAccordion = (navToggle) => {
  const navListContent = navToggle.nextElementSibling;

  navListContent.style.visibility = 'hidden';
  navListContent.style.maxHeight = '0px';

  navListContent.setAttribute('aria-hidden', 'true');
  navToggle.setAttribute('aria-expanded', 'false');
};

/**
 * Toggle Mobile Hamburger Nav
 * @param {Element} hamburger The toggle that show/hide the mobile navigation
 * @param {Element} mobileNav The container holding the mobile navigation
 */
const toggleHamburgerNav = (hamburger, mobileNav) => {
  const bodyEl = document.querySelector('body');
  const hamburgerAriaExpanded = hamburger.attributes[4].value;
  const setHamburgerAriaExpanded = hamburgerAriaExpanded === 'false' ? 'true' : 'false';
  hamburger.setAttribute('aria-expanded', setHamburgerAriaExpanded);

  if (hamburgerAriaExpanded === 'false') {
    mobileNav.focus();
    hamburger.setAttribute('aria-label', 'Close Mobile Navigation');
    if (!isDesktop.matches) {
      bodyEl.classList.add('scroll-lock');
    }
  } else {
    mobileNav.blur();
    hamburger.setAttribute('aria-label', 'Open Mobile Navigation');
    const mobileNavAccordions = document.querySelectorAll('.nav-mobile-list-level-1-item-toggle');
    mobileNavAccordions.forEach((accordion) => {
      resetAllMobileNavAccordion(accordion);
    });
    if (!isDesktop.matches) {
      bodyEl.classList.remove('scroll-lock');
    }
  }

  const navMobileAriaHidden = mobileNav.attributes[3].value;
  const setNavMobileAriaHidden = navMobileAriaHidden === 'false' ? 'true' : 'false';
  mobileNav.setAttribute('aria-hidden', setNavMobileAriaHidden);
  mobileNav.classList.toggle('mobile-nav-open');
};

// Close Mobile Navigation on ESC Key
const closeMobileNavOnEscape = (e) => {
  if (e.code === 'Escape') {
    const navToggle = document.getElementById('hamburger-nav');
    const mobileNav = document.getElementById('mobile-nav-wrapper');
    if (navToggle.getAttribute('aria-expanded') === 'true') {
      toggleHamburgerNav(navToggle, mobileNav);
    }
  }
};
window.addEventListener('keydown', closeMobileNavOnEscape);

const closeDesktopNavOnEscape = (e) => {
  if (e.code === 'Escape' && isDesktop.matches) {
    const allMegamenu = document.querySelectorAll('.desktop-header .megamenu-wrapper');
    allMegamenu.forEach((megamenu) => megamenu.classList.remove('megamenu-wrapper--active'));
  }
};
window.addEventListener('keydown', closeDesktopNavOnEscape);

/**
 * Toggle Mobile Navigation Accordions
 * @param {Element} navToggle The toggle that show/hide the mobile navigation
 */
const toggleMobileNavAccordion = (navToggle) => {
  const navListContent = navToggle.nextElementSibling;
  const navScroll = navListContent.scrollHeight;

  if (!navListContent.style.maxHeight) {
    navListContent.style.visibility = 'visible';
    navListContent.style.maxHeight = `${navScroll}px`;
  } else if (navListContent.style.maxHeight === '0px') {
    navListContent.style.visibility = 'visible';
    navListContent.style.maxHeight = `${navScroll}px`;
  } else {
    navListContent.style.visibility = 'hidden';
    navListContent.style.maxHeight = '0px';
  }

  const ariaHiddenState = navListContent.attributes[3].value;
  const setAriaHidden = ariaHiddenState === 'true' ? 'false' : 'true';
  navListContent.setAttribute('aria-hidden', setAriaHidden);

  const ariaExpandedState = navToggle.attributes[3].value;
  const setAriaExpanded = ariaExpandedState === 'false' ? 'true' : 'false';
  navToggle.setAttribute('aria-expanded', setAriaExpanded);
};

// FILTER JS LOGICS
const resetFilterAccordions = (filterToggle) => {
  const filterContent = filterToggle.nextElementSibling;
  const contentScroll = filterContent.scrollHeight;

  filterContent.style.visibility = 'visible';
  filterContent.style.maxHeight = `${contentScroll}px`;

  filterContent.setAttribute('aria-hidden', 'false');
  filterToggle.setAttribute('aria-expanded', 'true');
};

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

/**
 * Decorates the Header and Megamenu
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  block.innerHTML = '';
  const desktopHeader = document.createElement('div');
  desktopHeader.classList.add('desktop-header', 'desktop-view');
  const mobileHeader = document.createElement('div');
  mobileHeader.classList.add('mobile-header', 'mobile-view');
  block.append(desktopHeader);
  block.append(mobileHeader);

  // -----------------------------
  // FOR DESKTOP HEADER & MEGAMENU
  // Render Desktop Brand Logo
  const brandWrapperDesktop = document.createElement('div');
  brandWrapperDesktop.classList.add('brand');
  brandWrapperDesktop.innerHTML = `
    <a class="brand-logo-wrapper" href="/"><img src="../../icons/price-fx-logo.png" alt="Pricefx" loading="lazy"></a>
  `;
  desktopHeader.append(brandWrapperDesktop);

  // Render Navigation
  const nav = document.createElement('nav');
  nav.classList.add('header-nav');
  nav.id = 'header-nav';
  desktopHeader.append(nav);

  const navLevelOne = document.createElement('ul');
  navLevelOne.classList.add('nav-list-level-1');

  // Render Level 3 Navigation
  const groupByLevelTwo = Object.groupBy(headerData, (data) => data['Level 2'].trim());
  const renderLevelThreeItems = (navLabel) => {
    const navLevelThreeNames = [];
    let markup = '';
    groupByLevelTwo[navLabel].forEach((group) => {
      navLevelThreeNames.push(group['Level 3']);
    });
    const uniqueNavLevelThreeNames = [...new Set(navLevelThreeNames)];
    uniqueNavLevelThreeNames.forEach((level3Label) => {
      if (level3Label.includes('|')) {
        const linkInfoArray = level3Label.split('|');
        markup += `
          <li class="nav-list-level-3-item">
            <a href="${linkInfoArray[1].trim()}" target="${linkInfoArray.length === 3 ? linkInfoArray[2].trim() : '_self'}" tabindex="0">${linkInfoArray[0].trim()}</a>
          </li>
        `;
      }
    });
    return markup;
  };

  // Render Level 2 Navigation
  const groupByLevelOne = Object.groupBy(headerData, (data) => data['Level 1'].trim());
  const renderLevelTwoItems = (navLabel) => {
    const navLevelTwoNames = [];
    const navLevelThreeNames = [];
    let markup = '';
    groupByLevelOne[navLabel].forEach((group) => {
      navLevelTwoNames.push(group['Level 2']);
      if (group['Level 2'] === '') {
        navLevelThreeNames.push(group['Level 3']);
      }
    });
    const uniqueNavLevelTwoNames = [...new Set(navLevelTwoNames)];
    uniqueNavLevelTwoNames.forEach((level2Label) => {
      if (level2Label.includes('|')) {
        const linkInfoArray = level2Label.split('|');
        markup += `
          <li class="nav-list-level-2-item">
            <a href="${linkInfoArray[1].trim()}" target="${linkInfoArray.length >= 2 ? linkInfoArray[2].trim() : '_self'}" ${linkInfoArray.length >= 2 ? "class='level-2-item-link'" : ''} tabindex="0">${linkInfoArray[0].trim()}</a>
          </li>
        `;
      } else if (!level2Label.includes('|') && level2Label !== '') {
        markup += `
          <li class="nav-list-level-2-item category">
            <span class="nav-list-level-2-item-category">${level2Label}</span>
            <ul class="nav-list-level-3">
              ${renderLevelThreeItems(level2Label)}
            </ul>
          </li>
        `;
      } else if (level2Label === '') {
        let childMarkup = '';
        navLevelThreeNames.forEach((level3Label) => {
          if (level3Label.includes('|')) {
            const linkInfoArray = level3Label.split('|');
            childMarkup += `
              <li class="nav-list-level-2-item no-category">
                <a href="${linkInfoArray[1].trim()}" target="${linkInfoArray.length === 3 ? linkInfoArray[2].trim() : '_self'}" tabindex="0">${linkInfoArray[0].trim()}</a>
              </li>
            `;
          }
        });
        markup = `
          <ul class="no-category-wrapper">
            ${childMarkup}
          </ul>
        `;
      }
    });
    return markup;
  };

  // Render Level 1 Navigation
  const navLevelOneNames = [];
  headerData.forEach((dataItem) => {
    navLevelOneNames.push(dataItem['Level 1'].trim());
  });
  const uniqueNavLevelOneNames = [...new Set(navLevelOneNames)];

  const renderLevelOneItems = (navLabels) => {
    let markup = '';
    navLabels.forEach((navLabel) => {
      markup += `
        <li class="nav-list-level-1-item" tabindex="0" role="button" aria-haspopup="menu">
          <span class="nav-list-level-1-item-name">${navLabel}</span>
          <div class="megamenu-wrapper">
            <ul class="nav-list-level-2 nav-list-level-2-${navLabels.indexOf(navLabel) + 1}">
              ${renderLevelTwoItems(navLabel)}
            </ul>
          </div>
        </li>
      `;
    });
    navLevelOne.innerHTML = markup;
  };
  renderLevelOneItems(uniqueNavLevelOneNames);
  nav.append(navLevelOne);

  // Render Header Search
  const searchWrapperDesktop = document.createElement('div');
  searchWrapperDesktop.classList.add('search-wrapper');
  searchWrapperDesktop.innerHTML = `
    <button class="header-search-cta" aria-label="Search">
      ${SEARCH}
    </button>
    <div class="search-input-wrapper">
      <button type="submit">
        ${SEARCH}
      </button>
      <input type="text" name="search" aria-label="Search" placeholder="Search pricefx.com">
    </div>
  `;
  nav.insertAdjacentElement('afterend', searchWrapperDesktop);

  // Render Talk to an Expert CTA
  const expertCta = document.createElement('a');
  expertCta.classList.add('expert-cta');
  expertCta.href = '/pricing-software-demo';
  expertCta.textContent = 'Talk to an Expert';
  expertCta.setAttribute('target', '_blank');
  desktopHeader.insertAdjacentElement('beforeend', expertCta);

  // Desktop Keyboard Navigation
  const allNavListLevelOne = document.querySelectorAll('.nav-list-level-1-item');
  const allMegamenu = document.querySelectorAll('.desktop-header .megamenu-wrapper');
  const allMegamenuLinks = document.querySelectorAll('.desktop-header .megamenu-wrapper a');
  const searchToggle = searchWrapperDesktop.querySelector('.header-search-cta');
  allNavListLevelOne.forEach((navListLevelOne) => {
    navListLevelOne.addEventListener('focus', () => {
      allMegamenu.forEach((megamenu) => megamenu.classList.remove('megamenu-wrapper--active'));
      window.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && isDesktop.matches) {
          navListLevelOne.blur();
        }
      });
    });
  });
  allMegamenuLinks.forEach((link) => {
    link.addEventListener('focus', () => {
      allMegamenu.forEach((megamenu) => megamenu.classList.remove('megamenu-wrapper--active'));
      const activeMegamenu = link.closest('.megamenu-wrapper');
      activeMegamenu.classList.add('megamenu-wrapper--active');
    });
  });
  searchToggle.addEventListener('focus', () => {
    allMegamenu.forEach((megamenu) => megamenu.classList.remove('megamenu-wrapper--active'));
  });

  // ----------------------------
  // FOR MOBILE HEADER & MEGAMENU
  // Render Mobile Brand Logo
  const brandWrapperMobile = document.createElement('div');
  brandWrapperMobile.classList.add('brand');
  const brandLogo = `<a class="brand-logo-wrapper" href="/"><img src="../../icons/price-fx-logo-white.png" alt="Pricefx" loading="lazy"></a>`;
  brandWrapperMobile.innerHTML = brandLogo;
  mobileHeader.append(brandWrapperMobile);

  const mobileNavControlWrapper = document.createElement('div');
  mobileNavControlWrapper.classList.add('mobile-nav-control-wrapper');
  mobileHeader.append(mobileNavControlWrapper);

  // Render Mobile Header Search
  const searchWrapperMobile = document.createElement('div');
  searchWrapperMobile.classList.add('search-wrapper');
  searchWrapperMobile.innerHTML = `
    <button class="header-search-cta" aria-label="Search">
      ${SEARCH}
    </button>
    <div class="search-input-wrapper">
      <button type="submit">
        ${SEARCH}
      </button>
      <input type="text" name="search" aria-label="Search" placeholder="Search pricefx.com">
    </div>
  `;
  mobileNavControlWrapper.append(searchWrapperMobile);

  // Render Mobile Hamburger Menu
  const hamburger = document.createElement('button');
  hamburger.classList.add('hamburger-nav');
  hamburger.id = 'hamburger-nav';
  hamburger.setAttribute('aria-label', 'Open Mobile Navigation');
  hamburger.setAttribute('aria-controls', 'mobile-nav');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = `<span class="menu-icon"></span>`;
  mobileNavControlWrapper.append(hamburger);

  // Render Mobile Navigation
  const navMobileWrapper = document.createElement('div');
  navMobileWrapper.classList.add('mobile-nav-wrapper');
  navMobileWrapper.id = 'mobile-nav-wrapper';
  const navMobile = document.createElement('nav');
  navMobile.classList.add('mobile-nav');
  navMobile.id = 'mobile-nav';
  navMobileWrapper.setAttribute('aria-labelledby', 'hamburger-nav');
  navMobileWrapper.setAttribute('aria-hidden', 'true');
  mobileHeader.append(navMobileWrapper);
  navMobileWrapper.append(navMobile);

  const navMobileLevelOne = document.createElement('ul');
  navMobileLevelOne.classList.add('nav-mobile-list-level-1');

  hamburger.addEventListener('click', () => {
    toggleHamburgerNav(hamburger, navMobileWrapper);
  });

  // Render Level 3 Navigation
  const renderMobileLevelThreeItems = (navLabel) => {
    const navLevelThreeNames = [];
    let markup = '';
    groupByLevelTwo[navLabel].forEach((group) => {
      navLevelThreeNames.push(group['Level 3']);
    });
    const uniqueNavLevelThreeNames = [...new Set(navLevelThreeNames)];
    uniqueNavLevelThreeNames.forEach((level3Label) => {
      if (level3Label.includes('|')) {
        const linkInfoArray = level3Label.split('|');
        markup += `
          <li class="nav-mobile-list-level-2-item">
            <a href="${linkInfoArray[1].trim()}" target="${linkInfoArray.length === 3 ? linkInfoArray[2].trim() : '_self'}">${linkInfoArray[0].trim()}</a>
          </li>
        `;
      }
    });
    return markup;
  };

  // Render Mobile Level 2 Navigation
  const renderMobileLevelTwoItems = (navLabel) => {
    const navLevelTwoNames = [];
    const navLevelThreeNames = [];
    let markup = '';
    groupByLevelOne[navLabel].forEach((group) => {
      navLevelTwoNames.push(group['Level 2']);
      if (group['Level 2'] === '') {
        navLevelThreeNames.push(group['Level 3']);
      }
    });
    const uniqueNavLevelTwoNames = [...new Set(navLevelTwoNames)];
    uniqueNavLevelTwoNames.forEach((level2Label) => {
      if (level2Label.includes('|')) {
        const linkInfoArray = level2Label.split('|');
        markup += `
          <a class="nav-mobile-list-level-2-category-link" href="${linkInfoArray[1].trim()}" target="${linkInfoArray.length >= 2 ? linkInfoArray[2].trim() : '_self'}">${linkInfoArray[0].trim()}</a>
        `;
      } else if (!level2Label.includes('|') && level2Label !== '') {
        markup += `
          <ul class="nav-mobile-list-level-2-category" aria-label="${level2Label}">
            ${renderMobileLevelThreeItems(level2Label)}
          </ul>
        `;
      } else if (level2Label === '') {
        let childMarkup = '';
        navLevelThreeNames.forEach((level3Label) => {
          if (level3Label.includes('|')) {
            const linkInfoArray = level3Label.split('|');
            childMarkup += `
              <li class="nav-mobile-list-level-2-link">
                <a href="${linkInfoArray[1].trim()}" target="${linkInfoArray.length === 3 ? linkInfoArray[2].trim() : '_self'}">${linkInfoArray[0].trim()}</a>
              </li>
            `;
          }
        });
        markup = `
          <ul class="nav-mobile-list-level-2-links">
            ${childMarkup}
          </ul>
        `;
      }
    });
    return markup;
  };

  // Render Mobile Level 1 Navigation
  const renderMobileLevelOneItems = (navLabels) => {
    let markup = '';
    navLabels.forEach((navLabel) => {
      markup += `
        <li class="nav-mobile-list-level-1-item">
          <button class="nav-mobile-list-level-1-item-toggle" id="mobile-nav-level-1-${navLabels.indexOf(navLabel) + 1}" aria-controls="mobile-nav-level-2-${navLabels.indexOf(navLabel) + 1}" aria-expanded="false">
            ${navLabel}
            <span class="accordion-icon"></span>
          </button>
          <div class="nav-mobile-list-level-2" id="mobile-nav-level-2-${navLabels.indexOf(navLabel) + 1}" aria-labelledby="mobile-nav-level-1-${navLabels.indexOf(navLabel) + 1}" aria-hidden="true">
            ${renderMobileLevelTwoItems(navLabel)}
          </div>
        </li>
      `;
    });
    navMobileLevelOne.innerHTML = markup;
  };
  renderMobileLevelOneItems(uniqueNavLevelOneNames);
  navMobile.append(navMobileLevelOne);

  const mobileNavAccordions = document.querySelectorAll('.nav-mobile-list-level-1-item-toggle');
  mobileNavAccordions.forEach((accordion) => {
    accordion.addEventListener('click', () => {
      toggleMobileNavAccordion(accordion);
    });
  });

  // Render Mobile Talk to an Expert CTA
  const mobileExpertCta = document.createElement('a');
  mobileExpertCta.classList.add('expert-cta');
  mobileExpertCta.href = '/pricing-software-demo';
  mobileExpertCta.textContent = 'Talk to an Expert';
  mobileExpertCta.setAttribute('target', '_blank');
  navMobileWrapper.append(mobileExpertCta);

  const backdrop = document.createElement('div');
  backdrop.classList.add('backdrop');
  mobileHeader.append(backdrop);

  // FILTER MARKUP - TO BE MOVED LATER
  const mainEl = document.querySelector('main');
  const placeholderLearningCenter = document.createElement('div');
  placeholderLearningCenter.classList.add('learning-center-wrapper');
  mainEl.append(placeholderLearningCenter);

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
