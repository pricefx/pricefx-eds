function hasWrapper(el) {
  return !!el.firstElementChild && window.getComputedStyle(el.firstElementChild).display === 'block';
}
function toggleAccordion(navToggle) {
  navToggle.open = !navToggle.open;
}
export default function decorate(block) {
  [...block.children].forEach((row) => {
    // decorate accordion item label
    const label = row.children[0];
    let type = row.children[1];

    if (type.firstChild) {
      type = document.createElement(type.firstChild.textContent);
    } else {
      type = document.createElement('h3');
    }
    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    summary.append(...label.childNodes);
    type.innerHTML = summary.innerHTML;
    if (!hasWrapper(summary)) {
      summary.innerHTML = '';
      summary.appendChild(type);
    }

    const buttonWithIcon = document.createElement('button');
    buttonWithIcon.classList.add('accordion-button');
    buttonWithIcon.setAttribute('aria-expanded', 'false');
    buttonWithIcon.innerHTML = '<span class="plus-icon" aria-expanded="false"></span>';
    summary.appendChild(buttonWithIcon);

    // decorate accordion item body
    const body = row.children[2];
    body.className = 'accordion-item-body';
    if (!hasWrapper(body)) {
      body.innerHTML = `<p>${body.innerHTML}</p>`;
    }
    // decorate accordion item
    const details = document.createElement('details');
    details.className = 'accordion-item';
    details.append(summary, body);
    row.classList.add('accordion-item-container');
    row.innerHTML = '';
    row.append(details);

    const menuTitle = summary.querySelector('button');

    menuTitle.addEventListener('click', () => {
      toggleAccordion(details);
    });
  });
}
