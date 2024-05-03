export default async function decorate(block) {
  const quoteContainer = document.createElement('div');
  quoteContainer.classList.add('quote-main-container');

  const quoteLeftContainer = document.createElement('div');
  quoteLeftContainer.classList.add('quote-left-container');

  const quoteRightContainer = document.createElement('div');
  const quoteRightContainerInner = document.createElement('div');
  quoteRightContainerInner.classList.add('quote-content');

  quoteRightContainer.classList.add('quote-right-container');
  quoteRightContainer.appendChild(quoteRightContainerInner);

  // eslint-disable-next-line no-unused-vars
  let count = 0;

  [...block.children].forEach((row, index) => {
    if (count === 1) {
      quoteRightContainer.classList.add('quote-no-left-container');
    }

    if (index === 0) {
      const quoteIcon = document.createElement('div');
      quoteIcon.className = 'quote-icon';
      quoteIcon.innerHTML = `<img src="../../icons/quote-icon.svg" alt="quoteIcon">`;

      const quoteEl = document.createElement('p');
      quoteEl.classList.add('quote-text');
      quoteEl.textContent = row.firstElementChild.textContent;

      quoteIcon.appendChild(quoteEl);

      quoteRightContainerInner.appendChild(quoteIcon);
    } else if (index === 3) {
      const imageLogo = document.querySelector('picture img');
      if (imageLogo) {
        const quoteLogo = document.createElement('div');
        quoteLogo.classList.add('quote-logo');
        quoteLogo.appendChild(imageLogo);
        quoteRightContainerInner.appendChild(quoteLogo);
      }
    } else if (index === 1) {
      const authorEl = document.createElement('div');
      authorEl.classList.add('author');
      authorEl.innerHTML = row.firstElementChild.innerHTML;
      quoteRightContainerInner.appendChild(authorEl);
    } else if (index === 2) {
      const quoteImage = row.firstElementChild.querySelector('picture');
      if (quoteImage) {
        quoteImage.classList.add('quote-image-container');
        if (quoteImage) {
          quoteLeftContainer.appendChild(quoteImage);
        }
      } else {
        quoteLeftContainer.className = 'quote-no-image-container';
        count += 1;
      }
    }
  });

  quoteContainer.append(quoteLeftContainer);
  quoteContainer.append(quoteRightContainer);
  block.textContent = '';
  block.append(quoteContainer);
}
