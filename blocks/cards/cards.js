import { createOptimizedPicture } from '../../scripts/aem.js';

function decorateCTA(cta, ctaLabel, ctaTarget, isClickable) {
  const link = cta.querySelector('a');
  if (link && isClickable?.textContent.trim() !== 'true') {
    if (ctaLabel.textContent.trim()) {
      const label = ctaLabel.textContent.trim();
      link.textContent = label;
      link.title = label;
    }

    if (ctaTarget.textContent.trim() === 'true') {
      link.target = '_blank';
    }

    return link;
  }

  return ctaLabel.children.length > 0 ? ctaLabel?.firstElementChild : ctaLabel;
}

function generateCardDom(props, block) {
  const [imageContainer, cardTopContent, eyebrow, title, description, cta, ctaLabel, ctaTarget, isClickable] = props;
  const picture = imageContainer.querySelector('picture');
  const cardImPricing = block.classList.contains('card-im-pricing');

  // Build DOM
  if (isClickable?.textContent.trim() === 'true') {
    const link = cta.querySelector('a');
    const cardDOM = `
          <a class="cards-card-link" href="${link ? link.href : '#'}" target="${ctaTarget.textContent.trim() === 'true' ? '_blank' : ''}">
          ${cardImPricing ? `<div class='cards-card-top-content'>${cardTopContent.innerHTML}</div>` : `<div class='cards-card-image'>${picture ? picture.outerHTML : ''}</div>`}
          <div class='cards-card-body'>
              ${eyebrow?.textContent.trim() !== '' ? `<div class='cards-card-eyebrow'>${eyebrow.textContent.trim().toUpperCase()}</div>` : ``}
              ${title?.children.length > 0 ? `<div class='cards-card-title'><h6>${title.textContent.trim()}</h6></div>` : ``}
              ${description?.children.length > 0 ? `<div class='cards-card-description'>${description.innerHTML}</div>` : ``}
              ${ctaLabel.textContent.trim() ? `<div class='cards-card-cta'>${decorateCTA(cta, ctaLabel, ctaTarget, isClickable).outerHTML}</div>` : ``}
          </div>
        </a>
    `;
    return cardDOM;
  }
  const cardDOM = `
      ${cardImPricing ? `<div class='cards-card-top-content'>${cardTopContent.innerHTML}</div>` : `<div class='cards-card-image'>${picture ? picture.outerHTML : ''}</div>`}
        <div class='cards-card-body'>
            ${eyebrow?.textContent.trim() !== '' ? `<div class='cards-card-eyebrow'>${eyebrow.textContent.trim().toUpperCase()}</div>` : ``}
            ${title?.children.length > 0 ? `<div class='cards-card-title'><h6>${title.textContent.trim()}</h6></div>` : ``}
            ${description?.children.length > 0 ? `<div class='cards-card-description'>${description.innerHTML}</div>` : ``}
            ${ctaLabel.textContent.trim() ? `<div class='cards-card-cta'>${decorateCTA(cta, ctaLabel, ctaTarget).outerHTML}</div>` : ``}
        </div>
    `;
  return cardDOM;
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row, index) => {
    const li = document.createElement('li');
    [...row.attributes].forEach(({ nodeName, nodeValue }) => {
      li.setAttribute(nodeName, nodeValue);
    });
    // Adding Style options
    if (index < 3) {
      if (row.textContent.trim()) {
        let className = '';
        if (index === 2) {
          className = row.textContent.trim().split(',');
          Array.from(className).forEach((name) => {
            block.classList.add(name);
          });
        } else {
          className = row.textContent.trim();
          block.classList.add(className);
        }
      }
      return;
    }
    li.innerHTML = generateCardDom(row.children, block);
    ul.append(li);
  });

  ul.querySelectorAll('img').forEach((img) =>
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])),
  );

  // Adjust Height of card top content
  const cardTopContentHeight = () => {
    const cardTopContent = ul.querySelectorAll('.cards-card-top-content');
    if (cardTopContent.length > 0) {
      setTimeout(() => {
        let maxHeight = 0;
        cardTopContent.forEach((topText) => {
          const height = topText.offsetHeight;
          maxHeight = Math.max(maxHeight, height);
        });
        if (maxHeight !== 0) {
          cardTopContent.forEach((topText) => {
            topText.style.height = `${maxHeight}px`;
          });
        }
      }, 150); // Delay to ensure proper recalculation after content changes
    }
  };

  // Adjust Height of card icon variation
  const cardIconVariationHeight = () => {
    const cardEyebrow = ul.querySelectorAll('.cards-card-eyebrow');
    const cardTitle = ul.querySelectorAll('.cards-card-title');
    const cardDescription = ul.querySelectorAll('.cards-card-description');
    if (block.classList.contains('icon-variation')) {
      setTimeout(() => {
        if (cardEyebrow.length > 0) {
          let maxHeight = 0;
          cardEyebrow.forEach((eyebrowText) => {
            const height = eyebrowText.offsetHeight;
            maxHeight = Math.max(maxHeight, height);
          });
          if (maxHeight !== 0) {
            cardEyebrow.forEach((eyebrowText) => {
              eyebrowText.style.height = `${maxHeight}px`;
            });
          }
        }
        if (cardTitle.length > 0) {
          let maxHeight = 0;
          cardTitle.forEach((titleText) => {
            const height = titleText.offsetHeight;
            maxHeight = Math.max(maxHeight, height);
          });
          if (maxHeight !== 0) {
            cardTitle.forEach((titleText) => {
              titleText.style.height = `${maxHeight}px`;
            });
          }
        }
        if (cardDescription.length > 0) {
          let maxHeight = 0;
          cardDescription.forEach((descriptionText) => {
            const height = descriptionText.offsetHeight;
            maxHeight = Math.max(maxHeight, height);
          });
          if (maxHeight !== 0) {
            cardDescription.forEach((descriptionText) => {
              descriptionText.style.height = `${maxHeight}px`;
            });
          }
        }
      }, 150); // Delay to ensure proper recalculation after content changes
    }
  };

  const defaultCardTopContentHeight = () => {
    const cardTopContent = ul.querySelectorAll('.cards-card-top-content');
    cardTopContent.forEach((topText) => {
      topText.style.height = 'auto';
    });
  };

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      cardTopContentHeight();
      cardIconVariationHeight();
    }
    defaultCardTopContentHeight();
  });

  // Initial call to adjust heights
  if (window.innerWidth >= 768) {
    cardTopContentHeight();
    cardIconVariationHeight();
  }

  block.textContent = '';
  block.append(ul);
}
