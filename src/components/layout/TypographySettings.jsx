import { Type } from 'lucide-react';
import { useLayoutStore } from '../../store/useLayoutStore';
import { useShallow } from 'zustand/react/shallow';
import { FONT_FAMILIES, FONT_WEIGHTS } from '../../constants/layoutConstants';

function TypographySettings() {
  const { layoutSettings, updateLayoutSetting } = useLayoutStore(
    useShallow((s) => ({
      layoutSettings: s.layoutSettings,
      updateLayoutSetting: s.updateLayoutSetting,
    }))
  );

  const set = (key, value) => updateLayoutSetting(key, value);
  const s = layoutSettings;

  // Helper components (inline to avoid circular dependencies)
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

  return (
    <>
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
    </>
  );
}

export default TypographySettings;