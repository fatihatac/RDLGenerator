import { useState } from "react";
import { generateRDL } from "../utils/rdlGenerator";
import { getDataType } from "../utils/getDataType";
import fixColumnNames from "../utils/fixColumnNames";
import getMaxCharWidth from "../utils/getMaxCharWidth";

function useReportItems() {
  const [reportItems, setReportItems] = useState([]);

  const addItem = (type) => {
    let newItem;
    if (type === "title") {
      newItem = { id: Date.now(), type: "title", value: "" };
    } else if (type === "table") {
      newItem = { id: Date.now(), type: "table", columns: [], groups:[] };
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
    const itemToDelete = reportItems.find(item => item.id === id);

    if (itemToDelete && itemToDelete.type === 'data') {
      setReportItems(prev => prev.filter(item =>
        item.id !== id && 
        item.dataSourceId !== id 
      ));
    } else {
      setReportItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const updateItem = (id, updates) => {
    let baseReportItems = reportItems.map((item) => {
      if (item.id === id) {
        return { ...item, ...updates };
      }
      return item;
    });

    const updatedItem = baseReportItems.find(item => item.id === id);

    if (updatedItem && updatedItem.type === "data") {
      const isValueEmpty = updatedItem.value.trim() === '';
      let parsedData;

      try {
        if (!isValueEmpty) {
          parsedData = JSON.parse(updatedItem.value);
        }
      } catch (e) {
        console.error("JSON parse hatası:", e.message);
      }

      // Eğer veri boşsa VEYA parse edilemediyse, ilişkili TÜM öğeleri sil
      if (isValueEmpty || !parsedData) {
        const finalItems = baseReportItems.filter(item =>
          item.dataSourceId !== id
        );
        // Güncellenen (artık boş olan) veri kaynağını koru
        const currentDataItem = baseReportItems.find(item => item.id === id);
        setReportItems([...finalItems.filter(item => item.id !== id), currentDataItem]);
        return;
      }

      let itemsToAdd = [];
      let itemsToUpdate = {};

      const titleExists = baseReportItems.some((item) => item.type === "title");
      if (!titleExists) {
        itemsToAdd.push({
          id: Date.now() + 1,
          type: "title",
          value: "RAPOR_ADI",
          dataSourceId: updatedItem.id 
        });
      }

      const existingTable = baseReportItems.find(item => item.type === "table");
      const firstRow = (Array.isArray(parsedData) && parsedData.length > 0) ? parsedData[0] : {};
      console.log(typeof firstRow['sicilId']);
      console.log(typeof firstRow['NormalMesai']);
      console.log(typeof firstRow['mesaitarih'])

      console.log(getDataType(firstRow['sicilId']));
      console.log(getDataType(firstRow['NormalMesai']));
      console.log(getDataType(firstRow['mesaitarih']));
      
      
      
      const jsonKeys = Object.keys(firstRow);
      const columnsToMap = jsonKeys.filter(key => !['TarihAralik'].includes(key));

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
          dataSourceId: updatedItem.id, // <-- TABLO İÇİN BAĞLANTI
        });
      } else if (existingTable.columns.length === 0) {
        itemsToUpdate[existingTable.id] = {
          ...existingTable,
          columns: newColumns,
          dataSourceId: updatedItem.id, // <-- TABLO İÇİN BAĞLANTI
          groups: existingTable.groups || [], // Grupları koru veya başlat
        };
      }
      
      itemsToUpdate[updatedItem.id] = { ...updatedItem, jsonKeys: jsonKeys, filteredJsonKeys: columnsToMap };

      const finalReportItems = baseReportItems
        .map((item) => (itemsToUpdate[item.id] ? { ...item, ...itemsToUpdate[item.id] } : item))
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
