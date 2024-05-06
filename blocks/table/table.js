// import ffetch from '../../scripts/ffetch.js';
export default async function decorate(block) {
  // eslint-disable-next-line no-unused-vars
  const [spreadSheetLink, title, disableTopRow, tableVariation] = block.children;

  const tableData = {};

  const tableContainer = document.createElement('div');
  tableContainer.classList.add('table-container');

  const tableTitle = document.createElement('div');
  tableTitle.classList.add('table-title');
  tableTitle.innerHTML = `<h3>${title.textContent} </h3>`;
  tableContainer.appendChild(tableTitle);

  /* Table component  */
  const table = document.createElement('table');
  const variation = tableVariation.textContent.replace(/\s+/g, ' ').trim();

  if (variation === 'default') {
    table.classList.add('table-default');
  } else if (variation === 'icon') {
    table.classList.add('table-icon');
  } else if (variation === 'level') {
    table.classList.add('table-level');
  } else if (variation === 'LevelColor') {
    table.classList.add('levelcolor');
  }

  /* Header Row  */
  const headerRow = document.createElement('tr');
  Object.keys(tableData.data[0]).forEach((key) => {
    const th = document.createElement('th');
    th.textContent = key.charAt(0).toUpperCase() + key.slice(1); // Capitalize the first letter
    headerRow.appendChild(th);
  });

  table.appendChild(headerRow);

  /* Rows */
  tableData.data.forEach((item) => {
    const row = document.createElement('tr');
    Object.values(item).forEach((value) => {
      const cell = document.createElement('td');

      // level-icon
      if (value.toLowerCase() === 'yes') {
        const icon = document.createElement('div');
        icon.classList.add('concentric-circle');
        cell.appendChild(icon);
      } else if (value.toLowerCase() === 'no') {
        cell.textContent = '';
      } else {
        cell.textContent = value;
      }

      // default table
      // cell.textContent = value;

      row.appendChild(cell);
    });
    table.appendChild(row);
  });

  tableContainer.appendChild(table);
  block.appendChild(tableContainer);
}
