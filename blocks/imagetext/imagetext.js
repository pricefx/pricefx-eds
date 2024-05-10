import { IMAGETEXT } from '../../scripts/constants.js';

export default async function decorate(block) {
  let enableIcon = false;

  const imagetext = document.createElement('div');
  imagetext.classList.add('imagetext-container');

  const imagetextContainer = document.createElement('div');
  imagetextContainer.classList.add('imagetext-main-container');

  const imagetextLeftContainer = document.createElement('div');
  imagetextLeftContainer.classList.add('imagetext-left-container');

  const imagetextRightContainer = document.createElement('div');
  imagetextRightContainer.classList.add('imagetext-right-container');

  const imagetextAction = document.createElement('div');
  imagetextAction.classList.add('imagetext-action');

  const supportContainer = document.createElement('div');
  supportContainer.classList.add('support-container');

  const container = document.createElement('div');
  container.classList.add('container');

  const leftContainer = document.createElement('div');
  leftContainer.classList.add('left-container');

  const rightContainer = document.createElement('div');
  rightContainer.classList.add('right-container');

  [...block.children].forEach((row, index) => {
    if (index === 0) {
      /* Description */
      const imagetextEl = document.createElement('p');
      imagetextEl.classList.add('imagetext-text');
      imagetextEl.textContent = row.firstElementChild.textContent;

      imagetext.appendChild(imagetextEl);
    } else if (index === 1) {
      /* Left Container image */
      const bannerImage = document.querySelector('picture');
      bannerImage.classList.add('banner-image');
      if (bannerImage) {
        const image = document.createElement('div');
        image.classList.add('banner-container');
        image.appendChild(bannerImage);
        imagetextLeftContainer.appendChild(image);
      }
    } else if (index === 2) {
      /* Enable icon for Action Text */
      enableIcon = row.firstElementChild.textContent;
    } else if (index === 3) {
      /* Action Text */

      const action = row.firstElementChild;

      action.childNodes.forEach((node) => {
        if (node.nodeType === 1 && node.tagName === 'P') {
          node.classList.add('icon-text');

          const newParagraph = document.createElement('p');
          newParagraph.classList.add('imagetext-para');
          newParagraph.appendChild(node.firstChild);

          if (enableIcon === 'true') {
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

      imagetextRightContainer.appendChild(imagetextAction);
    } else if (index === 5) {
      /* Button Component */
      const button = document.createElement('div');
      button.classList.add('button-container');
      button.appendChild(row.firstElementChild);
      imagetextAction.appendChild(button);
    } else if (index === 8) {
      /* Support Title */
      const line = document.createElement('div');
      line.classList.add('cross-line');
      supportContainer.appendChild(line);

      const content = document.createElement('div');
      content.classList.add('suggestion-title');
      content.innerHTML = row.firstElementChild.innerHTML;

      supportContainer.appendChild(content);
    } else if (index >= 9 && index <= 11) {
      /* Support 1 eyebrow, Logo, description */
      const firstChild = row.firstElementChild;
      const className = `index-${index}`;
      firstChild.classList.add(className);

      const content = document.createElement('div');
      content.classList.add('content');
      content.appendChild(firstChild);
      leftContainer.appendChild(content);
    } else if (index >= 12 && index <= 14) {
      /* Support 2 eyebrow, Logo, description */
      const firstChild = row.firstElementChild;
      const className = `index-${index}`;
      firstChild.classList.add(className);

      const content = document.createElement('div');
      content.classList.add('content');
      content.appendChild(firstChild);
      rightContainer.appendChild(content);
    } else if (index >= 15 && index <= 17) {
      /* Support 3 eyebrow, Logo, description */

      const firstChild = row.firstElementChild;
      const className = `index-${index}`;
      firstChild.classList.add(className);

      const content = document.createElement('div');
      content.classList.add('content');
      content.appendChild(firstChild);
      leftContainer.appendChild(content);
    } else if (index >= 18 && index <= 20) {
      /* Support 4 eyebrow, Logo, description */
      const firstChild = row.firstElementChild;
      const className = `index-${index}`;
      firstChild.classList.add(className);

      const content = document.createElement('div');
      content.classList.add('content');
      content.appendChild(firstChild);
      rightContainer.appendChild(content);
    }
  });

  container.appendChild(leftContainer);
  container.appendChild(rightContainer);

  supportContainer.appendChild(container);

  imagetextRightContainer.appendChild(supportContainer);

  imagetextContainer.appendChild(imagetextLeftContainer);
  imagetextContainer.appendChild(imagetextRightContainer);

  imagetext.appendChild(imagetextContainer);
  block.textContent = '';
  block.append(imagetext);
}
