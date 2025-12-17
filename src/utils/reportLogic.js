import { difference, keyBy, merge, values } from 'lodash';
import getDataType from "./getDataType";
import fixColumnNames from "./fixColumnNames";
import getMaxCharWidth from "./getMaxCharWidth";
import { EXCLUDED_KEYS } from "../constants/appConstants";
import generateId from "./generateId";
import parseAndExtractJsonInfo from "./parseAndExtractJsonInfo";

const cleanupStaleItems = (updatedItem, allItems) => {
  const itemsToKeep = allItems.filter(
    (item) => item.dataSourceId !== updatedItem.id && item.id !== updatedItem.id
  );
  return [...itemsToKeep, updatedItem];
};

const getOrCreateTitleItem = (allItems, updatedItem, itemsToAdd) => {
  const titleExists = allItems.some((item) => item.type === "title");
  if (!titleExists) {
    itemsToAdd.push({
      id: generateId("title"),
      type: "title",
      value: "RAPOR_ADI",
      dataSourceId: updatedItem.id,
    });
  }
};

const generateTableColumns = (parsedData, allKeys) => {
  const firstRow = Array.isArray(parsedData) && parsedData.length > 0 ? parsedData[0] : {};
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

const getOrCreateTableItem = (allItems, updatedItem, newColumns, itemsToAdd, itemsToUpdate) => {
  const existingTable = allItems.find((item) => item.type === "table");
  if (!existingTable) {
    itemsToAdd.push({
      id: generateId("table"),
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



export const handleDataUpdateSideEffects = (updatedItem, allItems) => {
  const { parsedData, allKeys, error } = parseAndExtractJsonInfo(updatedItem.value);

  if (error) {
    console.error("JSON parsing error in reportLogic:", error);
  }

  if (!parsedData) {
    return cleanupStaleItems(updatedItem, allItems);
  }

  let itemsToAdd = [];
  let itemsToUpdate = {};

  getOrCreateTitleItem(allItems, updatedItem, itemsToAdd);

  const newColumns = generateTableColumns(parsedData, allKeys);
  getOrCreateTableItem(allItems, updatedItem, newColumns, itemsToAdd, itemsToUpdate);

  itemsToUpdate[updatedItem.id] = {
    ...updatedItem,
    jsonKeys: allKeys,
    filteredJsonKeys: newColumns.map(col => col.mappedField),
  };

  const allItemsById = keyBy(allItems, 'id');
  const mergedItems = merge(allItemsById, itemsToUpdate);
  const finalReportItems = values(mergedItems).concat(itemsToAdd);

  return finalReportItems;
};

