// Render badges based on authored field
const renderBadges = (badges) => {
  const fragment = document.createDocumentFragment();
  badges.forEach((badge) => {
    const badgeContainer = document.createElement('div');
    badgeContainer.classList.add('badge__container');
    const badgeLink = document.createElement('a');
    badgeLink.title = badge.textContent;
    badgeLink.href = 'https://www.g2.com/products/pricefx/reviews?utm_source=rewards-badge';
    const badgeImg = document.createElement('img');
    badgeImg.decoding = 'async';
    badgeImg.alt = badge.textContent;
    badgeImg.dataset.src = badge.href;
    badgeImg.src = badge.href;
    badgeImg.loading = 'lazy'; // Add lazy loading for images
    badgeImg.classList.add('badge__icon');
    badgeLink.appendChild(badgeImg);
    badgeContainer.appendChild(badgeLink);
    fragment.appendChild(badgeContainer);
  });
  return fragment;
};

// Render iframes based on authored field
const renderIframes = (iframes, height, width) => {
  const checkForFalseSource = (iframes[0].textContent.trim().match(/https:/g) || []).length;
  const iframesArray = checkForFalseSource > 1 ? Array.from(iframes).slice(1) : Array.from(iframes);
  const fragment = document.createDocumentFragment();
  if (iframesArray.length === 3) {
    // Creating left column and children elements
    const leftColumn = document.createElement('div');
    leftColumn.classList.add('iframe__left-column');
    if (width) {
      leftColumn.setAttribute('style', `max-width:${width + 36}px;`);
    }
    const iframeContainerOne = document.createElement('div');
    iframeContainerOne.classList.add('iframe__container');
    if (width) {
      iframeContainerOne.setAttribute('style', `max-width:${width + 36}px;`);
    }
    const iframeElOne = document.createElement('iframe');
    iframeElOne.src = iframesArray[0].textContent.trim();
    iframeElOne.setAttribute('frameborder', '0');
    if (height) {
      iframeElOne.setAttribute('style', `min-height:${height}px;`);
    }
    iframeContainerOne.appendChild(iframeElOne);
    leftColumn.appendChild(iframeContainerOne);
    const iframeContainerTwo = document.createElement('div');
    iframeContainerTwo.classList.add('iframe__container');
    if (width) {
      iframeContainerTwo.setAttribute('style', `max-width:${width + 36}px;`);
    }
    const iframeElTwo = document.createElement('iframe');
    iframeElTwo.src = iframesArray[1].textContent.trim();
    iframeElTwo.setAttribute('frameborder', '0');
    if (height) {
      iframeElTwo.setAttribute('style', `min-height:${height}px;`);
    }
    iframeContainerTwo.appendChild(iframeElTwo);
    leftColumn.appendChild(iframeContainerTwo);
    fragment.appendChild(leftColumn);

    // Creating right column and children elements
    const rightColumn = document.createElement('div');
    rightColumn.classList.add('iframe__right-column');
    if (width) {
      rightColumn.setAttribute('style', `max-width:${width + 36}px;`);
    }
    const iframeContainerThree = document.createElement('div');
    iframeContainerThree.classList.add('iframe__container');
    if (width) {
      iframeContainerThree.setAttribute('style', `max-width:${width + 36}px;`);
    }
    const iframeElThree = document.createElement('iframe');
    iframeElThree.src = iframesArray[2].textContent.trim();
    iframeElThree.setAttribute('frameborder', '0');
    if (height) {
      iframeElThree.setAttribute('style', `min-height:${height * 2 + 36}px;`);
    }
    iframeContainerThree.appendChild(iframeElThree);
    rightColumn.appendChild(iframeContainerThree);
    fragment.appendChild(rightColumn);
  } else {
    iframesArray.forEach((iframe) => {
      const iframeSource = iframe.textContent.trim();
      const iframeContainer = document.createElement('div');
      iframeContainer.classList.add('iframe__container');
      if (width) {
        iframeContainer.setAttribute('style', `max-width:${width + 36}px;`);
      }
      const iframeEl = document.createElement('iframe');
      iframeEl.src = iframeSource;
      iframeEl.setAttribute('frameborder', '0');
      if (height) {
        iframeEl.setAttribute('style', `min-height:${height}px;`);
      }
      iframeContainer.appendChild(iframeEl);
      fragment.appendChild(iframeContainer);
    });
  }
  return fragment;
};

export default function decorate(block) {
  const [badgeLinks, iframeLinks, widthElement, heightElement] = block.children;
  const badgeItems = badgeLinks.querySelectorAll('a');
  const iframeItems = iframeLinks.querySelectorAll('p');
  const height = Number(heightElement.textContent);
  const width = Number(widthElement.textContent);
  block.textContent = '';

  // Create badge wrapper element and render individual badges
  if (badgeLinks.textContent.trim() !== '') {
    const badgeWrapper = document.createElement('div');
    badgeWrapper.classList.add('badge__wrapper');
    badgeWrapper.append(renderBadges(badgeItems));
    block.append(badgeWrapper);
  }

  // Create iFrame wrapper element and render individual iFrames
  if (iframeLinks.textContent.trim() !== '') {
    const iframeWrapper = document.createElement('div');
    iframeWrapper.classList.add('iframe__wrapper');

    // Add custom class for 3 iframes
    if (iframeItems.length === 3) {
      iframeWrapper.classList.add('iframe__wrapper--three-iframes');
    }

    // Add custom class if badges are present
    if (badgeLinks.textContent.trim() !== '') {
      iframeWrapper.classList.add('frame__wrapper--with-badge');
    }

    iframeWrapper.append(renderIframes(iframeItems, height, width));
    block.append(iframeWrapper);
  }
}
