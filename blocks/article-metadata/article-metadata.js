import { getMetadata } from '../../scripts/aem.js';
import { environmentMode } from '../../scripts/global-functions.js';
import { BASE_CONTENT_PATH } from '../../scripts/url-constants.js';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

const formatDateFromTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

const toTitleCase = (str) => str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

// Function to generate author page link
const getAuthorPageLink = (authorName) => `${authorName.replace(/\s+/g, '-').toLowerCase()}`;

export default async function decorate(block) {
  const container = document.createElement('div');
  container.classList.add('article-metadata-container');

  // Extracting metadata
  const articleAuthors = getMetadata('authors');
  const articlePostDate = getMetadata('publishdate');
  const articleReadTime = getMetadata('readingtime');
  const articleUpdatedDate = getMetadata('published-time');

  // Extracting authorsParentPagePath from block's text content
  let authorsParentPagePath = '';
  if (block.children.length > 0) {
    const [firstChild] = block.children;
    authorsParentPagePath = firstChild.textContent.trim();
  }

  block.textContent = '';

  // Formatting authorsParentPagePath
  let authorsParentPagePathFormatted = authorsParentPagePath;
  const isPublishEnvironment = environmentMode() === 'publish';

  if (!isPublishEnvironment) {
    // In the author environment, ensure the URL does not end with a slash
    // Append a slash only if the URL doesn't already end with it
    if (!authorsParentPagePathFormatted.endsWith('/')) {
      authorsParentPagePathFormatted += '/';
    }
  } else {
    // In the publish environment, remove the base path if present
    authorsParentPagePathFormatted = authorsParentPagePathFormatted.replace(BASE_CONTENT_PATH, '');
  }

  // Format post date and updated date
  const postDate = formatDate(articlePostDate);
  const updatedDate = formatDateFromTimestamp(articleUpdatedDate);

  // Generate authors list
  const authors = articleAuthors
    .split(',')
    .map((authorTag) => {
      const authorName = authorTag
        .split('/')
        .pop()
        .split('-')
        .map((word) => toTitleCase(word))
        .join(' ');
      const authorLink = document.createElement('a');
      let authorPageLink = '';
      if (!isPublishEnvironment) {
        authorPageLink = `${authorsParentPagePathFormatted}${getAuthorPageLink(authorName)}.html`;
      } else {
        authorPageLink = `/authors/${getAuthorPageLink(authorName)}`;
      }
      authorLink.href = authorPageLink;
      authorLink.textContent = authorName;
      return authorLink.outerHTML;
    })
    .join(' & ');

  // Create elements for post date and authors
  const postDateElement = document.createElement('div');
  postDateElement.textContent = `${postDate} (Updated ${updatedDate}) | ${articleReadTime} min. read`;
  const authorsElement = document.createElement('div');
  authorsElement.innerHTML = `By ${authors}`;

  container.appendChild(postDateElement);
  container.appendChild(authorsElement);
  block.appendChild(container);
}
