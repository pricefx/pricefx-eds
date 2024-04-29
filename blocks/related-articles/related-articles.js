import { createOptimizedPicture, getMetadata } from '../../scripts/aem.js';
import ffetch from '../../scripts/ffetch.js';

function generateCardDom(article) {
  const { articlePublishDate, image, imageAlt, title, path, readingTime } = article;

  // Build DOM
  const cardDOM = document.createRange().createContextualFragment(`
    <li class='card-item'>
      <a class='cards-card-link' href='${path}'>
        <div class='cards-card-image'>
        <picture>
            <img src='${image || ''}'  alt='${imageAlt || ''}'/>
        </picture>
        </div>
        <div class='cards-card-body'>
            ${title ? `<div class='cards-card-title'><h6>${title}</h6></div>` : ``}
            <div class='cards-card-cta'>
              <div class='cards-card-published-date'>${articlePublishDate}</div>
              ${readingTime ? `<div class='cards-card-reading-time'>${readingTime} min read</div>` : ''}
            </div>
        </div>
      </a>
    </li>
    `);
  return cardDOM;
}

const filterBasedOnProp = (data = [], filterProps = [], filterValues = {}) =>
  data.filter(
    (item) =>
      filterProps.filter((prop) => {
        const filteredValue = filterValues[prop];
        return filteredValue?.filter((filterItem) => filterItem && item[prop]?.includes(filterItem)).length > 0;
      }).length > 0,
  );

export default async function decorate(block) {
  const data = await ffetch('/article-index.json').all();
  const title = block.children[0]?.textContent.trim();
  const titleEle = `<h2>${title}</h2>`;
  const columnLayout = block.children[1]?.textContent.trim() || 'three-column';
  let categoryTags = block.children[2]?.textContent.trim()?.split(',');
  const articleTags = block.children[3]?.textContent.trim()?.split(',');
  if (categoryTags.toString().length === 0) {
    categoryTags = getMetadata('category')?.split(',');
  }
  const filterValues = {
    category: categoryTags,
    authors: articleTags,
  };
  const filterProps = ['authors', 'category'];
  block.classList.add(columnLayout, 'cards', 'aspect-ratio-16-9');
  block.innerHTML = titleEle;
  const ul = document.createElement('ul');

  const filteredData = filterBasedOnProp(data, filterProps, filterValues);

  // Sorting Article by Date published
  filteredData.sort((a, b) => {
    const date1 = new Date(a.articlePublishDate).getTime();
    const date2 = new Date(b.articlePublishDate).getTime();
    return date2 - date1;
  });

  filteredData?.forEach((article, index) => {
    if (index > 8) {
      return;
    }

    ul.append(generateCardDom(article));
  });
  block.append(ul);
  ul.querySelectorAll('img').forEach((img) =>
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])),
  );
}
