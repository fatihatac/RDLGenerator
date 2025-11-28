import parseAndExtractJsonInfo from "./parseAndExtractJsonInfo.js";
import getMaxCharWidth from "./getMaxCharWidth.js";
import * as Layout from "../constants/layoutConstants.js";
import generateId from './generateId.js'

function getDataAndTableItems(items) {
  const dataItem = items.find(item => item.type === "data");
  const tableItem = items.find(item => item.type === "table");
  return { dataItem, tableItem };
}

function getRowCount(dataItem) {
  if (!dataItem || !dataItem.value) return 0;
  
  const { parsedData, error } = parseAndExtractJsonInfo(dataItem.value);
  
  if (error) {
    console.error("Error parsing dataItem.value in rdlGenerator:", error);
    return 0;
  }

  if (parsedData?.Result && Array.isArray(parsedData.Result)) {
    return parsedData.Result.length;
  }
  
  return 0;
}

function getNumberColumnWidth(rowCount) {
  return getMaxCharWidth(null, null, String(rowCount));
}

function getMaxColumns(items) {
  return items.reduce((max, item) => {
    if (item.type === "table" && item.columns) {
      return Math.max(max, item.columns.length);
    }
    return max;
  }, 0);
}

function getTotalTableWidth(tableItem) {
  if (!tableItem?.columns?.length) return 468;

  const columnsWidth = tableItem.columns.reduce(
    (sum, col) => sum + (Number(col.width) || 72),
    0
  );

  const groupsWidth = tableItem.groups?.length ? tableItem.groups.length * 72 : 0;
  return columnsWidth + groupsWidth;
}

function calculateReportValues(items) {
  const { dataItem, tableItem } = getDataAndTableItems(items);
  const rowCount = getRowCount(dataItem);
  const NUMBER_COLUMN_WIDTH = getNumberColumnWidth(rowCount);

  if (tableItem) {
    tableItem.columns = tableItem.columns.map(col =>
      col.mappedField === "RowNumber" ? { ...col, width: NUMBER_COLUMN_WIDTH } : col
    );
  }

  const maxColumns = getMaxColumns(items);
  const TOTAL_REPORT_WIDTH = getTotalTableWidth(tableItem);
  const TOTAL_REPORT_HEIGHT = items.length > 0 ? Layout.PAGE_HEIGHT : 225;

  // const dataSetName = `DataSet_${dataItem ? dataItem.id : "1"}`;
  const dataSetName = generateId("dataset");

  return {
    dataItem,
    tableItem,
    rowCount,
    maxColumns,
    TOTAL_REPORT_WIDTH,
    TOTAL_REPORT_HEIGHT,
    dataSetName
  };
}

export {
  getDataAndTableItems,
  getRowCount,
  getNumberColumnWidth,
  getMaxColumns,
  getTotalTableWidth,
  calculateReportValues
};
