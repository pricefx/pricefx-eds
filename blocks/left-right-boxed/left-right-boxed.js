import { decorateEmbed } from '../embed/embed.js';

function decorateRightContainer(boxedRightContainer) {
  const boxedVariation = boxedRightContainer.firstElementChild.textContent || 'imageVariation';

  if (boxedVariation === 'imageVariation') {
    const boxedImageContainer = document.createElement('div');
    boxedImageContainer.classList.add('boxed-image-container');
    const boxedImage = boxedRightContainer.children[2];
    boxedImageContainer.append(boxedImage);
    boxedRightContainer.textContent = '';
    boxedRightContainer.append(boxedImageContainer);
  } else if (boxedVariation === 'videoVariation') {
    const boxedRightContainerInner = document.createElement('div');
    boxedRightContainerInner.classList.add('embed');
    const placeholder = boxedRightContainer.children[2];
    const link = boxedRightContainer.children[3];
    const overlayText = boxedRightContainer.children[4];
    const isPopup = boxedRightContainer.children[5];
    boxedRightContainer.textContent = '';
    if (link.textContent !== '') {
      boxedRightContainerInner.append(placeholder);
      boxedRightContainerInner.append(link);
      boxedRightContainerInner.append(overlayText);
      boxedRightContainerInner.append(isPopup);

      decorateEmbed(boxedRightContainerInner);
      boxedRightContainer.append(boxedRightContainerInner);
    }
  } else {
    boxedRightContainer.textContent = '';
  }
}

export default async function decorate(block) {
  const boxedContainer = document.createElement('div');
  boxedContainer.classList.add('boxed-main-container');
  const boxedLeftContainer = document.createElement('div');
  boxedLeftContainer.classList.add('boxed-left-container');
  const boxedRightContainer = document.createElement('div');

  [...block.children].forEach((row, index) => {
    if (index <= 6) {
      /* Image / Video */
      boxedRightContainer.append(row.firstElementChild);
      boxedRightContainer.classList.add('boxed-right-container');
    } else if (index === 7) {
      /* Eyebrow Text */
      if (row.firstElementChild?.textContent !== '') {
        const boxedEyebrowText = document.createElement('span');
        boxedEyebrowText.classList.add('boxed-eyebrow-text');
        boxedEyebrowText.append(row.firstElementChild);
        boxedLeftContainer.append(boxedEyebrowText);
      }
    } else if (index === 8) {
      /* Left Right Boxed Content */
      row.firstElementChild?.classList.add('boxed-content-container');
      boxedLeftContainer.append(row.firstElementChild || '');
    }
  });

  decorateRightContainer(boxedRightContainer);
  boxedContainer.append(boxedLeftContainer);
  boxedContainer.append(boxedRightContainer);
  block.textContent = '';
  block.append(boxedContainer);
}
