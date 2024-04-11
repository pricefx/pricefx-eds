import { loadScript } from '../../scripts/aem.js';
import { EMAIL, FACEBOOK, LINKEDIN, TWITTER } from '../../scripts/constants.js';

function decorateSocialShare(block, config) {
  const wrapperElement = document.createElement('ul');
  wrapperElement.classList.add('a2a_kit', 'a2a_kit_size_32', 'a2a_default_style');
  Array.from(config).forEach((item) => {
    const listItem = document.createElement('li');
    const socialLink = document.createElement('a');
    socialLink.classList.add(`a2a_button_${item}`);
    socialLink.setAttribute('title', `Share on ${item}`);
    switch (item) {
      case 'facebook':
        socialLink.innerHTML = FACEBOOK;
        break;
      case 'twitter':
        socialLink.innerHTML = TWITTER;
        break;
      case 'linkedin':
        socialLink.innerHTML = LINKEDIN;
        break;
      default:
        socialLink.innerHTML = EMAIL;
    }
    listItem.appendChild(socialLink);
    wrapperElement.appendChild(listItem);
  });
  loadScript('https://static.addtoany.com/menu/page.js', { async: true });
  block.appendChild(wrapperElement);
}

export default async function decorate(block) {
  const [socialShare] = block.children;
  const config = socialShare?.querySelector('p')?.textContent?.split(',');
  block.textContent = '';
  if (config) {
    decorateSocialShare(block, config);
  }
}
