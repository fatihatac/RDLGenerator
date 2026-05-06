import { FileText } from 'lucide-react';
import { useLayoutStore } from '../../store/useLayoutStore';
import { useShallow } from 'zustand/react/shallow';
import { PAGE_PRESETS } from '../../constants/layoutConstants';

function PageSettings() {
  const { layoutSettings, updateLayoutSetting } = useLayoutStore(
    useShallow((s) => ({
      layoutSettings: s.layoutSettings,
      updateLayoutSetting: s.updateLayoutSetting,
    }))
  );

  const set = (key, value) => updateLayoutSetting(key, value);
  const s = layoutSettings;

  // Helper components (inline for now to avoid circular dependencies)
  const SectionHeader = ({ icon: Icon, label }) => {
    // eslint-disable-next-line no-unused-vars
    const iconUsed = Icon;
    return (
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-md bg-red-50 flex items-center justify-center shrink-0">
          <Icon size={13} className="text-[#e12f27]" />
        </div>
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</span>
      </div>
    );
  };

  const FieldRow = ({ label, children }) => (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <label className="text-xs text-gray-600 shrink-0 w-36">{label}</label>
      <div className="flex-1 flex justify-end">{children}</div>
    </div>
  );

  const NumberInput = ({ value, onChange, min, max, step = 0.5, unit = 'pt' }) => (
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

  const SelectInput = ({ value, onChange, options }) => (
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
    </div>
  );

  const Divider = () => <div className="border-t border-gray-100 my-4" />;

  // Seçili preset kontrolü
  const activePreset = PAGE_PRESETS.find(
    (p) => p.pageWidth === s.pageWidth && p.pageHeight === s.pageHeight,
  );

  return (
    <>
      <SectionHeader icon={FileText} label="Sayfa" />

      {/* Preset seçici */}
      <FieldRow label="Kağıt boyutu">
        <SelectInput
          value={activePreset?.label ?? 'Özel'}
          onChange={(label) => {
            if (label === 'Özel') {
              return;
            }
            
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
    </>
  );
}

export default PageSettings;