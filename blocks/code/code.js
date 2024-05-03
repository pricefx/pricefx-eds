export default async function decorate(block) {
  const titleData = block.children[0]?.querySelector('p')?.textContent.trim() || '';
  block.innerHTML = '';
  if (titleData) {
    const titleElement = document.createElement('div');
    titleElement.innerHTML = titleData;
    block.append(titleElement);
  }
  const iframes = block.querySelectorAll('iframe');
  iframes.forEach((iframe) => {
    const nextSibling = iframe.nextElementSibling;
    if (nextSibling && nextSibling.tagName.toLowerCase() === 'a') {
      nextSibling.style.display = 'block';
    }
  });
  if (iframes.length !== 0) {
    block.parentElement.classList.add('iframe-width');
  }
}
