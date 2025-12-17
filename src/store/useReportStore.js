import { create } from "zustand";
import { cloneDeep, remove } from 'lodash';
import { generateRDL } from "../utils/rdlGenerator";
import { handleDataUpdateSideEffects } from "../utils/reportLogic";
import generateId from "../utils/generateId";
import fixColumnNames from "../utils/fixColumnNames";

const useReportStore = create((set, get) => {
  // Helper to find a table item, reducing repetition
  const findTable = (items, tableId) => items.find(item => item.id === tableId && item.type === 'table');

  return {
    reportItems: [],
    fileName: '',
    setFileName: (newFileName) => set({ fileName: newFileName }),

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

      set((state) => {
        const newItems = cloneDeep(state.reportItems);
        // Remove the item itself
        remove(newItems, item => item.id === id);
        // If it was a data source, remove dependent items
        if (itemToDelete && itemToDelete.type === "data") {
          remove(newItems, item => item.dataSourceId === id);
        }
        return { reportItems: newItems };
      });
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

    addColumn: (tableId) => set(state => {
      const newReportItems = cloneDeep(state.reportItems);
      const table = findTable(newReportItems, tableId);
      if (table) {
        const newCol = { id: generateId("column"), name: `Sütun ${table.columns.length + 1}`, mappedField: null };
        table.columns.push(newCol);
      }
      return { reportItems: newReportItems };
    }),

    removeColumn: (tableId, columnId) => set(state => {
      const newReportItems = cloneDeep(state.reportItems);
      const table = findTable(newReportItems, tableId);
      if (table) {
        remove(table.columns, c => c.id === columnId);
      }
      return { reportItems: newReportItems };
    }),

    updateColumnName: (tableId, columnId, newName) => set(state => {
      const newReportItems = cloneDeep(state.reportItems);
      const table = findTable(newReportItems, tableId);
      if (table) {
        const column = table.columns.find(c => c.id === columnId);
        if (column) column.name = newName;
      }
      return { reportItems: newReportItems };
    }),

    addRowNumberColumn: (tableId) => set(state => {
      const newReportItems = cloneDeep(state.reportItems);
      const table = findTable(newReportItems, tableId);
      if (table && !table.columns.some(c => c.mappedField === 'RowNumber')) {
        const newCol = { id: generateId("RowNumber"), name: 'No', mappedField: 'RowNumber', width: 30 };
        table.columns.unshift(newCol); // Add to the beginning
      } else if (table) {
        console.warn('Satır numarası sütunu zaten ekli.');
      }
      return { reportItems: newReportItems };
    }),

    addGroup: (tableId) => set(state => {
      const newReportItems = cloneDeep(state.reportItems);
      const table = findTable(newReportItems, tableId);
      if (table) {
        if (!table.groups) table.groups = [];
        const newGroup = { id: generateId("group"), name: `Group${table.groups.length + 1}`, mappedField: null };
        table.groups.push(newGroup);
      }
      return { reportItems: newReportItems };
    }),

    removeGroup: (tableId, groupId) => set(state => {
      const newReportItems = cloneDeep(state.reportItems);
      const table = findTable(newReportItems, tableId);
      if (table && table.groups) {
        remove(table.groups, g => g.id === groupId);
      }
      return { reportItems: newReportItems };
    }),

    updateGroupName: (tableId, groupId, newName) => set(state => {
      const newReportItems = cloneDeep(state.reportItems);
      const table = findTable(newReportItems, tableId);
      if (table && table.groups) {
        const group = table.groups.find(g => g.id === groupId);
        if (group) group.name = newName;
      }
      return { reportItems: newReportItems };
    }),

    updateGroupMappedField: (tableId, groupId, newMappedField) => set(state => {
      const newReportItems = cloneDeep(state.reportItems);
      const table = findTable(newReportItems, tableId);
      if (table && table.groups) {
        const group = table.groups.find(g => g.id === groupId);
        if (group) {
          group.mappedField = newMappedField;
          group.name = newMappedField ? fixColumnNames(newMappedField) : group.name;
        }
      }
      return { reportItems: newReportItems };
    }),

    addSum: (tableId) => set(state => {
      const newReportItems = cloneDeep(state.reportItems);
      const table = findTable(newReportItems, tableId);
      if (table) {
        if (!table.sums) table.sums = [];
        const newSum = { id: generateId("sum"), mappedField: null };
        table.sums.push(newSum);
      }
      return { reportItems: newReportItems };
    }),

    removeSum: (tableId, sumId) => set(state => {
      const newReportItems = cloneDeep(state.reportItems);
      const table = findTable(newReportItems, tableId);
      if (table && table.sums) {
        remove(table.sums, s => s.id === sumId);
      }
      return { reportItems: newReportItems };
    }),

    updateSumMappedField: (tableId, sumId, newMappedField) => set(state => {
      const newReportItems = cloneDeep(state.reportItems);
      const table = findTable(newReportItems, tableId);
      if (table && table.sums) {
        const sum = table.sums.find(s => s.id === sumId);
        if (sum) sum.mappedField = newMappedField;
      }
      return { reportItems: newReportItems };
    }),

    updateColumnMappedField: (tableId, columnId, newMappedField) => set(state => {
      const newReportItems = cloneDeep(state.reportItems);
      const table = findTable(newReportItems, tableId);
      if (table) {
        const column = table.columns.find(c => c.id === columnId);
        if (column) column.mappedField = newMappedField;
      }
      return { reportItems: newReportItems };
    }),
  }
});

export default useReportStore;

