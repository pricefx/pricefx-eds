export default function decorate(block) {
  const parentDiv = document.createElement('div');
  const size = block.lastElementChild.querySelector('p');
  let titleSize = '';
  if (size) {
    titleSize = size.textContent.trim();
  }

  const background = block.lastElementChild.previousElementSibling;
  const pText = background.querySelector('p').textContent.trim();
  parentDiv.classList.add('statsWrapper');
  parentDiv.classList.add(pText);

  let childDiv = null;
  [...block.children].forEach((row) => {
    const element = row.querySelector('[data-richtext-prop]');
    if (element) {
      const propValue = element.getAttribute('data-richtext-prop');
      // If either a title or description is left empty, add a corresponding empty tag
      if (propValue && propValue.includes('stat')) {
        // If title is authored without description
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
        if (titleSize) {
          titleDiv.classList.add(titleSize);
        }
        titleDiv.appendChild(pTag.cloneNode(true));
        childDiv.appendChild(titleDiv);
        const line = document.createElement('div');
        line.classList.add('line');
        childDiv.appendChild(line);
      } else if (propValue && propValue.includes('description')) {
        // If description is authored without title
        if (childDiv === null) {
          childDiv = document.createElement('div');
          childDiv.classList.add('stat');
          const emptyTag = document.createElement('p');
          const titleDiv = document.createElement('div');
          titleDiv.appendChild(emptyTag.cloneNode(true));
          titleDiv.classList.add('stat-title');
          if (titleSize) {
            titleDiv.classList.add(titleSize);
          }
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

  // Adjust Height of stat-title
  const adjustStatTitleHeight = () => {
    const statTitles = parentDiv.querySelectorAll('.stat-title');
    statTitles.forEach((title) => {
      title.style.height = 'auto'; // Set height to auto to recalculate
    });
    setTimeout(() => {
      const statTitle = parentDiv.querySelectorAll('.stat-title');
      let maxHeight = 0;
      statTitle.forEach((title) => {
        const height = title.offsetHeight;
        maxHeight = Math.max(maxHeight, height);
      });
      if (maxHeight !== 0) {
        statTitle.forEach((title) => {
          title.style.height = `${maxHeight}px`;
        });
      }
    }, 200); // Delay to ensure proper recalculation after content changes
  };

  // Attach resize event listener to adjust heights on window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      adjustStatTitleHeight();
    }
  });

  // Initial call to adjust heights
  if (window.innerWidth > 768) {
    adjustStatTitleHeight();
  }

  block.innerHTML = '';
  block.appendChild(parentDiv);
}
