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
  let markup = '';
  if (iframes.length === 3) {
    markup = `
      <div class="iframe__left-column" ${width ? `style=max-width:${width + 36}px;` : ''}>
        <div class="iframe__container" ${width ? `style=max-width:${width + 36}px;` : ''}>
          <iframe src="${iframes[0].textContent.trim()}" frameborder="0" style=${height ? `min-height:${height}px;` : ''}></iframe>
        </div>
        <div class="iframe__container" ${width ? `style=max-width:${width + 36}px;` : ''}>
          <iframe src="${iframes[1].textContent.trim()}" frameborder="0" style=${height ? `min-height:${height}px;` : ''}></iframe>
        </div>
      </div>
      <div class="iframe__right-column" ${width ? `style=max-width:${width + 36}px;` : ''}>
        <div class="iframe__container" ${width ? `style=max-width:${width + 36}px;` : ''}>
          <iframe src="${iframes[2].textContent.trim()}" frameborder="0" style=${height ? `min-height:${height + height + 36}px;` : ''}></iframe>
        </div>
      </div>
    `;
  } else {
    iframes.forEach((iframe) => {
      const iframeSource = iframe.textContent.trim();
      markup += `
        <div class="iframe__container" ${width ? `style=max-width:${width + 36}px;` : ''}>
          <iframe src="${iframeSource}" frameborder="0" style=${height ? `min-height:${height}px;` : ''}></iframe>
        </div>
      `;
    });
  }
  return markup;
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
    const fragment = document.createDocumentFragment();
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

    iframeWrapper.innerHTML = renderIframes(iframeItems, height, width);
    fragment.append(iframeWrapper);
    block.append(fragment);
  }
}
