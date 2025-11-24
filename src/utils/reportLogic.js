import { getDataType } from "./getDataType";
import fixColumnNames from "./fixColumnNames";
import getMaxCharWidth from "./getMaxCharWidth";

/**
 * Handles the side-effects of updating a 'data' item.
 * It generates a title and a table if they don't exist,
 * and cleans up related items if the JSON data is removed or invalid.
 * @param {object} updatedItem - The 'data' item that was just updated.
 * @param {Array} allItems - The entire list of report items.
 * @returns {Array} The new, transformed list of report items.
 */
export const handleDataUpdateSideEffects = (updatedItem, allItems) => {
  const isValueEmpty = updatedItem.value.trim() === "";
  let parsedData;

  try {
    if (!isValueEmpty) {
      parsedData = JSON.parse(updatedItem.value);
    }
  } catch (e) {
    console.error("JSON parse error:", e.message);
  }

  // If JSON is empty or invalid, remove related auto-generated items
  if (isValueEmpty || !parsedData) {
    const itemsToKeep = allItems.filter(
      (item) => item.dataSourceId !== updatedItem.id
    );
    // Find the original data item to ensure it's not removed
    const currentDataItem = allItems.find((item) => item.id === updatedItem.id);
    return [
      ...itemsToKeep.filter((item) => item.id !== updatedItem.id),
      currentDataItem,
    ];
  }

  // --- If JSON is valid, proceed with creating/updating other items ---

  let itemsToAdd = [];
  let itemsToUpdate = {};

  // 1. Create Title if it doesn't exist
  const titleExists = allItems.some((item) => item.type === "title");
  if (!titleExists) {
    itemsToAdd.push({
      id: Date.now() + 1,
      type: "title",
      value: "RAPOR_ADI",
      dataSourceId: updatedItem.id,
    });
  }

  // 2. Create or Update Table
  const existingTable = allItems.find((item) => item.type === "table");
  const firstRow = Array.isArray(parsedData) && parsedData.length > 0 ? parsedData[0] : {};
  const jsonKeys = Object.keys(firstRow);
  const columnsToMap = jsonKeys.filter((key) => !["TarihAralik"].includes(key));

  const newColumns = columnsToMap.map((key, index) => {
    const fixedName = fixColumnNames(key);
    return {
      id: Date.now() + index + 2,
      name: fixedName,
      mappedField: key,
      dataType: getDataType(firstRow[key]),
      width: getMaxCharWidth(parsedData, key, fixedName),
    };
  });

  if (!existingTable) {
    itemsToAdd.push({
      id: Date.now() + 2,
      type: "table",
      columns: newColumns,
      dataSourceId: updatedItem.id,
      groups: [],
    });
  } else if (existingTable.columns.length === 0) {
    itemsToUpdate[existingTable.id] = {
      ...existingTable,
      columns: newColumns,
      dataSourceId: updatedItem.id,
      groups: existingTable.groups || [],
    };
  }

  // 3. Update the data item itself with discovered keys
  itemsToUpdate[updatedItem.id] = {
    ...updatedItem,
    jsonKeys: jsonKeys,
    filteredJsonKeys: columnsToMap,
  };

  // 4. Combine all changes into the final list of items
  const finalReportItems = allItems
    .map((item) => (itemsToUpdate[item.id] ? { ...item, ...itemsToUpdate[item.id] } : item))
    .concat(itemsToAdd);

  return finalReportItems;
};
