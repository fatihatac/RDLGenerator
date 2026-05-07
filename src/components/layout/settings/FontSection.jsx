import { Type } from 'lucide-react';
import { SectionHeader, SelectInput, NumberInput, FieldRow } from './FormInputs';

const FONT_FAMILIES = [
  'Segoe UI', 'Arial', 'Calibri', 'Tahoma', 'Verdana',
  'Times New Roman', 'Georgia', 'Trebuchet MS', 'Courier New',
];

const FONT_WEIGHTS = ['Normal', 'Bold'];

export default function FontSection({ settings, onChange }) {
  return (
    <>
      <SectionHeader icon={Type} label="Yazı Tipi" />

      <FieldRow label="Font ailesi">
        <SelectInput value={settings.fontFamily} onChange={(v) => onChange('fontFamily', v)} options={FONT_FAMILIES} />
      </FieldRow>
      <FieldRow label="Başlık font boyutu">
        <NumberInput value={settings.titleFontSize} onChange={(v) => onChange('titleFontSize', v)} min={6} max={24} step={0.5} />
      </FieldRow>
      <FieldRow label="Başlık kalınlığı">
        <SelectInput value={settings.titleFontWeight} onChange={(v) => onChange('titleFontWeight', v)} options={FONT_WEIGHTS} />
      </FieldRow>
      <FieldRow label="Sütun başlık boyutu">
        <NumberInput value={settings.columnHeaderFontSize} onChange={(v) => onChange('columnHeaderFontSize', v)} min={6} max={20} step={0.5} />
      </FieldRow>
      <FieldRow label="Sütun veri boyutu">
        <NumberInput value={settings.columnDataFontSize} onChange={(v) => onChange('columnDataFontSize', v)} min={5} max={16} step={0.5} />
      </FieldRow>
    </>
  );
}
