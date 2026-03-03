import { cloneDeep, remove } from "lodash";
import { generateId } from "../../utils";
import { ITEM_TYPES } from "../../constants/appConstants";

const ITEM_FACTORIES = {
  [ITEM_TYPES.TITLE]: () => ({
    id: generateId("title"),
    type: ITEM_TYPES.TITLE,
    value: "",
  }),
  [ITEM_TYPES.TABLE]: () => ({
    id: generateId("table"),
    type: ITEM_TYPES.TABLE,
    columns: [],
    groups: [],
    sums: [],
  }),
  [ITEM_TYPES.DATA]: () => ({
    id: generateId("datasource"),
    type: ITEM_TYPES.DATA,
    value: "",
    jsonKeys: [],
  }),
  [ITEM_TYPES.DATE_RANGE]: () => ({
    id: generateId("dateRange"),
    type: ITEM_TYPES.DATE_RANGE,
    mappedField: null,
  }),
  [ITEM_TYPES.CHART]: () => ({
    id: generateId("chart"),
    type: ITEM_TYPES.CHART,
    chartType: "bar",
    dataSourceId: null,
    xAxis: null,
    yAxis: null,
  }),
};

export const createReportSlice = (set, get) => ({
  reportItems: [],

  addItem: (type) => {
    const factory = ITEM_FACTORIES[type];
    if (!factory) {
      console.warn(
        `Bilinmeyen item tipi: "${type}". ITEM_TYPES sabitlerini kullanın.`,
      );
      return;
    }
    const newItem = factory();
    set((state) => ({ reportItems: [...state.reportItems, newItem] }));
  },

  deleteItem: (id) => {
    const { reportItems } = get();
    const itemToDelete = reportItems.find((item) => item.id === id);
    set((state) => {
      const newItems = cloneDeep(state.reportItems);
      remove(newItems, (item) => item.id === id);
      if (itemToDelete?.type === ITEM_TYPES.DATA) {
        remove(newItems, (item) => item.dataSourceId === id);
      }
      return { reportItems: newItems };
    });
  },

  updateItem: (id, updates) => {
    set((state) => ({
      reportItems: state.reportItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item,
      ),
    }));
  },

  setReportItems: (newItems) => {
    set({ reportItems: newItems });
  },
});
