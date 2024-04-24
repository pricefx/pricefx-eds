function decorateButton(heroLeftContainer) {
  heroLeftContainer.querySelectorAll('.button-container').forEach((btn) => {
    const btnStyle = btn.children[0].textContent;
    const btnLink = btn.children[1].textContent;
    const btnLabel = btn.children[2].textContent;
    const btnTarget = btn.children[3].textContent;
    btn.textContent = '';
    const heroButton = document.createElement('a');
    heroButton.classList.add('button');
    heroButton.classList.add(btnStyle);
    heroButton.innerHTML = btnLabel;
    heroButton.href = btnLink;
    if (btnTarget === 'true') {
      heroButton.target = '_blank';
    }
    btn.append(heroButton);
  });
}

function decorateRightContainer(heroRightContainer) {
  const heroVariation = heroRightContainer.firstElementChild.textContent;
  const heroImageContainer = document.createElement('div');
  heroImageContainer.classList.add('hero-image-container');
  if (heroVariation === 'imageVariation') {
    const heroImage = heroRightContainer.children[1].firstElementChild.firstElementChild;
    heroImageContainer.append(heroImage);
  }
  heroRightContainer.textContent = '';
  heroRightContainer.append(heroImageContainer);
}

export default async function decorate(block) {
  const heroContainer = document.createElement('div');
  heroContainer.classList.add('hero-main-container');
  const heroLeftContainer = document.createElement('div');
  const heroRightContainer = document.createElement('div');
  let buttonContainer = document.createElement('div');
  buttonContainer.classList.add('button-container');
  let count = 1;
  [...block.children].forEach((row, index) => {
    if (index < 6) {
      heroRightContainer.append(row.firstElementChild);
      heroRightContainer.classList.add('hero-right-container');
    } else if (index === 6) {
      heroLeftContainer.append(row.firstElementChild.firstElementChild);
      heroLeftContainer.firstElementChild.classList.add('hero-content-container');
    } else {
      if (buttonContainer.children.length >= 0 && count === 5) {
        heroLeftContainer.classList.add('hero-left-container');
        heroLeftContainer.append(buttonContainer);
        buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        count = 1;
      }
      count += 1;
      buttonContainer.append(row.firstElementChild);
      heroLeftContainer.append(buttonContainer);
    }
  });

  decorateButton(heroLeftContainer);
  decorateRightContainer(heroRightContainer);
  heroContainer.append(heroLeftContainer);
  heroContainer.append(heroRightContainer);
  block.textContent = '';
  block.append(heroContainer);
}
