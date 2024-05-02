export default async function decorate(block) {
  const titleData = block.children[0]?.querySelector('p')?.textContent.trim() || '';
  block.innerHTML = '';
  if (titleData) {
    const titleElement = document.createElement('div');
    titleElement.innerHTML = titleData;
    block.append(titleElement);
  }
}
