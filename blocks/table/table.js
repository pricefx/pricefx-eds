import { CIRCLEICON } from '../../scripts/constants.js';

export default async function decorate(block) {
  // eslint-disable-next-line no-unused-vars
  const [title, showHeader, numberOfColumns, tableVariation, ...rows] = block.children;

  const tableContainer = document.createElement('div');
  tableContainer.classList.add('table-container');

  const tableTitle = document.createElement('div');
  tableTitle.classList.add('table-title');
  tableTitle.innerHTML = `<h3>${title.textContent} </h3>`;
  tableContainer.appendChild(tableTitle);

  /* Table component  */
  const table = document.createElement('table');
  const variation = tableVariation.textContent.replace(/\s+/g, ' ').trim();

  rows.forEach((rowDiv, rowIndex) => {
    const row = document.createElement('tr');

    if (variation === 'default') {
      table.classList.add('table-default');
      [...rowDiv.children].forEach((cellDiv) => {
        if (cellDiv.textContent.trim() !== '') {
          const cell =
            showHeader.textContent.replace(/\s+/g, '') === 'true' && rowIndex === 0
              ? document.createElement('th')
              : document.createElement('td');
          cell.textContent = cellDiv.textContent;
          row.appendChild(cell);
        }
      });
    } else if (variation === 'icon') {
      table.classList.add('table-icon');
      [...rowDiv.children].forEach((cellDiv) => {
        if (cellDiv.textContent.trim() !== '') {
          const cell =
            showHeader.textContent.replace(/\s+/g, '') === 'true' && rowIndex === 0
              ? document.createElement('th')
              : document.createElement('td');
          cell.textContent = cellDiv.textContent;
          row.appendChild(cell);
        }
      });
    } else if (variation === 'level') {
      table.classList.add('table-level');
      [...rowDiv.children].forEach((cellDiv) => {
        if (cellDiv.textContent.trim() !== '') {
          const cell =
            showHeader.textContent.replace(/\s+/g, '') === 'true' && rowIndex === 0
              ? document.createElement('th')
              : document.createElement('td');
          const cellText = cellDiv.textContent.trim().toLowerCase();
          if (cellText === 'yes') {
            cell.classList.add('concentric-circle');
            cell.innerHTML = CIRCLEICON;
          } else if (cellText === 'no') {
            cell.textContent = '';
          } else {
            cell.textContent = cellDiv.textContent;
            // cell.style.fontWeight = 'bold';
          }
          row.appendChild(cell);
        }
      });
    } else if (variation === 'LevelColor') {
      table.classList.add('levelcolor');
      const columnColors = ['#FFFFFF', '#f5a057', '#41b6e6', '#6eb74a'];

      [...rowDiv.children].forEach((cellDiv, cellIndex) => {
        if (cellDiv.textContent.trim() !== '') {
          const cell =
            showHeader.textContent.replace(/\s+/g, '') === 'true' && rowIndex === 0
              ? document.createElement('th')
              : document.createElement('td');
          const cellText = cellDiv.textContent.trim().toLowerCase();
          if (cellText === 'yes') {
            cell.classList.add('concentric-circle');
            cell.innerHTML = CIRCLEICON;
          } else if (cellText === 'no') {
            cell.textContent = '';
          } else {
            cell.textContent = cellDiv.textContent;
            // cell.style.fontWeight = 'bold';
          }

          if (rowIndex === 0 && showHeader.textContent.replace(/\s+/g, '') === 'true') {
            cell.style.color = columnColors[cellIndex];
          }

          row.appendChild(cell);
        }
      });
    } else if (variation === 'im-connect') {
      table.classList.add('table-im-connect');
      [...rowDiv.children].forEach((cellDiv) => {
        if (cellDiv.textContent.trim() !== '') {
          const cell =
            showHeader.textContent.replace(/\s+/g, '') === 'true' && rowIndex === 0
              ? document.createElement('th')
              : document.createElement('td');
          cell.textContent = cellDiv.textContent;
          row.appendChild(cell);
        }
      });
    }

    table.appendChild(row);
  });
  tableContainer.appendChild(table);

  block.textContent = '';
  block.appendChild(tableContainer);
}