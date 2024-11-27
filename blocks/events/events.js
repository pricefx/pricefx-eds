import { readBlockConfig } from '../../scripts/aem.js';
import { getEnvironment, getEnvironmentDomain } from '../../scripts/global-functions.js';
import { GRAPHQL_ENDPOINT_PATH } from '../../scripts/url-constants.js';

const isDesktop = window.matchMedia('(min-width: 986px)');

let allEventsData;

function filterAndModifyEvents(events) {
  const today = new Date().toISOString().split('T')[0];
  return events.filter((event) => {
    // Parse the event date
    const eventDate = new Date(event.eventDate).toISOString().split('T')[0];

    // Skip events that are already passed

    if (eventDate < today) {
      if (event.program === 'Event') {
        return false;
      }
      if (event.program === 'Webinar') {
        const liveStatusIndex = event.eventTags.indexOf('pricefx:status/live');
        if (liveStatusIndex !== -1) {
          event.eventTags.push('pricefx:status/on-demand');
        }
      }
    }

    return true;
  });
}

const formatDate = (dateString) => {
  if (dateString === 'On-demand') {
    return dateString;
  }
  const date = new Date(dateString);
  const options = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
};

function showOnDemandOrDate(eventDate, program) {
  const today = new Date().toISOString().split('T')[0];
  // Parse the event date
  let [eventDateFormatted] = new Date(eventDate).toISOString().split('T');
  // Skip events that are already passed
  if (eventDateFormatted < today) {
    if (program === 'Webinar') {
      eventDateFormatted = 'On-demand';
    } else {
      eventDateFormatted = formatDate(eventDate);
    }
  } else {
    eventDateFormatted = formatDate(eventDate);
  }
  return eventDateFormatted;
}

function filterEventsByPath(path) {
  return allEventsData.data.eventsList.items.filter((event) => path.includes(event._path))[0];
}

const updateBrowserUrl = (searchParams, key, value) => {
  searchParams.set(key, value);
  const newRelativePathQuery = `${window.location.pathname}?${searchParams.toString()}`;
  window.history.pushState(null, '', newRelativePathQuery);
};

const renderArticleCategory = (event) => {
  const categoriesArray = event.program;
  if (categoriesArray) {
    return `<p class="event-subtitle">${categoriesArray}</p>`;
  }
  return null;
};

// Dynamically update the card CTA label based on event Content Type
const renderArticleCtaLabel = (event) => `<a class="event-link" href="${event.eventLink}">${event.eventCtaLabel}</a>`;

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

