import { useState } from 'react';
import {
  Move, RotateCcw, ChevronDown, ChevronRight, AlertTriangle,
  AlignStartVertical, AlignCenterVertical, AlignEndVertical, ArrowUpToLine,
} from 'lucide-react';
import useReportStore from '../../store/useReportStore';
import useItemPositions from '../../hooks/useItemPositions';
import { computeAlignedLeft, FLEXIBLE_WIDTH_TYPES, SIZABLE_TYPES } from '../../utils/core/reportCalculations';
import { ptToPx } from '../../utils/core/units';
import { useShallow } from 'zustand/react/shallow';

const INPUT_CLASS = `w-full text-xs px-2 py-1.5 pr-6 rounded-md border border-gray-200 bg-white
  placeholder:text-gray-300 text-gray-800
  focus:outline-none focus:ring-1 focus:ring-red-300 focus:border-red-400
  [appearance:textfield]
  [&::-webkit-outer-spin-button]:appearance-none
  [&::-webkit-inner-spin-button]:appearance-none`;

const ALIGN_BUTTONS = [
  { mode: 'left',   label: 'Sola (0)', Icon: AlignStartVertical },
  { mode: 'center', label: 'Ortala',   Icon: AlignCenterVertical },
  { mode: 'right',  label: 'Sağa',     Icon: AlignEndVertical },
];

function CoordField({ label, value, placeholder, onChange, onReset, max }) {
  const hasValue = value != null;
  const outOfRange = hasValue && max != null && value > max;
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-gray-500 w-10 shrink-0">{label}</label>
      <div className="relative flex-1">
        <input
          type="number"
          value={hasValue ? value : ''}
          min={0}
          step={1}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`${INPUT_CLASS} ${outOfRange ? 'border-amber-400' : ''}`}
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-300 pointer-events-none">
          px
        </span>
      </div>
      {hasValue && (
        <button
          onClick={onReset}
          title="Auto'ya döndür"
          className="p-1 rounded text-gray-300 hover:text-amber-500 hover:bg-amber-50 transition-colors shrink-0"
        >
          <RotateCcw size={11} />
        </button>
      )}
    </div>
  );
}

/**
 * PositionEditor — her item editörünün altında kullanılır: <PositionEditor itemId={item.id} />
 *
 *   - Left/Top boşsa "Auto" (Left → global varsayılan, Top → birikimli konum).
 *   - Hızlı hizalama: sola / ortala / sağa, üste yasla.
 *   - İçerik alanının dışına taşan değerler ve başka itemla çakışmalar uyarılır.
 */
