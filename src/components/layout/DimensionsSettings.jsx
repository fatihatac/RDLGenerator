import { Ruler } from 'lucide-react';
import { useLayoutStore } from '../../store/useLayoutStore';
import { useShallow } from 'zustand/react/shallow';

function DimensionsSettings() {
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

  const Divider = () => <div className="border-t border-gray-100 my-4" />;

  return (
    <>
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
    </>
  );
}

export default DimensionsSettings;