// This utility flattens a nested JSON structure, specifically one where arrays contain objects that contain more arrays.
// It effectively performs a "join" across the nested structures to create a flat list of objects.

function flattenData(data) {
  if (!Array.isArray(data)) {
    return [];
  }

  let flattenedRows = [];

  // Helper function to recursively process objects and arrays
  function processEntry(entry, currentRow) {
    let nextRow = { ...currentRow };
    let arrayChildren = [];

    // Separate primitive key-values from array children
    for (const key in entry) {
      if (Array.isArray(entry[key])) {
        arrayChildren.push(...entry[key]);
      } else if (typeof entry[key] !== 'object' || entry[key] === null) {
        nextRow[key] = entry[key];
      } else if (typeof entry[key] === 'object') {
          // If it's an object but not an array, merge its properties
          Object.assign(nextRow, entry[key]);
      }
    }

    if (arrayChildren.length === 0) {
      // This is a leaf node in the hierarchy, add the complete row
      flattenedRows.push(nextRow);
    } else {
      // Continue recursion for each child in the arrays
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
