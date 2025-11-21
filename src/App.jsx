import Header from './components/Header';
import SidePanel from './components/SidePanel';
import MainPanel from './components/MainPanel';


function App() {

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans text-slate-800">
      <Header /*downloadReport={downloadReport}*/ />
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        <SidePanel/>
        <MainPanel/>
      </div>
    </div>
  );
}

export default App;


