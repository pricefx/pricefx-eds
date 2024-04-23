export default async function decorate(block) {
  const heroContainer = document.createElement('div');
  heroContainer.classList.add('hero-container');
  const heroLeftContainer = document.createElement('div');
  const heroRightContainer = document.createElement('div');
  [...block.children].forEach((row, index) => {
    if (index < 5) {
      heroLeftContainer.append(row.firstElementChild);
    } else {
      heroRightContainer.append(row.firstElementChild);
    }
  });
  heroContainer.append(heroLeftContainer);
  heroContainer.append(heroRightContainer);
  block.append(heroContainer);
}
