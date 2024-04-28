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
  const heroImageContainer = document.createElement('div');
  heroImageContainer.classList.add('hero-image-container');
  if (heroVariation === 'imageVariation') {
    const heroImage = heroRightContainer.children[1];
    if (window.matchMedia('(min-width:986px)').matches && heroImage.querySelector('img') !== null) {
      heroImageContainer.setAttribute('style', `background-image:url(${heroImage.querySelector('img').src})`);
    }
    heroImageContainer.append(heroImage);
  }
  heroRightContainer.textContent = '';
  heroRightContainer.append(heroImageContainer);
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
      heroRightContainer.append(row.firstElementChild);
      heroRightContainer.classList.add('hero-right-container');
    } else if (index === 6) {
      /* Height Height Variation */
      heroLeftContainer.classList.add(row.firstElementChild?.textContent || 'hero-secondary-variation');
    } else if (index === 7) {
      /* Pre Header Text */
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
