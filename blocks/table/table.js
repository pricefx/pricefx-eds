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

  /* Header Row  */
  const headerRow = document.createElement('tr');
  headerRow.innerHTML = `<style id="dynamic-styles" class="dynamic-styles">`;
  Object.keys(tableData.data[0]).forEach((key, index) => {
    const th = document.createElement('th');
    th.textContent = key.charAt(0).toUpperCase() + key.slice(1);
    if (variation === 'LevelColor') {
      th.classList.add(`column-${index}`); // Add class based on column index
    }
    headerRow.appendChild(th);
  });

  table.appendChild(headerRow);

  if (variation === 'default' || variation === 'icon') {
    if (variation === 'default') {
      table.classList.add('table-default');
    } else {
      table.classList.add('table-icon');
    }

    tableData.data.forEach((item) => {
      const row = document.createElement('tr');

      /* Default Table / Icon Table */
      Object.values(item).forEach((value) => {
        const cell = document.createElement('td');
        cell.textContent = value;
        row.appendChild(cell);
      });

      table.appendChild(row);
    });
  } else if (variation === 'level' || variation === 'LevelColor') {
    tableData.data.forEach((item) => {
      const row = document.createElement('tr');
      /* Level Table && LevelColor Table */
      Object.values(item).forEach((value) => {
        const cell = document.createElement('td');
        if (value.toLowerCase() === 'yes') {
          const icon = document.createElement('div');
          icon.classList.add('concentric-circle');
          cell.appendChild(icon);
        } else if (value.toLowerCase() === 'no') {
          cell.textContent = '';
        } else {
          cell.textContent = value;
        }
        row.appendChild(cell);
      });

      table.appendChild(row);
    });

    if (variation === 'level') {
      table.classList.add('table-level');
    } else if (variation === 'LevelColor') {
      table.classList.add('levelcolor');
      const dynamicStyles = document.createElement('style');
      dynamicStyles.classList.add('dynamic-styles');
      headerRow.appendChild(dynamicStyles);
      const colors = ['#f5a057', '#41b6e6', '#6eb74a'];
      Object.keys(tableData.data[0]).forEach((key, index) => {
        if (index !== 0) {
          const colorIndex = index % colors.length; // Calculate color index
          dynamicStyles.textContent += `
    .column-${index} {
        color: var(--color-${colorIndex}, ${colors[colorIndex]});
    }`;
        } else {
          dynamicStyles.textContent += `
    .column-${index} {
        color: white;
    }`;
        }
      });
    }
  }

  tableContainer.appendChild(table);
  block.appendChild(tableContainer);
}
