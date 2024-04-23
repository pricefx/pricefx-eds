export default async function decorate(block) {
  const heroContainer = document.createElement('div');
  heroContainer.classList.add('hero-container');
  const heroLeftContainer = document.createElement('div');
  const heroRightContainer = document.createElement('div');
  [...block.children].forEach((row, index) => {
    if (index < 5) {
      heroRightContainer.append(row.firstElementChild);
      heroRightContainer.classList.add('hero-right-container');
    } else {
      heroLeftContainer.append(row.firstElementChild);
      heroLeftContainer.classList.add('hero-left-container');
    }
  });
  heroContainer.append(heroLeftContainer);
  heroContainer.append(heroRightContainer);
  block.append(heroContainer);
}
