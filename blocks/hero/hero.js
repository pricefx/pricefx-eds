export default async function decorate(block) {
  const heroContainer = document.createElement('div');
  heroContainer.classList.add('hero-container');
  const heroLeftContainer = document.createElement('div');
  const heroRightContainer = document.createElement('div');
  let buttonContainer = document.createElement('div');
  let count = 1;
  [...block.children].forEach((row, index) => {
    if (index <= 5) {
      heroRightContainer.append(row.firstElementChild);
      heroRightContainer.classList.add('hero-right-container');
    } else if (index === 6) {
      heroLeftContainer.append(row.firstElementChild);
    } else {
      if (buttonContainer.children.length > 0 && count === 5) {
        heroLeftContainer.append(buttonContainer);
        buttonContainer = document.createElement('div');
        heroLeftContainer.classList.add('hero-left-container');
        count = 1;
      }
      buttonContainer.append(row.firstElementChild);
      count += 1;
    }
  });

  heroContainer.append(heroLeftContainer);
  heroContainer.append(heroRightContainer);
  block.textContent = '';
  block.append(heroContainer);
}
