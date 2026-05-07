import { Ruler } from 'lucide-react';
import { SectionHeader, NumberInput, FieldRow } from './FormInputs';

export default function DimensionsSection({ settings, onChange }) {
  return (
    <>
      <SectionHeader icon={Ruler} label="Boyutlar" />

      <FieldRow label="Başlık yüksekliği">
        <NumberInput value={settings.titleHeight} onChange={(v) => onChange('titleHeight', v)} min={10} max={200} />
      </FieldRow>
      <FieldRow label="Sütun genişliği">
        <NumberInput value={settings.columnWidth} onChange={(v) => onChange('columnWidth', v)} min={20} max={300} />
      </FieldRow>
      <FieldRow label="Satır yüksekliği">
        <NumberInput value={settings.columnHeight} onChange={(v) => onChange('columnHeight', v)} min={10} max={100} />
      </FieldRow>
      <FieldRow label="Grafik genişliği">
        <NumberInput value={settings.chartWidth} onChange={(v) => onChange('chartWidth', v)} min={50} max={800} />
      </FieldRow>
      <FieldRow label="Grafik yüksekliği">
        <NumberInput value={settings.chartHeight} onChange={(v) => onChange('chartHeight', v)} min={50} max={600} />
      </FieldRow>
    </>
  );
}
