export default async function decorate(block) {
  const titleText = block.children[0]?.querySelector('p')?.textContent.trim() || '';
  const titleType = block.children[1]?.querySelector('p')?.textContent.trim() || 'h2';
  block.innerHTML = '';
  if (titleText) {
    const titleElement = document.createElement(titleType);

    titleElement.innerHTML = titleText;
    block.append(titleElement);
  }
}
