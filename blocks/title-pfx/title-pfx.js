export default async function decorate(block) {
  const [heading, headingType] = block;
  const titleText = heading?.textContent.trim() || '';
  const titleType = headingType?.textContent.trim() || 'h2';
  block.textContent = '';
  if (titleText) {
    const titleElement = block.createElement(titleType);
    titleElement.innerHTML = titleText;
    block.append(titleElement);
  }
}
