import { AlignCenter } from 'lucide-react';
import { SectionHeader, AlignPicker, FieldRow } from './FormInputs';

const ALIGN_H_OPTIONS = ['Left', 'Center', 'Right', 'Justify'];
const ALIGN_V_OPTIONS = ['Top', 'Middle', 'Bottom'];

export default function AlignmentSection({ settings, onChange }) {
  return (
    <>
      <SectionHeader icon={AlignCenter} label="Hizalama" />

      <FieldRow label="Başlık — yatay">
        <AlignPicker value={settings.titleHAlign} onChange={(v) => onChange('titleHAlign', v)} options={ALIGN_H_OPTIONS} />
      </FieldRow>
      <FieldRow label="Başlık — dikey">
        <AlignPicker value={settings.titleVAlign} onChange={(v) => onChange('titleVAlign', v)} options={ALIGN_V_OPTIONS} />
      </FieldRow>
      <FieldRow label="Sütun — yatay">
        <AlignPicker value={settings.columnHAlign} onChange={(v) => onChange('columnHAlign', v)} options={ALIGN_H_OPTIONS} />
      </FieldRow>
      <FieldRow label="Sütun — dikey">
        <AlignPicker value={settings.columnVAlign} onChange={(v) => onChange('columnVAlign', v)} options={ALIGN_V_OPTIONS} />
      </FieldRow>
    </>
  );
}
