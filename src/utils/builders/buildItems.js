import { buildTitle } from "../builders/buildTitle.js";
import { buildTable } from "../builders/buildTable.js";
import buildDateRange from "../builders/buildDateRange.js";
import buildChart from "../builders/buildChart.js";
import { ITEM_TYPES } from "../../constants/appConstants.js";

function buildReportItems(items, totalWidth, totalHeight, dataSetMap) {
  return items
    .map((item) => {
      switch (item.type) {
        case ITEM_TYPES.TITLE:
          return buildTitle(item, totalWidth);
        case ITEM_TYPES.TABLE:
          return buildTable(item, dataSetMap);
        case ITEM_TYPES.DATE_RANGE:
          return buildDateRange(item, totalWidth);
        case ITEM_TYPES.CHART: {
          const dataItem = items.find(
            (i) => i.id === item.dataSourceId && i.type === ITEM_TYPES.DATA,
          );
          return buildChart(item, totalHeight, dataSetMap, dataItem);
        }
        default:
          return null;
      }
    })
    .filter(Boolean);
}

export { buildReportItems };
