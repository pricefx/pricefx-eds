import { createOptimizedPicture } from '../../scripts/aem.js';

function createImageContainer(imageSrc, title, text, widthClass) {
  const imageContainer = document.createElement('div');
  imageContainer.classList.add(widthClass);

  const caseImage = imageSrc.firstElementChild.querySelector('picture img');

  const image = document.createElement('div');
  image.classList.add('image');
  if (caseImage !== null) {
    image.appendChild(caseImage);
  }
  imageContainer.appendChild(image);

  const banner = document.createElement('div');
  banner.classList.add('banner');

  const titleNode = document.createElement('div');
  titleNode.classList.add('title-text');
  titleNode.textContent = title.textContent;

  const textNode = document.createElement('div');
  textNode.classList.add('text');
  textNode.appendChild(text.firstElementChild);
  banner.appendChild(titleNode);
  banner.appendChild(textNode);

  imageContainer.appendChild(banner);

  imageContainer
    .querySelectorAll('img')
    .forEach((img) =>
      img.closest('img').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])),
    );

  return imageContainer;
}

export default async function decorate(block) {
  const [image1, title1, text1, image2, title2, text2, image3, title3, text3, swapRight] = block.children;

  const container = document.createElement('div');

  const firstImageContainer = createImageContainer(image1, title1, text1, 'image-1');

  const secondImageContainer = createImageContainer(image2, title2, text2, 'image-2');

  if (title1.textContent.trim() && title2.textContent.trim() && title3.textContent.trim()) {
    const thirdImageContainer = createImageContainer(image3, title3, text3, 'image-3');

    const halfContainer = document.createElement('div');
    halfContainer.classList.add('half-container');

    container.classList.add('grid-container-3');

    halfContainer.appendChild(secondImageContainer);
    halfContainer.appendChild(thirdImageContainer);

    if (swapRight.textContent.trim() === 'true') {
      container.appendChild(halfContainer);
      container.appendChild(firstImageContainer);
    } else {
      container.appendChild(firstImageContainer);
      container.appendChild(halfContainer);
    }
  } else if (title1.textContent.trim() && title2.textContent.trim()) {
    container.classList.add('grid-container-2');
    container.appendChild(firstImageContainer);
    container.appendChild(secondImageContainer);
  }

  block.textContent = '';
  block.appendChild(container);
}
