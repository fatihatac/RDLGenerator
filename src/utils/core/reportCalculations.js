import { sumBy } from 'lodash';
import parseAndExtractJsonInfo from './parseAndExtractJsonInfo.js';
import getMaxCharWidth from './getMaxCharWidth.js';
import { DEFAULT_LAYOUT_SETTINGS } from '../../store/useLayoutStore.js';
import { ITEM_TYPES } from '../../constants/appConstants.js';
import { pxToPt } from './units.js';
import generateId from '../helpers/generateId.js';

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
      // YENİ: Sadece görünür sütunların sayısını alıyoruz
      const visibleColumns = item.columns.filter((col) => col.isVisible !== false);
      return Math.max(max, visibleColumns.length);
    }
    return max;
  }, 0);
}

function getTotalTableWidth(tableItem, settings = DEFAULT_LAYOUT_SETTINGS) {
  if (!tableItem?.columns?.length) return 468;

  // YENİ: Sadece görünür sütunları filtreliyoruz
  const visibleColumns = tableItem.columns.filter((col) => col.isVisible !== false);

  const columnsWidth = sumBy(
    visibleColumns, // YENİ: tableItem.columns yerine visibleColumns kullanıyoruz
    (col) => Number(col.width) || settings.columnWidth,
  );
  const groupsWidth = (tableItem.groups?.length || 0) * settings.columnWidth;
  return columnsWidth + groupsWidth;
}

// ---------------------------------------------------------------------------
// Her item tipinin RDL'deki tahmini yüksekliği (pt)
// Top birikimli hesabında kullanılır.
// ---------------------------------------------------------------------------
// Boyutu kullanıcının girebildiği bileşenler (tablo/matrix boyutu sütunlardan gelir).
const SIZABLE_TYPES = new Set([
  ITEM_TYPES.TITLE, ITEM_TYPES.DATE_RANGE, ITEM_TYPES.CHART,
  ITEM_TYPES.TEXTBOX, ITEM_TYPES.RECTANGLE,
]);

function getItemHeight(item, settings = DEFAULT_LAYOUT_SETTINGS) {
  if (SIZABLE_TYPES.has(item.type) && item.heightPx != null) return pxToPt(item.heightPx);

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

    case ITEM_TYPES.TEXTBOX:
      return item.isLegend ? (settings.legendHeight ?? 43.5) : (item.height ?? 20);

    case ITEM_TYPES.RECTANGLE:
      return item.height ?? 100;

    default:
      return 0;
  }
}

// ---------------------------------------------------------------------------
// Tüm itemlar için Left / Top (pt) hesaplar. Ölçüler içerik alanına (marjinlerin
// içi) göredir.
//
// Item'daki kullanıcı değerleri px'tir: leftPx, rightPx, topPx, bottomPx.
// (Eski kayıtlardaki leftOverride / topOverride pt değerleri de okunur.)
//   Yatay: leftPx  → _left = leftPx
//          rightPx → _left = içerikGenişliği − itemGenişliği − rightPx
//          ikisi de boşsa settings.defaultLeft (sol öncelikli)
//   Dikey: topPx   → _top = topPx
//          bottomPx→ _top = içerikYüksekliği − itemYüksekliği − bottomPx
//          ikisi de boşsa birikimli Top
//
// Birikimli Top hesabında override olan itemlar atlanmaz; cursor yine o itemın
// yüksekliği kadar ilerler (layout bütünlüğü için).
// ---------------------------------------------------------------------------
const FLEXIBLE_WIDTH_TYPES = new Set([ITEM_TYPES.TITLE, ITEM_TYPES.DATE_RANGE]);

function resolveAxis({ near, far, legacyNearPt, size, contentSize, fallback }) {
  if (near != null) return pxToPt(near);
  if (legacyNearPt != null) return legacyNearPt;
  if (far != null) return Math.round((contentSize - size - pxToPt(far)) * 100) / 100;
  return fallback;
}

function computePositions(items, settings = DEFAULT_LAYOUT_SETTINGS, contentWidth, contentHeight) {
  const bodyWidth =
    contentWidth ?? settings.pageWidth - settings.marginLeft - settings.marginRight;
  const bodyHeight =
    contentHeight ?? settings.pageHeight - settings.marginTop - settings.marginBottom;
  // relativeTo === 'page' olan bileşenler marjini yok sayar: uzaklıklar kağıt kenarından ölçülür.
  const pageWidth = bodyWidth + settings.marginLeft + settings.marginRight;
  const pageHeight = bodyHeight + settings.marginTop + settings.marginBottom;
  let cursor = 0;

  return items.map((item) => {
    const page = item.relativeTo === 'page';
    const boxW = page ? pageWidth : bodyWidth;
    const boxH = page ? pageHeight : bodyHeight;
    const offL = page ? settings.marginLeft : 0; // otomatik değerlerde marjini koru
    const offT = page ? settings.marginTop : 0;

    const height = getItemHeight(item, settings);
    const width = getItemWidth(item, boxW, settings);

    const _top = resolveAxis({
      near: item.topPx, far: item.bottomPx, legacyNearPt: item.topOverride,
      size: height, contentSize: boxH, fallback: cursor + offT,
    });

    let _left;
    let _width = width;
    // Başlık / tarih gibi esnek genişlikli öğelerde, genişlik girilmediyse
    // Sol ve Sağ uzaklık genişliği daraltır.
    if (FLEXIBLE_WIDTH_TYPES.has(item.type) && item.widthPx == null) {
      _left = resolveAxis({
        near: item.leftPx, far: null, legacyNearPt: item.leftOverride,
        size: 0, contentSize: 0, fallback: (settings.defaultLeft ?? 0) + offL,
      });
      const r = item.rightPx != null ? pxToPt(item.rightPx) : 0;
      _width = Math.max(0, boxW - _left - r);
    } else {
      _left = resolveAxis({
        near: item.leftPx, far: item.rightPx, legacyNearPt: item.leftOverride,
        size: width, contentSize: boxW, fallback: (settings.defaultLeft ?? 0) + offL,
      });
    }

    if (height > 0) cursor += height + settings.itemSpacing;

    return { ...item, _top, _left, _width, _height: height, _rel: page ? 'page' : 'margin' };
  });
}

