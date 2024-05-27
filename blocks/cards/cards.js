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
    setTimeout(() => {
      const cardTopContent = ul.querySelectorAll('.cards-card-top-content');
      let maxHeight = 0;
      cardTopContent.forEach((topText) => {
        const height = topText.offsetHeight;
        maxHeight = Math.max(maxHeight, height);
      });
      if (maxHeight !== 0) {
        cardTopContent.forEach((topText) => {
          topText.style.height = `${maxHeight + 24}px`;
        });
      }
    }, 0); // Delay to ensure proper recalculation after content changes
  };

  // Initial call to adjust heights
  if (window.innerWidth >= 768) {
    cardTopContentHeight();
  }

  block.textContent = '';
  block.append(ul);
}
