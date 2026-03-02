import { cloneDeep, remove } from "lodash";
import {
  generateId,
  handleDataUpdateSideEffects,
  generateRDL,
} from "../../utils";

export const createReportSlice = (set, get) => ({
  reportItems: [],

  addItem: (type) => {
    let newItem;
    if (type === "title") {
      newItem = { id: generateId("title"), type: "title", value: "" };
    } else if (type === "table") {
      newItem = {
        id: generateId("table"),
        type: "table",
        columns: [],
        groups: [],
        sums: [],
      };
    } else if (type === "data") {
      newItem = {
        id: generateId("datasource"),
        type: "data",
        value: "",
        jsonKeys: [],
      };
    } else if (type === "dateRange") {
      newItem = {
        id: generateId("dateRange"),
        type: "dateRange",
        mappedField: null,
      };
    } else if (type === "chart") {
      newItem = {
        id: generateId("chart"),
        type: "chart",
        chartType: "bar",
        dataSourceId: null,
        xAxis: null,
        yAxis: null,
      };
    }

    if (newItem) {
      set((state) => ({ reportItems: [...state.reportItems, newItem] }));
    }
  },

  deleteItem: (id) => {
    const { reportItems } = get();
    const itemToDelete = reportItems.find((item) => item.id === id);

    set((state) => {
      const newItems = cloneDeep(state.reportItems);
      remove(newItems, (item) => item.id === id);

      if (itemToDelete && itemToDelete.type === "data") {
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

  triggerDataSideEffects: (dataItemId) => {
    const { reportItems } = get();
    const dataItem = reportItems.find((item) => item.id === dataItemId);
    if (dataItem) {
      const updatedItems = handleDataUpdateSideEffects(dataItem, reportItems);
      set({ reportItems: updatedItems });
    }
  },

  downloadReport: (fileName) => {
    const { reportItems } = get();
    const titleItem = reportItems.find((item) => item.type === "title");
    const reportTitle = titleItem ? titleItem.value : "TaslakRapor";
    let reportName =
      fileName && fileName.trim() !== "" ? fileName.trim() : reportTitle;

    const rdlContent = generateRDL(reportItems);
    const blob = new Blob([rdlContent], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${reportName.toUpperCase()}.rdl`;
    a.click();
  },
});
