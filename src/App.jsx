import React, { useState } from 'react';
import { Download, FileText, Table, LayoutTemplate, X } from 'lucide-react';
import TableEditor from './components/TableEditor';
import TextboxEditor from './components/TextboxEditor';
import {generateRDL} from './components/utils/rdlGenerator';

function App() {
  const [reportItems, setReportItems] = useState([]);

  const addItem = (type) => {
    const newItem = {
      id: Date.now(),
      type,
      ...(type === 'textbox' && { value: 'Yeni Başlık' }),
      ...(type === 'table' && { columns: [{ id: Date.now(), name: 'ID' }, { id: Date.now() + 1, name: 'İsim' }] }),
    };
    setReportItems([...reportItems, newItem]);
  };

  const updateItem = (id, newData) => {
    setReportItems(reportItems.map(item => item.id === id ? { ...item, ...newData } : item));
  };

  const deleteItem = (id) => {
    setReportItems(reportItems.filter(item => item.id !== id));
  };

  const downloadReport = () => {
    const rdlContent = generateRDL(reportItems);
    const blob = new Blob([rdlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'TaslakRapor.rdl';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans text-slate-800">
      {/* Üst Bar */}
      <header className="bg-indigo-700 text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <LayoutTemplate />
          <h1 className="text-xl font-bold">Bold Reports Tasarımcısı</h1>
        </div>
        <button
          onClick={downloadReport}
          className="bg-white text-indigo-700 hover:bg-indigo-50 px-4 py-2 rounded-md flex items-center font-medium transition-colors shadow-sm"
        >
          <Download size={18} className="mr-2" />
          RDL İndir
        </button>
      </header>

      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        {/* Sol Panel: Araç Kutusu */}
        <aside className="w-full md:w-64 bg-white border-r border-gray-200 p-6 flex flex-col gap-4 shadow-inner z-0">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Bileşenler</h2>
          
          <button
            onClick={() => addItem('textbox')}
            className="flex items-center p-3 bg-gray-50 hover:bg-blue-50 hover:border-blue-300 border border-gray-200 rounded-lg transition-all text-left group"
          >
            <div className="bg-blue-100 text-blue-600 p-2 rounded mr-3 group-hover:bg-blue-200">
              <FileText size={20} />
            </div>
            <div>
              <span className="block font-medium text-gray-700">Metin Kutusu</span>
              <span className="text-xs text-gray-500">Başlık veya etiket için</span>
            </div>
          </button>

          <button
            onClick={() => addItem('table')}
            className="flex items-center p-3 bg-gray-50 hover:bg-green-50 hover:border-green-300 border border-gray-200 rounded-lg transition-all text-left group"
          >
            <div className="bg-green-100 text-green-600 p-2 rounded mr-3 group-hover:bg-green-200">
              <Table size={20} />
            </div>
            <div>
              <span className="block font-medium text-gray-700">Tablo</span>
              <span className="text-xs text-gray-500">Veri listelemek için</span>
            </div>
          </button>
        </aside>

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
                    {item.type === 'textbox' && (
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


