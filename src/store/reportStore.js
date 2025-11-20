import { create } from "zustand";
import { generateRDL } from "../utils/rdlGenerator";
import { getDataType } from "../utils/getDataType";
import fixColumnNames from "../utils/fixColumnNames";
import getMaxCharWidth from "../utils/getMaxCharWidth";

// Helper function to find table and data items
const findReportItems = (items) => ({
  tableItem: items.find(item => item.type === 'table'),
  dataItem: items.find(item => item.type === 'data'),
});

const useReportStore = create((set, get) => ({
  reportItems: [],

  // =================================================================
  // SIMPLE ACTIONS
  // =================================================================

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
      set((state) => ({ reportItems: [...state.reportItems, newItem] }));
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
    set(state => ({
      reportItems: state.reportItems.map(item =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
  },

  // =================================================================
  // SMART ACTIONS (İş mantığı içeren fonksiyonlar)
  // =================================================================

  updateDataItemValue: (id, value) => {
    const { reportItems } = get();
    
    let tempReportItems = reportItems.map(item => 
      item.id === id ? { ...item, value } : item
    );

    const updatedItem = tempReportItems.find(item => item.id === id);
    const isValueEmpty = value.trim() === "";
    let parsedData;

    try {
      if (!isValueEmpty) parsedData = JSON.parse(value);
    } catch (e) {
      console.error("JSON parse hatası:", e.message);
      set({ reportItems: tempReportItems }); 
      return;
    }

    if (isValueEmpty || !parsedData) {
       const finalItems = tempReportItems.filter(item => item.dataSourceId !== id);
       const currentDataItem = tempReportItems.find(item => item.id === id);
       set({ reportItems: [...finalItems.filter(item => item.id !== id), currentDataItem] });
       return;
    }

    let itemsToAdd = [];
    let itemsToUpdate = {};
    const firstRow = Array.isArray(parsedData) && parsedData.length > 0 ? parsedData[0] : {};
    const jsonKeys = Object.keys(firstRow);
    const columnsToMap = jsonKeys.filter(key => !["TarihAralik"].includes(key));

    if (!tempReportItems.some(item => item.type === "title")) {
      itemsToAdd.push({ id: Date.now() + 1, type: "title", value: "RAPOR_ADI", dataSourceId: updatedItem.id });
    }

    const existingTable = tempReportItems.find(item => item.type === "table");
    const newColumns = columnsToMap.map((key, index) => {
        const fixedName = fixColumnNames(key);
        return {
          id: Date.now() + index + 2,
          name: fixedName,
          mappedField: key,
          dataType: getDataType(firstRow[key]),
          width: getMaxCharWidth(parsedData, key, fixedName),
        };
    });

    if (!existingTable) {
        itemsToAdd.push({ id: Date.now() + 2, type: "table", columns: newColumns, dataSourceId: updatedItem.id });
    } else {
        const shouldCreateColumns = existingTable.columns.length === 0;
        const finalColumns = shouldCreateColumns 
            ? newColumns
            : existingTable.columns.map(col => { 
                const fixedName = fixColumnNames(col.mappedField);
                return {...col, width: getMaxCharWidth(parsedData, col.mappedField, fixedName)};
            });
        
        itemsToUpdate[existingTable.id] = { ...existingTable, columns: finalColumns, dataSourceId: updatedItem.id };
    }
    
    itemsToUpdate[updatedItem.id] = { ...updatedItem, jsonKeys: jsonKeys, filteredJsonKeys: columnsToMap };

    const finalReportItems = tempReportItems
      .map(item => (itemsToUpdate[item.id] ? { ...item, ...itemsToUpdate[item.id] } : item))
      .concat(itemsToAdd);

    set({ reportItems: finalReportItems });
  },
  
  // --- Column Specific Actions ---

  updateColumnName: (columnId, newName) => {
    set(state => {
      const { tableItem } = findReportItems(state.reportItems);
      if (!tableItem) return state;

      const newCols = tableItem.columns.map(c => c.id === columnId ? { ...c, name: newName } : c);
      return {
        reportItems: state.reportItems.map(item => item.id === tableItem.id ? { ...tableItem, columns: newCols } : item)
      };
    });
  },

  deleteTableColumn: (columnId) => {
    set(state => {
      const { tableItem } = findReportItems(state.reportItems);
      if (!tableItem) return state;

      const newCols = tableItem.columns.filter(c => c.id !== columnId);
      return {
        reportItems: state.reportItems.map(item => item.id === tableItem.id ? { ...tableItem, columns: newCols } : item)
      };
    });
  },
  
  updateTableColumnMapping: (columnId, newMappedField) => {
     set(state => {
      const { tableItem, dataItem } = findReportItems(state.reportItems);
      if (!tableItem || !dataItem || !dataItem.value) return state;

      let parsedData;
      try { parsedData = JSON.parse(dataItem.value); } catch { return state; }

      const newCols = tableItem.columns.map(c => {
        if (c.id === columnId) {
          const fixedName = fixColumnNames(newMappedField);
          return {
            ...c, 
            mappedField: newMappedField,
            width: getMaxCharWidth(parsedData, newMappedField, fixedName),
          };
        }
        return c;
      });

      return {
        reportItems: state.reportItems.map(item => item.id === tableItem.id ? { ...tableItem, columns: newCols } : item)
      };
    });
  },

  addTableColumn: () => {
    set(state => {
      const { tableItem } = findReportItems(state.reportItems);
      if (!tableItem) return state;

      const newCol = { id: Date.now(), name: `Sütun ${tableItem.columns.length + 1}`, mappedField: null };
      const newCols = [...tableItem.columns, newCol];
      
      return {
        reportItems: state.reportItems.map(item => item.id === tableItem.id ? { ...tableItem, columns: newCols } : item)
      };
    });
  },

  addRowNumberColumn: () => {
    set(state => {
      const { tableItem } = findReportItems(state.reportItems);
      if (!tableItem || tableItem.columns.find(c => c.mappedField === 'RowNumber')) return state;
      
      const newCol = { id: Date.now(), name: 'No', mappedField: 'RowNumber', width: 30 };
      const newCols = [newCol, ...tableItem.columns];

      return {
        reportItems: state.reportItems.map(item => item.id === tableItem.id ? { ...tableItem, columns: newCols } : item)
      };
    });
  },

  // =================================================================
  // DOWNLOAD ACTION
  // =================================================================
  downloadReport: (fileName) => {
    const reportItems = get().reportItems;
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
}));

export default useReportStore;
