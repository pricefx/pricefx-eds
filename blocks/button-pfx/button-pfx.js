export default async function decorate(block) {
  const [link, buttonLabel, type] = block.children;
  block.textContent = '';

  if (link.textContent !== '') {
    const buttonEl = document.createElement('a');
    buttonEl.classList.add('button');
    buttonEl.textContent = buttonLabel.textContent;
    buttonEl.href = link.textContent;
    block.appendChild(buttonEl);
  } else {
    const buttonEl = document.createElement('button');
    buttonEl.classList.add('button');
    buttonEl.textContent = buttonLabel.textContent;
    block.appendChild(buttonEl);
  }

  console.log(block.children, link.textContent, buttonLabel.textContent, type.textContent);
}
