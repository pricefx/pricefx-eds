import ffetch from '../../scripts/ffetch.js';

/**
 * Helps set multiple attributes to an element at once
 * @param {Element} element The element you want to set the attributes to
 * @param {attributes} Object An object containing the attributes as key/value pairs
 */
const setAttributes = (element, attributes) => {
  Object.entries(attributes).forEach(([key, val]) => {
    element.setAttribute(key, val);
  });
};

// Get filter options from JSON data
const getFilterOptions = (clientsDataJson, filterName) => {
  const allOptions = [];
  if (filterName === 'industries') {
    clientsDataJson.forEach((client) => {
      allOptions.push(client.industries.trim().toLowerCase());
    });
  } else {
    clientsDataJson.forEach((client) => {
      allOptions.push(client.region.trim().toLowerCase());
    });
  }
  const uniqueOptionsArray = [...new Set(allOptions)];
  return uniqueOptionsArray;
};

// Render client logos from JSON data
const renderClientLogos = (clientsDataJson, noResultsText) => {
  let markup = '';
  if (clientsDataJson.length > 0) {
    clientsDataJson.forEach((client) => {
      const imageAltText = client['alt text'].includes('-')
        ? client['alt text'].replaceAll('-', ' ')
        : client['alt text'];
      markup += `
        <li class="tabbed-filter__content-item">
          <img class="tabbed-filter__content-item-image" src="${client.logo}" alt="${imageAltText}">
        </li>
      `;
    });
    return markup;
  }
  markup = `
      <p class="no-clients">${noResultsText.textContent.trim()}</p>
    `;
  return markup;
};

// Render filter options markup
const renderFilterOptions = (filterOptions) => {
  let markup = '';
  filterOptions.forEach((option) => {
    markup += `
      <option value="${option}">${option}</option>
    `;
  });
  return markup;
};

// Append client logos markup
const appendClientLogos = (clientsDataJson, clientLogosContainer, noResultsText) => {
  clientLogosContainer.innerHTML = renderClientLogos(clientsDataJson, noResultsText);
};

// Handle filter logic
const handleFilter = (
  clientsDataJson,
  industriesFilter,
  regionsFilter,
  clientLogosContainer,
  showMoreCta,
  showMoreLabel,
  noResultsText,
) => {
  let currentFilteredData = [...clientsDataJson];
  let initialCurrentFilteredData;
  if (industriesFilter.value !== 'all-industries' && regionsFilter.value === 'all-regions') {
    currentFilteredData = currentFilteredData.filter(
      (filteredData) => filteredData.industries.trim().toLowerCase() === industriesFilter.value,
    );
    initialCurrentFilteredData = currentFilteredData.slice(currentFilteredData, 12);
    appendClientLogos(initialCurrentFilteredData, clientLogosContainer, noResultsText);
  } else if (industriesFilter.value === 'all-industries' && regionsFilter.value !== 'all-regions') {
    currentFilteredData = currentFilteredData.filter(
      (filteredData) => filteredData.region.trim().toLowerCase() === regionsFilter.value,
    );
    initialCurrentFilteredData = currentFilteredData.slice(currentFilteredData, 12);
    appendClientLogos(initialCurrentFilteredData, clientLogosContainer, noResultsText);
  } else if (industriesFilter.value !== 'all-industries' && regionsFilter.value !== 'all-regions') {
    currentFilteredData = currentFilteredData.filter(
      (filteredData) =>
        filteredData.industries.trim().toLowerCase() === industriesFilter.value &&
        filteredData.region.trim().toLowerCase() === regionsFilter.value,
    );
    initialCurrentFilteredData = currentFilteredData.slice(currentFilteredData, 12);
    appendClientLogos(initialCurrentFilteredData, clientLogosContainer, noResultsText);
  } else {
    currentFilteredData = clientsDataJson;
    initialCurrentFilteredData = currentFilteredData.slice(currentFilteredData, 12);
    appendClientLogos(initialCurrentFilteredData, clientLogosContainer, noResultsText);
  }

  showMoreCta.setAttribute('aria-expanded', 'false');
  showMoreCta.textContent = showMoreLabel.textContent.trim();
  if (currentFilteredData.length <= 12) {
    showMoreCta.classList.add('hidden');
  } else {
    showMoreCta.classList.remove('hidden');
  }

  return currentFilteredData;
};

// Handle show more or less clients logos
const handleCtaClick = (
  industriesFilter,
  regionsFilter,
  initialClientsData,
  filteredClientsData,
  contentContainer,
  noResultsText,
) => {
  if (industriesFilter.value !== 'all-industries' && regionsFilter.value === 'all-regions') {
    appendClientLogos(filteredClientsData, contentContainer, noResultsText);
  } else if (industriesFilter.value === 'all-industries' && regionsFilter.value !== 'all-regions') {
    appendClientLogos(filteredClientsData, contentContainer, noResultsText);
  } else if (industriesFilter.value !== 'all-industries' && regionsFilter.value !== 'all-regions') {
    appendClientLogos(filteredClientsData, contentContainer, noResultsText);
  } else {
    appendClientLogos(initialClientsData, contentContainer, noResultsText);
  }
};