export default async function decorate(block) {
  const env = getEnvironment();
  const domain = getEnvironmentDomain(env) + GRAPHQL_ENDPOINT_PATH;
  const fetchUrl = `https://${domain}`;
  fetch(fetchUrl, {
    method: 'GET',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
      // Assuming the response is JSON
    })
    .then((data) => {
      allEventsData = data;

      const blockConfig = readBlockConfig(block);
      const featuredEvent = blockConfig.featuredevents;
      const searchPlaceholder = blockConfig.searchplaceholdertext;
      const numOfEvents = blockConfig.numberofevents ? blockConfig.numberofevents : 3;
      const defaultSort = blockConfig.sortby;
      const filterOne = blockConfig.filteronetitle;
      const filterOneOptions = blockConfig.filteronetags;
      const filterTwo = blockConfig.filtertwotitle;
      const filterTwoOptions = blockConfig.filtertwotags;
      const filterThree = blockConfig.filterthreetitle;
      const filterThreeOptions = blockConfig.filterthreetags;
      const filterFour = blockConfig.filterfourtitle;
      const filterFourOptions = blockConfig.filterfourtags;
      const filterFourIsMultiSelect = blockConfig.filterfourmultiselect ? 'false' : 'true';

      const filterFive = blockConfig.filterfivetitle;
      const filterFiveOptions = blockConfig.filterfivetags;

      block.textContent = '';

      allEventsData.data.eventsList.items = filterAndModifyEvents(allEventsData.data.eventsList.items);
      let currentEvenData = allEventsData.data.eventsList.items;

      // Filter out the featured article data from the rest of the article data (if applicable)

      let noFeaturedEventData;
      if (featuredEvent !== '') {
        noFeaturedEventData = allEventsData.data.eventsList.items.filter(
          (event) => !featuredEvent.includes(event._path),
        );
      } else {
        noFeaturedEventData = allEventsData.data.eventsList.items;
      }

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

      // Creates a div container to hold Events events
      const eventsContent = document.createElement('div');
      eventsContent.classList.add('events-content');
      const EventsContainer = document.createElement('ul');
      EventsContainer.classList.add('event-container');
      const featuredEventContainer = document.createElement('div');
      featuredEventContainer.classList.add('featured-event');
      if (featuredEvent !== '' && featuredEvent) {
        eventsContent.append(featuredEventContainer);
      }
      flexContainer.append(eventsContent);
      eventsContent.append(EventsContainer);

      // Creates a div container to hold pagination
      const paginationContainer = document.createElement('nav');
      paginationContainer.classList.add('pagination-wrapper');
      paginationContainer.setAttribute('aria-label', 'Pagination Navigation');
      paginationContainer.setAttribute('role', 'navigation');
      eventsContent.append(paginationContainer);

      const defaultSortedArticle = noFeaturedEventData.sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));

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
        filterIsMultiSelect,
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
          const optionTextTransform = optionReplace;
          const optionLabel = optionTextTransform === 'it professionals' ? 'IT Professionals' : optionTextTransform;
          if (filterIsMultiSelect !== 'true') {
            filterOptionsMarkup += `
                <li class="filter-category-item">
                  <input type="radio" id="filter-${optionSplit}" name="${filterCategoryName}" value="${optionSplit}" data-filter-category="${filterCategoryName}" />
                  <label for="filter-${optionSplit}">${optionSplit === 'e-books' || optionSplit === 'c-suite' ? optionSplit : optionTextTransform}</label>
                </li>
              `;
          } else {
            filterOptionsMarkup += `
                <li class="filter-category-item">
                  <input type="checkbox" id="filter-${optionSplit}" name="${optionSplit}" value="${optionSplit}" data-filter-category="${filterCategoryName}" />
                  <label for="filter-${optionSplit}">${optionSplit === 'e-books' || optionSplit === 'c-suite' ? optionSplit : optionLabel}</label>
                </li>
              `;
          }
        });

        markup = `
            <div class="filter-category">
              <button class="filter-category-toggle" id="filter-category-${filterNum}-toggle" aria-controls="filter-category-${filterNum}-content" aria-expanded="true">${filterCategoryLabel}<span class="accordion-icon"></span></button>
              <ul class="filter-category-content" id="filter-category-${filterNum}-content" aria-labelledby="filter-category-${filterNum}-toggle" aria-hidden="false">
                ${
                  filterIsMultiSelect !== 'true'
                    ? `<li class="filter-category-item">
                    <input type="radio" id="${filterAllId}" name="${filterCategoryName}" value="${filterAllId}" data-filter-category="${filterCategoryName}" checked />
                    <label for="${filterAllId}">All</label>
                  </li>`
                    : ``
                }
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
  ${filterOne !== '' ? renderFilterCategory(1, filterOne, false, filterOneOptions, 'filter-all-program', 'filter-program') : ''}
  ${filterTwo !== '' ? renderFilterCategory(2, filterTwo, false, filterTwoOptions, 'filter-all-type', 'filter-type') : ''}
  ${filterThree !== '' ? renderFilterCategory(3, filterThree, false, filterThreeOptions, 'filter-all-industry', 'filter-industry') : ''}
  ${filterFour !== '' ? renderFilterCategory(4, filterFour, filterFourIsMultiSelect, filterFourOptions, 'filter-all-capability', 'filter-capability') : ''}
  ${filterFive !== '' ? renderFilterCategory(4, filterFive, false, filterFiveOptions, 'filter-all-topic', 'filter-topic') : ''}
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
    <div class="event-image">
      <picture>
        <img src="${featuredEventData.eventImage._dmS7Url || ''}" alt="${featuredEventData.imageAlt || featuredEventData.program}">
      </picture>
    </div>
    <div class="event-content">
      ${
        featuredEventData.eventType !== '' || featuredEventData.eventTitle !== '' || featuredEventData.eventDate !== ''
          ? `<div class="event-details">
          ${featuredEventData.eventType !== '' ? renderArticleCategory(featuredEventData) : ''}
          ${featuredEventData.eventTitle !== '' ? `<p class="event-info"><b>${featuredEventData.eventTitle} </b></p>` : ''}
 
        </div>`
          : ''
      }
      <div class="event-cta-container">
        ${renderArticleCtaLabel(featuredEventData)}
        ${featuredEventData.readingTime !== '' ? `<p class="event-readtime">${formatDate(featuredEventData.eventDate)}</p>` : ''}
      </div>
    </div>
  `;
      } else {
        featuredEventContainer.innerHTML = '';
      }

      // Render Events Article Card
      const renderArticleCard = (articleDataList) => {
        let initialArticleData = articleDataList;
        const initialArticleCount = initialArticleData.length;
        if (Number(numOfEvents) !== '' && initialArticleCount > Number(numOfEvents)) {
          initialArticleData = articleDataList.slice(noFeaturedEventData, numOfEvents);
        }
        let markup = '';
        initialArticleData.forEach((event) => {
          markup += `
          <li class="event-card">
            <div class="event-image">
              <picture>
                <img src="${event.eventImage._dmS7Url || ''}" alt="${event.imageAlt || event.eventTitle}">
              </picture>
            </div>
            <div class="event-content">
              ${
                event.eventType !== '' || event.eventTitle !== '' || event.eventDate !== ''
                  ? `<div class="event-details">
                  ${event.category !== '' ? renderArticleCategory(event) : ''}
                  ${event.title !== '' ? `<p class="event-info"><b>${event.eventTitle}</b></p>` : ''}
                </div>`
                  : ''
              }
              <div class="event-cta-container">
                ${renderArticleCtaLabel(event)}
                ${event.readingTime !== '' ? `<p class="event-readtime">${showOnDemandOrDate(event.eventDate, event.program)}</p>` : ''}
              </div>
            </div>
          </li>
        `;
        });
        return markup;
      };

      const appendEvents = (articleJsonData) => {
        EventsContainer.innerHTML = renderArticleCard(articleJsonData);
      };
      appendEvents(noFeaturedEventData);

      // Render pagination pages
      const renderPages = (articlePerPage, articleList, currentPage) => {
        const totalEvents = articleList.length;
        const totalPageNumber = Math.ceil(totalEvents / articlePerPage);
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
  ${Number(numOfEvents) > defaultSortedArticle.length ? '' : '<button class="pagination-prev" aria-label="Previous Page">Previous</button>'}
  <ul class="pagination-pages-list">
    ${renderPages(numOfEvents, defaultSortedArticle, 1)}
  </ul>
  ${Number(numOfEvents) > defaultSortedArticle.length ? '' : '<button class="pagination-next" aria-label="Next Page">Next</button>'}
`;

      const paginationPageList = document.querySelector('.pagination-pages-list');
      const prevPageButton = document.querySelector('.pagination-prev');
      const nextPageButton = document.querySelector('.pagination-next');

      if (paginationPageList.children.length === 1) {
        paginationContainer.classList.add('hidden');
      } else {
        paginationContainer.classList.remove('hidden');
      }

      if (prevPageButton && nextPageButton) {
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
      }

      // Defining some variables for filter, sort and search logic
      const sortByEl = document.getElementById('sort-content');
      const searchInput = document.getElementById('filter-search');
      let currentFilteredEvents;
      let currentSearchedEvents;
      let currentSortedEvents;
      let currentFilteredAndSortedEvents;
      let currentSearchedAndFilteredEvents;
      let currentSearchAndSortedEvents;
      const selectedFiltersArray = [];
      const selectedFilters = {
        'filter-program': [],
        'filter-type': [],
        'filter-industry': [],
        'filter-capability': [],
        'filter-topic': [],
      };

      // Updates the URL Params based on selected filters
      const updateFiltersUrlParams = () => {
        if (selectedFilters['filter-program'].length > 0) {
          updateBrowserUrl(searchParams, 'filter-program', selectedFilters['filter-program'][0]);
        }
        if (selectedFilters['filter-type'].length > 0) {
          const valuesString = selectedFilters['filter-type'].toString();
          updateBrowserUrl(searchParams, 'filter-type', valuesString);
        }
        if (selectedFilters['filter-industry'].length > 0) {
          const valuesString = selectedFilters['filter-industry'].toString();
          updateBrowserUrl(searchParams, 'filter-industry', valuesString);
        }
        if (selectedFilters['filter-capability'].length > 0) {
          const valuesString = selectedFilters['filter-capability'].toString();
          updateBrowserUrl(searchParams, 'filter-capability', valuesString);
        }
        if (selectedFilters['filter-topic'].length > 0) {
          updateBrowserUrl(searchParams, 'filter-topic', selectedFilters['filter-topic'][0]);
        }
      };

      // Events Sort By logic
      const handleSortEvents = (sortBy, articleDataList) => {
        let articleJson = articleDataList;
        sortByEl.style.width = 'auto';
        if (sortBy === 'desc-date') {
          articleJson = articleJson.sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
          appendEvents(articleJson);
        } else if (sortBy === 'asc-date') {
          articleJson = articleJson.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
          appendEvents(articleJson);
        } else if (sortBy === 'asc-title') {
          sortByEl.style.width = '140px';
          articleJson = articleJson.sort((a, b) => a.eventTitle.localeCompare(b.eventTitle));
          appendEvents(articleJson);
        } else {
          sortByEl.style.width = '140px';
          articleJson = articleJson.sort((a, b) => b.eventTitle.localeCompare(a.eventTitle));
          appendEvents(articleJson);
        }

        currentSortedEvents = articleJson;

        if (articleJson.length === 0) {
          EventsContainer.innerHTML = `
      <h4 class="no-events">Sorry, there are no results based on these choices. Please update and try again.</h4>
    `;
          paginationContainer.classList.add('hidden');
          updateBrowserUrl(searchParams, 'page', 1);
        } else {
          paginationContainer.classList.remove('hidden');
          const currentPage = paginationPageList.children[0];
          paginationPageList.innerHTML = renderPages(numOfEvents, currentSortedEvents, Number(currentPage.textContent));
          paginationPageList.children[0].classList.add('active-page');
          if (nextPageButton) {
            nextPageButton.classList.remove('hidden');
          }
          if (paginationPageList.children.length <= 1) {
            paginationContainer.classList.add('hidden');
          } else {
            paginationContainer.classList.remove('hidden');
          }
        }

        if (searchInput.value !== '') {
          currentSearchAndSortedEvents = articleJson;
          currentEvenData = articleJson;
        } else if (selectedFiltersArray.length > 0) {
          currentFilteredAndSortedEvents = articleJson;
          currentEvenData = articleJson;
        }
      };

      sortByEl.addEventListener('change', (e) => {
        let sortedEvents = [...defaultSortedArticle];
        const selectedFiltersValues = Object.values(selectedFilters);
        selectedFiltersValues.forEach((filterValue) => {
          if (filterValue[0] !== undefined) {
            selectedFiltersArray.push(filterValue[0]);
          }
        });

        if (searchInput.value !== '' && selectedFiltersArray.length > 0) {
          sortedEvents = currentSearchedAndFilteredEvents;
          currentEvenData = currentSearchedAndFilteredEvents;

          handleSortEvents(e.target.value, currentSearchedAndFilteredEvents);
        } else if (searchInput.value !== '' && selectedFiltersArray.length <= 0) {
          sortedEvents = currentSearchedEvents;
          currentEvenData = currentSearchedEvents;
          handleSortEvents(e.target.value, currentSearchedEvents);
        } else if (selectedFiltersArray.length > 0) {
          sortedEvents = currentFilteredEvents;
          currentEvenData = currentFilteredEvents;
          handleSortEvents(e.target.value, currentFilteredEvents);
        } else {
          handleSortEvents(e.target.value, sortedEvents);
        }

        if (prevPageButton && paginationPageList.children[0].className.includes('active-page')) {
          prevPageButton.classList.add('hidden');
        }
        updateBrowserUrl(searchParams, 'page', 1);
        updateBrowserUrl(searchParams, 'sortBy', e.target.value);
      });

      // Events Search logic
      const handleSearch = (query, articleList) => {
        let articleJson = articleList;
        articleJson = articleJson.filter(
          (result) =>
            result.eventType.includes(query.replaceAll(' ', '-')) ||
            result.eventTitle.toLowerCase().includes(query) ||
            result.eventTags.includes(query.replaceAll(' ', '-')),
        );

        currentSearchedEvents = articleJson;

        if (articleJson.length === 0) {
          EventsContainer.innerHTML = `
      <h4 class="no-events">Sorry, there are no results based on these choices. Please update and try again.</h4>
    `;
          paginationContainer.classList.add('hidden');
          updateBrowserUrl(searchParams, 'page', 1);
        } else {
          appendEvents(articleJson);
          paginationContainer.classList.remove('hidden');
          const currentPage = paginationPageList.children[0];
          paginationPageList.innerHTML = renderPages(
            numOfEvents,
            currentSearchedEvents,
            Number(currentPage.textContent),
          );
          paginationPageList.children[0].classList.add('active-page');
          if (nextPageButton) {
            nextPageButton.classList.remove('hidden');
          }
          if (paginationPageList.children.length <= 1) {
            paginationContainer.classList.add('hidden');
          } else {
            paginationContainer.classList.remove('hidden');
          }
        }

        if (sortByEl.value !== '') {
          currentSearchAndSortedEvents = articleJson;
        } else if (selectedFiltersArray.length > 0) {
          currentSearchedAndFilteredEvents = articleJson;
        }
      };

      const searchForm = document.querySelector('.filter-search-wrapper');
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let searchedEvents = [...defaultSortedArticle];
        const formData = new FormData(e.target);
        const value = Object.fromEntries(formData)['filter-search'].toLowerCase();

        // Implement search through filtered events
        const selectedFiltersValues = Object.values(selectedFilters);
        selectedFiltersValues.forEach((filterValue) => {
          if (filterValue[0] !== undefined) {
            selectedFiltersArray.push(filterValue[0]);
          }
        });

        if (sortByEl.value !== '' && selectedFiltersArray.length > 0) {
          searchedEvents = currentFilteredAndSortedEvents;
          currentEvenData = currentFilteredAndSortedEvents;
          handleSearch(value, currentFilteredAndSortedEvents);
        } else if (sortByEl.value !== '' && selectedFiltersArray.length <= 0) {
          searchedEvents = currentSortedEvents;
          currentEvenData = currentSortedEvents;
          handleSearch(value, currentSortedEvents);
        } else if (selectedFiltersArray.length > 0) {
          searchedEvents = currentFilteredEvents;
          currentEvenData = currentFilteredEvents;
          handleSearch(value, searchedEvents);
        } else if (value === '') {
          handleSearch(value, defaultSortedArticle);
        } else {
          handleSearch(value, searchedEvents);
        }

        updateBrowserUrl(searchParams, 'page', 1);

        if (prevPageButton && paginationPageList.children[0].className.includes('active-page')) {
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

      // Events Filter logic
      const updateSelectedFilters = (state, key, value) => {
        if (state === true && value.includes('all')) {
          selectedFilters[key].pop();
          searchParams.delete(key);
        } else if (
          (state === true && key === 'filter-program') ||
          key === 'filter-type' ||
          key === 'filter-industry' ||
          key === 'filter-topic'
        ) {
          selectedFilters[key].pop();
          selectedFilters[key].push(value);
          updateFiltersUrlParams();
        } else if (state === true && !selectedFilters[key].includes(value)) {
          selectedFilters[key].push(value);
          updateFiltersUrlParams();
        } else if (state === false && selectedFilters[key].includes(value)) {
          selectedFilters[key].splice(selectedFilters[key].indexOf(value), 1);
          searchParams.delete(key);
          updateFiltersUrlParams();
        }
        const newRelativePathQuery = `${window.location.pathname}?${searchParams.toString()}`;
        window.history.pushState(null, '', newRelativePathQuery);
        return selectedFilters;
      };

      const handleFilterEvents = (filters, articleList) => {
        let articleJson = articleList;
        if (filters['filter-program'].length > 0) {
          articleJson = articleJson.filter((event) =>
            filters['filter-program'].some((searchTag) =>
              event.eventTags.some((tag) => tag.toLowerCase().includes(searchTag.toLowerCase())),
            ),
          );
        }

        if (filters['filter-type'].length > 0 && Array.isArray(filters['filter-type'])) {
          articleJson = articleJson.filter((event) =>
            filters['filter-type'].some((searchTag) =>
              event.eventTags.some((tag) => tag.toLowerCase().includes(searchTag.toLowerCase())),
            ),
          );
        }

        if (filters['filter-industry'].length > 0 && Array.isArray(filters['filter-industry'])) {
          articleJson = articleJson.filter((event) =>
            filters['filter-industry'].some((searchTag) =>
              event.eventTags.some((tag) => tag.toLowerCase().includes(searchTag.toLowerCase())),
            ),
          );
        }

        if (filters['filter-capability'].length > 0) {
          articleJson = articleJson.filter((event) =>
            filters['filter-capability'].some((searchTag) =>
              event.eventTags.some((tag) => tag.toLowerCase().includes(searchTag.toLowerCase())),
            ),
          );
        }

        if (filters['filter-topic'].length > 0 && Array.isArray(filters['filter-topic'])) {
          articleJson = articleJson.filter((event) =>
            filters['filter-topic'].some((searchTag) =>
              event.eventTags.some((tag) => tag.toLowerCase().includes(searchTag.toLowerCase())),
            ),
          );
        }

        currentFilteredEvents = articleJson;
        currentEvenData = articleJson;

        if (articleJson.length === 0) {
          EventsContainer.innerHTML = `
      <h4 class="no-events">Sorry, there are no results based on these choices. Please update and try again.</h4>
    `;
          paginationContainer.classList.add('hidden');
          updateBrowserUrl(searchParams, 'page', 1);
        } else {
          appendEvents(articleJson);
          paginationContainer.classList.remove('hidden');
          const currentPage = paginationPageList.children[0];
          paginationPageList.innerHTML = renderPages(
            numOfEvents,
            currentFilteredEvents,
            Number(currentPage.textContent),
          );
          paginationPageList.children[0].classList.add('active-page');
          if (nextPageButton) {
            nextPageButton.classList.remove('hidden');
          }
          if (paginationPageList.children.length <= 1) {
            paginationContainer.classList.add('hidden');
          } else {
            paginationContainer.classList.remove('hidden');
          }
        }

        if (searchInput.value !== '') {
          currentSearchedAndFilteredEvents = articleJson;
        } else if (sortByEl.value !== '') {
          currentFilteredAndSortedEvents = articleJson;
        }
      };

      const allFilterOptions = document.querySelectorAll('.filter-category-item input');
      allFilterOptions.forEach((filterOption) => {
        filterOption.addEventListener('click', () => {
          updateSelectedFilters(filterOption.checked, filterOption.dataset.filterCategory, filterOption.value);
          let filteredEvents = [...defaultSortedArticle];

          if (sortByEl.value !== '' && searchInput.value !== '') {
            handleFilterEvents(selectedFilters, currentSearchAndSortedEvents);
          } else if (sortByEl.value !== '' && searchInput.value === '') {
            filteredEvents = currentSortedEvents;

            handleFilterEvents(selectedFilters, currentSortedEvents);
          } else if (searchInput.value !== '' && sortByEl.value === '') {
            filteredEvents = currentSearchedEvents;

            handleFilterEvents(selectedFilters, currentSearchedEvents);
          } else {
            handleFilterEvents(selectedFilters, filteredEvents);
          }

          updateBrowserUrl(searchParams, 'page', 1);

          if (prevPageButton && paginationPageList.children[0].className.includes('active-page')) {
            prevPageButton.classList.add('hidden');
          }
        });
      });

      // Append articles based on active page
      const appendNewActiveArticlePage = (startIndex, endIndex, currentPage, articlesJson) => {
        let newCurrentEvenData;
        if (Number(currentPage.textContent) * Number(numOfEvents) >= articlesJson.length) {
          newCurrentEvenData = articlesJson.slice(startIndex);
        } else {
          newCurrentEvenData = articlesJson.slice(startIndex, endIndex);
        }
        appendEvents(newCurrentEvenData);
      };

      const handlePageClick = (paginations, activePage) => {
        const newPageList = paginations.querySelectorAll('.pagination-page');
        newPageList.forEach((newPage) => {
          newPage.classList.remove('active-page');
          if (activePage === newPage.textContent) {
            newPage.classList.add('active-page');
          }
        });

        if (activePage > '1') {
          prevPageButton.classList.remove('hidden');
        } else {
          prevPageButton.classList.add('hidden');
        }

        if (activePage === paginations.lastChild.textContent) {
          nextPageButton.classList.add('hidden');
        } else {
          nextPageButton.classList.remove('hidden');
        }
      };

      const handlePaginationNav = (paginations, nextActivePage) => {
        [...paginations.children].forEach((page) => page.classList.remove('active-page'));
        nextActivePage.classList.add('active-page');
        paginationPageList.innerHTML = renderPages(numOfEvents, currentEvenData, Number(nextActivePage.textContent));

        handlePageClick(paginationPageList, nextActivePage.textContent);

        appendNewActiveArticlePage(
          Number(nextActivePage.textContent) * Number(numOfEvents) - Number(numOfEvents),
          Number(nextActivePage.textContent) * Number(numOfEvents),
          nextActivePage,
          currentEvenData,
        );
        updateBrowserUrl(searchParams, 'page', nextActivePage.textContent);
      };

      paginationContainer.addEventListener('click', (e) => {
        if (e.target && e.target.nodeName === 'BUTTON' && e.target.className === '') {
          const { target } = e;
          const targetPageContainer = target.parentElement.parentElement;
          [...targetPageContainer.children].forEach((page) => page.classList.remove('active-page'));
          target.parentElement.classList.add('active-page');

          paginationPageList.innerHTML = renderPages(numOfEvents, currentEvenData, Number(target.textContent));

          handlePageClick(paginationPageList, target.textContent);

          appendNewActiveArticlePage(
            Number(target.textContent) * Number(numOfEvents) - Number(numOfEvents),
            Number(target.textContent) * Number(numOfEvents),
            target,
            currentEvenData,
          );
          updateBrowserUrl(searchParams, 'page', target.textContent);

          const pagItems = document.querySelectorAll('.pagination-page');
          for (let i = 0; i < pagItems.length; i += 1) {
            pagItems[i].removeAttribute('aria-current');
            if (pagItems[i].classList.contains('active-page')) {
              pagItems[i].setAttribute('aria-current', 'true');
            }
          }
        }
      });

      nextPageButton.addEventListener('click', () => {
        const paginationList = nextPageButton.previousElementSibling;
        const activePage = [...paginationList.children].find((page) => page.classList.contains('active-page'));
        const nextActivePage = activePage.nextElementSibling;
        handlePaginationNav(paginationList, nextActivePage);
      });

      prevPageButton.addEventListener('click', () => {
        const paginationList = prevPageButton.nextElementSibling;
        const activePage = [...paginationList.children].find((page) => page.classList.contains('active-page'));
        const nextActivePage = activePage.previousElementSibling;
        handlePaginationNav(paginationList, nextActivePage);
      });
    });
}
