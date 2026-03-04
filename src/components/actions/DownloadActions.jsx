import { useState, useEffect, useCallback } from 'react';
import { Download, Loader2 } from 'lucide-react';
import useReportStore from '../../store/useReportStore';
import { useShallow } from 'zustand/react/shallow';
import { downloadReportFile } from '../../services/reportService';

const DownloadActions = () => {
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    try {
      downloadReportFile(reportItems, fileName);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Undo / Redo butonları */}
      <div className="flex items-center gap-1">
        <button
          onClick={undo}
          disabled={!canUndo()}
          title="Geri Al (Ctrl+Z)"
          className="p-1.5 rounded text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs font-bold"
        >
          ↩
        </button>
        <button
          onClick={redo}
          disabled={!canRedo()}
          title="Yinele (Ctrl+Y)"
          className="p-1.5 rounded text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs font-bold"
        >
          ↪
        </button>
      </div>

      <div className="w-px h-5 bg-white/30" />

      {/* Dosya adı girişi */}
      <div className="relative">
        <input
          name="fileNameInput"
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="Dosya Adı"
          className="w-full px-4 py-2 rounded-md bg-white text-[#9D201B] placeholder:text-[#9D201B]/70 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#9D201B] pr-12"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9D201B] text-xs pointer-events-none font-bold">
          .rdl
        </span>
      </div>

      {/* İndir butonu */}
      <button
        onClick={handleDownload}
        disabled={isLoading}
        className="bg-white text-[#9D201B] hover:bg-[#fee2e2] px-4 py-2 rounded-md flex items-center font-medium transition-colors shadow-sm active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading
          ? <Loader2 size={18} className="mr-2 animate-spin" />
          : <Download size={18} className="mr-2" />
        }
        İndir
      </button>
    </div>
  );
};

export default DownloadActions;
