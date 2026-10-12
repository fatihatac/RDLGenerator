import { LayoutTemplate } from 'lucide-react';
import { SectionHeader, NumberInput, FieldRow } from './FormInputs';
import { pxToPt, ptToPx } from '../../../utils/core/units';

// Ayarlar pt olarak saklanır (RDL birimi); kullanıcı px görür ve girer.
function PxField({ label, settings, name, onChange, max }) {
  return (
    <FieldRow label={label}>
      <NumberInput
        value={ptToPx(settings[name])}
        onChange={(px) => onChange(name, pxToPt(px))}
        min={0} max={max} step={1} unit="px"
      />
    </FieldRow>
  );
}

// Sayfa, kenar boşlukları ve içerik alanını gösteren küçük şema.
function PageDiagram({ settings }) {
  const W = 90;
  const scale = W / settings.pageWidth;
  const H = Math.round(settings.pageHeight * scale);
  const box = (v) => Math.max(0, Math.round(v * scale));

  return (
    <div className="flex items-center gap-3 mb-2">
      <div
        className="relative bg-white border border-gray-300 shrink-0"
        style={{ width: W, height: H }}
        aria-label="Sayfa şeması"
      >
        <div
          className="absolute bg-red-50 border border-dashed border-[#e12f27]/60"
          style={{
            left: box(settings.marginLeft),
            right: box(settings.marginRight),
            top: box(settings.marginTop),
            bottom: box(settings.marginBottom),
          }}
        />
        {settings.defaultLeft > 0 && (
          <div
            className="absolute w-px bg-[#e12f27]"
            style={{
              left: box(settings.marginLeft + settings.defaultLeft),
              top: box(settings.marginTop),
              bottom: box(settings.marginBottom),
            }}
          />
        )}
      </div>
      <p className="text-[11px] text-gray-400 leading-relaxed">
        Kesikli alan içerik alanıdır. Bileşenlerin Sol/Sağ/Üst/Alt uzaklıkları bu alana göre ölçülür. Değerler px'tir (RDL'e pt olarak yazılır).
      </p>
    </div>
  );
}

export default function LayoutSection({ settings, onChange }) {
  return (
    <>
      <SectionHeader icon={LayoutTemplate} label="Yerleşim" />

      <PageDiagram settings={settings} />

      <PxField label="Sol marjin" name="marginLeft" settings={settings} onChange={onChange} max={400} />
      <PxField label="Sağ marjin" name="marginRight" settings={settings} onChange={onChange} max={400} />
      <PxField label="Üst marjin" name="marginTop" settings={settings} onChange={onChange} max={400} />
      <PxField label="Alt marjin" name="marginBottom" settings={settings} onChange={onChange} max={400} />
      <PxField label="Bileşen aralığı" name="itemSpacing" settings={settings} onChange={onChange} max={100} />
      <PxField label="Varsayılan Sol" name="defaultLeft" settings={settings} onChange={onChange} max={700} />
    </>
  );
}
