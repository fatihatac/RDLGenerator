import { COLUMN_WIDTH, PAGE_HEIGHT } from '../constants/layout';

export function calculateReportDimensions(items) {
  let maxColumns = 0;

  items.forEach((item) => {
    if (
      item.type === "table" &&
      item.columns &&
      item.columns.length > maxColumns
    ) {
      maxColumns = item.columns.length;
    }
  });

  const TOTAL_REPORT_WIDTH = maxColumns > 0 ? maxColumns * COLUMN_WIDTH : 504;
  const TOTAL_REPORT_HIGHT = items && items.length > 0 ? PAGE_HEIGHT : 225;

  return { TOTAL_REPORT_WIDTH, TOTAL_REPORT_HIGHT };
}