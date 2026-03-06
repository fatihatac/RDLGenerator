import { useState, useEffect, useCallback } from 'react';
import { Download, Loader2, Undo2, Redo2 } from 'lucide-react';
import useReportStore from '../../store/useReportStore';
import { useShallow } from 'zustand/react/shallow';
import { downloadReportFile } from '../../services/reportService';
import { useToast } from '../../hooks/useToast';

const DownloadActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const { reportItems, fileName, setFileName, undo, redo, canUndo, canRedo } =
    useReportStore(
      useShallow((state) => ({
        reportItems: state.reportItems,
        fileName:    state.fileName,
        setFileName: state.setFileName,
        undo:        state.undo,
        redo:        state.redo,
        canUndo:     state.canUndo,
        canRedo:     state.canRedo,
      })),
    );

  // Ctrl+Z / Ctrl+Y klavye kısayolları
  const handleKeyDown = useCallback(
    (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
        if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) { e.preventDefault(); redo(); }
      }
    },
    [undo, redo],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleDownload = async () => {
    if (reportItems.length === 0) {
      toast.warning('İndirilecek rapor bileşeni yok.');
      return;
    }
    setIsLoading(true);
    try {
      downloadReportFile(reportItems, fileName);
      toast.success('RDL dosyası başarıyla indirildi.');
    } catch (err) {
      toast.error('Dosya indirilirken bir hata oluştu.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">

      {/* Undo / Redo */}
      <div className="flex items-center gap-1">
        <button
          onClick={undo}
          disabled={!canUndo()}
          title="Geri Al (Ctrl+Z)"
          className="p-1.5 rounded text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Undo2 size={18} />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo()}
          title="Yinele (Ctrl+Y)"
          className="p-1.5 rounded text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Redo2 size={18} />
        </button>
      </div>

      {/* Dosya adı input */}
      <input
        type="text"
        value={fileName || ''}
        onChange={(e) => setFileName(e.target.value)}
        placeholder="Dosya adı (opsiyonel)"
        className="hidden md:block text-sm bg-white/10 text-white placeholder-white/40 border border-white/20 rounded-md px-3 py-1.5 focus:outline-none focus:bg-white/20 transition-colors w-44"
      />

      {/* İndir butonu */}
      <button
        onClick={handleDownload}
        disabled={isLoading || reportItems.length === 0}
        title={reportItems.length === 0 ? 'Önce bileşen ekleyin' : 'RDL olarak indir'}
        className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-white text-[#e12f27] text-sm font-semibold hover:bg-red-50 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
      >
        {isLoading ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
        İndir
      </button>
    </div>
  );
};

export default DownloadActions;
