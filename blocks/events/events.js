import { readBlockConfig } from '../../scripts/aem.js';
// import { environmentMode, replaceBasePath } from '../../scripts/global-functions.js';
// import { BASE_CONTENT_PATH } from '../../scripts/url-constants.js';

const isDesktop = window.matchMedia('(min-width: 986px)');

let jsonObject;

function filterEventsByPath(path) {
  return jsonObject.data.eventsList.items.filter((event) => path.includes(event._path))[0];
}

const updateBrowserUrl = (searchParams, key, value) => {
  searchParams.set(key, value);
  const newRelativePathQuery = `${window.location.pathname}?${searchParams.toString()}`;
  window.history.pushState(null, '', newRelativePathQuery);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

const renderArticleCategory = (article) => {
  const categoriesArray = article.eventType;
  if (categoriesArray) {
    return `<p class="article-subtitle">${categoriesArray}</p>`;
  }
  return null;
};

// Dynamically update the card CTA label based on article Content Type
const renderArticleCtaLabel = (article) =>
  `<a class="article-link" href="${article.eventLink}">${article.eventCtaLabel}</a>`;

/**
 * Reset Filter Accordions to Default State
 * @param {Element} filterToggle The CTA that show/hide the Filter Category
 */
const resetFilterAccordions = (filterToggle) => {
  const filterContent = filterToggle.nextElementSibling;
  const contentScroll = filterContent.scrollHeight;

  filterContent.style.visibility = 'visible';
  filterContent.style.maxHeight = `${contentScroll}px`;

  filterContent.setAttribute('aria-hidden', 'false');
  filterToggle.setAttribute('aria-expanded', 'true');
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
    contentWrapper.classList.toggle('events-content--full-width', false);
    filterMenu.focus();
    filterMenuToggle.innerHTML = `<span class="filter-icon"></span><span class="toggle-label">Hide Filters</span>`;
  } else {
    filterMenu.blur();
    filterMenuToggle.innerHTML = `<span class="filter-icon"></span><span class="toggle-label">Show Filter</span>`;
    const filterAccordions = document.querySelectorAll('.filter-category-toggle');
    filterAccordions.forEach((accordion) => {
      resetFilterAccordions(accordion);
    });
    setTimeout(() => {
      filterMenu.classList.toggle('hidden', true);
    }, '300');
    contentWrapper.classList.toggle('events-content--full-width', true);
  }

  const filterMenuAriaHidden = filterMenu.attributes[3].value;
  const setFilterMenuAriaHidden = filterMenuAriaHidden === 'false' ? 'true' : 'false';
  filterMenu.setAttribute('aria-hidden', setFilterMenuAriaHidden);
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

function fetchEventsData() {
  fetch('https://publish-p131512-e1282665.adobeaemcloud.com/graphql/execute.json/pricefx/events', {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      jsonObject = data;
    });
}

export default async function decorate(block) {
  fetchEventsData();
  const blockConfig = readBlockConfig(block);
  const featuredEvent = blockConfig.featuredevents;
  const searchPlaceholder = blockConfig.searchplaceholdertext;
  const numOfArticles = blockConfig.numberOfEvents ? blockConfig.numberOfEvents : 6;
  const defaultSort = blockConfig.sortby;
  const filterOne = blockConfig.filteronetitle;
  const filterOneOptions = blockConfig.filteronetags;
  const filterTwo = blockConfig.filtertwotitle;
  const filterTwoOptions = blockConfig.filtertwotags;
  const filterThree = blockConfig.filterthreetitle;
  const filterThreeOptions = blockConfig.filterthreetags;
  const filterFour = blockConfig.filterfourtitle;
  const filterFourOptions = blockConfig.filterfourtags;
  block.textContent = '';

  const filterControls = document.createElement('div');
  filterControls.classList.add('filter-controls');
  block.append(filterControls);

  // Creates a div container for flex-box styling use
  const flexContainer = document.createElement('div');
  flexContainer.classList.add('flex-container');
  block.append(flexContainer);

  // Creates a div container for the actual Filter Menu
  const filter = document.createElement('div');
  filter.classList.add('filter-wrapper');
  filter.id = 'filter-menu';
  filter.setAttribute('aria-labelledby', 'filter-menu-toggle');
  filter.setAttribute('aria-hidden', 'false');
  flexContainer.append(filter);

  // Creates a div container to hold Learning Center articles
  const eventsContent = document.createElement('div');
  eventsContent.classList.add('events-content');
  const articlesContainer = document.createElement('ul');
  articlesContainer.classList.add('articles-container');
  const featuredEventContainer = document.createElement('div');
  featuredEventContainer.classList.add('featured-event');
  if (featuredEvent !== '' && featuredEvent) {
    eventsContent.append(featuredEventContainer);
  }
  flexContainer.append(eventsContent);
  eventsContent.append(articlesContainer);

  // Creates a div container to hold pagination
  const paginationContainer = document.createElement('nav');
  paginationContainer.classList.add('pagination-wrapper');
  paginationContainer.setAttribute('aria-label', 'Pagination Navigation');
  paginationContainer.setAttribute('role', 'navigation');
  eventsContent.append(paginationContainer);

  const defaultSortedArticle = jsonObject.data.eventsList.items.sort(
    (a, b) => new Date(b.eventDate) - new Date(a.eventDate),
  );

  const queryStr = 'page=1&sortBy=desc-date';
  const searchParams = new URLSearchParams(queryStr);

  filterControls.innerHTML = `
<button class="filter-menu-toggle" id="filter-menu-toggle" aria-controls="filter-menu" aria-expanded="true"><span class="filter-icon"></span><span class="toggle-label">Hide Filters</span></button>
${
  defaultSort !== ''
    ? `<div class="sort-content-wrapper">
    <label for="sort-content" class="sr-only">Short by</label>
    <select name="sort-content" id="sort-content">
      <option value="" selected disabled>Sort by</option>
      ${
        defaultSort.includes('date')
          ? `<optgroup label="Date">
          ${defaultSort.includes('desc-date') ? `<option value="desc-date">Date (New → Old)</option>` : ''}
          ${defaultSort.includes('asc-date') ? `<option value="asc-date">Date (Old → New)</option>` : ''}
        </optgroup>`
          : ''
      }
      ${
        defaultSort.includes('title')
          ? `<optgroup label="Title">
          ${defaultSort.includes('asc-title') ? `<option value="asc-title">Title (A → Z)</option>` : ''}
          ${defaultSort.includes('desc-title') ? `<option value="desc-title">Title (Z → A)</option>` : ''}
        </optgroup>`
          : ''
      }
    </select>
  </div>`
    : ''
}
`;

  // Click event for Filter Menu Toggle
  const filterMenuToggle = document.querySelector('.filter-menu-toggle');
  filterMenuToggle.addEventListener('click', () => {
    toggleFilterMenu(filterMenuToggle, filter, eventsContent);
  });

  // Close Filter Menu when clicking outside of it on Mobile
  document.addEventListener('click', (e) => {
    if (!isDesktop.matches && filterMenuToggle.getAttribute('aria-expanded') === 'true') {
      if (e.target === flexContainer) {
        filterMenuToggle.click();
      }
    }
  });

  // Watch for screen size change and switch between Desktop and Mobile Filter
  window.addEventListener('resize', () => {
    if (!isDesktop.matches && filterMenuToggle.getAttribute('aria-expanded') === 'true') {
      filterMenuToggle.setAttribute('aria-expanded', 'false');
      filterMenuToggle.setAttribute('aria-label', 'Toggle Filter Menu');
      filter.setAttribute('aria-hidden', 'true');
    } else if (isDesktop.matches && filterMenuToggle.getAttribute('aria-expanded') === 'false') {
      filterMenuToggle.click();
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
    filterCategoryOptions,
    filterAllId,
    filterCategoryName,
  ) => {
    const optionsArray = filterCategoryOptions.split(',');
    let markup = '';
    let filterOptionsMarkup = '';
    optionsArray.forEach((option) => {
      const optionSplit = option.split('/')[1];
      const optionReplace = optionSplit.includes('-') ? optionSplit.replaceAll('-', ' ') : optionSplit;
      const optionTextTransform =
        optionReplace.length <= 4 && optionReplace !== 'news' && optionReplace !== 'food'
          ? optionReplace.toUpperCase()
          : optionReplace;
      filterOptionsMarkup += `
          <li class="filter-category-item">
            <input type="radio" id="filter-${optionSplit}" name="${filterCategoryName}" value="${optionSplit}" data-filter-category="${filterCategoryName}" />
            <label for="filter-${optionSplit}">${optionSplit === 'e-books' || optionSplit === 'c-suite' ? optionSplit : optionTextTransform}</label>
          </li>
        `;
    });

    markup = `
      <div class="filter-category">
        <button class="filter-category-toggle" id="filter-category-${filterNum}-toggle" aria-controls="filter-category-${filterNum}-content" aria-expanded="true">${filterCategoryLabel}<span class="accordion-icon"></span></button>
        <ul class="filter-category-content" id="filter-category-${filterNum}-content" aria-labelledby="filter-category-${filterNum}-toggle" aria-hidden="false">
          ${`<li class="filter-category-item">
              <input type="radio" id="${filterAllId}" name="${filterCategoryName}" value="${filterAllId}" data-filter-category="${filterCategoryName}" checked />
              <label for="${filterAllId}">All</label>
            </li>`}
            ${filterOptionsMarkup}
        </ul>
      </div>
    `;
    return markup;
  };

  filter.innerHTML = `
    <form class="filter-search-wrapper">
      <label for="filter-search" class="sr-only">Search</label>
      <input type="text" name="filter-search" id="filter-search" placeholder="${searchPlaceholder}" />
      <button type="submit" aria-label="Submit search"></button>
    </form>
    ${filterOne !== '' ? renderFilterCategory(1, filterOne, filterOneOptions, 'filter-all-content-type', 'filter-type') : ''}
    ${filterTwo !== '' ? renderFilterCategory(2, filterTwo, filterTwoOptions, 'filter-all-industry', 'filter-industry') : ''}
    ${filterThree !== '' ? renderFilterCategory(3, filterThree, filterThreeOptions, 'filter-all-role', 'filter-role') : ''}
    ${filterFour !== '' ? renderFilterCategory(4, filterFour, filterFourOptions, 'filter-all-pfx', 'filter-pfx') : ''}
  `;

  // Set initial max-height for Filter Categories to create smooth accordion transition
  const filterContents = document.querySelectorAll('.filter-category-content');
  filterContents.forEach((content) => {
    content.style.visibility = 'visible';
    content.style.maxHeight = '300px';
  });

  // Click event for Filter Accordions
  const filterAccordionToggles = document.querySelectorAll('.filter-category-toggle');
  filterAccordionToggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      toggleFilterAccordion(toggle);
    });
  });

  const featuredEventData = filterEventsByPath(featuredEvent);

  // Render Featured Article
  if (featuredEvent !== '' && featuredEventData) {
    featuredEventContainer.innerHTML = `
      <div class="article-image">
        <picture>
          <img src="${featuredEventData.eventImage._dmS7Url || ''}" alt="${featuredEventData.imageAlt || featuredEventData.program}">
        </picture>
      </div>
      <div class="article-content">
        ${
          featuredEventData.eventType !== '' ||
          featuredEventData.eventTitle !== '' ||
          featuredEventData.eventDate !== ''
            ? `<div class="article-details">
            ${featuredEventData.eventType !== '' ? renderArticleCategory(featuredEventData) : ''}
            ${featuredEventData.eventTitle !== '' ? `<p class="article-info"><b>${featuredEventData.eventTitle} : ${featuredEventData.eventDescription.plaintext}</b></p>` : ''}
   
          </div>`
            : ''
        }
        <div class="article-cta-container">
          ${renderArticleCtaLabel(featuredEventData)}
          ${featuredEventData.readingTime !== '' ? `<p class="article-readtime">${formatDate(featuredEventData.eventDate)}</p>` : ''}
        </div>
      </div>
    `;
  } else {
    featuredEventContainer.innerHTML = '';
  }

  // Render Learning Center Article Card
  const renderArticleCard = (articleDataList) => {
    const initialArticleData = articleDataList;

    let markup = '';
    initialArticleData.forEach((article) => {
      markup += `
            <li class="article-card">
              <div class="article-image">
                <picture>
                  <img src="${article.eventImage._dmS7Url || ''}" alt="${article.imageAlt || article.eventTitle}">
                </picture>
              </div>
              <div class="article-content">
                ${
                  article.eventType !== '' || article.eventTitle !== '' || article.eventDate !== ''
                    ? `<div class="article-details">
                    ${article.category !== '' ? renderArticleCategory(article) : ''}
                    ${article.title !== '' ? `<p class="article-info"><b>${article.eventTitle} : ${article.eventDescription.plaintext}</b></p>` : ''}
                  </div>`
                    : ''
                }
                <div class="article-cta-container">
                  ${renderArticleCtaLabel(article)}
                  ${article.readingTime !== '' ? `<p class="article-readtime">${formatDate(article.eventDate)}</p>` : ''}
                </div>
              </div>
            </li>
          `;
    });
    return markup;
  };

  const appendLearningCenterArticles = (articleJsonData) => {
    articlesContainer.innerHTML = renderArticleCard(articleJsonData);
  };
  appendLearningCenterArticles(jsonObject.data.eventsList.items);

  // Render pagination pages
  const renderPages = (articlePerPage, articleList, currentPage) => {
    const totalArticles = articleList.length;
    const totalPageNumber = Math.ceil(totalArticles / articlePerPage);
    const firstPageMarkup = `<li class="pagination-page" id="page-1" aria-label="Page 1" aria-current="true"><button>1</button></li>`;
    const lastPageMarkup = `<li class="pagination-page" id="page-${totalPageNumber}" aria-label="Page ${totalPageNumber}"><button>${totalPageNumber}</button></li>`;
    let paginationMarkup = '';
    let middlePageMarkup = '';

    if (totalPageNumber <= 1) {
      return firstPageMarkup;
    }
    const center = [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
    const filteredCenter = center.filter((p) => p > 1 && p < totalPageNumber);
    const includeThreeLeft = currentPage === 5;
    const includeThreeRight = currentPage === totalPageNumber - 4;
    const includeLeftDots = currentPage > 5;
    const includeRightDots = currentPage < totalPageNumber - 4;

    if (includeThreeLeft) {
      filteredCenter.unshift(2);
    }
    if (includeThreeRight) {
      filteredCenter.push(totalPageNumber - 1);
    }

    if (includeLeftDots) {
      filteredCenter.unshift('...');
    }
    if (includeRightDots) {
      filteredCenter.push('...');
    }

    filteredCenter.forEach((centerPage) => {
      if (centerPage === '...') {
        middlePageMarkup += `
          <li class="pagination-ellipses"><span>${centerPage}</span></li>
        `;
      } else {
        middlePageMarkup += `
          <li class="pagination-page" id="page-${centerPage}" aria-label="Page ${centerPage}"><button>${centerPage}</button></li>
        `;
      }
    });
    paginationMarkup = firstPageMarkup + middlePageMarkup + lastPageMarkup;
    return paginationMarkup;
  };

  paginationContainer.innerHTML = `
    ${Number(numOfArticles) > defaultSortedArticle.length ? '' : '<button class="pagination-prev" aria-label="Previous Page">Previous</button>'}
    <ul class="pagination-pages-list">
      ${renderPages(numOfArticles, defaultSortedArticle, 1)}
    </ul>
    ${Number(numOfArticles) > defaultSortedArticle.length ? '' : '<button class="pagination-next" aria-label="Next Page">Next</button>'}
  `;

  const paginationPageList = document.querySelector('.pagination-pages-list');
  const prevPageButton = document.querySelector('.pagination-prev');
  const nextPageButton = document.querySelector('.pagination-next');

  if (paginationPageList.children.length === 1) {
    paginationContainer.classList.add('hidden');
  } else {
    paginationContainer.classList.remove('hidden');
  }

  if (window.location.search !== '') {
    const currentUrlParam = new URLSearchParams(window.location.search);
    const pageNum = currentUrlParam.get('page');
    if (Number(pageNum) > 1) {
      prevPageButton.classList.remove('hidden');
      paginationPageList.children[0].classList.remove('active-page');
    } else {
      prevPageButton.classList.add('hidden');
      paginationPageList.children[0].classList.add('active-page');
    }
  } else {
    prevPageButton.classList.add('hidden');
    paginationPageList.children[0].classList.add('active-page');
  }

  // Defining some variables for filter, sort and search logic
  const sortByEl = document.getElementById('sort-content');
  const searchInput = document.getElementById('filter-search');
  let currentFilteredArticles;
  let currentSearchedArticles;
  let currentSortedArticles;
  let currentFilteredAndSortedArticles;
  let currentSearchedAndFilteredArticles;
  let currentSearchAndSortedArticles;
  const selectedFiltersArray = [];
  const selectedFilters = {
    'filter-type': [],
    'filter-industry': [],
    'filter-role': [],
    'filter-pfx': [],
  };

  // Updates the URL Params based on selected filters
  const updateFiltersUrlParams = () => {
    if (selectedFilters['filter-type'].length > 0) {
      updateBrowserUrl(searchParams, 'filter-type', selectedFilters['filter-type'][0]);
    }
    if (selectedFilters['filter-industry'].length > 0) {
      const valuesString = selectedFilters['filter-industry'].toString();
      updateBrowserUrl(searchParams, 'filter-industry', valuesString);
    }
    if (selectedFilters['filter-role'].length > 0) {
      const valuesString = selectedFilters['filter-role'].toString();
      updateBrowserUrl(searchParams, 'filter-role', valuesString);
    }
    if (selectedFilters['filter-pfx'].length > 0) {
      updateBrowserUrl(searchParams, 'filter-pfx', selectedFilters['filter-pfx'][0]);
    }
  };

  // Learning Center Sort By logic
  const handleSortArticles = (sortBy, articleDataList) => {
    let articleJson = articleDataList;
    sortByEl.style.width = 'auto';
    if (sortBy === 'desc-date') {
      articleJson = articleJson.sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
      appendLearningCenterArticles(articleJson);
    } else if (sortBy === 'asc-date') {
      articleJson = articleJson.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
      appendLearningCenterArticles(articleJson);
    } else if (sortBy === 'asc-title') {
      sortByEl.style.width = '140px';
      articleJson = articleJson.sort((a, b) => a.eventTitle.localeCompare(b.eventTitle));
      appendLearningCenterArticles(articleJson);
    } else {
      sortByEl.style.width = '140px';
      articleJson = articleJson.sort((a, b) => b.eventTitle.localeCompare(a.eventTitle));
      appendLearningCenterArticles(articleJson);
    }

    currentSortedArticles = jsonObject.data.eventsList.items;

    if (articleJson.length === 0) {
      articlesContainer.innerHTML = `
        <h4 class="no-articles">Sorry, there are no results based on these choices. Please update and try again.</h4>
      `;
      paginationContainer.classList.add('hidden');
      updateBrowserUrl(searchParams, 'page', 1);
    } else {
      paginationContainer.classList.remove('hidden');
      const currentPage = paginationPageList.children[0];
      paginationPageList.innerHTML = renderPages(numOfArticles, currentSortedArticles, Number(currentPage.textContent));
      paginationPageList.children[0].classList.add('active-page');
      nextPageButton.classList.remove('hidden');
      if (paginationPageList.children.length <= 1) {
        paginationContainer.classList.add('hidden');
      } else {
        paginationContainer.classList.remove('hidden');
      }
    }

    if (searchInput.value !== '') {
      currentSearchAndSortedArticles = articleJson;
    } else if (selectedFiltersArray.length > 0) {
      currentFilteredAndSortedArticles = articleJson;
    }
  };

  sortByEl.addEventListener('change', (e) => {
    let sortedArticles = [...defaultSortedArticle];
    const selectedFiltersValues = Object.values(selectedFilters);
    selectedFiltersValues.forEach((filterValue) => {
      if (filterValue[0] !== undefined) {
        selectedFiltersArray.push(filterValue[0]);
      }
    });

    if (searchInput.value !== '' && selectedFiltersArray.length > 0) {
      sortedArticles = currentSearchedAndFilteredArticles;

      handleSortArticles(e.target.value, currentSearchedAndFilteredArticles);
    } else if (searchInput.value !== '' && selectedFiltersArray.length <= 0) {
      sortedArticles = currentSearchedArticles;

      handleSortArticles(e.target.value, currentSearchedArticles);
    } else if (selectedFiltersArray.length > 0) {
      sortedArticles = currentFilteredArticles;

      handleSortArticles(e.target.value, currentFilteredArticles);
    } else {
      handleSortArticles(e.target.value, sortedArticles);
    }

    if (paginationPageList.children[0].className.includes('active-page')) {
      prevPageButton.classList.add('hidden');
    }
    updateBrowserUrl(searchParams, 'page', 1);
    updateBrowserUrl(searchParams, 'sortBy', e.target.value);
  });

  // Learning Center Search logic
  const handleSearch = (query, articleList) => {
    let articleJson = articleList;
    articleJson = articleJson.filter(
      (result) =>
        result.eventType.includes(query.replaceAll(' ', '-')) ||
        result.eventTitle.toLowerCase().includes(query) ||
        result.eventDescription.plaintext.toLowerCase().includes(query) ||
        result.eventTags.includes(query.replaceAll(' ', '-')),
    );

    currentSearchedArticles = articleJson;

    if (articleJson.length === 0) {
      articlesContainer.innerHTML = `
        <h4 class="no-articles">Sorry, there are no results based on these choices. Please update and try again.</h4>
      `;
      paginationContainer.classList.add('hidden');
      updateBrowserUrl(searchParams, 'page', 1);
    } else {
      appendLearningCenterArticles(articleJson);
      paginationContainer.classList.remove('hidden');
      const currentPage = paginationPageList.children[0];
      paginationPageList.innerHTML = renderPages(
        numOfArticles,
        currentSearchedArticles,
        Number(currentPage.textContent),
      );
      paginationPageList.children[0].classList.add('active-page');
      nextPageButton.classList.remove('hidden');
      if (paginationPageList.children.length <= 1) {
        paginationContainer.classList.add('hidden');
      } else {
        paginationContainer.classList.remove('hidden');
      }
    }

    if (sortByEl.value !== '') {
      currentSearchAndSortedArticles = articleJson;
    } else if (selectedFiltersArray.length > 0) {
      currentSearchedAndFilteredArticles = articleJson;
    }
  };

  const searchForm = document.querySelector('.filter-search-wrapper');
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let searchedArticles = [...defaultSortedArticle];
    const formData = new FormData(e.target);
    const value = Object.fromEntries(formData)['filter-search'].toLowerCase();

    // Implement search through filtered articles
    const selectedFiltersValues = Object.values(selectedFilters);
    selectedFiltersValues.forEach((filterValue) => {
      if (filterValue[0] !== undefined) {
        selectedFiltersArray.push(filterValue[0]);
      }
    });

    if (sortByEl.value !== '' && selectedFiltersArray.length > 0) {
      searchedArticles = currentFilteredAndSortedArticles;

      handleSearch(value, currentFilteredAndSortedArticles);
    } else if (sortByEl.value !== '' && selectedFiltersArray.length <= 0) {
      searchedArticles = currentSortedArticles;

      handleSearch(value, currentSortedArticles);
    } else if (selectedFiltersArray.length > 0) {
      searchedArticles = currentFilteredArticles;

      handleSearch(value, searchedArticles);
    } else if (value === '') {
      handleSearch(value, defaultSortedArticle);
    } else {
      handleSearch(value, searchedArticles);
    }

    updateBrowserUrl(searchParams, 'page', 1);

    if (paginationPageList.children[0].className.includes('active-page')) {
      prevPageButton.classList.add('hidden');
    }
    if (value !== '') {
      updateBrowserUrl(searchParams, 'search', value);
      const newRelativePathQuery = `${window.location.pathname}?${searchParams.toString()}`;
      window.history.pushState(null, '', newRelativePathQuery);
    } else {
      searchParams.delete('search');
      const newRelativePathQuery = `${window.location.pathname}?${searchParams.toString()}`;
      window.history.pushState(null, '', newRelativePathQuery);
    }
    updateFiltersUrlParams();
  });

  // Learning Center Filter logic
  const updateSelectedFilters = (state, key, value) => {
    if (state === true && value.includes('all')) {
      selectedFilters[key].pop();
      searchParams.delete(key);
    } else if ((state === true && key === 'filter-type') || key === 'filter-pfx') {
      selectedFilters[key].pop();
      selectedFilters[key].push(value);
      updateFiltersUrlParams();
    } else if (state === true && !selectedFilters[key].includes(value)) {
      selectedFilters[key].push(value);
      updateFiltersUrlParams();
    } else if (state === false && selectedFilters[key].includes(value)) {
      selectedFilters[key].splice(selectedFilters[key].indexOf(value), 1);
      searchParams.delete(key);
    }
    const newRelativePathQuery = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.pushState(null, '', newRelativePathQuery);
    return selectedFilters;
  };

  const handleFilterArticles = (filters, articleList) => {
    let articleJson = articleList;
    if (filters['filter-type'].length > 0) {
      articleJson = articleJson.filter((article) =>
        filters['filter-type'].some((searchTag) =>
          article.eventTags.some((tag) => tag.toLowerCase().includes(searchTag.toLowerCase())),
        ),
      );
    }

    if (filters['filter-industry'].length > 0 && Array.isArray(filters['filter-industry'])) {
      articleJson = articleJson.filter((article) =>
        filters['filter-industry'].some((searchTag) =>
          article.eventTags.some((tag) => tag.toLowerCase().includes(searchTag.toLowerCase())),
        ),
      );
    }

    if (filters['filter-role'].length > 0 && Array.isArray(filters['filter-role'])) {
      articleJson = articleJson.filter((article) =>
        filters['filter-role'].some((searchTag) =>
          article.eventTags.some((tag) => tag.toLowerCase().includes(searchTag.toLowerCase())),
        ),
      );
    }

    if (filters['filter-pfx'].length > 0) {
      articleJson = articleJson.filter((article) =>
        filters['filter-pfx'].some((searchTag) =>
          article.eventTags.some((tag) => tag.toLowerCase().includes(searchTag.toLowerCase())),
        ),
      );
    }

    currentFilteredArticles = articleJson;

    if (articleJson.length === 0) {
      articlesContainer.innerHTML = `
        <h4 class="no-articles">Sorry, there are no results based on these choices. Please update and try again.</h4>
      `;
      paginationContainer.classList.add('hidden');
      updateBrowserUrl(searchParams, 'page', 1);
    } else {
      appendLearningCenterArticles(articleJson);
      paginationContainer.classList.remove('hidden');
      const currentPage = paginationPageList.children[0];
      paginationPageList.innerHTML = renderPages(
        numOfArticles,
        currentFilteredArticles,
        Number(currentPage.textContent),
      );
      paginationPageList.children[0].classList.add('active-page');
      nextPageButton.classList.remove('hidden');
      if (paginationPageList.children.length <= 1) {
        paginationContainer.classList.add('hidden');
      } else {
        paginationContainer.classList.remove('hidden');
      }
    }

    if (searchInput.value !== '') {
      currentSearchedAndFilteredArticles = articleJson;
    } else if (sortByEl.value !== '') {
      currentFilteredAndSortedArticles = articleJson;
    }
  };

  const allFilterOptions = document.querySelectorAll('.filter-category-item input');
  allFilterOptions.forEach((filterOption) => {
    filterOption.addEventListener('click', () => {
      updateSelectedFilters(filterOption.checked, filterOption.dataset.filterCategory, filterOption.value);
      let filteredArticles = [...defaultSortedArticle];

      if (sortByEl.value !== '' && searchInput.value !== '') {
        handleFilterArticles(selectedFilters, currentSearchAndSortedArticles);
      } else if (sortByEl.value !== '' && searchInput.value === '') {
        filteredArticles = currentSortedArticles;

        handleFilterArticles(selectedFilters, currentSortedArticles);
      } else if (searchInput.value !== '' && sortByEl.value === '') {
        filteredArticles = currentSearchedArticles;

        handleFilterArticles(selectedFilters, currentSearchedArticles);
      } else {
        handleFilterArticles(selectedFilters, filteredArticles);
      }

      updateBrowserUrl(searchParams, 'page', 1);

      if (paginationPageList.children[0].className.includes('active-page')) {
        prevPageButton.classList.add('hidden');
      }
    });
  });
}
