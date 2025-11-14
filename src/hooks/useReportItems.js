
import { useState } from 'react';
import convertTitleCase from '../utils/convertTitleCase';
import { generateRDL } from '../utils/rdlGenerator';
import { getRdlTypeName } from '../utils/getDataType';
import fixColumnNames from '../utils/fixColumnNames';

function useReportItems() {
  const [reportItems, setReportItems] = useState([]);

  const addItem = (type) => {
    let newItem;
    if (type === 'title') {
      newItem = { id: Date.now(), type: 'title', value: 'RAPOR BAŞLIĞI' };
    } else if (type === 'table') {
      newItem = { id: Date.now(), type: 'table', columns: [] };
    } else if (type === 'data') {
      newItem = { id: Date.now(), type: 'data', value: '', jsonKeys: [] };
    }else if (type === 'dateRange') {
      newItem = { id: Date.now(), type: 'dateRange', mappedField: null };
    }
    
    if (newItem) {
      setReportItems(prev => [...prev, newItem]);
    }
  };

  const deleteItem = (id) => {
    setReportItems(prev => prev.filter(item => item.id !== id));
  };


  const updateItem = (id, updates) => {
    
    let updatedItem = null;
    let baseReportItems = reportItems.map(item => {
      if (item.id === id) {
        updatedItem = { ...item, ...updates };
        return updatedItem;
      }
      return item;
    });

    if (updatedItem && updatedItem.type === 'data' && updates.jsonKeys && updates.jsonKeys.length > 0) {
      
      let itemsToAdd = []; 
      let itemsToUpdate = {}; 

      const titleExists = baseReportItems.some(item => item.type === 'title');
      if (!titleExists) {
        itemsToAdd.push({
          id: Date.now() + 1,
          type: 'title',
          value: 'OTOMATİK BAŞLIK'
        });
      }

      const existingTable = baseReportItems.find(item => item.type === 'table');
      
      let firstRow = {};
      try {
        const data = JSON.parse(updatedItem.value);
        if (Array.isArray(data) && data.length > 0) firstRow = data[0];
      } catch(e) {
        console.error("JSON parse hatası:", e.message);
      }

      const newColumns = updates.jsonKeys.map((key, index) => ({
        id: Date.now() + index + 2,
        name: fixColumnNames(key), 
        mappedField: key, 
        dataType: getRdlTypeName(firstRow[key])
      }));

      if (!existingTable) {
        itemsToAdd.push({
          id: Date.now() + 2,
          type: 'table',
          columns: newColumns
        });
      } 
      else if (existingTable.columns.length === 0) {
        itemsToUpdate[existingTable.id] = { columns: newColumns };
      }

      const finalReportItems = baseReportItems.map(item => {
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


  const downloadReport = () => {
    const titleItem = reportItems.find(item => item.type === 'title');
    const reportTitle = titleItem ? titleItem.value : 'TaslakRapor';
    const rdlContent = generateRDL(reportItems);
    const blob = new Blob([rdlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${convertTitleCase(reportTitle.trim()).replace(/\s/g, "_")}.rdl`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return { reportItems, addItem, updateItem, deleteItem, downloadReport };
}

export default useReportItems;
