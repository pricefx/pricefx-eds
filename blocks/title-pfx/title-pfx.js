export default async function decorate(block) {
  const [heading, headingType] = block.children;
  const titleText = heading?.textContent.trim() || '';
  const titleType = headingType?.textContent.trim() || 'h2';
  block.textContent = '';
  if (titleText) {
    const titleElement = document.createElement(titleType);
    titleElement.innerHTML = titleText;
    block.append(titleElement);
  }
}
