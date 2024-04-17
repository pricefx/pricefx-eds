export default function decorate(block) {
  console.log(block);
  const pictureImg = block.children[1]?.querySelector('picture');
  const elementText = block.children[2]?.querySelector('p')?.textContent.trim();
  block.innerHTML = '';
  const rightBox = document.createElement('div');
  rightBox.classList.add('hero-image-container');
  rightBox.append(pictureImg);
  block.append(rightBox);

  const leftBox = document.createElement('div');
  leftBox.classList.add('hero-content-container');
  leftBox.append(elementText);

  // addDropdown(leftBox);

  block.prepend(leftBox);
  // elementContainer.parentElement.remove();
  // removeEmptyPTags(block);
}
