import Header from './components/layout/Header';
import SidePanel from './components/layout/SidePanel';
import MainPanel from './components/layout/MainPanel';

function App() {
  

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans text-slate-800">
      <Header/>
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        <SidePanel/>
        <MainPanel/>
      </div>
    </div>
  );
}

export default App;