export default async function decorate(block) {
  const [
    spreadsheetPath,
    eyebrowText,
    title,
    showMoreLabel,
    showLessLabel,
    noResultsText,
    filterIndustryAllLabel,
    filterRegionAllLabel,
  ] = block.children;
  block.textContent = '';

  // Fetch client logos from JSON endpoint
  const clientData = await ffetch(spreadsheetPath.textContent.trim()).all();
  const initialClientData = clientData.slice(clientData, 12);
  let filteredClientsData = clientData;

  // Create eyebrow element
  if (eyebrowText.textContent.trim() !== '') {
    const eyebrowEl = document.createElement('p');
    eyebrowEl.classList.add('tabbed-filter__eyebrow');
    eyebrowEl.textContent = eyebrowText.textContent.trim();
    block.append(eyebrowEl);
  }

  // Create title element
  if (title.textContent.trim() !== '') {
    const titleEl = document.createElement('h2');
    titleEl.classList.add('tabbed-filter__title');
    titleEl.textContent = title.textContent.trim();
    block.append(titleEl);
  }

  // Create the variables to store the filter options
  const industriesFilterOptions = getFilterOptions(clientData, 'industries');
  const regionsFilterOptions = getFilterOptions(clientData, 'region');

  // Create container to hold the filter dropdowns
  if (!industriesFilterOptions.length > 0 && !regionsFilterOptions.length > 0) {
    return;
  }
  const filtersWrapper = document.createElement('div');
  filtersWrapper.classList.add('tabbed-filter__filters-wrapper');
  block.append(filtersWrapper);

  // Create industries filter
  if (industriesFilterOptions.length > 0) {
    const industriesFilterContainer = document.createElement('div');
    industriesFilterContainer.classList.add('tabbed-filter__filter-container');
    filtersWrapper.append(industriesFilterContainer);
    const industriesFilterLabel = document.createElement('label');
    setAttributes(industriesFilterLabel, { class: 'sr-only', for: 'filter-industries' });
    industriesFilterLabel.textContent = 'Filter by Industries';
    const industriesFilter = document.createElement('select');
    setAttributes(industriesFilter, {
      class: 'tabbed-filter__filter tabbed-filter__industries-filter',
      name: 'filter-industries',
      id: 'filter-industries',
    });
    industriesFilterContainer.append(industriesFilterLabel);
    industriesFilterContainer.append(industriesFilter);

    industriesFilter.innerHTML = `
    <option value="all-industries" selected>${filterIndustryAllLabel.textContent.trim()}</option>
    ${renderFilterOptions(industriesFilterOptions)}
  `;
  }

  // Create regions filter
  if (regionsFilterOptions.length > 0) {
    const regionsFilterContainer = document.createElement('div');
    regionsFilterContainer.classList.add('tabbed-filter__filter-container');
    filtersWrapper.append(regionsFilterContainer);
    const regionsFilterLabel = document.createElement('label');
    setAttributes(regionsFilterLabel, { class: 'sr-only', for: 'filter-regions' });
    regionsFilterLabel.textContent = 'Filter by Regions';
    const regionsFilter = document.createElement('select');
    setAttributes(regionsFilter, {
      class: 'tabbed-filter__filter tabbed-filter__regions-filter',
      name: 'filter-regions',
      id: 'filter-regions',
    });
    regionsFilterContainer.append(regionsFilterLabel);
    regionsFilterContainer.append(regionsFilter);

    regionsFilter.innerHTML = `
      <option value="all-regions" selected>${filterRegionAllLabel.textContent.trim()}</option>
      ${renderFilterOptions(regionsFilterOptions)}
    `;
  }

  // Create content container
  const contentContainer = document.createElement('ul');
  setAttributes(contentContainer, {
    class: 'tabbed-filter__content-container',
    id: 'content-container',
    'aria-labelledby': 'content-container-toggle',
  });
  block.append(contentContainer);
  appendClientLogos(initialClientData, contentContainer, noResultsText);

  // Create show more CTA
  const industriesFilter = document.getElementById('filter-industries');
  const regionsFilter = document.getElementById('filter-regions');
  if (showMoreLabel.textContent.trim() !== '' && filteredClientsData.length > 12) {
    const showMoreCta = document.createElement('button');
    setAttributes(showMoreCta, {
      class: 'tabbed-filter__show-more-cta primary',
      id: 'content-container-toggle',
      'aria-controls': 'content-container',
      'aria-expanded': 'false',
    });
    showMoreCta.textContent = showMoreLabel.textContent.trim();
    block.append(showMoreCta);

    showMoreCta.addEventListener('click', () => {
      if (showMoreCta.getAttribute('aria-expanded') === 'false') {
        showMoreCta.setAttribute('aria-expanded', 'true');
        showMoreCta.textContent = showLessLabel.textContent.trim();
        handleCtaClick(industriesFilter, regionsFilter, clientData, filteredClientsData, contentContainer);
      } else {
        showMoreCta.setAttribute('aria-expanded', 'false');
        showMoreCta.textContent = showMoreLabel.textContent.trim();
        handleCtaClick(industriesFilter, regionsFilter, initialClientData, filteredClientsData, contentContainer);
      }
    });
  }

  // Handle filter logics
  const showMoreCta = document.querySelector('.tabbed-filter__show-more-cta');
  industriesFilter.addEventListener('change', () => {
    filteredClientsData = handleFilter(
      clientData,
      industriesFilter,
      regionsFilter,
      contentContainer,
      showMoreCta,
      showMoreLabel,
    );
  });

  regionsFilter.addEventListener('change', () => {
    filteredClientsData = handleFilter(
      clientData,
      industriesFilter,
      regionsFilter,
      contentContainer,
      showMoreCta,
      showMoreLabel,
    );
  });
}
