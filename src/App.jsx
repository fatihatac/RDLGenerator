import React, { useState } from 'react';
import {  FileText, Table, LayoutTemplate, FileBraces } from 'lucide-react';
import TableEditor from './components/TableEditor';
import TextboxEditor from './components/TextboxEditor';
import { generateRDL } from './utils/rdlGenerator';
import JSONEditor from './components/JSONEditor';
import Header from './components/Header';
import AddTitleButton from './components/AddTitleButton';
import AddTableButton from './components/AddTableButton';
import AddDataButton from './components/AddDataButton';
import SidePanel from './components/SidePanel';

function App() {
  const [reportItems, setReportItems] = useState([]);

  // const addItem = (type) => {
  //   const newItem = {
  //     id: Date.now(),
  //     type,
  //     ...(type === 'title' && { value: 'Yeni Başlık' }),
  //     ...(type === 'table' && { columns: [{ id: Date.now(), name: 'ID' }, { id: Date.now() + 1, name: 'İsim' }] }),
  //     ...(type === 'data' && { json: '{ "data": [] }' }),
  //   };
  //   setReportItems([...reportItems, newItem]);
  // };

  const updateItem = (id, newData) => {
    setReportItems(reportItems.map(item => item.id === id ? { ...item, ...newData } : item));
  };

  const deleteItem = (id) => {
    setReportItems(reportItems.filter(item => item.id !== id));
  };

  const downloadReport = () => {
    const titleItem = reportItems.find(item => item.type === 'title');
    const reportTitle = titleItem ? titleItem.value : 'TaslakRapor';
    const rdlContent = generateRDL(reportItems);
    const blob = new Blob([rdlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportTitle.replace(/\s/g, "_")}_Raporu.rdl`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans text-slate-800">
      {/* Üst Bar */}
      <Header downloadReport={downloadReport} />

      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        {/* Sol Panel: Araç Kutusu */}
         <SidePanel reportItems={reportItems} setReportItems={setReportItems}/>
        {/* Orta Panel: Tasarım Alanı (Canvas) */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Rapor Taslağı</h2>
              <span className="text-sm text-gray-500">{reportItems.length} bileşen eklendi</span>
            </div>

            {reportItems.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center bg-gray-50/50">
                <LayoutTemplate size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">Raporunuz boş.</p>
                <p className="text-gray-400 text-sm mt-1">Soldaki menüden bileşen ekleyerek başlayın.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reportItems.map((item) => (
                  <div key={item.id}>
                    {item.type === 'title' && (
                      <TextboxEditor
                        item={item}
                        updateItem={updateItem}
                        deleteItem={deleteItem}
                      />
                    )}
                    {item.type === 'table' && (
                      <TableEditor
                        item={item}
                        updateItem={updateItem}
                        deleteItem={deleteItem}
                      />
                    )}
                    {item.type === 'data' && (
                      <JSONEditor
                        item={item}
                        updateItem={updateItem}
                        deleteItem={deleteItem}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;


