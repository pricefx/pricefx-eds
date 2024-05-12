import ffetch from '../../scripts/ffetch.js';
import { createOptimizedPicture } from '../../scripts/aem.js';
import { environmentMode } from '../../scripts/global-functions.js';
import { BASE_CONTENT_PATH } from '../../scripts/url-constants.js';

const isDesktop = window.matchMedia('(min-width: 986px)');

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
    contentWrapper.classList.toggle('learning-center-content--full-width', false);
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
    contentWrapper.classList.toggle('learning-center-content--full-width', true);
  }

  const filterMenuAriaHidden = filterMenu.attributes[3].value;
  const setFilterMenuAriaHidden = filterMenuAriaHidden === 'false' ? 'true' : 'false';
  filterMenu.setAttribute('aria-hidden', setFilterMenuAriaHidden);
};

// Close Mobile Navigation on ESC Key
const closeMobileFilterOnEscape = (e) => {
  if (e.code === 'Escape' && !isDesktop.matches) {
    const filterMenuToggle = document.getElementById('filter-menu-toggle');
    const filterMenu = document.getElementById('filter-menu');
    if (filterMenuToggle.getAttribute('aria-expanded') === 'true') {
      filterMenuToggle.setAttribute('aria-expanded', 'false');
      filterMenu.setAttribute('aria-hidden', 'true');
    }
  }
};
window.addEventListener('keydown', closeMobileFilterOnEscape);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

/**
 * Decorates Learning Center on DOM
 * @param {Element} block The Learning Center block element
 */
