import { decorateEmbed } from '../embed/embed.js';

function decorateButton(heroLeftContainer) {
  heroLeftContainer.querySelectorAll('.button-container').forEach((btn) => {
    const btnStyle = btn.children[0]?.textContent || 'primary';
    const btnLink = btn.children[1]?.textContent;
    const btnLabel = btn.children[2]?.textContent;
    const btnTarget = btn.children[3]?.textContent;
    btn.textContent = '';
    if (btnLabel === '') {
      btn.remove();
    } else {
      const heroButton = document.createElement('a');
      heroButton.classList.add('button');
      heroButton.classList.add(btnStyle);
      heroButton.innerHTML = btnLabel;
      if (btnLink) {
        heroButton.href = btnLink;
      }

      if (btnTarget === 'true') {
        heroButton.target = '_blank';
      }
      btn.append(heroButton);
    }
  });
}

function decorateRightContainer(heroRightContainer) {
  const heroVariation = heroRightContainer.firstElementChild.textContent;

  if (heroVariation === 'imageVariation') {
    const heroImageContainer = document.createElement('div');
    heroImageContainer.classList.add('hero-image-container');
    const heroImage = heroRightContainer.children[1];
    if (window.matchMedia('(min-width:986px)').matches && heroImage.querySelector('img') !== null) {
      heroImageContainer.setAttribute('style', `background-image:url(${heroImage.querySelector('img').src})`);
    }
    heroImageContainer.append(heroImage);
    heroRightContainer.textContent = '';
    heroRightContainer.append(heroImageContainer);
  } else if (heroVariation === 'videoVariation') {
    const heroRightContainerInner = document.createElement('div');
    heroRightContainerInner.classList.add('embed');
    const placeholder = heroRightContainer.children[2];
    const link = heroRightContainer.children[3];
    const overlayText = heroRightContainer.children[4];
    const isPopup = heroRightContainer.children[5];
    heroRightContainer.textContent = '';
    if (link.textContent !== '') {
      heroRightContainerInner.append(placeholder);
      heroRightContainerInner.append(link);
      heroRightContainerInner.append(overlayText);
      heroRightContainerInner.append(isPopup);

      decorateEmbed(heroRightContainerInner);
      heroRightContainer.append(heroRightContainerInner);
    }
  } else {
    heroRightContainer.textContent = '';
  }
}

export default async function decorate(block) {
  const heroContainer = document.createElement('div');
  heroContainer.classList.add('hero-main-container');
  const heroLeftContainer = document.createElement('div');
  heroLeftContainer.classList.add('hero-left-container');
  const heroRightContainer = document.createElement('div');
  const heroLeftContainerInner = document.createElement('div');
  heroLeftContainerInner.classList.add('hero-content');
  let buttonContainer = document.createElement('div');
  buttonContainer.classList.add('button-container');
  let count = 1;
  [...block.children].forEach((row, index) => {
    if (index < 6) {
      /* Image / Video */
      if (index === 0) {
        if (row.firstElementChild?.textContent === 'noVariation') {
          heroLeftContainerInner.classList.add('hero-no-bg-image');
        } else if (row.firstElementChild?.textContent === 'videoVariation') {
          heroLeftContainerInner.classList.add('hero-content-video');
          heroRightContainer.classList.add('hero-video');
        }
      }
      heroRightContainer.append(row.firstElementChild);
      heroRightContainer.classList.add('hero-right-container');
    } else if (index === 6) {
      /*  Height Variation */
      heroLeftContainer.classList.add(row.firstElementChild?.textContent || 'hero-primary-height');
    } else if (index === 7) {
      /* Eyebrow Text */
      if (row.firstElementChild?.textContent !== '') {
        const heroPreHeader = document.createElement('span');
        heroPreHeader.classList.add('hero-pre-header');
        heroPreHeader.append(row.firstElementChild);
        heroLeftContainerInner.append(heroPreHeader);
      }
    } else if (index === 8) {
      /* Hero Content */
      row.firstElementChild?.classList.add('hero-content-container');
      heroLeftContainerInner.append(row.firstElementChild || '');
    } else {
      /* Hero Buttons */
      if (buttonContainer.children.length >= 0 && count === 5) {
        heroLeftContainerInner.append(buttonContainer);
        buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');
        count = 1;
      }
      count += 1;
      buttonContainer.append(row.firstElementChild);
      heroLeftContainerInner.append(buttonContainer);
      heroLeftContainer.append(heroLeftContainerInner);
    }
  });

  decorateButton(heroLeftContainer);
  decorateRightContainer(heroRightContainer);
  heroContainer.append(heroLeftContainer);
  heroContainer.append(heroRightContainer);
  block.textContent = '';
  block.append(heroContainer);
}
