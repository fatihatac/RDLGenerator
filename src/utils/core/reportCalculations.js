import { sumBy } from 'lodash';
import parseAndExtractJsonInfo from './parseAndExtractJsonInfo.js';
import getMaxCharWidth from './getMaxCharWidth.js';
import { DEFAULT_LAYOUT_SETTINGS } from '../../store/useLayoutStore.js';
import { ITEM_TYPES } from '../../constants/appConstants.js';
import generateId from '../helpers/generateId.js';

// ---------------------------------------------------------------------------
// FIX: keyBy(items, "type") aynı tipten birden fazla öğe olduğunda son
// öğeyi tutar, diğerlerini siler. Yerine find() kullanılıyor.
// ---------------------------------------------------------------------------
function getDataAndTableItems(items) {
  return {
    dataItem:  items.find((i) => i.type === ITEM_TYPES.DATA),
    tableItem: items.find((i) => i.type === ITEM_TYPES.TABLE),
    chartItem: items.find((i) => i.type === ITEM_TYPES.CHART),
  };
}

function getRowCount(dataItem) {
  if (!dataItem?.value) return 0;

  const { parsedData, error } = parseAndExtractJsonInfo(dataItem.value);
  if (error) {
    console.error('Error parsing dataItem.value in reportCalculations:', error);
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

function getTotalTableWidth(tableItem, settings = DEFAULT_LAYOUT_SETTINGS) {
  if (!tableItem?.columns?.length) return 468;

  const columnsWidth = sumBy(
    tableItem.columns,
    (col) => Number(col.width) || settings.columnWidth,
  );
  const groupsWidth = (tableItem.groups?.length || 0) * settings.columnWidth;
  return columnsWidth + groupsWidth;
}

// ---------------------------------------------------------------------------
// Her item tipinin RDL'deki tahmini yüksekliği (pt)
// Top birikimli hesabında kullanılır.
// ---------------------------------------------------------------------------
export function getItemHeight(item, settings = DEFAULT_LAYOUT_SETTINGS) {
  switch (item.type) {
    case ITEM_TYPES.TITLE:
    case ITEM_TYPES.DATE_RANGE:
      return settings.titleHeight;

    case ITEM_TYPES.TABLE: {
      const baseRows  = 2; // header + data
      const sumRows   = item.sums?.length  ? 1 : 0;
      const groupRows = item.groups?.length || 0;
      return settings.columnHeight * (baseRows + sumRows + groupRows);
    }

    case ITEM_TYPES.CHART:
      return settings.chartHeight;

    default:
      return 0;
  }
}

// ---------------------------------------------------------------------------
// Tüm itemlar için birikimli Top + Left değerlerini hesaplar.
// Kural:
//   _top  = item.topOverride  ?? birikimli hesap
//   _left = item.leftOverride ?? settings.defaultLeft
//
// Her item objesine `_top` ve `_left` alanları eklenerek yeni dizi döner.
// Birikimli Top hesabı override olan itemları atlamaz ama cursor'ı yine
// o itemın yüksekliği kadar ilerletir (layout bütünlüğü için).
// ---------------------------------------------------------------------------
export function computePositions(items, settings = DEFAULT_LAYOUT_SETTINGS) {
  let cursor = 0;
  return items.map((item) => {
    const height = getItemHeight(item, settings);

    // topOverride varsa onu kullan, yoksa birikimli cursoru
    const _top = item.topOverride != null ? item.topOverride : cursor;

    // _left: override varsa onu, yoksa global default
    const _left = item.leftOverride != null ? item.leftOverride : (settings.defaultLeft ?? 0);

    // Cursor her zaman ilerler (override olsa bile sonraki item'ın auto-top'u
    // bu item'ın geometrisini bilmeli)
    if (height > 0) cursor += height + settings.itemSpacing;

    return { ...item, _top, _left };
  });
}

/** @deprecated computePositions kullanın */
export function computeTopPositions(items, settings = DEFAULT_LAYOUT_SETTINGS) {
  return computePositions(items, settings);
}

function calculateReportValues(originalItems, settings = DEFAULT_LAYOUT_SETTINGS) {
  const items = [...originalItems];
  const { dataItem, tableItem, chartItem } = getDataAndTableItems(items);
  const rowCount          = getRowCount(dataItem);
  const NUMBER_COLUMN_WIDTH = getNumberColumnWidth(rowCount);

  const adjustedTableItem = tableItem
    ? {
        ...tableItem,
        columns: tableItem.columns.map((col) =>
          col.mappedField === 'RowNumber'
            ? { ...col, width: NUMBER_COLUMN_WIDTH }
            : col,
        ),
      }
    : tableItem;

  const maxColumns  = getMaxColumns(items);
  const tableWidth  = getTotalTableWidth(adjustedTableItem, settings);

  const TOTAL_REPORT_WIDTH = chartItem
    ? Math.max(tableWidth, settings.chartWidth)
    : tableWidth;

  // Dinamik yükseklik: tüm itemların tahmini yüksekliklerinin toplamı
  const TOTAL_REPORT_HEIGHT = items.reduce((sum, item) => {
    const h = getItemHeight(item, settings);
    return h > 0 ? sum + h + settings.itemSpacing : sum;
  }, 0);

  const dataSetName = generateId('dataset');

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
