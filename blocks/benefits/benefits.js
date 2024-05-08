import { BENEFITS } from '../../scripts/constants.js';

export default async function decorate(block) {
  // eslint-disable-next-line no-unused-vars
  const [description, benefitpicture, enableIcon, actionText, supportText] = block.children;

  const benefits = document.createElement('div');
  benefits.classList.add('benefits-container');

  const benefitsContainer = document.createElement('div');
  benefitsContainer.classList.add('benefits-main-container');

  const benefitsLeftContainer = document.createElement('div');
  benefitsLeftContainer.classList.add('benefits-left-container');

  const benefitsRightContainer = document.createElement('div');
  benefitsRightContainer.classList.add('benefits-right-container');

  [...block.children].forEach((row, index) => {
    if (index === 0) {
      const benefitsEl = document.createElement('p');
      benefitsEl.classList.add('benefits-text');
      benefitsEl.textContent = row.firstElementChild.textContent;

      benefits.appendChild(benefitsEl);
    } else if (index === 1) {
      const benefitImage = document.querySelector('picture img');
      if (benefitImage) {
        const image = document.createElement('div');
        image.classList.add('benefits-image');
        image.appendChild(benefitImage);
        benefitsLeftContainer.appendChild(image);
      }
    } else if (index === 3) {
      const benefitsAction = document.createElement('div');
      benefitsAction.classList.add('benefits-action');

      const action = row.firstElementChild;

      action.childNodes.forEach((node) => {
        if (node.nodeType === 1 && node.tagName === 'P') {
          node.classList.add('icon-text');

          const newParagraph = document.createElement('p');
          newParagraph.classList.add('benefits-para');
          newParagraph.appendChild(node.firstChild);

          if (enableIcon.textContent.replace(/\s+/g, '') === 'true') {
            const icon = document.createElement('div');
            icon.classList.add('benefits-icon');
            icon.innerHTML = BENEFITS;
            icon.appendChild(newParagraph);

            node.insertBefore(icon, node.firstChild);
          } else {
            node.insertBefore(newParagraph, node.firstChild);
          }
        }
      });

      benefitsAction.appendChild(action);
      benefitsRightContainer.appendChild(benefitsAction);
    } else if (index === 4) {
      const line = document.createElement('hr');
      line.classList.add('cross-line');
      benefitsRightContainer.appendChild(line);
      const container = document.createElement('div');
      container.classList.add('container');

      const leftContainer = document.createElement('div');
      leftContainer.classList.add('left-container');

      const rightContainer = document.createElement('div');
      rightContainer.classList.add('right-container');

      const divElement = row.firstElementChild;

      const { children } = divElement;

      let iteration = 1;

      for (let i = 1; i < children.length; i += 1) {
        const currentElement = children[i];

        if (currentElement.tagName.toLowerCase().startsWith('h')) {
          const heading = currentElement;

          let nextElement = heading.nextElementSibling;
          const paragraphs = [];

          while (nextElement) {
            if (nextElement.tagName.toLowerCase() === 'p') {
              paragraphs.push(nextElement);
            }

            nextElement = nextElement.nextElementSibling;
          }

          if (paragraphs.length > 1) {
            const content = document.createElement('div');
            content.classList.add('content');
            content.innerHTML = `<p><strong>${heading.textContent}</strong></p>
             <p>${paragraphs[0].textContent.trim()}</p>
             <p class="uppercase"><strong>${paragraphs[1].textContent.trim()}<strong></p>
            </div>`;

            if (iteration % 2 === 1) {
              leftContainer.appendChild(content);
            } else {
              rightContainer.appendChild(content);
            }

            iteration += 1;
          }
        }
      }
      container.appendChild(leftContainer);
      container.appendChild(rightContainer);
      benefitsRightContainer.appendChild(container);
    }
  });

  benefitsContainer.appendChild(benefitsLeftContainer);
  benefitsContainer.appendChild(benefitsRightContainer);

  benefits.appendChild(benefitsContainer);
  block.textContent = '';
  block.append(benefits);
}
