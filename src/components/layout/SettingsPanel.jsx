import { useEffect, useRef } from 'react';
import {
  X, RotateCcw, FileText, Type, Ruler, AlignCenter,
  ChevronDown,
} from 'lucide-react';
import useLayoutStore, { DEFAULT_LAYOUT_SETTINGS } from '../../store/useLayoutStore';
import { useShallow } from 'zustand/react/shallow';

// ---------------------------------------------------------------------------
// Sayfa boyutu presetleri
// ---------------------------------------------------------------------------
const PAGE_PRESETS = [
  { label: 'A4 Dikey', pageWidth: 595.44, pageHeight: 841.68 },
  { label: 'A4 Yatay', pageWidth: 841.68, pageHeight: 595.44 },
  { label: 'A3 Dikey', pageWidth: 841.89, pageHeight: 1190.55 },
  { label: 'Letter Dikey', pageWidth: 612, pageHeight: 792 },
  { label: 'Letter Yatay', pageWidth: 792, pageHeight: 612 },
];

const FONT_FAMILIES = [
  'Segoe UI', 'Arial', 'Calibri', 'Tahoma', 'Verdana',
  'Times New Roman', 'Georgia', 'Trebuchet MS', 'Courier New',
];

const FONT_WEIGHTS = ['Normal', 'Bold'];

const ALIGN_H_OPTIONS = ['Left', 'Center', 'Right', 'Justify'];
const ALIGN_V_OPTIONS = ['Top', 'Middle', 'Bottom'];

// ---------------------------------------------------------------------------
// Küçük yardımcı bileşenler
// ---------------------------------------------------------------------------

function SectionHeader({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-6 h-6 rounded-md bg-red-50 flex items-center justify-center shrink-0">
        <Icon size={13} className="text-[#e12f27]" />
      </div>
      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</span>
    </div>
  );
}

function FieldRow({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <label className="text-xs text-gray-600 shrink-0 w-36">{label}</label>
      <div className="flex-1 flex justify-end">{children}</div>
    </div>
  );
}

function NumberInput({ value, onChange, min, max, step = 0.5, unit = 'pt' }) {
  return (
    <div className="flex items-center gap-1">
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-20 text-right text-xs px-2 py-1.5 rounded-md border border-gray-200 bg-white
                   focus:outline-none focus:ring-1 focus:ring-red-300 focus:border-red-400
                   text-gray-800 [appearance:textfield]
                   [&::-webkit-outer-spin-button]:appearance-none
                   [&::-webkit-inner-spin-button]:appearance-none"
      />
      {unit && <span className="text-xs text-gray-400 w-4">{unit}</span>}
    </div>
  );
}

function SelectInput({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none text-xs px-2.5 py-1.5 pr-7 rounded-md border border-gray-200 bg-white
                   focus:outline-none focus:ring-1 focus:ring-red-300 focus:border-red-400
                   text-gray-800 cursor-pointer min-w-[110px]"
      >
        {options.map((o) => (
          <option key={typeof o === 'string' ? o : o.value} value={typeof o === 'string' ? o : o.value}>
            {typeof o === 'string' ? o : o.label}
          </option>
        ))}
      </select>
      <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );
}

