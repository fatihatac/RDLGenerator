import Header from './components/layout/Header';
import SidePanel from './components/layout/SidePanel';
import MainPanel from './components/layout/MainPanel';
import ErrorBoundary from './components/common/ErrorBoundary';
import ToastContainer from './components/ui/ToastContainer';

// FIX: viewMode koşullu render kaldırıldı — SidePanel kendi içinde yönetiyor
// FIX: Uygulama geneli ErrorBoundary eklendi
function App() {
  return (
    <>
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-100 flex flex-col font-sans text-slate-800">
          <Header />
          <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
            <SidePanel />
            <MainPanel />
          </div>
        </div>
      </ErrorBoundary>
      <ToastContainer />
    </>
  );
}

export default App;
