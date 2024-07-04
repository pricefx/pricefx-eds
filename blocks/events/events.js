import ffetch from '../../scripts/ffetch.js';
import { EVENTS_INDEX_PATH } from '../../scripts/url-constants.js';

/**
 * Decorates Events on DOM
 * @param {Element} block The Events block element
 */
export default async function decorate(block) {
  // Fetch Events content from JSON endpoint

  const eventsData = await ffetch(EVENTS_INDEX_PATH).all();
  console.log(block);
  console.log(eventsData);
}
