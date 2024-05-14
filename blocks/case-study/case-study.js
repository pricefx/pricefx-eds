function createImageContainer(imageSrc, title, text, widthClass) {
  const imageContainer = document.createElement('div');
  imageContainer.classList.add('image-container');
  imageContainer.classList.add(widthClass);

  const caseImage = imageSrc.firstElementChild.querySelector('picture img');

  const image = document.createElement('div');
  image.classList.add('image');
  image.appendChild(caseImage);
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

  return imageContainer;
}

export default async function decorate(block) {
  const [image1, title1, text1, image2, , title2, text2, image3, title3, text3, swapRight] = block.children;

  const container = document.createElement('div');
  container.classList.add('container');

  const leftContainer = document.createElement('div');
  leftContainer.classList.add('left-container');

  const rightContainer = document.createElement('div');
  rightContainer.classList.add('right-container');

  const firstImageContainer = createImageContainer(image1, title1, text1, 'half-width');

  const secondImageContainer = createImageContainer(image2, title2, text2, 'half-width');

  if (
    title1.textContent.replace(/\s+/g, '') &&
    title2.textContent.replace(/\s+/g, '') &&
    title3.textContent.replace(/\s+/g, '')
  ) {
    const thirdImageContainer = createImageContainer(image3, title3, text3, 'half-width');

    leftContainer.appendChild(firstImageContainer);

    const topContainer = document.createElement('div');
    topContainer.classList.add('top-container');

    const bottomContainer = document.createElement('div');
    bottomContainer.classList.add('bottom-container');

    topContainer.appendChild(secondImageContainer);
    bottomContainer.appendChild(thirdImageContainer);

    rightContainer.appendChild(topContainer);

    rightContainer.appendChild(bottomContainer);

    if (swapRight.textContent === 'true') {
      container.appendChild(rightContainer);
      container.appendChild(leftContainer);
    } else {
      container.appendChild(leftContainer);
      container.appendChild(rightContainer);
    }
  } else if (title1.textContent.replace(/\s+/g, '') && title2.textContent.replace(/\s+/g, '')) {
    leftContainer.appendChild(firstImageContainer);
    rightContainer.appendChild(secondImageContainer);
    container.appendChild(leftContainer);
    container.appendChild(rightContainer);
  }

  block.textContent = '';
  block.appendChild(container);
}
