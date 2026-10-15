import { Ruler } from 'lucide-react';
import { SectionHeader, PxInput, FieldRow } from './FormInputs';

export default function DimensionsSection({ settings, onChange }) {
  return (
    <>
      <SectionHeader icon={Ruler} label="Boyutlar" />

      <FieldRow label="Başlık yüksekliği">
        <PxInput value={settings.titleHeight} onChange={(v) => onChange('titleHeight', v)} min={13} max={267} />
      </FieldRow>
      <FieldRow label="Sütun genişliği">
        <PxInput value={settings.columnWidth} onChange={(v) => onChange('columnWidth', v)} min={27} max={400} />
      </FieldRow>
      <FieldRow label="Satır yüksekliği">
        <PxInput value={settings.columnHeight} onChange={(v) => onChange('columnHeight', v)} min={13} max={133} />
      </FieldRow>
      <FieldRow label="Grafik genişliği">
        <PxInput value={settings.chartWidth} onChange={(v) => onChange('chartWidth', v)} min={67} max={1067} />
      </FieldRow>
      <FieldRow label="Grafik yüksekliği">
        <PxInput value={settings.chartHeight} onChange={(v) => onChange('chartHeight', v)} min={67} max={800} />
      </FieldRow>
    </>
  );
}
