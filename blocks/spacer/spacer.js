export default async function decorate(block) {
    const [spacerValue] = block.children;
    block.textContent = '';
  
    const spacerEl = document.createElement('div');
    spacerEl.textContent = block.textContent;
  
    const authorEl = document.createElement('div');
    authorEl.classList.add(spacerValue);
  
    block.appendChild(spacerEl);
    block.appendChild(authorEl);
  }
  