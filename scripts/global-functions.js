/**
 * Function to identify the AEM environment based on the URL.
 * @returns {string} Environment mode (author or publish)
 */
function environmentMode() {
  if (window.location.hostname.includes('adobeaemcloud')) {
    return 'author';
  }
  return 'publish';
}

/**
 * Function to return the formatted date by passing the Timestamp.
 * @returns {string} Formatted  Date string (September 22, 2024)
 */
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

/**
 * Function to sort the JSON By Date in Descending order.
 * @params {data} JSON Array
 * @params {prop} object property name
 * @returns {JSON}
 */
function sortByDate(data, prop) {
  return data.sort((a, b) => {
    const date1 = new Date(a[prop]).getTime();
    const date2 = new Date(b[prop]).getTime();
    return date2 - date1;
  });
}

// eslint-disable-next-line import/prefer-default-export
export { environmentMode, formatDate, sortByDate };
