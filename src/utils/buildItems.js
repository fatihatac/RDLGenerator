import { buildTitle } from "./buildTitle.js";
import { buildTable } from "./buildTable.js";
import buildDateRange from "./buildDateRange.js";

function buildReportItems(items, totalWidth, dataSetName) {
  return items.map(item => {
    switch (item.type) {
       case "title":
         return buildTitle(item, totalWidth);

       case "table":
         return buildTable(item, dataSetName);

       case "dateRange":
         return buildDateRange(item, totalWidth);

      default:
        return null;
    }
  }).filter(Boolean);
}

export { buildReportItems };
