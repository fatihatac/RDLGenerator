import { Type } from 'lucide-react';
import { SectionHeader, SelectInput, PxInput, FieldRow } from './FormInputs';

const FONT_FAMILIES = [
  'Cambria', 'Segoe UI', 'Arial', 'Calibri', 'Tahoma', 'Verdana',
  'Times New Roman', 'Georgia', 'Trebuchet MS', 'Courier New',
];

import { FONT_WEIGHT_OPTIONS, normalizeFontWeight } from '../../../utils/core/fontWeights';

const FONT_WEIGHTS = FONT_WEIGHT_OPTIONS.map(({ value, label }) => ({ value, label }));

export default function FontSection({ settings, onChange }) {
  return (
    <>
      <SectionHeader icon={Type} label="Yazı Tipi" />

      <FieldRow label="Font ailesi">
        <SelectInput value={settings.fontFamily} onChange={(v) => onChange('fontFamily', v)} options={FONT_FAMILIES} />
      </FieldRow>
      <FieldRow label="Başlık font boyutu">
        <PxInput value={settings.titleFontSize} onChange={(v) => onChange('titleFontSize', v)} min={8} max={32} />
      </FieldRow>
      <FieldRow label="Başlık kalınlığı">
        <SelectInput value={normalizeFontWeight(settings.titleFontWeight, 'Bold')} onChange={(v) => onChange('titleFontWeight', v)} options={FONT_WEIGHTS} />
      </FieldRow>
      <FieldRow label="Sütun başlık boyutu">
        <PxInput value={settings.columnHeaderFontSize} onChange={(v) => onChange('columnHeaderFontSize', v)} min={8} max={27} />
      </FieldRow>
      <FieldRow label="Sütun başlık kalınlığı">
        <SelectInput value={normalizeFontWeight(settings.columnHeaderFontWeight, 'SemiBold')} onChange={(v) => onChange('columnHeaderFontWeight', v)} options={FONT_WEIGHTS} />
      </FieldRow>
      <FieldRow label="Sütun veri boyutu">
        <PxInput value={settings.columnDataFontSize} onChange={(v) => onChange('columnDataFontSize', v)} min={7} max={21} />
      </FieldRow>
      <FieldRow label="Sütun veri kalınlığı">
        <SelectInput value={normalizeFontWeight(settings.columnDataFontWeight, 'Normal')} onChange={(v) => onChange('columnDataFontWeight', v)} options={FONT_WEIGHTS} />
      </FieldRow>
    </>
  );
}
