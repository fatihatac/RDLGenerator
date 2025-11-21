import { create } from "zustand";

const useReportStore = create((set, get) => ({
  reportItems: [],
  addItem: (type) => {
    let newItem;
    if (type === "title") {
      newItem = { id: Date.now(), type: "title", value: "" };
    } else if (type === "table") {
      newItem = { id: Date.now(), type: "table", columns: [] };
    } else if (type === "data") {
      newItem = { id: Date.now(), type: "data", value: "", jsonKeys: [] };
    } else if (type === "dateRange") {
      newItem = { id: Date.now(), type: "dateRange", mappedField: null };
    }

    if (newItem) {
      set((state) => ({reportItems : [...state.reportItems, newItem]}));
    }
  },

  deleteItem: (id) => {
    const { reportItems } = get();
    const itemToDelete = reportItems.find((item) => item.id === id);

    let newReportItems = reportItems;
    if (itemToDelete?.type === "data") {
      newReportItems = reportItems.filter(
        (item) => item.id !== id && item.dataSourceId !== id
      );
    } else {
      newReportItems = reportItems.filter((item) => item.id !== id);
    }
    set({ reportItems: newReportItems });
  },
  updateItem: (id, updates) => {
    set((state) => ({
      reportItems: state.reportItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
  },
}));

export default useReportStore;