function PositionEditor({ itemId }) {
  const [open, setOpen] = useState(false);

  const { item, updateItem } = useReportStore(
    useShallow((state) => ({
      item: state.reportItems.find((i) => i.id === itemId),
      updateItem: state.updateItem,
    })),
  );
  const { byId, contentWidth, overlaps, settings } = useItemPositions();

  if (!item) return null;

  const pos = byId[itemId];
  const has = (k) => item[k] != null;
  const hasLegacy = item.leftOverride != null || item.topOverride != null;
  const sizable = SIZABLE_TYPES.has(item.type);
  const pageRel = item.relativeTo === 'page';
  const hasAnyOverride =
    has('leftPx') || has('rightPx') || has('topPx') || has('bottomPx') ||
    has('widthPx') || has('heightPx') || pageRel || hasLegacy;

  const toNumber = (val) => (val === '' || Number.isNaN(Number(val)) ? undefined : Math.max(0, Number(val)));
  // Aynı eksende bir taraf girilince karşı taraf temizlenir; eski pt alanları da silinir.
  const setSide = (key, opposite, legacyKey) => (val) =>
    updateItem(itemId, {
      [key]: toNumber(val),
      ...(toNumber(val) !== undefined && { [opposite]: undefined, [legacyKey]: undefined }),
      ...(toNumber(val) === undefined && { [legacyKey]: undefined }),
    });
  // Başlık/tarih gibi esnek genişlikli öğelerde Sol+Sağ birlikte kullanılır (genişlik daralır).
  const flexible = FLEXIBLE_WIDTH_TYPES.has(item.type);
  const setLeft = flexible
    ? (val) => updateItem(itemId, { leftPx: toNumber(val), leftOverride: undefined })
    : setSide('leftPx', 'rightPx', 'leftOverride');
  const setRight = flexible
    ? (val) => updateItem(itemId, { rightPx: toNumber(val) })
    : setSide('rightPx', 'leftPx', 'leftOverride');
  const setTop = setSide('topPx', 'bottomPx', 'topOverride');
  const setBottom = setSide('bottomPx', 'topPx', 'topOverride');
  const setWidth = (val) => updateItem(itemId, { widthPx: toNumber(val) });
  const setHeight = (val) => updateItem(itemId, { heightPx: toNumber(val) });
  const setRelativeTo = (mode) => updateItem(itemId, { relativeTo: mode === 'page' ? 'page' : undefined });
  const resetAll = () =>
    updateItem(itemId, {
      leftPx: undefined, rightPx: undefined, topPx: undefined, bottomPx: undefined,
      widthPx: undefined, heightPx: undefined, relativeTo: undefined,
      leftOverride: undefined, topOverride: undefined,
    });

  const alignTo = (mode) =>
    updateItem(itemId, {
      leftPx: ptToPx(computeAlignedLeft(item, mode, contentWidth, settings)),
      rightPx: undefined, leftOverride: undefined,
    });

  const itemWidth = pos?._width ?? 0;
  const boxWidth = pageRel ? contentWidth + settings.marginLeft + settings.marginRight : contentWidth;
  const maxLeft = Math.max(0, boxWidth - itemWidth);
  const overflowsRight = pos && pos._left + itemWidth > boxWidth + 0.01;
  const overlapIds = overlaps[itemId] ?? [];
  const activeMode = pos
    ? ALIGN_BUTTONS.find((b) => Math.abs(computeAlignedLeft(item, b.mode, contentWidth, settings) - pos._left) < 0.01)?.mode
    : null;

  return (
    <div className="mt-3 border-t border-gray-100 pt-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 w-full text-left group"
      >
        <div className="w-5 h-5 rounded flex items-center justify-center bg-gray-100 group-hover:bg-gray-200 transition-colors">
          <Move size={11} className="text-gray-500" />
        </div>
        <span className="text-xs font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
          Konum ve Boyut
        </span>
        {pos && (
          <span className="text-[10px] text-gray-400 tabular-nums">
            {ptToPx(pos._left)} / {ptToPx(pos._top)} px
          </span>
        )}
        {hasAnyOverride && (
          <span className="ml-1 text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium">
            özel
          </span>
        )}
        {(overlapIds.length > 0 || overflowsRight) && (
          <AlertTriangle size={12} className="text-amber-500" />
        )}
        <span className="ml-auto text-gray-300">
          {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
        </span>
      </button>

      {open && (
        <div className="mt-2.5 space-y-2.5">
          {/* Ölçü referansı */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-500 shrink-0">Ölçü referansı</span>
            <div className="flex rounded-md border border-gray-200 overflow-hidden">
              {[{ v: 'margin', l: 'Marjin içi' }, { v: 'page', l: 'Kağıt kenarı' }].map(({ v, l }) => (
                <button
                  key={v}
                  onClick={() => setRelativeTo(v)}
                  className={`text-[11px] px-2 py-1 transition-colors ${
                    (v === 'page') === pageRel
                      ? 'bg-[#e12f27] text-white font-medium'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Hızlı hizalama */}
          <div className="flex items-center gap-1.5">
            <div className="flex rounded-md border border-gray-200 overflow-hidden">
              {ALIGN_BUTTONS.map(({ mode, label, Icon }) => (
                <button
                  key={mode}
                  onClick={() => alignTo(mode)}
                  title={label}
                  className={`flex items-center gap-1 text-[11px] px-2 py-1.5 transition-colors ${
                    activeMode === mode
                      ? 'bg-[#e12f27] text-white font-medium'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={11} />
                  {label}
                </button>
              ))}
            </div>
            <button
              onClick={() => updateItem(itemId, { topPx: 0, bottomPx: undefined, topOverride: undefined })}
              title="Üste yasla (Üst = 0)"
              className="flex items-center gap-1 text-[11px] px-2 py-1.5 rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <ArrowUpToLine size={11} />
              Üste (0)
            </button>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
            <CoordField
              label="Sol" value={item.leftPx ?? (item.leftOverride != null ? ptToPx(item.leftOverride) : undefined)}
              placeholder={!flexible && has('rightPx') ? '—' : `Auto (${ptToPx(pos?._left ?? 0)})`}
              onChange={setLeft} onReset={() => setLeft('')} max={ptToPx(maxLeft)}
            />
            <CoordField
              label="Sağ" value={item.rightPx}
              placeholder={!flexible && (has('leftPx') || item.leftOverride != null) ? '—' : 'Auto'}
              onChange={setRight} onReset={() => setRight('')}
            />
            <CoordField
              label="Üst" value={item.topPx ?? (item.topOverride != null ? ptToPx(item.topOverride) : undefined)}
              placeholder={has('bottomPx') ? '—' : `Auto (${ptToPx(pos?._top ?? 0)})`}
              onChange={setTop} onReset={() => setTop('')}
            />
            <CoordField
              label="Alt" value={item.bottomPx}
              placeholder={has('topPx') || item.topOverride != null ? '—' : 'Auto'}
              onChange={setBottom} onReset={() => setBottom('')}
            />
          </div>

          {sizable ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
              <CoordField
                label="Gen." value={item.widthPx}
                placeholder={`Auto (${ptToPx(pos?._width ?? 0)})`}
                onChange={setWidth} onReset={() => setWidth('')}
              />
              <CoordField
                label="Yük." value={item.heightPx}
                placeholder={`Auto (${ptToPx(pos?._height ?? 0)})`}
                onChange={setHeight} onReset={() => setHeight('')}
              />
            </div>
          ) : (
            <p className="text-[10px] text-gray-400">
              Genişlik sütun genişliklerinden, yükseklik satır sayısından gelir; boyutu sütun ayarlarından değiştirin.
            </p>
          )}

          {hasAnyOverride && (
            <button
              onClick={resetAll}
              className="flex items-center gap-1 text-[11px] text-amber-600 hover:text-amber-700 transition-colors"
            >
              <RotateCcw size={10} />
              Tümünü Auto'ya döndür
            </button>
          )}

          {overflowsRight && (
            <p className="flex items-start gap-1.5 text-[11px] text-amber-700 bg-amber-50 rounded-md px-2 py-1.5">
              <AlertTriangle size={12} className="shrink-0 mt-px" />
              Bileşen içerik alanının dışına taşıyor (Sol en fazla {ptToPx(maxLeft)}px).
            </p>
          )}
          {overlapIds.length > 0 && (
            <p className="flex items-start gap-1.5 text-[11px] text-amber-700 bg-amber-50 rounded-md px-2 py-1.5">
              <AlertTriangle size={12} className="shrink-0 mt-px" />
              {overlapIds.length} bileşenle çakışıyor. Üst değerini değiştirin veya Auto'ya döndürün.
            </p>
          )}

          <p className="text-[10px] text-gray-400 leading-relaxed">
            Ölçüler seçtiğiniz referansa göredir (Marjin içi veya Kağıt kenarı), birim px. Sabit genişlikli bileşenlerde Sol/Sağ ve Üst/Alt'tan yalnızca biri
            kullanılır; başlık ve tarihte Sol+Sağ birlikte genişliği daraltır. Boş = otomatik: Sol varsayılan ({ptToPx(settings.defaultLeft)}px), Üst sıradaki
            birikimli konum. İçerik alanı: {ptToPx(contentWidth)}px.
          </p>
        </div>
      )}
    </div>
  );
}

export default PositionEditor;
