import { IMAGETEXT, PLAYBUTTON } from '../../scripts/constants.js';

export default async function decorate(block) {
  // eslint-disable-next-line no-unused-vars
  const [description, bannerpicture, enableIcon] = block.children;

  // eslint-disable-next-line no-unused-vars
  let suggestionLogo = false;

  const imagetext = document.createElement('div');
  imagetext.classList.add('imagetext-container');

  const imagetextContainer = document.createElement('div');
  imagetextContainer.classList.add('imagetext-main-container');

  const imagetextLeftContainer = document.createElement('div');
  imagetextLeftContainer.classList.add('imagetext-left-container');

  const imagetextRightContainer = document.createElement('div');
  imagetextRightContainer.classList.add('imagetext-right-container');

  const container = document.createElement('div');
  container.classList.add('container');

  const leftContainer = document.createElement('div');
  leftContainer.classList.add('left-container');

  const rightContainer = document.createElement('div');
  rightContainer.classList.add('right-container');

  [...block.children].forEach((row, index) => {
    if (index === 0) {
      const imagetextEl = document.createElement('p');
      imagetextEl.classList.add('imagetext-text');
      imagetextEl.textContent = row.firstElementChild.textContent;

      imagetext.appendChild(imagetextEl);
    } else if (index === 1) {
      const bannerImage = document.querySelector('picture img');
      if (bannerImage) {
        const image = document.createElement('div');
        image.classList.add('banner-image');
        image.appendChild(bannerImage);
        imagetextLeftContainer.appendChild(image);
      }
    } else if (index === 2) {
      suggestionLogo = row.firstElementChild.textContent;
      suggestionLogo = false;
    } else if (index === 3) {
      // 4
      const imagetextAction = document.createElement('div');
      imagetextAction.classList.add('imagetext-action');

      const action = row.firstElementChild;

      action.childNodes.forEach((node) => {
        if (node.nodeType === 1 && node.tagName === 'P') {
          node.classList.add('icon-text');

          const newParagraph = document.createElement('p');
          newParagraph.classList.add('imagetext-para');
          newParagraph.appendChild(node.firstChild);

          if (enableIcon.textContent.replace(/\s+/g, '') === 'true') {
            const icon = document.createElement('div');
            icon.classList.add('imagetext-icon');
            icon.innerHTML = IMAGETEXT;
            icon.appendChild(newParagraph);

            node.insertBefore(icon, node.firstChild);
          } else {
            node.insertBefore(newParagraph, node.firstChild);
          }
        }
      });

      imagetextAction.appendChild(action);

      const line = document.createElement('div');
      line.classList.add('cross-line');
      imagetextAction.appendChild(line);

      imagetextRightContainer.appendChild(imagetextAction);
    } else if (index >= 4) {
      const content = document.createElement('div');
      content.classList.add('content');
      content.innerHTML = row.firstElementChild.innerHTML;

      if (suggestionLogo === 'true') {
        const image = document.createElement('img');
        image.classList.add('suggestion-image');
        image.src = 'image-url.jpg';
        const replaceSuggestionImage = content.querySelector('p:first-child');
        content.replaceChild(image, replaceSuggestionImage);
      }

      const playButton = document.createElement('span');
      playButton.classList.add('play-button');
      playButton.innerHTML = PLAYBUTTON;

      const textPlayButton = content.querySelector('p:last-child');

      const tempText = textPlayButton.textContent;
      textPlayButton.innerHTML = '';

      const tempSpan = document.createElement('p');
      tempSpan.classList.add('text-icon');
      tempSpan.textContent = tempText;

      tempSpan.appendChild(playButton);
      textPlayButton.appendChild(tempSpan);

      if (index % 2 === 0) {
        leftContainer.appendChild(content);
      } else {
        rightContainer.appendChild(content);
      }
    }
  });

  container.appendChild(leftContainer);
  container.appendChild(rightContainer);
  imagetextRightContainer.appendChild(container);

  imagetextContainer.appendChild(imagetextLeftContainer);
  imagetextContainer.appendChild(imagetextRightContainer);

  imagetext.appendChild(imagetextContainer);
  block.textContent = '';
  block.append(imagetext);
}
