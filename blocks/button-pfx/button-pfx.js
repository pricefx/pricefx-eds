export default async function decorate(block) {
  const [link, target, buttonLabel, type] = block.children;
  block.textContent = '';
  const targetValue = target.textContent.trim() === 'true' ? '_blank' : '_self';

  if (type.textContent.trim() === 'left-arrow') {
    block.classList.add('left-arrow');
  } else if (type.textContent.trim() === 'right-arrow') {
    block.classList.add('right-arrow');
  }

  if (link.textContent.trim() === '') {
    const buttonEl = document.createElement('button');
    buttonEl.classList.add('button');
    buttonEl.textContent = buttonLabel.textContent.trim();
    block.appendChild(buttonEl);
  } else {
    const buttonEl = document.createElement('a');
    buttonEl.classList.add('button');
    buttonEl.textContent = buttonLabel.textContent.trim();
    buttonEl.href = link.textContent.trim();
    buttonEl.setAttribute('target', targetValue);
    block.appendChild(buttonEl);
  }
}
