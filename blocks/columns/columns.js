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
        if (picWrapper) {
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });
}
