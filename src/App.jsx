import Header from './components/Header';
import SidePanel from './components/SidePanel';
import MainPanel from './components/MainPanel';
import useReportItems from './hooks/useReportItems';

function App() {
  const { reportItems, addItem, updateItem, deleteItem, downloadReport } = useReportItems();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans text-slate-800">
      {/* Üst Bar */}
      <Header downloadReport={downloadReport} />
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        {/* Sol Panel: Araç Kutusu */}
        <SidePanel reportItems={reportItems} addItem={addItem} />
        {/* Orta Panel: Tasarım Alanı (Canvas) */}
        <MainPanel reportItems={reportItems} updateItem={updateItem} deleteItem={deleteItem} />

      </div>
    </div>
  );
}

export default App;


