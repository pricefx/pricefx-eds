export default async function decorate(block) {
  block.textContent = '';
  block.appendChild(block.textContent);
}
