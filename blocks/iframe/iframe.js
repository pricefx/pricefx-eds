export default function decorate(block) {
  const [urlElement, widthElement, heightElement] = block.children;
  const container = document.createElement('div');
  block.textContent = '';
  container.classList.add('iframe', 'container');
  if (urlElement) {
    const url = new URL(urlElement.textContent);
    const iframe = document.createElement('iframe');
    container.appendChild(iframe);
    iframe.src = url.href;
  }

  if (heightElement) {
    const height = Number(heightElement.textContent);
    container.classList.remove('noheight');
    container.style.height = `${height}px`;
  } else {
    container.classList.add('noheight');
  }

  if (widthElement) {
    const width = Number(widthElement.textContent);
    container.style.width = `${width}px`;
  }

  block.appendChild(container);
}
