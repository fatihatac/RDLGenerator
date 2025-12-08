function flattenData(data) {
  if (!Array.isArray(data)) {
    return [];
  }

  let flattenedRows = [];

  function processEntry(entry, currentRow) {
    let nextRow = { ...currentRow };
    let arrayChildren = [];

    for (const key in entry) {
      if (Array.isArray(entry[key])) {
        arrayChildren.push(...entry[key]);
      } else if (typeof entry[key] !== 'object' || entry[key] === null) {
        nextRow[key] = entry[key];
      } else if (typeof entry[key] === 'object') {
          Object.assign(nextRow, entry[key]);
      }
    }

    if (arrayChildren.length === 0) {
      flattenedRows.push(nextRow);
    } else {
      arrayChildren.forEach(child => {
        processEntry(child, nextRow);
      });
    }
  }

  data.forEach(item => {
    processEntry(item, {});
  });

  return flattenedRows;
}

export { flattenData };
