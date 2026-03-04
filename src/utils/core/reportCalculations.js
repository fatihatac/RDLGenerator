import { sumBy } from "lodash";
import parseAndExtractJsonInfo from "./parseAndExtractJsonInfo.js";
import getMaxCharWidth from "./getMaxCharWidth.js";
import * as Layout from "../../constants/layoutConstants.js";
import { ITEM_TYPES } from "../../constants/appConstants.js";
import generateId from "../helpers/generateId.js";

// ---------------------------------------------------------------------------
// FIX: keyBy(items, "type") aynı tipten birden fazla öğe olduğunda son
// öğeyi tutar, diğerlerini siler. Yerine find() kullanılıyor.
// ---------------------------------------------------------------------------
function getDataAndTableItems(items) {
  return {
    dataItem: items.find((i) => i.type === ITEM_TYPES.DATA),
    tableItem: items.find((i) => i.type === ITEM_TYPES.TABLE),
    chartItem: items.find((i) => i.type === ITEM_TYPES.CHART),
  };
}

function getRowCount(dataItem) {
  if (!dataItem?.value) return 0;

  const { parsedData, error } = parseAndExtractJsonInfo(dataItem.value);
  if (error) {
    console.error("Error parsing dataItem.value in reportCalculations:", error);
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
    if (item.type === ITEM_TYPES.TABLE && item.columns) {
      return Math.max(max, item.columns.length);
    }
    return max;
  }, 0);
}

function getTotalTableWidth(tableItem) {
  if (!tableItem?.columns?.length) return 468;

  const columnsWidth = sumBy(
    tableItem.columns,
    (col) => Number(col.width) || 72,
  );
  const groupsWidth = (tableItem.groups?.length || 0) * 72;
  return columnsWidth + groupsWidth;
}

function calculateReportValues(originalItems) {
  // Immer sayesinde artık cloneDeep gerekmiyor;
  // sadece okuma yaptığımız için spread ile sığ kopya yeterli
  const items = [...originalItems];
  const { dataItem, tableItem, chartItem } = getDataAndTableItems(items);
  const rowCount = getRowCount(dataItem);
  const NUMBER_COLUMN_WIDTH = getNumberColumnWidth(rowCount);

  // RowNumber sütununu genişlik için güncelle (orijinal diziye dokunma)
  const adjustedTableItem = tableItem
    ? {
        ...tableItem,
        columns: tableItem.columns.map((col) =>
          col.mappedField === "RowNumber"
            ? { ...col, width: NUMBER_COLUMN_WIDTH }
            : col,
        ),
      }
    : tableItem;

  const maxColumns = getMaxColumns(items);
  const tableWidth = getTotalTableWidth(adjustedTableItem);

  const TOTAL_REPORT_WIDTH = chartItem
    ? Math.max(tableWidth, Layout.CHART_WIDTH)
    : tableWidth;

  // FIX: Sihirli sayı → isimlendirilmiş sabit
  const TOTAL_REPORT_HEIGHT = Layout.DEFAULT_REPORT_HEIGHT;

  const dataSetName = generateId("dataset");

  return {
    dataItem,
    tableItem: adjustedTableItem,
    rowCount,
    maxColumns,
    TOTAL_REPORT_WIDTH,
    TOTAL_REPORT_HEIGHT,
    dataSetName,
  };
}

export {
  getDataAndTableItems,
  getRowCount,
  getNumberColumnWidth,
  getMaxColumns,
  getTotalTableWidth,
  calculateReportValues,
};
