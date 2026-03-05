import { generateId } from "../../utils";
import { ITEM_TYPES } from "../../constants/appConstants";

// ---------------------------------------------------------------------------
// Item fabrikaları — her tip için başlangıç değerleri
// ---------------------------------------------------------------------------
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
    filteredJsonKeys: [],
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

// ---------------------------------------------------------------------------
// Slice — Immer ile yazıldı; cloneDeep ve lodash remove kaldırıldı
// ---------------------------------------------------------------------------
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
    set((state) => {
      state.reportItems.push(newItem);
    });
  },

  deleteItem: (id) => {
    const { reportItems } = get();
    const itemToDelete = reportItems.find((item) => item.id === id);

    set((state) => {
      // Öğeyi sil
      state.reportItems = state.reportItems.filter((item) => item.id !== id);

      // Data item siliniyorsa bağlı chart gibi öğeleri de temizle
      if (itemToDelete?.type === ITEM_TYPES.DATA) {
        state.reportItems = state.reportItems.filter(
          (item) => item.dataSourceId !== id,
        );
      }
    });
  },

  updateItem: (id, updates) => {
    set((state) => {
      const item = state.reportItems.find((i) => i.id === id);
      if (item) Object.assign(item, updates);
    });
  },

  reorderItems: (startIndex, endIndex) => {
    set((state) => {
      const [moved] = state.reportItems.splice(startIndex, 1);
      state.reportItems.splice(endIndex, 0, moved);
    });
  },

  setReportItems: (newItems) => {
    set((state) => {
      state.reportItems = newItems;
    });
  },

  resetReport: () => {
    set((state) => {
      state.reportItems = [];
      state._past = [];
      state._future = [];
      state.fileName = "";
    });
  },
});
