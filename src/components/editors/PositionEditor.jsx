import { useState } from 'react';
import { Move, RotateCcw, ChevronDown, ChevronRight } from 'lucide-react';
import useReportStore from '../../store/useReportStore';
import useLayoutStore from '../../store/useLayoutStore';
import { useShallow } from 'zustand/react/shallow';

/**
 * PositionEditor
 *
 * Her item editörünün altına eklenecek reusable bileşen.
 * Kullanım:
 *   <PositionEditor itemId={item.id} />
 *
 * Davranış:
 *   - leftOverride / topOverride alanı yoksa input "Auto" gösterir.
 *   - Kullanıcı değer girince override aktif olur.
 *   - "Sıfırla" butonu override'ı kaldırır → tekrar Auto'ya döner.
 */
function PositionEditor({ itemId }) {
  const [open, setOpen] = useState(false);

  const { item, updateItem } = useReportStore(
    useShallow((state) => ({
      item: state.reportItems.find((i) => i.id === itemId),
      updateItem: state.updateItem,
    })),
  );

  const defaultLeft = useLayoutStore((s) => s.layoutSettings.defaultLeft);

  if (!item) return null;

  const hasLeftOverride = item.leftOverride != null;
  const hasTopOverride = item.topOverride != null;
  const hasAnyOverride = hasLeftOverride || hasTopOverride;

  const leftDisplay = hasLeftOverride ? item.leftOverride : '';
  const topDisplay = hasTopOverride ? item.topOverride : '';

  const setLeft = (val) => {
    updateItem(itemId, { leftOverride: val === '' ? undefined : Number(val) });
  };

  const setTop = (val) => {
    updateItem(itemId, { topOverride: val === '' ? undefined : Number(val) });
  };

  const resetAll = () => {
    updateItem(itemId, { leftOverride: undefined, topOverride: undefined });
  };

  return (
    <div className="mt-3 border-t border-gray-100 pt-3">
      {/* Başlık — tıklanınca açılır/kapanır */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 w-full text-left group"
      >
        <div className="w-5 h-5 rounded flex items-center justify-center bg-gray-100 group-hover:bg-gray-200 transition-colors">
          <Move size={11} className="text-gray-500" />
        </div>
        <span className="text-xs font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
          Konum
        </span>
        {hasAnyOverride && (
          <span className="ml-1 text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium">
            özel
          </span>
        )}
        <span className="ml-auto text-gray-300">
          {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
        </span>
      </button>

      {open && (
        <div className="mt-2.5 space-y-2.5">

          {/* Left */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 w-10 shrink-0">Left</label>
            <div className="relative flex-1">
              <input
                type="number"
                value={leftDisplay}
                min={0}
                step={0.5}
                placeholder={`Auto (${defaultLeft})`}
                onChange={(e) => setLeft(e.target.value)}
                className="w-full text-xs px-2 py-1.5 pr-6 rounded-md border border-gray-200 bg-white
                           placeholder:text-gray-300 text-gray-800
                           focus:outline-none focus:ring-1 focus:ring-red-300 focus:border-red-400
                           [appearance:textfield]
                           [&::-webkit-outer-spin-button]:appearance-none
                           [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-300 pointer-events-none">
                pt
              </span>
            </div>
            {hasLeftOverride && (
              <button
                onClick={() => setLeft('')}
                title="Auto'ya döndür"
                className="p-1 rounded text-gray-300 hover:text-amber-500 hover:bg-amber-50 transition-colors shrink-0"
              >
                <RotateCcw size={11} />
              </button>
            )}
          </div>

          {/* Top */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 w-10 shrink-0">Top</label>
            <div className="relative flex-1">
              <input
                type="number"
                value={topDisplay}
                min={0}
                step={0.5}
                placeholder="Auto (hesaplanır)"
                onChange={(e) => setTop(e.target.value)}
                className="w-full text-xs px-2 py-1.5 pr-6 rounded-md border border-gray-200 bg-white
                           placeholder:text-gray-300 text-gray-800
                           focus:outline-none focus:ring-1 focus:ring-red-300 focus:border-red-400
                           [appearance:textfield]
                           [&::-webkit-outer-spin-button]:appearance-none
                           [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-300 pointer-events-none">
                pt
              </span>
            </div>
            {hasTopOverride && (
              <button
                onClick={() => setTop('')}
                title="Auto'ya döndür"
                className="p-1 rounded text-gray-300 hover:text-amber-500 hover:bg-amber-50 transition-colors shrink-0"
              >
                <RotateCcw size={11} />
              </button>
            )}
          </div>

          {/* İkisi de override'lıysa toplu sıfırlama */}
          {hasAnyOverride && (
            <button
              onClick={resetAll}
              className="flex items-center gap-1 text-[11px] text-amber-600 hover:text-amber-700 transition-colors mt-1"
            >
              <RotateCcw size={10} />
              Tümünü Auto'ya döndür
            </button>
          )}

          <p className="text-[10px] text-gray-400 leading-relaxed">
            Boş bırakılan alanlar otomatik hesaplanır.
            <br />
            <span className="font-medium">Left Auto</span> = global varsayılan ({defaultLeft}pt).
            <br />
            <span className="font-medium">Top Auto</span> = sıradaki birikimli konum.
          </p>
        </div>
      )}
    </div>
  );
}

export default PositionEditor;
