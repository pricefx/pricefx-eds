export default async function decorate(block) {
  const [spacerValue] = block.children;
  block.textContent = '';
  block.classList.add(spacerValue.textContent.trim());
  block.appendChild(block.textContent);
}
