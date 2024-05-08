import { createOptimizedPicture } from '../../scripts/aem.js';
import { decorateEmbed } from '../embed/embed.js';

function decorateRightContainer(boxedRightContainer) {
  const boxedVariation = boxedRightContainer.firstElementChild.textContent || 'imageVariation';

  if (boxedVariation === 'imageVariation') {
    const boxedImageContainer = document.createElement('div');
    boxedImageContainer.classList.add('boxed-image-container');
    const boxedImage = boxedRightContainer.children[2];
    if (window.matchMedia('(min-width:986px)').matches && boxedImage.querySelector('img') !== null) {
      boxedImageContainer.setAttribute('style', `background-image:url(${boxedImage.querySelector('img').src})`);
    }
    boxedImageContainer.append(boxedImage);
    boxedRightContainer.textContent = '';
    boxedRightContainer.append(boxedImageContainer);
  } else if (boxedVariation === 'videoVariation') {
    const boxedRightContainerInner = document.createElement('div');
    boxedRightContainerInner.classList.add('embed');
    const placeholder = boxedRightContainer.children[3];
    const link = boxedRightContainer.children[4];
    const overlayText = boxedRightContainer.children[5];
    const isPopup = boxedRightContainer.children[6];
    boxedRightContainer.textContent = '';
    if (link.textContent !== '') {
      if (window.matchMedia('(min-width:986px)').matches && placeholder.querySelector('img') !== null) {
        boxedRightContainerInner.setAttribute('style', `background-image:url(${placeholder.querySelector('img').src})`);
      }
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
  const boxedLeftContainerInner = document.createElement('div');
  boxedLeftContainerInner.classList.add('boxed-content-container');

  [...block.children].forEach((row, index) => {
    if (index <= 6) {
      if (index === 1) {
        const variationOption = row.firstElementChild?.textContent || 'false';
        if (variationOption === 'true') {
          boxedContainer.classList.add('boxed-content-right');
        }
      }
      /* Image / Video */
      boxedRightContainer.append(row.firstElementChild);
      boxedRightContainer.classList.add('boxed-right-container');
    } else if (index === 7) {
      /* Eyebrow Text */
      if (row.firstElementChild?.textContent !== '') {
        const boxedEyebrowText = document.createElement('span');
        boxedEyebrowText.classList.add('boxed-eyebrow-text');
        boxedEyebrowText.append(row.firstElementChild);
        boxedLeftContainerInner.append(boxedEyebrowText);
      }
    } else if (index === 8) {
      /* Left Right Boxed Content */
      boxedLeftContainerInner.append(row.firstElementChild?.firstElementChild || '');
      boxedLeftContainer.append(boxedLeftContainerInner);
    }
  });
  decorateRightContainer(boxedRightContainer);

  boxedRightContainer
    .querySelectorAll('img')
    .forEach((img) =>
      img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])),
    );

  boxedContainer.append(boxedLeftContainer);
  boxedContainer.append(boxedRightContainer);
  block.textContent = '';
  block.append(boxedContainer);
}
