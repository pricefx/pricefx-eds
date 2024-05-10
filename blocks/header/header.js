import ffetch from '../../scripts/ffetch.js';
import { SEARCH } from '../../scripts/constants.js';
import { decorateIcons } from '../../scripts/aem.js'; 

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
    <a class="brand-logo-wrapper" href="/" aria-label="Go to Pricefx homepage"><span class="icon icon-pricefx-logo-light"></span></a>
  `;
  decorateIcons(brandWrapperDesktop, alt = 'Pricefx Logo');
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
  const brandLogo = `
    <a class="brand-logo-wrapper" href="/" aria-label="Go to Pricefx homepage"><span class="icon icon-pricefx-logo-light"></span></a>`;
  brandWrapperMobile.innerHTML = brandLogo;
  decorateIcons(brandWrapperMobile, alt = 'Pricefx Logo');
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
}
