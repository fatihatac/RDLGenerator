import { buildTitle }    from './buildTitle.js';
import { buildTable }    from './buildTable.js';
import buildDateRange    from './buildDateRange.js';
import buildChart        from './buildChart.js';
import { ITEM_TYPES }   from '../../constants/appConstants.js';
import { DEFAULT_LAYOUT_SETTINGS } from '../../store/useLayoutStore.js';

// ---------------------------------------------------------------------------
// BUILDER_MAP — yeni tip eklemek için tek satır yeterli
// Her builder imzası: (item, totalWidth, totalHeight, dataSetMap, allItems, settings)
// item._top: rdlGenerator tarafından önceden hesaplanmış Top değeri (pt)
// ---------------------------------------------------------------------------
const BUILDER_MAP = {
  [ITEM_TYPES.TITLE]: (item, totalWidth, _th, _dsm, _all, settings) =>
    buildTitle(item, totalWidth, settings),

  [ITEM_TYPES.TABLE]: (item, _tw, _th, dataSetMap, _all, settings) =>
    buildTable(item, dataSetMap, settings),

  [ITEM_TYPES.DATE_RANGE]: (item, totalWidth, _th, _dsm, _all, settings) =>
    buildDateRange(item, totalWidth, settings),

  [ITEM_TYPES.CHART]: (item, totalWidth, totalHeight, dataSetMap, allItems, settings) => {
    const dataItem = allItems.find(
      (i) => i.id === item.dataSourceId && i.type === ITEM_TYPES.DATA,
    );
    return buildChart(item, totalHeight, dataSetMap, dataItem, settings);
  },
};

function buildReportItems(items, totalWidth, totalHeight, dataSetMap, settings = DEFAULT_LAYOUT_SETTINGS) {
  return items
    .map((item) => {
      const builder = BUILDER_MAP[item.type];
      if (!builder) return null;
      return builder(item, totalWidth, totalHeight, dataSetMap, items, settings);
    })
    .filter(Boolean);
}

export { buildReportItems };
