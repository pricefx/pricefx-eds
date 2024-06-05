const renderBadges = (badges) => {
  const fragment = document.createDocumentFragment();

  badges.forEach((badge) => {
    const badgeContainer = document.createElement('div');
    badgeContainer.classList.add('badge__container');

    const badgeLink = document.createElement('a');
    badgeLink.title = badge.textContent;
    badgeLink.href = "https://www.g2.com/products/pricefx/reviews?utm_source=rewards-badge";

    const badgeImg = document.createElement('img');
    badgeImg.decoding = "async";
    badgeImg.alt = badge.textContent;
    badgeImg.dataset.src = badge.href;
    badgeImg.src = badge.href;
    badgeImg.classList.add('lazyloaded', 'badge__icon');

    badgeLink.appendChild(badgeImg);
    badgeContainer.appendChild(badgeLink);
    fragment.appendChild(badgeContainer);
  });

  return fragment;
};

const renderIframes = (iframes, height, width) => {
  const fragment = document.createDocumentFragment();

  if (iframes.length === 3) {
    const leftColumn = document.createElement('div');
    leftColumn.classList.add('iframe__left-column');
    if (width) leftColumn.style.maxWidth = `${width + 36}px`;

    for (let i = 0; i < 2; i++) {
      const iframeContainer = document.createElement('div');
      iframeContainer.classList.add('iframe__container');
      if (width) iframeContainer.style.maxWidth = `${width + 36}px`;

      const iframe = document.createElement('iframe');
      iframe.src = iframes[i].textContent.trim();
      iframe.frameBorder = "0";
      if (height) iframe.style.minHeight = `${height}px`;

      iframeContainer.appendChild(iframe);
      leftColumn.appendChild(iframeContainer);
    }

    const rightColumn = document.createElement('div');
    rightColumn.classList.add('iframe__right-column');
    if (width) rightColumn.style.maxWidth = `${width + 36}px`;

    const rightIframeContainer = document.createElement('div');
    rightIframeContainer.classList.add('iframe__container');
    if (width) rightIframeContainer.style.maxWidth = `${width + 36}px`;

    const rightIframe = document.createElement('iframe');
    rightIframe.src = iframes[2].textContent.trim();
    rightIframe.frameBorder = "0";
    if (height) rightIframe.style.minHeight = `${height + height + 36}px`;

    rightIframeContainer.appendChild(rightIframe);
    rightColumn.appendChild(rightIframeContainer);

    fragment.appendChild(leftColumn);
    fragment.appendChild(rightColumn);
  } else {
    iframes.forEach((iframe) => {
      const iframeContainer = document.createElement('div');
      iframeContainer.classList.add('iframe__container');
      if (width) iframeContainer.style.maxWidth = `${width + 36}px`;

      const iframeElement = document.createElement('iframe');
      iframeElement.src = iframe.textContent.trim();
      iframeElement.frameBorder = "0";
      if (height) iframeElement.style.minHeight = `${height}px`;

      iframeContainer.appendChild(iframeElement);
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

  if (badgeLinks.textContent.trim() !== '') {
    const badgeWrapper = document.createElement('div');
    badgeWrapper.classList.add('badge__wrapper');
    badgeWrapper.appendChild(renderBadges(badgeItems));
    block.appendChild(badgeWrapper);
  }

  if (iframeLinks.textContent.trim() !== '') {
    const iframeWrapper = document.createElement('div');
    iframeWrapper.classList.add('iframe__wrapper');

    if (iframeItems.length === 3) {
      iframeWrapper.classList.add('iframe__wrapper--three-iframes');
    }

    if (badgeLinks.textContent.trim() !== '') {
      iframeWrapper.classList.add('frame__wrapper--with-badge');
    }

    iframeWrapper.appendChild(renderIframes(iframeItems, height, width));
    block.appendChild(iframeWrapper);
  }
}
