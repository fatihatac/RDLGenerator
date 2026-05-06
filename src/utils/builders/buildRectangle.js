import { DEFAULT_LAYOUT_SETTINGS } from '../../store/useLayoutStore.js';

const buildRectangle = (item, totalWidth, totalHeight, dataSetMap, allItems, settings = DEFAULT_LAYOUT_SETTINGS, buildReportItems) => {
  return {
    Rectangle: {
      '@_Name': item.id,
      Left:     `${item.left ?? 0}pt`,
      Top:      `${item.top ?? 0}pt`,
      Height:   `${item.height ?? 100}pt`,
      Width:    `${item.width ?? 100}pt`,
      Style: {
        Border: { 
          Style: item.style?.borderStyle ?? 'None',
          Color: item.style?.borderColor ?? 'Transparent'
        },
      },
      ReportItems: item.children ? buildReportItems(item.children, item.width, item.height, dataSetMap, settings) : [],
    },
  };
};

export { buildRectangle };