export default async function decorate(block) {
  const [
    featuredArticle,
    searchPath,
    searchPlaceholder,
    authorDirectoryPath,
    numOfArticles,
    defaultSort,
    filterOne,
    filterOneIsMultiSelect,
    filterOneOptions,
    filterTwo,
    filterTwoIsMultiSelect,
    filterTwoOptions,
    filterThree,
    filterThreeIsMultiSelect,
    filterThreeOptions,
    filterFour,
    filterFourIsMultiSelect,
    filterFourOptions,
  ] = block.children;
  block.innerHTML = '';

  // Fetch Articles content from JSON endpoint
  const articleData = await ffetch(searchPath.textContent.trim()).all();

  const featuredArticlePath = featuredArticle.textContent.trim().split('/en')[1];
  const featuredArticleData = articleData.find((data) => data.path.includes(featuredArticlePath));
  const noFeaturedArticleData = articleData.filter((data) => !data.path.includes(featuredArticlePath));
  const defaultSortedArticle = noFeaturedArticleData.sort(
    (a, b) => new Date(b.articlePublishDate) - new Date(a.articlePublishDate),
  );
  let currentArticleData = [...defaultSortedArticle];

  const queryStr = 'page=1&sortBy=desc-date';
  const searchParams = new URLSearchParams(queryStr);

  // Creates a div container to hold the Filter Menu Toggle and Sort by dropdown
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
  const learningCenterContent = document.createElement('div');
  learningCenterContent.classList.add('learning-center-content');
  const articlesContainer = document.createElement('ul');
  articlesContainer.classList.add('articles-container');
  const featuredArticleContainer = document.createElement('div');
  featuredArticleContainer.classList.add('featured-article');
  flexContainer.append(learningCenterContent);
  learningCenterContent.append(featuredArticleContainer);
  learningCenterContent.append(articlesContainer);

  // Creates a div container to hold pagination
  const paginationContainer = document.createElement('div');
  paginationContainer.classList.add('pagination-wrapper');
  learningCenterContent.append(paginationContainer);

  // Markup for filterControls
  filterControls.innerHTML = `
    <button class="filter-menu-toggle" id="filter-menu-toggle" aria-controls="filter-menu" aria-expanded="true"><span class="filter-icon"></span><span class="toggle-label">Hide Filters</span></button>
    ${
      defaultSort.textContent !== ''
        ? `<div class="sort-content-wrapper">
        <label for="sort-content" class="sr-only">Short by</label>
        <select name="sort-content" id="sort-content">
          <option value="" selected disabled>Sort by</option>
          ${
            defaultSort.textContent.includes('date')
              ? `<optgroup label="Date">
              ${defaultSort.textContent.includes('desc-date') ? `<option value="desc-date">Date (New → Old)</option>` : ''}
              ${defaultSort.textContent.includes('asc-date') ? `<option value="asc-date">Date (Old → New)</option>` : ''}
            </optgroup>`
              : ''
          }
          ${
            defaultSort.textContent.includes('title')
              ? `<optgroup label="Title">
              ${defaultSort.textContent.includes('asc-title') ? `<option value="asc-title">Title (A → Z)</option>` : ''}
              ${defaultSort.textContent.includes('desc-title') ? `<option value="desc-title">Title (Z → A)</option>` : ''}
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
    toggleFilterMenu(filterMenuToggle, filter, learningCenterContent);
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
    filterAllId,
    filterCategoryName,
  ) => {
    const optionsArray = filterCategoryOptions.textContent.trim().split(',');
    let filterOptionsMarkup = '';
    optionsArray.forEach((option) => {
      const optionSplit = option.split('/')[1];
      const optionReplace = optionSplit.replaceAll('-', ' ');
      if (filterIsMultiSelect.textContent.trim() === 'false') {
        filterOptionsMarkup += `
          <li class="filter-category-item">
            <input type="radio" id="filter-${optionSplit}" name="${filterCategoryName}" value="${optionSplit}" data-filter-category="${filterCategoryName}" />
            <label for="filter-${optionSplit}">${optionSplit === 'e-books' || optionSplit === 'c-suite' ? optionSplit : optionReplace}</label>
          </li>
        `;
      } else {
        filterOptionsMarkup += `
          <li class="filter-category-item">
            <input type="checkbox" id="filter-${optionSplit}" name="${optionSplit}" value="${optionSplit}" data-filter-category="${filterCategoryName}" />
            <label for="filter-${optionSplit}">${optionSplit === 'e-books' || optionSplit === 'c-suite' ? optionSplit : optionReplace}</label>
          </li>
        `;
      }
    });

    const markup = `
      <div class="filter-category">
        <button class="filter-category-toggle" id="filter-category-${filterNum}-toggle" aria-controls="filter-category-${filterNum}-content" aria-expanded="true">${filterCategoryLabel.textContent.trim()}<span class="accordion-icon"></span></button>
        <ul class="filter-category-content" id="filter-category-${filterNum}-content" aria-labelledby="filter-category-${filterNum}-toggle" aria-hidden="false">
          ${
            filterIsMultiSelect.textContent.trim() === 'false'
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
      <input type="text" name="filter-search" id="filter-search" placeholder=${searchPlaceholder.textContent.trim()} />
      <button type="submit" aria-label="Submit search"></button>
    </form>
    ${renderFilterCategory(1, filterOne, filterOneIsMultiSelect, filterOneOptions, 'filter-all-content-type', 'filter-type')}
    ${renderFilterCategory(2, filterTwo, filterTwoIsMultiSelect, filterTwoOptions, 'filter-all-industry', 'filter-industry')}
    ${renderFilterCategory(3, filterThree, filterThreeIsMultiSelect, filterThreeOptions, 'filter-all-role', 'filter-role')}
    ${renderFilterCategory(4, filterFour, filterFourIsMultiSelect, filterFourOptions, 'filter-all-pfx', 'filter-pfx')}
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

  // Clean-up and Render Article Category
  const renderArticleCategory = (articles) => {
    const categoriesArray = articles.category.split(',');
    if (categoriesArray.length !== 0) {
      const firstCategory = categoriesArray[0];
      let markup = '';
      const removePrefixCategory = firstCategory.split('/')[1];
      const removeHyphenCategory =
        removePrefixCategory !== 'e-books' && removePrefixCategory !== 'c-suite'
          ? removePrefixCategory.replaceAll('-', ' ')
          : removePrefixCategory;
      markup = `<p class="article-subtitle">${removeHyphenCategory}</p>`;
      return markup;
    }
    return null;
  };

  // Clean-up and Render Article Authors
  const renderArticleAuthors = (article) => {
    const authorsArray = article.authors.split(',');
    const postDate = formatDate(article.articlePublishDate);
    let markup = '';
    let innerMarkup = '';

    // Formatting authorsParentPagePath
    let authorsParentPagePathFormatted = authorDirectoryPath.textContent.trim();
    const isPublishEnvironment = environmentMode() === 'publish';

    // Append a slash only if the URL doesn't already end with it
    if (!authorsParentPagePathFormatted.endsWith('/')) {
      authorsParentPagePathFormatted += '/';
    }

    if (isPublishEnvironment) {
      // In the publish environment, remove the base path if present
      authorsParentPagePathFormatted = authorsParentPagePathFormatted.replace(BASE_CONTENT_PATH, '');
    }

    authorsArray.forEach((author) => {
      if (author === '') {
        return;
      }

      const removePrefixAuthor = author.split('/')[1];
      const removeHyphenAuthor = removePrefixAuthor.replaceAll('-', ' ');
      let authorPageLink = '';

      if (!isPublishEnvironment) {
        authorPageLink = `${authorsParentPagePathFormatted}${removePrefixAuthor}.html`;
      } else {
        authorPageLink = `${authorsParentPagePathFormatted}${removePrefixAuthor}`;
      }

      innerMarkup +=
        authorsArray.indexOf(author) + 1 === authorsArray.length
          ? `<a class="article-author-link" href="${authorPageLink}">${removeHyphenAuthor}</a>`
          : `<a class="article-author-link" href="${authorPageLink}">${removeHyphenAuthor}</a> & `;
    });
    markup = `<p class="article-info">${article.author !== '' ? `By ${innerMarkup}` : ''} ${article.articlePublishDate !== '' ? `${article.author !== '' ? 'on' : ''} ${postDate}</p>` : ''}`;
    return markup;
  };

  // Render Featured Article
  featuredArticleContainer.innerHTML = `
    <div class="article-image">
      <picture>
        <img src="${featuredArticleData.image || ''}" alt="${featuredArticleData.imageAlt || featuredArticleData.title}">
      </picture>
    </div>
    <div class="article-content">
      ${
        featuredArticleData.category !== '' ||
        featuredArticleData.title !== '' ||
        featuredArticleData.authors !== '' ||
        featuredArticleData.articlePublishDate !== ''
          ? `<div class="article-details">
          ${featuredArticleData.category !== '' ? renderArticleCategory(featuredArticleData) : ''}
          ${featuredArticleData.title !== '' ? `<h2 class="article-title">${featuredArticleData.title}</h2>` : ''}
          ${featuredArticleData.authors !== '' || featuredArticleData.articlePublishDate !== '' ? renderArticleAuthors(featuredArticleData) : ''}
        </div>`
          : ''
      }
      <div class="article-cta-container">
        <a class="article-link" href="${featuredArticleData.path}">Read Now</a>
        ${featuredArticleData.readingTime !== '' ? `<p class="article-readtime">${featuredArticleData.readingTime} min read</p>` : ''}
      </div>
    </div>
  `;

  featuredArticleContainer
    .querySelectorAll('img')
    .forEach((img) =>
      img
        .closest('picture')
        .replaceWith(createOptimizedPicture(img.src, img.alt, true, [{ media: '(min-width: 640px)', width: '594' }])),
    );

  // Render Learning Center Article Card
  const renderArticleCard = (articleDataList) => {
    let initialArticleData = articleDataList;
    const initialArticleCount = initialArticleData.length;
    if (
      Number(numOfArticles.textContent.trim()) !== '' &&
      initialArticleCount > Number(numOfArticles.textContent.trim())
    ) {
      initialArticleData = articleDataList.slice(noFeaturedArticleData, numOfArticles.textContent.trim());
    }
    let markup = '';
    initialArticleData.forEach((article) => {
      renderArticleAuthors(article);
      markup += `
        <li class="article-card">
          <div class="article-image">
            <picture>
              <img src="${article.image || ''}" alt="${article.imageAlt || article.title}">
            </picture>
          </div>
          <div class="article-content">
            ${
              article.category !== '' ||
              article.title !== '' ||
              article.authors !== '' ||
              article.articlePublishDate !== ''
                ? `<div class="article-details">
                ${article.category !== '' ? renderArticleCategory(article) : ''}
                ${article.title !== '' ? `<h2 class="article-title">${article.title}</h2>` : ''}
                ${article.authors !== '' || article.articlePublishDate !== '' ? renderArticleAuthors(article) : ''}
              </div>`
                : ''
            }
            <div class="article-cta-container">
              <a class="article-link" href="${article.path}">Read Now</a>
              ${article.readingTime !== '' ? `<p class="article-readtime">${article.readingTime} min read</p>` : ''}
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
  appendLearningCenterArticles(defaultSortedArticle);

  articlesContainer
    .querySelectorAll('img')
    .forEach((img) =>
      img
        .closest('picture')
        .replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 640px)', width: '594' }])),
    );

  // Render pagination pages
  const renderPages = (articlePerPage, articleList, currentPage) => {
    const totalArticles = articleList.length;
    const totalPageNumber = Math.ceil(totalArticles / articlePerPage);
    const firstPageMarkup = `<li class="pagination-page active-page" id="page-1"><button>1</button></li>`;
    const lastPageMarkup = `<li class="pagination-page" id="page-${totalPageNumber}"><button>${totalPageNumber}</button></li>`;
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
          <li class="pagination-page" id="page-${centerPage}"><button>${centerPage}</button></li>
        `;
      }
    });
    paginationMarkup = firstPageMarkup + middlePageMarkup + lastPageMarkup;
    return paginationMarkup;
  };

  paginationContainer.innerHTML = `
    ${Number(numOfArticles.textContent.trim()) > defaultSortedArticle.length ? '' : '<button class="pagination-prev hidden">Previous</button>'}
    <ul class="pagination-pages-list">
      ${renderPages(numOfArticles.textContent.trim(), defaultSortedArticle, 1)}
    </ul>
    ${Number(numOfArticles.textContent.trim()) > defaultSortedArticle.length ? '' : '<button class="pagination-next">Next</button>'}
  `;

  const paginationPageList = document.querySelector('.pagination-pages-list');
  const prevPageButton = document.querySelector('.pagination-prev');
  const nextPageButton = document.querySelector('.pagination-next');

  if (paginationPageList.children.length === 1) {
    paginationContainer.classList.add('hidden');
  } else {
    paginationContainer.classList.remove('hidden');
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

  // Learning Center Sort By logic
  const handleSortArticles = (sortBy, articleDataList) => {
    let articleJson = articleDataList;
    sortByEl.style.width = 'auto';
    if (sortBy === 'desc-date') {
      articleJson = articleJson.sort((a, b) => new Date(b.articlePublishDate) - new Date(a.articlePublishDate));
      appendLearningCenterArticles(articleJson);
    } else if (sortBy === 'asc-date') {
      articleJson = articleJson.sort((a, b) => new Date(a.articlePublishDate) - new Date(b.articlePublishDate));
      appendLearningCenterArticles(articleJson);
    } else if (sortBy === 'asc-title') {
      sortByEl.style.width = '140px';
      articleJson = articleJson.sort((a, b) => a.title.localeCompare(b.title));
      appendLearningCenterArticles(articleJson);
    } else {
      sortByEl.style.width = '140px';
      articleJson = articleJson.sort((a, b) => b.title.localeCompare(a.title));
      appendLearningCenterArticles(articleJson);
    }

    currentSortedArticles = articleJson;
    currentArticleData = articleJson;

    if (articleJson.length === 0) {
      articlesContainer.innerHTML = `
        <h4 class="no-articles">Sorry, there are no results based on these choices. Please update and try again.</h4>
      `;
      paginationContainer.classList.add('hidden');
      searchParams.set('page', 1);
    } else {
      paginationContainer.classList.remove('hidden');
      const currentPage = [...paginationPageList.children].find((page) => page.classList.contains('active-page'));
      paginationPageList.innerHTML = renderPages(
        numOfArticles.textContent.trim(),
        currentSortedArticles,
        Number(currentPage.textContent),
      );
      if (paginationPageList.children.length <= 1) {
        paginationContainer.classList.add('hidden');
      } else {
        paginationContainer.classList.remove('hidden');
      }
    }

    if (searchInput.value !== '') {
      currentSearchAndSortedArticles = articleJson;
      currentArticleData = articleJson;
    } else if (selectedFiltersArray.length > 0) {
      currentFilteredAndSortedArticles = articleJson;
      currentArticleData = articleJson;
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
      currentArticleData = currentSearchedAndFilteredArticles;
      handleSortArticles(e.target.value, currentSearchedAndFilteredArticles);
    } else if (searchInput.value !== '' && selectedFiltersArray.length <= 0) {
      sortedArticles = currentSearchedArticles;
      currentArticleData = currentSearchedArticles;
      handleSortArticles(e.target.value, currentSearchedArticles);
    } else if (selectedFiltersArray.length > 0) {
      sortedArticles = currentFilteredArticles;
      currentArticleData = currentFilteredArticles;
      handleSortArticles(e.target.value, currentFilteredArticles);
    } else {
      handleSortArticles(e.target.value, sortedArticles);
    }

    if (paginationPageList.children[0].className.includes('active-page')) {
      prevPageButton.classList.add('hidden');
    }
    searchParams.set('sortBy', e.target.value);
    const newRelativePathQuery = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.pushState(null, '', newRelativePathQuery);
  });

  // Learning Center Search logic
  const handleSearch = (query, articleList) => {
    let articleJson = articleList;
    articleJson = articleJson.filter(
      (result) =>
        result.category.includes(query) ||
        result.title.toLowerCase().includes(query) ||
        result.description.toLowerCase().includes(query) ||
        result['cq-tags'].includes(query),
    );

    currentSearchedArticles = articleJson;
    currentArticleData = articleJson;

    if (sortByEl.value !== '') {
      currentSearchAndSortedArticles = articleJson;
      currentArticleData = articleJson;
    } else if (selectedFiltersArray.length > 0) {
      currentSearchedAndFilteredArticles = articleJson;
      currentArticleData = articleJson;
    }

    if (articleJson.length === 0) {
      articlesContainer.innerHTML = `
        <h4 class="no-articles">Sorry, there are no results based on these choices. Please update and try again.</h4>
      `;
      paginationContainer.classList.add('hidden');
      searchParams.set('page', 1);
    } else {
      appendLearningCenterArticles(articleJson);
      paginationContainer.classList.remove('hidden');
      const currentPage = [...paginationPageList.children].find((page) => page.classList.contains('active-page'));
      paginationPageList.innerHTML = renderPages(
        numOfArticles.textContent.trim(),
        currentSearchedArticles,
        Number(currentPage.textContent),
      );
      if (articleJson.length <= Number(numOfArticles.textContent.trim())) {
        searchParams.set('page', 1);
      }
      if (paginationPageList.children.length <= 1) {
        paginationContainer.classList.add('hidden');
      } else {
        paginationContainer.classList.remove('hidden');
      }
    }
  };

  const searchForm = document.querySelector('.filter-search-wrapper');
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let searchedArticles = [...defaultSortedArticle];
    const formData = new FormData(e.target);
    const value = Object.fromEntries(formData)['filter-search'];

    // Implement search through filtered articles
    const selectedFiltersValues = Object.values(selectedFilters);
    selectedFiltersValues.forEach((filterValue) => {
      if (filterValue[0] !== undefined) {
        selectedFiltersArray.push(filterValue[0]);
      }
    });

    if (sortByEl.value !== '' && selectedFiltersArray.length > 0) {
      searchedArticles = currentFilteredAndSortedArticles;
      currentArticleData = currentFilteredAndSortedArticles;
      handleSearch(value, currentFilteredAndSortedArticles);
    } else if (sortByEl.value !== '' && selectedFiltersArray.length <= 0) {
      searchedArticles = currentSortedArticles;
      currentArticleData = currentSortedArticles;
      handleSearch(value, currentSortedArticles);
    } else if (selectedFiltersArray.length > 0) {
      searchedArticles = currentFilteredArticles;
      currentArticleData = currentFilteredArticles;
      handleSearch(value, searchedArticles);
    } else {
      handleSearch(value, searchedArticles);
    }

    if (paginationPageList.children[0].className.includes('active-page')) {
      prevPageButton.classList.add('hidden');
    }
    if (value !== '') {
      searchParams.set('search', value);
    } else {
      searchParams.delete('search');
    }
    const newRelativePathQuery = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.pushState(null, '', newRelativePathQuery);
  });

  // Updates the URL Params based on selected filters
  const updateFiltersUrlParams = () => {
    if (selectedFilters['filter-type'].length > 0) {
      searchParams.set('filter-type', selectedFilters['filter-type'][0]);
    }
    if (selectedFilters['filter-industry'].length > 0) {
      const valuesString = selectedFilters['filter-industry'].toString();
      searchParams.set('filter-industry', valuesString);
    }
    if (selectedFilters['filter-role'].length > 0) {
      const valuesString = selectedFilters['filter-role'].toString();
      searchParams.set('filter-role', valuesString);
    }
    if (selectedFilters['filter-pfx'].length > 0) {
      searchParams.set('filter-pfx', selectedFilters['filter-pfx'][0]);
    }
  };

  // Learning Center Filter logic
  const updateSelectedFilters = (state, key, value) => {
    if (state === true && value.includes('all')) {
      selectedFilters[key].pop();
      searchParams.delete(key);
      updateFiltersUrlParams();
    } else if ((state === true && key === 'filter-type') || key === 'filter-pfx') {
      selectedFilters[key].pop();
      selectedFilters[key].push(value);
      updateFiltersUrlParams();
    } else if (state === true && !selectedFilters[key].includes(value)) {
      selectedFilters[key].push(value);
      updateFiltersUrlParams();
    } else if (state === false && selectedFilters[key].includes(value)) {
      selectedFilters[key].splice(selectedFilters[key].indexOf(value), 1);
      updateFiltersUrlParams();
    }
    const newRelativePathQuery = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.pushState(null, '', newRelativePathQuery);
    return selectedFilters;
  };

  const handleFilterArticles = (filters, articleList) => {
    let articleJson = articleList;
    if (filters['filter-type'].length > 0) {
      articleJson = articleJson.filter((article) => article.category.includes(filters['filter-type']));
    }

    if (filters['filter-industry'].length > 0 && Array.isArray(filters['filter-industry'])) {
      articleJson = articleJson.filter((article) =>
        filters['filter-industry'].some((filterValue) => article.topics.includes(filterValue)),
      );
    } else {
      articleJson = articleJson.filter((article) => article.topics.includes(filters['filter-industry']));
    }

    if (filters['filter-role'].length > 0 && Array.isArray(filters['filter-role'])) {
      articleJson = articleJson.filter((article) =>
        filters['filter-role'].some((filterValue) => article.topics.includes(filterValue)),
      );
    } else {
      articleJson = articleJson.filter((article) => article.topics.includes(filters['filter-role']));
    }

    if (filters['filter-pfx'].length > 0) {
      articleJson = articleJson.filter((article) => article.topics.includes(filters['filter-pfx']));
    }

    currentFilteredArticles = articleJson;
    currentArticleData = articleJson;

    if (articleJson.length === 0) {
      articlesContainer.innerHTML = `
        <h4 class="no-articles">Sorry, there are no results based on these choices. Please update and try again.</h4>
      `;
      paginationContainer.classList.add('hidden');
      searchParams.set('page', 1);
    } else {
      appendLearningCenterArticles(articleJson);
      paginationContainer.classList.remove('hidden');
      const currentPage = [...paginationPageList.children].find((page) => page.classList.contains('active-page'));
      paginationPageList.innerHTML = renderPages(
        numOfArticles.textContent.trim(),
        currentFilteredArticles,
        Number(currentPage.textContent),
      );
      if (articleJson.length <= Number(numOfArticles.textContent.trim())) {
        searchParams.set('page', 1);
      }
      if (paginationPageList.children.length <= 1) {
        paginationContainer.classList.add('hidden');
      } else {
        paginationContainer.classList.remove('hidden');
      }
    }

    if (searchInput.value !== '') {
      currentSearchedAndFilteredArticles = articleJson;
      currentArticleData = articleJson;
    } else if (sortByEl.value !== '') {
      currentFilteredAndSortedArticles = articleJson;
      currentArticleData = articleJson;
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
        currentArticleData = currentSortedArticles;
        handleFilterArticles(selectedFilters, currentSortedArticles);
      } else if (searchInput.value !== '' && sortByEl.value === '') {
        filteredArticles = currentSearchedArticles;
        currentArticleData = currentSearchedArticles;
        handleFilterArticles(selectedFilters, currentSearchedArticles);
      } else {
        handleFilterArticles(selectedFilters, filteredArticles);
      }

      if (paginationPageList.children[0].className.includes('active-page')) {
        prevPageButton.classList.add('hidden');
      }
    });
  });

  // Append articles based on active page
  const appendNewActiveArticlePage = (startIndex, endIndex, currentPage, articlesJson) => {
    let newCurrentArticleData;
    if (Number(currentPage.textContent) * Number(numOfArticles.textContent.trim()) >= articlesJson.length) {
      newCurrentArticleData = articlesJson.slice(startIndex);
    } else {
      newCurrentArticleData = articlesJson.slice(startIndex, endIndex);
    }
    appendLearningCenterArticles(newCurrentArticleData);
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
    paginationPageList.innerHTML = renderPages(
      numOfArticles.textContent.trim(),
      currentArticleData,
      Number(nextActivePage.textContent),
    );

    handlePageClick(paginationPageList, nextActivePage.textContent);

    appendNewActiveArticlePage(
      Number(nextActivePage.textContent) * Number(numOfArticles.textContent.trim()) -
        Number(numOfArticles.textContent.trim()),
      Number(nextActivePage.textContent) * Number(numOfArticles.textContent.trim()),
      nextActivePage,
      currentArticleData,
    );

    searchParams.set('page', nextActivePage.textContent);
    const newRelativePathQuery = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.pushState(null, '', newRelativePathQuery);
  };

  paginationContainer.addEventListener('click', (e) => {
    if (e.target && e.target.nodeName === 'BUTTON' && e.target.className === '') {
      const { target } = e;
      const targetPageContainer = target.parentElement.parentElement;
      [...targetPageContainer.children].forEach((page) => page.classList.remove('active-page'));
      target.parentElement.classList.add('active-page');

      paginationPageList.innerHTML = renderPages(
        numOfArticles.textContent.trim(),
        currentArticleData,
        Number(target.textContent),
      );

      handlePageClick(paginationPageList, target.textContent);

      appendNewActiveArticlePage(
        Number(target.textContent) * Number(numOfArticles.textContent.trim()) -
          Number(numOfArticles.textContent.trim()),
        Number(target.textContent) * Number(numOfArticles.textContent.trim()),
        target,
        currentArticleData,
      );

      searchParams.set('page', target.textContent);
      const newRelativePathQuery = `${window.location.pathname}?${searchParams.toString()}`;
      window.history.pushState(null, '', newRelativePathQuery);
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

  // Set up page state on load based on URL Params
  const updateStateFromUrlParams = (articleJson) => {
    const getUrlParams = window.location.search;
    const loadedSearchParams = new URLSearchParams(getUrlParams);
    const articlesOnLoad = articleJson;
    if (getUrlParams === '') {
      return;
    }

    if (loadedSearchParams.get('sortBy') !== 'desc-date') {
      sortByEl.value = loadedSearchParams.get('sortBy');
      handleSortArticles(loadedSearchParams.get('sortBy'), articlesOnLoad);
    }

    if (loadedSearchParams.get('search') !== null) {
      searchInput.setAttribute('value', loadedSearchParams.get('search'));
      searchInput.value = loadedSearchParams.get('search');
      handleSearch(loadedSearchParams.get('search'), articlesOnLoad);
    }

    if (
      loadedSearchParams.get('filter-type') !== null ||
      loadedSearchParams.get('filter-industry') !== null ||
      loadedSearchParams.get('filter-role') !== null ||
      loadedSearchParams.get('filter-pfx') !== null
    ) {
      let filterIndustry = [];
      let filterRole = [];
      if (loadedSearchParams.get('filter-type') !== null) {
        selectedFilters['filter-type'].push(loadedSearchParams.get('filter-type'));
      }
      if (loadedSearchParams.get('filter-industry') !== null) {
        filterIndustry = loadedSearchParams.get('filter-industry').includes(',')
          ? loadedSearchParams.get('filter-industry').split(',')
          : loadedSearchParams.get('filter-industry');
        if (Array.isArray(filterIndustry)) {
          filterIndustry.forEach((industryItem) => selectedFilters['filter-industry'].push(industryItem));
        } else {
          selectedFilters['filter-industry'].push(filterIndustry);
        }
      }
      if (loadedSearchParams.get('filter-role') !== null) {
        filterRole = loadedSearchParams.get('filter-role').includes(',')
          ? loadedSearchParams.get('filter-role').split(',')
          : loadedSearchParams.get('filter-role');
        if (Array.isArray(filterRole)) {
          filterRole.forEach((roleItem) => selectedFilters['filter-role'].push(roleItem));
        } else {
          selectedFilters['filter-role'].push(filterRole);
        }
      }
      if (loadedSearchParams.get('filter-pfx') !== null) {
        selectedFilters['filter-pfx'].push(loadedSearchParams.get('filter-pfx'));
      }

      const loadedFilters = {
        'filter-type': loadedSearchParams.get('filter-type') !== null ? [loadedSearchParams.get('filter-type')] : [],
        'filter-industry': filterIndustry,
        'filter-role': filterRole,
        'filter-pfx': loadedSearchParams.get('filter-pfx') !== null ? [loadedSearchParams.get('filter-pfx')] : [],
      };
      const filterValuesArray = [];
      const loadedFilterValues = Object.values(loadedFilters);
      loadedFilterValues.forEach((filterValue) => {
        if (filterValue.length === 1) {
          filterValuesArray.push(filterValue[0]);
        } else if (filterValue.length > 1 && Array.isArray(filterValue)) {
          filterValue.forEach((value) => filterValuesArray.push(value));
        } else {
          filterValuesArray.push(filterValue);
        }
      });
      allFilterOptions.forEach((filterOption) => {
        if (filterValuesArray.includes(filterOption.value)) {
          filterOption.checked = true;
          handleFilterArticles(loadedFilters, articlesOnLoad);
        }
      });
    }

    if (loadedSearchParams.get('page') !== '1') {
      paginationPageList.innerHTML = renderPages(
        numOfArticles.textContent.trim(),
        currentArticleData,
        Number(loadedSearchParams.get('page')),
      );
      const pageList = paginationPageList.querySelectorAll('.pagination-page');
      if (pageList.length > 1) {
        pageList.forEach((page) => {
          page.classList.remove('active-page');
          if (loadedSearchParams.get('page') === page.textContent) {
            page.classList.add('active-page');
          }
        });
      }
      appendNewActiveArticlePage(
        Number(loadedSearchParams.get('page')) * Number(numOfArticles.textContent.trim()) -
          Number(numOfArticles.textContent.trim()),
        Number(loadedSearchParams.get('page')) * Number(numOfArticles.textContent.trim()),
        Number(loadedSearchParams.get('page')),
        currentArticleData,
      );
    }
  };
  updateStateFromUrlParams(defaultSortedArticle);
}
