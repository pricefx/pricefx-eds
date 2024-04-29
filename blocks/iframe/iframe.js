export default function decorate(block) {
  const container = document.createElement('div');
  block.appendChild(container);
}
