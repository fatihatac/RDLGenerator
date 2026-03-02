import { buildTitle } from "../builders/buildTitle.js";
import { buildTable } from "../builders/buildTable.js";
import buildDateRange from "../builders/buildDateRange.js";
import buildChart from "../builders/buildChart.js";

function buildReportItems(items, totalWidth, totalHeight, dataSetMap) {
  return items
    .map((item) => {
      switch (item.type) {
        case "title":
          return buildTitle(item, totalWidth);
        case "table":
          return buildTable(item, dataSetMap);
        case "dateRange":
          return buildDateRange(item, totalWidth);
        case "chart":
          return buildChart(item, totalHeight, dataSetMap);
        default:
          return null;
      }
    })
    .filter(Boolean);
}

export { buildReportItems };
