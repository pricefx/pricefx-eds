function hasWrapper(el) {
  document.addEventListener('DOMContentLoaded', () => {
    const icon = document.getElementById('plus-icon');
    icon.setAttribute('aria-expanded', 'false');
  });
  return !!el.firstElementChild && window.getComputedStyle(el.firstElementChild).display === 'block';
}

export default function decorate(block) {
  [...block.children].forEach((row) => {
    // decorate accordion item label
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    summary.append(...label.childNodes);
    if (!hasWrapper(summary)) {
      summary.innerHTML = `
        <p>${summary.innerHTML}</p>
        <button class="accordion-button" aria-expanded="false">
          <span class="plus-icon" aria-expanded="false"></span>
        </button>
     `;
    }
    // decorate accordion item body
    const body = row.children[1];
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
  });

  const plusIcon = document.querySelector('.plus-icon');
  plusIcon.addEventListener('click', () => {
    const ariaExpandedState = plusIcon.getAttribute('aria-expanded');
    const details = document.querySelector('details');
    if (ariaExpandedState === 'false') {
      details.setAttribute('open', 'true');
    } else if (ariaExpandedState === 'true') {
      details.removeAttribute('open');
    }
    const newAriaExpandedState = ariaExpandedState === 'false' ? 'true' : 'false';
    plusIcon.setAttribute('aria-expanded', newAriaExpandedState);
  });
}