// ---------------------------------------------------------------------------
// Bir itemın RDL'deki tahmini genişliği (pt).
// Başlık / tarih / metin gibi öğeler body genişliğini (contentWidth) kullanır.
// ---------------------------------------------------------------------------
function getItemWidth(item, contentWidth, settings = DEFAULT_LAYOUT_SETTINGS) {
  if (SIZABLE_TYPES.has(item.type) && item.widthPx != null) return pxToPt(item.widthPx);

  switch (item.type) {
    case ITEM_TYPES.TABLE:
      return getTotalTableWidth(item, settings);

    case ITEM_TYPES.MATRIX:
      return sumBy(item.staticColumns || [], (c) => Number(c.width) || settings.columnWidth);

    case ITEM_TYPES.CHART:
      return settings.chartWidth;

    case ITEM_TYPES.TEXTBOX:
      return item.width ?? (item.isLegend ? contentWidth : 100);

    case ITEM_TYPES.RECTANGLE:
      return item.width ?? 100;

    default:
      return contentWidth;
  }
}

// ---------------------------------------------------------------------------
// Hızlı hizalama: 'left' | 'center' | 'right' → Left değeri (pt)
// Sonuç 0'ın altına düşmez (item içerikten genişse 0).
// ---------------------------------------------------------------------------
function computeAlignedLeft(item, mode, contentWidth, settings = DEFAULT_LAYOUT_SETTINGS) {
  const boxW = item.relativeTo === 'page'
    ? contentWidth + settings.marginLeft + settings.marginRight
    : contentWidth;
  const free = Math.max(0, boxW - getItemWidth(item, boxW, settings));
  if (mode === 'center') return Math.round((free / 2) * 100) / 100;
  if (mode === 'right') return Math.round(free * 100) / 100;
  return 0;
}

// ---------------------------------------------------------------------------
// Konumlanmış itemların dikdörtgenlerini kıyaslar, kesişenleri döner.
// Dönen: { [itemId]: [kesiştiği itemId, ...] }
// ---------------------------------------------------------------------------
function detectOverlaps(positionedItems) {
  const rects = positionedItems
    .filter((i) => i._height > 0 && i._width > 0)
    .map((i) => ({
      id: i.id,
      l: i._left, t: i._top,
      r: i._left + i._width, b: i._top + i._height,
    }));

  const result = {};
  for (let a = 0; a < rects.length; a++) {
    for (let b = a + 1; b < rects.length; b++) {
      const A = rects[a];
      const B = rects[b];
      const intersects = A.l < B.r && B.l < A.r && A.t < B.b && B.t < A.b;
      if (!intersects) continue;
      (result[A.id] ||= []).push(B.id);
      (result[B.id] ||= []).push(A.id);
    }
  }
  return result;
}

// ---------------------------------------------------------------------------
// RDL'de kenar boşluğunu gövdenin içine taşır.
// Tasarım ekranları (Bold Reports / Report Builder) sayfa margin'ini çizmez ve
// gövdeyi 0,0'dan başlatır. Bu yüzden body bileşenlerinin Left/Top değerine
// marginLeft/marginTop eklenir; RDL'deki sayfa margin'i ise 0 yazılır ki
// çalıştırılan çıktıda boşluk iki kat olmasın.
// Header/footer öğelerine dokunulmaz (kendi alanları vardır).
// ---------------------------------------------------------------------------
function applyPageMargins(positionedItems, settings = DEFAULT_LAYOUT_SETTINGS) {
  return positionedItems.map((item) =>
    (!item.section || item.section === 'body') && item._rel !== 'page'
      ? { ...item, _left: item._left + settings.marginLeft, _top: item._top + settings.marginTop }
      : item,
  );
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
  FLEXIBLE_WIDTH_TYPES,
  SIZABLE_TYPES,
  computePositions,
  getItemHeight,
  getItemWidth,
  computeAlignedLeft,
  applyPageMargins,
  detectOverlaps,
  calculateReportValues,
};
