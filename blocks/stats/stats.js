export default function decorate(block) {
  const parentDiv = document.createElement('div');
  parentDiv.classList.add('statsWrapper');
  let childDiv = null;
  [...block.children].forEach((row) => {
      const element = row.querySelector('[data-richtext-prop]');
      if(element) {
          const propValue = element.getAttribute('data-richtext-prop');
          if (propValue && propValue.includes('stat')) {
              if (childDiv) {
                  const emptyTag = document.createElement('p');
                  const textDiv = document.createElement('div');
                  textDiv.classList.add('stat-description');
                  textDiv.appendChild(emptyTag.cloneNode(true));
                  childDiv.appendChild(textDiv);
                  parentDiv.appendChild(childDiv);
                  childDiv = null;
              }
              childDiv = document.createElement('div');
              childDiv.classList.add('stat');
              const pTag = element.querySelector('p');
              const titleDiv = document.createElement('div');
              titleDiv.classList.add('stat-title');
              titleDiv.appendChild(pTag.cloneNode(true));
              childDiv.appendChild(titleDiv);
              const line = document.createElement('div');
              line.classList.add('line');
              childDiv.appendChild(line);
          } else if (propValue && propValue.includes('description')) {
              if (childDiv === null) {
                  childDiv = document.createElement('div');
                  childDiv.classList.add('stat');
                  const emptyTag = document.createElement('p');
                  const titleDiv = document.createElement('div');
                  titleDiv.appendChild(emptyTag.cloneNode(true));
                  titleDiv.classList.add('stat-title');
                  childDiv.appendChild(titleDiv);
                  const line = document.createElement('div'); 
                  line.classList.add('line');
                  childDiv.appendChild(line);
              }
              const pTag = element.querySelector('p');
              const textDiv = document.createElement('div');
              textDiv.classList.add('stat-description');
              textDiv.appendChild(pTag.cloneNode(true));
              childDiv.appendChild(textDiv);
              parentDiv.appendChild(childDiv);
              childDiv = null;
          }   
      }
  });  
  if (childDiv) {
      const emptyTag = document.createElement('p');
      const textDiv = document.createElement('div');
      textDiv.appendChild(emptyTag.cloneNode(true));
      textDiv.classList.add('stat-description');
      childDiv.appendChild(textDiv);
      parentDiv.appendChild(childDiv);
  }
  block.innerHTML = '';
  block.appendChild(parentDiv);
}
