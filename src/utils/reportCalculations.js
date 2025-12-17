import { cloneDeep, keyBy, sumBy } from 'lodash';
import parseAndExtractJsonInfo from "./parseAndExtractJsonInfo.js";
import getMaxCharWidth from "./getMaxCharWidth.js";
import * as Layout from "../constants/layoutConstants.js";
import generateId from './generateId.js'

function getDataAndTableItems(items) {
  const itemsByType = keyBy(items, 'type');
  return {
    dataItem: itemsByType.data,
    tableItem: itemsByType.table,
    chartItem: itemsByType.chart
  };
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

  const columnsWidth = sumBy(tableItem.columns, col => Number(col.width) || 72);
  const groupsWidth = (tableItem.groups?.length || 0) * 72;
  
  return columnsWidth + groupsWidth;
}

function calculateReportValues(originalItems) {
  const items = cloneDeep(originalItems);
  const { dataItem, tableItem, chartItem } = getDataAndTableItems(items);
  const rowCount = getRowCount(dataItem);
  const NUMBER_COLUMN_WIDTH = getNumberColumnWidth(rowCount);

  if (tableItem) {
    tableItem.columns = tableItem.columns.map(col =>
      col.mappedField === "RowNumber" ? { ...col, width: NUMBER_COLUMN_WIDTH } : col
    );
  }

  const maxColumns = getMaxColumns(items);
  const TOTAL_REPORT_WIDTH = (chartItem) 
  ? Math.max(getTotalTableWidth(tableItem), Layout.CHART_WIDTH)
  : getTotalTableWidth(tableItem);
  
  const chartHeight = chartItem ? Layout.CHART_HEIGHT : 0;
  console.log(chartHeight);
  

  const TOTAL_REPORT_HEIGHT = items.length > 0 ? (Layout.PAGE_HEIGHT + chartHeight) : 225;


  console.log(TOTAL_REPORT_HEIGHT);
  
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
