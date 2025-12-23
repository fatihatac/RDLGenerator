import { buildTitle } from "./buildTitle.js";
import { buildTable } from "./buildTable.js";
import buildDateRange from "./buildDateRange.js";
import buildChart from "./buildChart.js";

function buildReportItems(items, totalWidth, totalHeight, dataSetMap) {
  return items.map(item => {
    switch (item.type) {
       case "title":
         return buildTitle(item, totalWidth);
       case "table":
         return buildTable(item, dataSetMap);
       case "dateRange":
         return buildDateRange(item, totalWidth);
        case "chart":
          return buildChart(item,totalHeight, dataSetMap);
      default:
        return null;
    }
  }).filter(Boolean);
}

export { buildReportItems };
