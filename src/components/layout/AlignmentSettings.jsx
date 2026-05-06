import { AlignCenter } from 'lucide-react';
import { useLayoutStore } from '../../store/useLayoutStore';
import { useShallow } from 'zustand/react/shallow';
import { ALIGN_H_OPTIONS, ALIGN_V_OPTIONS } from '../../constants/layoutConstants';

function AlignmentSettings() {
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

  const AlignPicker = ({ value, onChange, options }) => (
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

  return (
    <>
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
    </>
  );
}

export default AlignmentSettings;