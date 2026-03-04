import { difference, keyBy } from "lodash";
import getDataType from "../helpers/getDataType";
import fixColumnNames from "../helpers/fixColumnNames";
import getMaxCharWidth from "./getMaxCharWidth";
import { EXCLUDED_KEYS, ITEM_TYPES } from "../../constants/appConstants";
import generateId from "../helpers/generateId";
import parseAndExtractJsonInfo from "./parseAndExtractJsonInfo";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const cleanupStaleItems = (updatedItem, allItems) => {
  const itemsToKeep = allItems.filter(
    (item) =>
      item.dataSourceId !== updatedItem.id && item.id !== updatedItem.id,
  );
  return [...itemsToKeep, updatedItem];
};

const getOrCreateTitleItem = (allItems, updatedItem, itemsToAdd) => {
  const titleExists = allItems.some((item) => item.type === ITEM_TYPES.TITLE);
  if (!titleExists) {
    itemsToAdd.push({
      id: generateId("title"),
      type: ITEM_TYPES.TITLE,
      value: "RAPOR_ADI",
      dataSourceId: updatedItem.id,
    });
  }
};

const generateTableColumns = (parsedData, allKeys) => {
  const firstRow =
    Array.isArray(parsedData) && parsedData.length > 0 ? parsedData[0] : {};
  const columnsToMap = difference(allKeys, EXCLUDED_KEYS);

  return columnsToMap.map((key) => {
    const fixedName = fixColumnNames(key);
    return {
      id: generateId("column"),
      name: fixedName,
      mappedField: key,
      dataType: getDataType(firstRow[key]),
      width: getMaxCharWidth(parsedData, key, fixedName),
    };
  });
};

const getOrCreateTableItem = (
  allItems,
  updatedItem,
  newColumns,
  itemsToAdd,
  itemsToUpdate,
) => {
  const existingTable = allItems.find((item) => item.type === ITEM_TYPES.TABLE);

  if (!existingTable) {
    itemsToAdd.push({
      id: generateId("table"),
      type: ITEM_TYPES.TABLE,
      columns: newColumns,
      dataSourceId: updatedItem.id,
      groups: [],
      sums: [],
    });
  } else if (existingTable.columns.length === 0) {
    itemsToUpdate[existingTable.id] = {
      ...existingTable,
      columns: newColumns,
      dataSourceId: updatedItem.id,
      groups: existingTable.groups || [],
      sums: existingTable.sums || [],
    };
  }
};

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export const handleDataUpdateSideEffects = (updatedItem, allItems) => {
  const { parsedData, allKeys, error } = parseAndExtractJsonInfo(
    updatedItem.value,
  );

  if (error) {
    console.error("JSON parsing error in reportLogic:", error);
  }

  if (!parsedData) {
    return cleanupStaleItems(updatedItem, allItems);
  }

  const itemsToAdd = [];
  const itemsToUpdate = {};

  getOrCreateTitleItem(allItems, updatedItem, itemsToAdd);

  const newColumns = generateTableColumns(parsedData, allKeys);
  getOrCreateTableItem(
    allItems,
    updatedItem,
    newColumns,
    itemsToAdd,
    itemsToUpdate,
  );

  itemsToUpdate[updatedItem.id] = {
    ...updatedItem,
    jsonKeys: allKeys,
    filteredJsonKeys: newColumns.map((col) => col.mappedField),
  };

  const allItemsById = keyBy(allItems, "id");
  const mergedById = { ...allItemsById };

  Object.entries(itemsToUpdate).forEach(([id, updatedFields]) => {
    mergedById[id] = { ...(mergedById[id] ?? {}), ...updatedFields };
  });

  return Object.values(mergedById).concat(itemsToAdd);
};
