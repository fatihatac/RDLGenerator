import { useEffect, useRef } from 'react';
import { X, RotateCcw } from 'lucide-react';
import useLayoutStore from '../../store/useLayoutStore';
import { useShallow } from 'zustand/react/shallow';
import { PageSection, FontSection, DimensionsSection, AlignmentSection, Divider } from './settings';

function SettingsPanel({ onClose }) {
  const { layoutSettings, updateLayoutSetting, resetLayoutSettings } = useLayoutStore(
    useShallow((s) => ({
      layoutSettings: s.layoutSettings,
      updateLayoutSetting: s.updateLayoutSetting,
      resetLayoutSettings: s.resetLayoutSettings,
    })),
  );

  const panelRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const set = (key, value) => updateLayoutSetting(key, value);

  return (
    <>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-40" />

      <div
        ref={panelRef}
        className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col
                   animate-in slide-in-from-right duration-200"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-sm font-bold text-gray-800">Rapor Ayarları</h2>
            <p className="text-xs text-gray-400 mt-0.5">RDL çıktı ölçüleri</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetLayoutSettings}
              title="Tüm ayarları varsayılana döndür"
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-600
                         px-2.5 py-1.5 rounded-md hover:bg-red-50 transition-colors"
            >
              <RotateCcw size={12} />
              Sıfırla
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
          <PageSection settings={layoutSettings} onChange={set} />
          <Divider />
          <FontSection settings={layoutSettings} onChange={set} />
          <Divider />
          <DimensionsSection settings={layoutSettings} onChange={set} />
          <Divider />
          <AlignmentSection settings={layoutSettings} onChange={set} />
          <div className="h-6" />
        </div>

        <div className="px-5 py-3 border-t border-gray-100 shrink-0 bg-gray-50/60">
          <p className="text-xs text-gray-400 text-center">
            Değişiklikler anında uygulanır · RDL indirildiğinde geçerli olur
          </p>
        </div>
      </div>
    </>
  );
}

export default SettingsPanel;
