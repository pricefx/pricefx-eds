import { CIRCLEICON } from '../../scripts/constants.js';
import { decorateButtons } from '../../scripts/aem.js';

function hasNumber(myString) {
  return /\d/.test(myString);
}

export default async function decorate(block) {
  // eslint-disable-next-line no-unused-vars
  const [title, showHeader, , tableVariation, ...rows] = block.children;

  const tableContainer = document.createElement('div');
  tableContainer.classList.add('table-container');

  const titleContent = title.textContent.trim() || 'default';
  const tableTitle = document.createElement('div');
  tableTitle.classList.add('table-title');
  tableTitle.innerHTML = `<h3>${titleContent} </h3>`;
  tableContainer.appendChild(tableTitle);

  /* Table component  */
  const table = document.createElement('table');
  const variation = tableVariation?.textContent.trim() || 'default';

  if (variation === 'default') {
    table.classList.add('table-default');
    const row = document.createElement('tr');
    rows.forEach((rowDiv, rowIndex) => {
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
      table.appendChild(row);
    });
  } else if (variation === 'icon') {
    table.classList.add('table-icon');
    const row = document.createElement('tr');
    rows.forEach((rowDiv, rowIndex) => {
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
      table.appendChild(row);
    });
  } else if (variation === 'level') {
    table.classList.add('table-level');
    const row = document.createElement('tr');
    rows.forEach((rowDiv, rowIndex) => {
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
            const hasNum = hasNumber(cellText);

            if (hasNum === true) {
              cell.style.fontWeight = 'var(--fw-bold)';
            }
            cell.textContent = cellDiv.textContent;
          }
          row.appendChild(cell);
        }
      });
      table.appendChild(row);
    });
  } else if (variation === 'LevelColor') {
    table.classList.add('levelcolor');
    const columnColors = [
      'var(--c-white)',
      'var(--c-level-header-1)',
      'var(--c-level-header-2)',
      'var(--c-level-header-3)',
    ];
    const row = document.createElement('tr');
    rows.forEach((rowDiv, rowIndex) => {
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
            const hasNum = hasNumber(cellText);

            if (hasNum === true) {
              cell.style.fontWeight = 'var(--fw-bold)';
            }
            cell.textContent = cellDiv.textContent;
          }

          if (rowIndex === 0 && showHeader.textContent.replace(/\s+/g, '') === 'true') {
            cell.style.color = columnColors[cellIndex];
          }

          row.appendChild(cell);
        }
      });
      table.appendChild(row);
    });
  } else if (variation === 'buttonRow') {
    table.classList.add('table-im-connect');
    const row = document.createElement('tr');
    rows.forEach((rowDiv, rowIndex) => {
      [...rowDiv.children].forEach((cellDiv) => {
        const cell =
          showHeader.textContent.replace(/\s+/g, '') === 'true' && rowIndex === 0
            ? document.createElement('th')
            : document.createElement('td');

        if (rowIndex === 0) {
          cell.textContent = cellDiv.textContent;
        } else if (rowIndex >= 1) {
          cell.appendChild(cellDiv);
          decorateButtons(cellDiv);
        }

        row.appendChild(cell);
      });
      table.appendChild(row);
    });
  }

  tableContainer.appendChild(table);

  block.textContent = '';
  block.appendChild(tableContainer);
}
