import { create } from "zustand";
import { generateRDL } from "../utils/rdlGenerator";
import { getDataType } from "../utils/getDataType";
import fixColumnNames from "../utils/fixColumnNames";
import getMaxCharWidth from "../utils/getMaxCharWidth";


const handleDataUpdateSideEffects = (updatedItem, allItems) => {
  const isValueEmpty = updatedItem.value.trim() === "";
  let parsedData;

  try {
    if (!isValueEmpty) {
      parsedData = JSON.parse(updatedItem.value);
    }
  } catch (e) {
    console.error("JSON parse error:", e.message);
  }

  // If JSON is empty or invalid, remove related auto-generated items
  if (isValueEmpty || !parsedData) {
    const itemsToKeep = allItems.filter(
      (item) => item.dataSourceId !== updatedItem.id
    );
    // Find the original data item to ensure it's not removed
    const currentDataItem = allItems.find((item) => item.id === updatedItem.id);
    return [
      ...itemsToKeep.filter((item) => item.id !== updatedItem.id),
      currentDataItem,
    ];
  }

  // --- If JSON is valid, proceed with creating/updating other items ---

  let itemsToAdd = [];
  let itemsToUpdate = {};

  // 1. Create Title if it doesn't exist
  const titleExists = allItems.some((item) => item.type === "title");
  if (!titleExists) {
    itemsToAdd.push({
      id: Date.now() + 1,
      type: "title",
      value: "RAPOR_ADI",
      dataSourceId: updatedItem.id,
    });
  }

  // 2. Create or Update Table
  const existingTable = allItems.find((item) => item.type === "table");
  const firstRow = Array.isArray(parsedData) && parsedData.length > 0 ? parsedData[0] : {};
  const jsonKeys = Object.keys(firstRow);
  const columnsToMap = jsonKeys.filter((key) => !["TarihAralik"].includes(key));

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
    itemsToAdd.push({
      id: Date.now() + 2,
      type: "table",
      columns: newColumns,
      dataSourceId: updatedItem.id,
      groups: [],
    });
  } else if (existingTable.columns.length === 0) {
    itemsToUpdate[existingTable.id] = {
      ...existingTable,
      columns: newColumns,
      dataSourceId: updatedItem.id,
      groups: existingTable.groups || [],
    };
  }

  // 3. Update the data item itself with discovered keys
  itemsToUpdate[updatedItem.id] = {
    ...updatedItem,
    jsonKeys: jsonKeys,
    filteredJsonKeys: columnsToMap,
  };

  // 4. Combine all changes into the final list of items
  const finalReportItems = allItems
    .map((item) => (itemsToUpdate[item.id] ? { ...item, ...itemsToUpdate[item.id] } : item))
    .concat(itemsToAdd);

  return finalReportItems;
};


const useReportStore = create((set, get) => ({
  reportItems: [],
  fileName: '',
  setFileName: (newFileName) => set({ fileName: newFileName }),

  addItem: (type) => {
    let newItem;
    if (type === "title") {
      newItem = { id: Date.now(), type: "title", value: "" };
    } else if (type === "table") {
      newItem = { id: Date.now(), type: "table", columns: [], groups: [] };
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
}));

export default useReportStore;
