import { useState } from "react";
//import convertTitleCase from '../utils/convertTitleCase';
import { generateRDL } from "../utils/rdlGenerator";
import { getRdlTypeName } from "../utils/getDataType";
import fixColumnNames from "../utils/fixColumnNames";
import getMaxCharWidth from "../utils/getMaxCharWidth";

function useReportItems() {
  const [reportItems, setReportItems] = useState([]);

  const addItem = (type) => {
    let newItem;
    if (type === "title") {
      newItem = { id: Date.now(), type: "title", value: "RAPOR BAŞLIĞI" };
    } else if (type === "table") {
      newItem = { id: Date.now(), type: "table", columns: [] };
    } else if (type === "data") {
      newItem = { id: Date.now(), type: "data", value: "", jsonKeys: [] };
    } else if (type === "dateRange") {
      newItem = { id: Date.now(), type: "dateRange", mappedField: null };
    }

    if (newItem) {
      setReportItems((prev) => [...prev, newItem]);
    }
  };

  const deleteItem = (id) => {
    setReportItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (id, updates) => {
    let updatedItem = null;
    let baseReportItems = reportItems.map((item) => {
      if (item.id === id) {
        updatedItem = { ...item, ...updates };
        return updatedItem;
      }
      return item;
    });

    if (
      updatedItem &&
      updatedItem.type === "data" &&
      updates.jsonKeys &&
      updates.jsonKeys.length > 0
    ) {
      let itemsToAdd = [];
      let itemsToUpdate = {};

      const titleExists = baseReportItems.some((item) => item.type === "title");
      if (!titleExists) {
        itemsToAdd.push({
          id: Date.now() + 1,
          type: "title",
          value: "RAPOR BAŞLIĞI",
        });
      }

      const existingTable = baseReportItems.find(
        (item) => item.type === "table"
      );

      let firstRow = {};
      let parsedData = [];
      try {
        parsedData = JSON.parse(updatedItem.value);
        if (Array.isArray(parsedData) && parsedData.length > 0)
          firstRow = parsedData[0];
      } catch (e) {
        console.error("JSON parse hatası:", e.message);
      }
      

      const columnsToMap = updates.filteredJsonKeys || updates.jsonKeys;
      const newColumns = columnsToMap.map((key, index) => {
        const fixedName = fixColumnNames(key);
        
        return {
          id: Date.now() + index + 2,
          name: fixedName,
          mappedField: key,
          dataType: getRdlTypeName(firstRow[key]),
          width: getMaxCharWidth(parsedData, key, fixedName),
        };
      });

      if (!existingTable) {
        itemsToAdd.push({
          id: Date.now() + 2,
          type: "table",
          columns: newColumns,
        });
      } else if (existingTable.columns.length === 0) {
        itemsToUpdate[existingTable.id] = { columns: newColumns };
      }

      const finalReportItems = baseReportItems
        .map((item) => {
          if (itemsToUpdate[item.id]) {
            return { ...item, ...itemsToUpdate[item.id] };
          }
          return item;
        })
        .concat(itemsToAdd);

      setReportItems(finalReportItems);
    } else {
      setReportItems(baseReportItems);
    }
  };

  const downloadReport = (fileName) => {
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
  };

  return { reportItems, addItem, updateItem, deleteItem, downloadReport };
}

export default useReportItems;
