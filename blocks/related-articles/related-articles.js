import { createOptimizedPicture, getMetadata } from '../../scripts/aem.js';
import { environmentMode } from '../../scripts/global-functions.js';
import { PUBLISH_ENDPOINT } from '../../scripts/url-constants.js';
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
        return filteredValue?.filter((filterItem) => item[prop]?.includes(filterItem)).length > 0;
      }).length > 0,
  );

export default async function decorate(block) {
  const url = environmentMode() === 'author' ? `${PUBLISH_ENDPOINT}/article-index.json` : '/article-index.json';
  // Get Data
  const data = await ffetch(url).all();
  // const type = block.children[0]?.textContent.trim(); // TODO for Blog Articles
  const title = block.children[1]?.textContent.trim();
  const titleEle = `<h2>${title}</h2>`;
  const columnLayout = block.children[2]?.textContent.trim() || 'three-column';
  let categoryTags = block.children[3]?.textContent.trim()?.split(',');
  const topicTags = block.children[4]?.textContent.trim()?.split(',');
  const authorTags = block.children[5]?.textContent.trim()?.split(',');
  if (categoryTags.toString().length === 0) {
    categoryTags = getMetadata('category')?.split(',');
  }

  block.classList.add(columnLayout, 'cards', 'aspect-ratio-16-9');
  block.innerHTML = titleEle;
  const ul = document.createElement('ul');

  // filter by Category
  const filteryByCategory = filterBasedOnProp(data, ['category'], { category: categoryTags });

  // filter by other tags
  const filteryByTopics = filterBasedOnProp(filteryByCategory, ['topics'], { topics: topicTags });
  const filteredData = filterBasedOnProp(filteryByTopics, ['authors'], { authors: authorTags });

  // Sorting Article by Date published
  filteredData.sort((a, b) => {
    const date1 = new Date(a.articlePublishDate).getTime();
    const date2 = new Date(b.articlePublishDate).getTime();
    return date2 - date1;
  });

  filteredData?.forEach((article, index) => {
    if (index > 7) {
      return;
    }

    ul.append(generateCardDom(article));
  });
  block.append(ul);
  ul.querySelectorAll('img').forEach((img) =>
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])),
  );
}
