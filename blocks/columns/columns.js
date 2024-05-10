export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      if (col.textContent.trim() === '') {
        col.style.border = 'none';
        col.style.background = 'none';
        col.style.boxShadow = 'none';
      }
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        const picParent = pic.parentElement;
        if (picWrapper) {
          picWrapper.classList.add('columns-img-col');
        }

        const linkwrapper = pic.parentElement.nextElementSibling;
        const aInsideStrong = linkwrapper?.querySelector('strong a');
        const aInsideEM = linkwrapper?.querySelector('em a');
        const a = linkwrapper?.querySelector('a');
        const isTarget = linkwrapper?.nextElementSibling;
        if (a && !aInsideStrong && !aInsideEM) {
          a.textContent = '';
          a.target = isTarget?.textContent.trim() === 'true' ? '_blank' : '';
          a.append(pic);
          picParent.append(a);
          linkwrapper.remove();
          if (isTarget) {
            isTarget.remove();
          }
        }
      }
    });
  });
}
