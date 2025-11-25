import { getDataType } from "./getDataType";
import fixColumnNames from "./fixColumnNames";
import getMaxCharWidth from "./getMaxCharWidth";
import { EXCLUDED_KEYS } from "../constants/appConstants"; // Import EXCLUDED_KEYS
import generateId from "./generateId"; // Import generateId
import parseAndExtractJsonInfo from "./parseAndExtractJsonInfo"; // Import the new utility

// Helper function to cleanup stale items
const cleanupStaleItems = (updatedItem, allItems) => {
  const itemsToKeep = allItems.filter(
    (item) => item.dataSourceId !== updatedItem.id && item.id !== updatedItem.id
  );
  return [...itemsToKeep, updatedItem];
};

// Helper function to get or create title item
const getOrCreateTitleItem = (allItems, updatedItem, itemsToAdd) => {
  const titleExists = allItems.some((item) => item.type === "title");
  if (!titleExists) {
    itemsToAdd.push({
      id: generateId(), // Use generateId()
      type: "title",
      value: "RAPOR_ADI",
      dataSourceId: updatedItem.id,
    });
  }
};

// Helper function to generate table columns
const generateTableColumns = (parsedData, allKeys) => { // Changed jsonKeys to allKeys
  const firstRow = Array.isArray(parsedData) && parsedData.length > 0 ? parsedData[0] : {};
  const columnsToMap = allKeys.filter((key) => !EXCLUDED_KEYS.includes(key)); // Use EXCLUDED_KEYS

  return columnsToMap.map((key, index) => {
    const fixedName = fixColumnNames(key);
    return {
      id: generateId(), 
      name: fixedName,
      mappedField: key,
      dataType: getDataType(firstRow[key]),
      width: getMaxCharWidth(parsedData, key, fixedName),
    };
  });
};

const getOrCreateTableItem = (allItems, updatedItem, newColumns, itemsToAdd, itemsToUpdate) => {
  const existingTable = allItems.find((item) => item.type === "table");
  if (!existingTable) {
    itemsToAdd.push({
      id: generateId(), 
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
};


/**
 * Handles the side-effects of updating a 'data' item.
 * It generates a title and a table if they don't exist,
 * and cleans up related items if the JSON data is removed or invalid.
 * @param {object} updatedItem - The 'data' item that was just updated.
 * @param {Array} allItems - The entire list of report items.
 * @returns {Array} The new, transformed list of report items.
 */
export const handleDataUpdateSideEffects = (updatedItem, allItems) => {
  const { parsedData, allKeys, filteredKeys, error } = parseAndExtractJsonInfo(updatedItem.value);

  if (error) {
    console.error("JSON parsing error in reportLogic:", error);
    // Even if there's an error, we should proceed with cleanup if parsedData is null
  }

  // If JSON is empty or invalid, remove related auto-generated items
  if (!parsedData) {
    return cleanupStaleItems(updatedItem, allItems);
  }

  // --- If JSON is valid, proceed with creating/updating other items ---
  let itemsToAdd = [];
  let itemsToUpdate = {};

  getOrCreateTitleItem(allItems, updatedItem, itemsToAdd);

  const newColumns = generateTableColumns(parsedData, allKeys); // Pass allKeys
  getOrCreateTableItem(allItems, updatedItem, newColumns, itemsToAdd, itemsToUpdate);

  // Update the data item itself with discovered keys
  itemsToUpdate[updatedItem.id] = {
    ...updatedItem,
    jsonKeys: allKeys, // Use allKeys from the utility
    filteredJsonKeys: newColumns.map(col => col.mappedField), // Use mappedField from generated columns
  };

  // Combine all changes into the final list of items
  const finalReportItems = allItems
    .map((item) => (itemsToUpdate[item.id] ? { ...item, ...itemsToUpdate[item.id] } : item))
    .concat(itemsToAdd);

  return finalReportItems;
};