function AlignPicker({ value, onChange, options }) {
  return (
    <div className="flex rounded-md border border-gray-200 overflow-hidden">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`text-xs px-2.5 py-1.5 transition-colors ${value === opt
              ? 'bg-[#e12f27] text-white font-medium'
              : 'bg-white text-gray-500 hover:bg-gray-50'
            }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function Divider() {
  return <div className="border-t border-gray-100 my-4" />;
}

// ---------------------------------------------------------------------------
// Ana bileşen
// ---------------------------------------------------------------------------
function SettingsPanel({ onClose }) {
  const { layoutSettings, updateLayoutSetting, resetLayoutSettings } = useLayoutStore(
    useShallow((s) => ({
      layoutSettings: s.layoutSettings,
      updateLayoutSetting: s.updateLayoutSetting,
      resetLayoutSettings: s.resetLayoutSettings,
    })),
  );

  const panelRef = useRef(null);

  // Dışarı tıklanınca kapat
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  // ESC tuşuyla kapat
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const set = (key, value) => updateLayoutSetting(key, value);
  const s = layoutSettings;

  // Seçili preset kontrolü
  const activePreset = PAGE_PRESETS.find(
    (p) => p.pageWidth === s.pageWidth && p.pageHeight === s.pageHeight,
  );

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-40" />

      {/* Panel */}
      <div
        ref={panelRef}
        className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col
                   animate-in slide-in-from-right duration-200"
      >
        {/* Header */}
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

        {/* İçerik — kaydırılabilir */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">

          {/* ── 1. SAYFA ─────────────────────────────────────────────────── */}
          <SectionHeader icon={FileText} label="Sayfa" />

          {/* Preset seçici */}
          <FieldRow label="Kağıt boyutu">
            <SelectInput
              value={activePreset?.label ?? 'Özel'}
              onChange={(label) => {
                const preset = PAGE_PRESETS.find((p) => p.label === label);
                if (preset) {
                  set('pageWidth', preset.pageWidth);
                  set('pageHeight', preset.pageHeight);
                }
              }}
              options={[
                ...PAGE_PRESETS.map((p) => ({ value: p.label, label: p.label })),
                { value: 'Özel', label: 'Özel' },
              ]}
            />
          </FieldRow>

          <FieldRow label="Sayfa genişliği">
            <NumberInput value={s.pageWidth} onChange={(v) => set('pageWidth', v)} min={200} max={2000} />
          </FieldRow>
          <FieldRow label="Sayfa yüksekliği">
            <NumberInput value={s.pageHeight} onChange={(v) => set('pageHeight', v)} min={200} max={2000} />
          </FieldRow>

          <div className="grid grid-cols-1 gap-x-2">
            <FieldRow label="Sol boşluk">
              <NumberInput value={s.marginLeft} onChange={(v) => set('marginLeft', v)} min={0} max={200} />
            </FieldRow>
            <FieldRow label="Sağ boşluk">
              <NumberInput value={s.marginRight} onChange={(v) => set('marginRight', v)} min={0} max={200} />
            </FieldRow>
            <FieldRow label="Üst boşluk">
              <NumberInput value={s.marginTop} onChange={(v) => set('marginTop', v)} min={0} max={200} />
            </FieldRow>
            <FieldRow label="Alt boşluk">
              <NumberInput value={s.marginBottom} onChange={(v) => set('marginBottom', v)} min={0} max={200} />
            </FieldRow>
          </div>

          <FieldRow label="Bileşen aralığı">
            <NumberInput value={s.itemSpacing} onChange={(v) => set('itemSpacing', v)} min={0} max={50} step={1} />
          </FieldRow>
          <FieldRow label="Varsayılan Left">
            <NumberInput value={s.defaultLeft} onChange={(v) => set('defaultLeft', v)} min={0} max={500} />
          </FieldRow>

          <Divider />

          {/* ── 2. YAZI TİPİ ─────────────────────────────────────────────── */}
          <SectionHeader icon={Type} label="Yazı Tipi" />

          <FieldRow label="Font ailesi">
            <SelectInput
              value={s.fontFamily}
              onChange={(v) => set('fontFamily', v)}
              options={FONT_FAMILIES}
            />
          </FieldRow>
          <FieldRow label="Başlık font boyutu">
            <NumberInput value={s.titleFontSize} onChange={(v) => set('titleFontSize', v)} min={6} max={24} step={0.5} />
          </FieldRow>
          <FieldRow label="Başlık kalınlığı">
            <SelectInput
              value={s.titleFontWeight}
              onChange={(v) => set('titleFontWeight', v)}
              options={FONT_WEIGHTS}
            />
          </FieldRow>
          <FieldRow label="Sütun başlık boyutu">
            <NumberInput value={s.columnHeaderFontSize} onChange={(v) => set('columnHeaderFontSize', v)} min={6} max={20} step={0.5} />
          </FieldRow>
          <FieldRow label="Sütun veri boyutu">
            <NumberInput value={s.columnDataFontSize} onChange={(v) => set('columnDataFontSize', v)} min={5} max={16} step={0.5} />
          </FieldRow>

          <Divider />

          {/* ── 3. BOYUTLAR ──────────────────────────────────────────────── */}
          <SectionHeader icon={Ruler} label="Boyutlar" />

          <FieldRow label="Başlık yüksekliği">
            <NumberInput value={s.titleHeight} onChange={(v) => set('titleHeight', v)} min={10} max={200} />
          </FieldRow>
          <FieldRow label="Sütun genişliği">
            <NumberInput value={s.columnWidth} onChange={(v) => set('columnWidth', v)} min={20} max={300} />
          </FieldRow>
          <FieldRow label="Satır yüksekliği">
            <NumberInput value={s.columnHeight} onChange={(v) => set('columnHeight', v)} min={10} max={100} />
          </FieldRow>
          <FieldRow label="Grafik genişliği">
            <NumberInput value={s.chartWidth} onChange={(v) => set('chartWidth', v)} min={50} max={800} />
          </FieldRow>
          <FieldRow label="Grafik yüksekliği">
            <NumberInput value={s.chartHeight} onChange={(v) => set('chartHeight', v)} min={50} max={600} />
          </FieldRow>

          <Divider />

          {/* ── 4. HİZALAMA ─────────────────────────────────────────────── */}
          <SectionHeader icon={AlignCenter} label="Hizalama" />

          <FieldRow label="Başlık — yatay">
            <AlignPicker value={s.titleHAlign} onChange={(v) => set('titleHAlign', v)} options={ALIGN_H_OPTIONS} />
          </FieldRow>
          <FieldRow label="Başlık — dikey">
            <AlignPicker value={s.titleVAlign} onChange={(v) => set('titleVAlign', v)} options={ALIGN_V_OPTIONS} />
          </FieldRow>
          <FieldRow label="Sütun — yatay">
            <AlignPicker value={s.columnHAlign} onChange={(v) => set('columnHAlign', v)} options={ALIGN_H_OPTIONS} />
          </FieldRow>
          <FieldRow label="Sütun — dikey">
            <AlignPicker value={s.columnVAlign} onChange={(v) => set('columnVAlign', v)} options={ALIGN_V_OPTIONS} />
          </FieldRow>

          {/* Alt boşluk */}
          <div className="h-6" />
        </div>

        {/* Footer — değişiklik özeti */}
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
