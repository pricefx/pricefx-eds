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

function generateCardDom(props) {
  const [imageContainer, eyebrow, title, description, cta, ctaLabel, ctaTarget, isClickable] = props;
  const picture = imageContainer.querySelector('picture');

  // Build DOM
  if (isClickable.textContent.trim() === 'true') {
    const link = cta.querySelector('a');
    const cardDOM = document.createRange().createContextualFragment(`
      <li>
        <a class="cards-card-link" href="${link ? link.href : '#'}" target="${ctaTarget.textContent.trim() === 'true' ? '_blank' : ''}">
          <div class='cards-card-image'>${picture ? picture.outerHTML : ''}</div>
          <div class='cards-card-body'>
              ${eyebrow.textContent.trim() !== '' ? `<div class='cards-card-eyebrow'>${eyebrow.textContent.trim().toUpperCase()}</div>` : ``}
              ${title.children.length > 0 ? `<div class='cards-card-title'><h6>${title.textContent.trim()}</h6></div>` : ``}
              ${description.children.length > 0 !== '' ? `<div class='cards-card-description'>${description.innerHTML}</div>` : ``}
              <div class='cards-card-cta'>${decorateCTA(cta, ctaLabel, ctaTarget, isClickable).outerHTML}</div>
          </div>
        </a>
      </li>
    `);
    return cardDOM;
  }
  const cardDOM = document.createRange().createContextualFragment(`
      <li>
        <div class='cards-card-image'>${picture ? picture.outerHTML : ''}</div>
        <div class='cards-card-body'>
            ${eyebrow.textContent.trim() !== '' ? `<div class='cards-card-eyebrow'>${eyebrow.textContent.trim().toUpperCase()}</div>` : ``}
            ${title.children.length > 0 ? `<div class='cards-card-title'><h6>${title.textContent.trim()}</h6></div>` : ``}
            ${description.children.length > 0 !== '' ? `<div class='cards-card-description'>${description.innerHTML}</div>` : ``}
            <div class='cards-card-cta'>${decorateCTA(cta, ctaLabel, ctaTarget).outerHTML}</div>
        </div>
      </li>
    `);
  return cardDOM;
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row, index) => {
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

    ul.append(generateCardDom(row.children));
  });

  ul.querySelectorAll('img').forEach((img) =>
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])),
  );

  block.textContent = '';
  block.append(ul);
}
