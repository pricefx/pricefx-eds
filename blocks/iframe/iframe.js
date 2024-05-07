export default function decorate(block) {
  const [urlElement, widthElement, heightElement] = block.children;
  const height = Number(heightElement.textContent);
  const width = Number(widthElement.textContent);
  const url = new URL(urlElement.textContent);
  const container = document.createElement('div');
  const iframe = document.createElement('iframe');

  block.textContent = '';
  container.classList.add('iframe', 'container');
  container.appendChild(iframe);
  iframe.src = url.href;

  if (height) {
    container.classList.remove('noheight');
    container.style.height = `${height}px`;
  } else {
    container.classList.add('noheight');
  }

  if (width) {
    container.style.width = `${width}px`;
  }

  block.appendChild(container);
}
