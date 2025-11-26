import { buildTable } from "./buildTable.js";
import { buildTitle } from "./buildTitle.js";
import buildDateRange from "./buildDateRange.js";

function buildReportItems(items, context) {
  const result = {
    Textbox: [],
    Tablix: [],
  };

  for (const item of items) {
    switch (item.type) {
      case "title":
        result.Textbox.push(buildTitle(item, context).Textbox);
        break;

      case "table":
        result.Tablix.push(buildTable(item, context).Tablix);
        break;

      case "dateRange":
        result.Textbox.push(buildDateRange(item, context).Textbox);
        break;
    }
  }

  // Boş array olanları tamamen sil
  Object.keys(result).forEach((key) => {
    if (result[key].length === 0) {
      delete result[key];
    }
  });

  return result;
}

export { buildReportItems };
