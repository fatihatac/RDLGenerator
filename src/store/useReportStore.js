import { create } from "zustand";
import { generateRDL } from "../utils/rdlGenerator";
import { handleDataUpdateSideEffects } from "../utils/reportLogic";
import generateId from "../utils/generateId";
import fixColumnNames from "../utils/fixColumnNames";

const useReportStore = create((set, get) => ({
  reportItems: [],
  fileName: '',
  activeDataSourceId: null, // To track the active data source
  setFileName: (newFileName) => set({ fileName: newFileName }),

  // --- Data Source Management ---
  setActiveDataSourceId: (id) => set({ activeDataSourceId: id }),
  getActiveDataSource: () => {
    const { reportItems, activeDataSourceId } = get();
    const dataSources = reportItems.filter(item => item.type === 'data');
    if (dataSources.length === 0) return null;

    if (activeDataSourceId) {
      const activeSource = dataSources.find(ds => ds.id === activeDataSourceId);
      if (activeSource) return activeSource;
    }
    
    return dataSources[0]; // Fallback to the first one
  },

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
    }

    if (newItem) {
      set((state) => ({ reportItems: [...state.reportItems, newItem] }));
      // If the first data source is added, set it as active
      if (type === 'data' && !get().activeDataSourceId) {
        set({ activeDataSourceId: newItem.id });
      }
    }
  },

  deleteItem: (id) => {
    const { reportItems, activeDataSourceId } = get();
    const itemToDelete = reportItems.find((item) => item.id === id);
  
    // If the deleted item is the active data source, reset activeDataSourceId
    if (itemToDelete && itemToDelete.type === "data" && itemToDelete.id === activeDataSourceId) {
      const otherDataSources = reportItems.filter(item => item.type === 'data' && item.id !== id);
      set({ activeDataSourceId: otherDataSources.length > 0 ? otherDataSources[0].id : null });
    }

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
    const currentItems = get().reportItems;
    let updatedItems = currentItems.map((item) => {
      if (item.id === id) {
        return { ...item, ...updates };
      }
      return item;
    });

    const updatedItem = updatedItems.find((item) => item.id === id);
    if (updatedItem && updatedItem.type === "data") {
      updatedItems = handleDataUpdateSideEffects(updatedItem, updatedItems);
    }
    set({ reportItems: updatedItems });
  },

  downloadReport: (fileName) => {
    const { reportItems, getActiveDataSource } = get();

    const allDataSources = reportItems.filter(item => item.type === 'data');
    const activeDataSource = getActiveDataSource();

    const titleItem = reportItems.find((item) => item.type === "title");
    const reportTitle = titleItem ? titleItem.value : "TaslakRapor";
    let reportName = fileName && fileName.trim() !== "" ? fileName.trim() : reportTitle;
    const rdlContent = generateRDL(reportItems, allDataSources, activeDataSource);
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
          console.warn('Satır numarası sütunu zaten ekli.'); // Replaced alert with console.warn
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
          name: newMappedField ? fixColumnNames(newMappedField) : g.name // Update name using fixColumnNames
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

