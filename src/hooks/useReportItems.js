import { useState } from 'react';
import { generateRDL } from '../utils/rdlGenerator';
import convertTitleCase from '../utils/convertTitleCase';

function useReportItems() {
  const [reportItems, setReportItems] = useState([]);

  const addItem = (type) => {
    const newItem = {
      id: Date.now(),
      type,
      ...(type === 'title' && { value: 'Yeni Başlık' }),
      ...(type === 'table' && { columns: [{ id: Date.now(), name: 'ID' }, { id: Date.now() + 1, name: 'İsim' }] }),
      ...(type === 'data' && { json: '{ "data": [] }' }),
    };
    setReportItems(prev => [...prev, newItem]);
  };

  const updateItem = (id, newData) => {
    setReportItems(prev => prev.map(item => item.id === id ? { ...item, ...newData } : item));
  };

  const deleteItem = (id) => {
    setReportItems(prev => prev.filter(item => item.id !== id));
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

  return {
    reportItems,
    addItem,
    updateItem,
    deleteItem,
    downloadReport
  };
}

export default useReportItems;