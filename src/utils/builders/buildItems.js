import { buildTitle } from "../builders/buildTitle.js";
import { buildTable } from "../builders/buildTable.js";
import buildDateRange from "../builders/buildDateRange.js";
import buildChart from "../builders/buildChart.js";
import { ITEM_TYPES } from "../../constants/appConstants.js";

// ---------------------------------------------------------------------------
// FIX: switch-case → BUILDER_MAP (EDITOR_MAP ve ITEM_FACTORIES ile tutarlı)
// Yeni tip eklemek için sadece bu nesneye bir satır eklenmesi yeterli.
// ---------------------------------------------------------------------------
const BUILDER_MAP = {
  [ITEM_TYPES.TITLE]: (item, totalWidth) => buildTitle(item, totalWidth),

  [ITEM_TYPES.TABLE]: (item, _totalWidth, _totalHeight, dataSetMap) =>
    buildTable(item, dataSetMap),

  [ITEM_TYPES.DATE_RANGE]: (item, totalWidth) =>
    buildDateRange(item, totalWidth),

  [ITEM_TYPES.CHART]: (item, totalWidth, totalHeight, dataSetMap, allItems) => {
    const dataItem = allItems.find(
      (i) => i.id === item.dataSourceId && i.type === ITEM_TYPES.DATA,
    );
    return buildChart(item, totalHeight, dataSetMap, dataItem);
  },
};

function buildReportItems(items, totalWidth, totalHeight, dataSetMap) {
  return items
    .map((item) => {
      const builder = BUILDER_MAP[item.type];
      if (!builder) return null;
      return builder(item, totalWidth, totalHeight, dataSetMap, items);
    })
    .filter(Boolean);
}

export { buildReportItems };
