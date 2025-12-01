import { create } from "zustand";
import { generateRDL } from "../utils/rdlGenerator";
import { handleDataUpdateSideEffects } from "../utils/reportLogic";
import generateId from "../utils/generateId";
import fixColumnNames from "../utils/fixColumnNames";

const useReportStore = create((set, get) => ({
  reportItems: [],
  fileName: '',
  setFileName: (newFileName) => set({ fileName: newFileName }),

  // --- General Actions ---
  addItem: (type) => {
    let newItem;
    if (type === "title") {
      newItem = { id: generateId("title"), type: "title", value: "" };
    } else if (type === "table") {
      newItem = { id: generateId("table"), type: "table", columns: [], groups: [], sums: [] };
    } else if (type === "data") {
      newItem = { id: generateId("datasource"), type: "data", value: "", jsonKeys: [] };
    } else if (type === "dateRange") {
      newItem = { id: generateId("dateRange"), type: "dateRange", mappedField: null };
    } else if (type === "chart") {
      newItem = { id: generateId("chart"), type: "chart", chartType: "bar", dataSourceId: null, xAxis: null, yAxis: null };
    }
    if (newItem) {
      set((state) => ({ reportItems: [...state.reportItems, newItem] }));
    }
  },

  deleteItem: (id) => {
    const { reportItems } = get();
    const itemToDelete = reportItems.find((item) => item.id === id);

    if (itemToDelete && itemToDelete.type === "data") {
      set((state) => ({
        reportItems: state.reportItems.filter(
          (item) => item.id !== id && item.dataSourceId !== id
        )
      }));
    } else {
      set((state) => ({
        reportItems: state.reportItems.filter((item) => item.id !== id)
      }));
    }
  },

  updateItem: (id, updates) => {
    set((state) => ({
      reportItems: state.reportItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item
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
    let reportName = fileName && fileName.trim() !== "" ? fileName.trim() : reportTitle;
    const rdlContent = generateRDL(reportItems);
    const blob = new Blob([rdlContent], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${reportName.toUpperCase()}.rdl`;
    a.click();
  },

  // --- Table-Specific Actions ---

  addColumn: (tableId) => set(state => ({
    reportItems: state.reportItems.map(item => {
      if (item.id === tableId && item.type === 'table') {
        const newCol = { id: generateId("column"), name: `Sütun ${item.columns.length + 1}`, mappedField: null };
        return { ...item, columns: [...item.columns, newCol] };
      }
      return item;
    })
  })),

  removeColumn: (tableId, columnId) => set(state => ({
    reportItems: state.reportItems.map(item => {
      if (item.id === tableId && item.type === 'table') {
        const newCols = item.columns.filter(c => c.id !== columnId);
        return { ...item, columns: newCols };
      }
      return item;
    })
  })),

  updateColumnName: (tableId, columnId, newName) => set(state => ({
    reportItems: state.reportItems.map(item => {
      if (item.id === tableId && item.type === 'table') {
        const newCols = item.columns.map(c => c.id === columnId ? { ...c, name: newName } : c);
        return { ...item, columns: newCols };
      }
      return item;
    })
  })),

  addRowNumberColumn: (tableId) => set(state => ({
    reportItems: state.reportItems.map(item => {
      if (item.id === tableId && item.type === 'table') {
        if (item.columns.find(c => c.mappedField === 'RowNumber')) {
          console.warn('Satır numarası sütunu zaten ekli.');
          return item;
        }
        const newCol = { id: generateId("RowNumber"), name: 'No', mappedField: 'RowNumber', width: 30 };
        return { ...item, columns: [newCol, ...item.columns] };
      }
      return item;
    })
  })),

  addGroup: (tableId) => set(state => ({
    reportItems: state.reportItems.map(item => {
      if (item.id === tableId && item.type === 'table') {
        const newGroup = { id: generateId("group"), name: `Group${(item.groups || []).length + 1}`, mappedField: null };
        return { ...item, groups: [...(item.groups || []), newGroup] };
      }
      return item;
    })
  })),

  removeGroup: (tableId, groupId) => set(state => ({
    reportItems: state.reportItems.map(item => {
      if (item.id === tableId && item.type === 'table') {
        const newGroups = item.groups.filter(g => g.id !== groupId);
        return { ...item, groups: newGroups };
      }
      return item;
    })
  })),

  updateGroupName: (tableId, groupId, newName) => set(state => ({
    reportItems: state.reportItems.map(item => {
      if (item.id === tableId && item.type === 'table') {
        const newGroups = item.groups.map(g => g.id === groupId ? { ...g, name: newName } : g);
        return { ...item, groups: newGroups };
      }
      return item;
    })
  })),

  updateGroupMappedField: (tableId, groupId, newMappedField) => set(state => ({
    reportItems: state.reportItems.map(item => {
      if (item.id === tableId && item.type === 'table') {
        const newGroups = item.groups.map(g => g.id === groupId ? {
          ...g,
          mappedField: newMappedField,
          name: newMappedField ? fixColumnNames(newMappedField) : g.name
        } : g);
        return { ...item, groups: newGroups };
      }
      return item;
    })
  })),

  addSum: (tableId) => set(state => ({
    reportItems: state.reportItems.map(item => {
      if (item.id === tableId && item.type === 'table') {
        const newSum = { id: generateId("sum"), mappedField: null };
        return { ...item, sums: [...(item.sums || []), newSum] };
      }
      return item;
    })
  })),

  removeSum: (tableId, sumId) => set(state => ({
    reportItems: state.reportItems.map(item => {
      if (item.id === tableId && item.type === 'table') {
        const newSums = item.sums.filter(s => s.id !== sumId);
        return { ...item, sums: newSums };
      }
      return item;
    })
  })),

  updateSumMappedField: (tableId, sumId, newMappedField) => set(state => ({
    reportItems: state.reportItems.map(item => {
      if (item.id === tableId && item.type === 'table') {
        const newSums = item.sums.map(s => s.id === sumId ? { ...s, mappedField: newMappedField } : s);
        return { ...item, sums: newSums };
      }
      return item;
    })
  })),

  updateColumnMappedField: (tableId, columnId, newMappedField) => set(state => ({
    reportItems: state.reportItems.map(item => {
      if (item.id === tableId && item.type === 'table') {
        const newCols = item.columns.map(c => c.id === columnId ? { ...c, mappedField: newMappedField } : c);
        return { ...item, columns: newCols };
      }
      return item;
    })
  })),

}));

export default useReportStore;

