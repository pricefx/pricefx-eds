export default async function decorate(block) {
  const titleData = block.children[0]?.querySelector('p')?.textContent.trim() || '';
  const titleType = block.children[1]?.querySelector('p')?.textContent.trim() || 'h2';
  const titleColor = block.children[2]?.querySelector('p')?.textContent.trim() || 'title-dark-grey';
  block.innerHTML = '';
  if (titleData) {
    const titleElement = document.createElement(titleType);
    if (titleColor !== '') {
      block.classList.add(titleColor);
    }
    titleElement.innerHTML = titleData;
    block.append(titleElement);
  }
}
