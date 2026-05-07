import { FileText } from 'lucide-react';
import { SectionHeader, SelectInput, NumberInput, FieldRow } from './FormInputs';

const PAGE_PRESETS = [
  { label: 'A4 Dikey', pageWidth: 595.44, pageHeight: 841.68 },
  { label: 'A4 Yatay', pageWidth: 841.68, pageHeight: 595.44 },
  { label: 'A3 Dikey', pageWidth: 841.89, pageHeight: 1190.55 },
  { label: 'Letter Dikey', pageWidth: 612, pageHeight: 792 },
  { label: 'Letter Yatay', pageWidth: 792, pageHeight: 612 },
];

export default function PageSection({ settings, onChange }) {
  const activePreset = PAGE_PRESETS.find(
    (p) => p.pageWidth === settings.pageWidth && p.pageHeight === settings.pageHeight,
  );

  return (
    <>
      <SectionHeader icon={FileText} label="Sayfa" />

      <FieldRow label="Kağıt boyutu">
        <SelectInput
          value={activePreset?.label ?? 'Özel'}
          onChange={(label) => {
            const preset = PAGE_PRESETS.find((p) => p.label === label);
            if (preset) {
              onChange('pageWidth', preset.pageWidth);
              onChange('pageHeight', preset.pageHeight);
            }
          }}
          options={[
            ...PAGE_PRESETS.map((p) => ({ value: p.label, label: p.label })),
            { value: 'Özel', label: 'Özel' },
          ]}
        />
      </FieldRow>

      <FieldRow label="Sayfa genişliği">
        <NumberInput value={settings.pageWidth} onChange={(v) => onChange('pageWidth', v)} min={200} max={2000} />
      </FieldRow>
      <FieldRow label="Sayfa yüksekliği">
        <NumberInput value={settings.pageHeight} onChange={(v) => onChange('pageHeight', v)} min={200} max={2000} />
      </FieldRow>

      <div className="grid grid-cols-1 gap-x-2">
        <FieldRow label="Sol boşluk">
          <NumberInput value={settings.marginLeft} onChange={(v) => onChange('marginLeft', v)} min={0} max={200} />
        </FieldRow>
        <FieldRow label="Sağ boşluk">
          <NumberInput value={settings.marginRight} onChange={(v) => onChange('marginRight', v)} min={0} max={200} />
        </FieldRow>
        <FieldRow label="Üst boşluk">
          <NumberInput value={settings.marginTop} onChange={(v) => onChange('marginTop', v)} min={0} max={200} />
        </FieldRow>
        <FieldRow label="Alt boşluk">
          <NumberInput value={settings.marginBottom} onChange={(v) => onChange('marginBottom', v)} min={0} max={200} />
        </FieldRow>
      </div>

      <FieldRow label="Bileşen aralığı">
        <NumberInput value={settings.itemSpacing} onChange={(v) => onChange('itemSpacing', v)} min={0} max={50} step={1} />
      </FieldRow>
      <FieldRow label="Varsayılan Left">
        <NumberInput value={settings.defaultLeft} onChange={(v) => onChange('defaultLeft', v)} min={0} max={500} />
      </FieldRow>
    </>
  );
}
