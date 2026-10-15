import { useState } from 'react';
import { LayoutTemplate } from 'lucide-react';
import { SectionHeader, PxInput, FieldRow } from './FormInputs';
import { pxToPt, ptToPx } from '../../../utils/core/units';
import useItemPositions from '../../../hooks/useItemPositions';

function PxField({ label, settings, name, onChange, max }) {
  return (
    <FieldRow label={label}>
      <PxInput value={settings[name]} onChange={(pt) => onChange(name, pt)} min={0} max={max} />
    </FieldRow>
  );
}

// Gövde yüksekliği (Body.Height): doğrudan girilir; en alttaki bileşenin alt kenarından
// küçük olamaz. Girilen değer "son bileşen altı boşluk" ayarına çevrilir.
function BodyHeightField({ settings, bodyHeight, onChange }) {
  const [draft, setDraft] = useState(null); // null → hesaplanan değeri göster
  const contentBottom = bodyHeight - (settings.bodyBottomSpace ?? 0);
  const minPx = ptToPx(contentBottom);

  const commit = () => {
    if (draft === null) return;
    const px = parseFloat(draft);
    if (!Number.isNaN(px)) {
      onChange('bodyBottomSpace', Math.max(0, Math.round((pxToPt(px) - contentBottom) * 100) / 100));
    }
    setDraft(null);
  };

  return (
    <>
      <FieldRow label="Gövde yüksekliği">
        <div className="flex items-center gap-1">
          <input
            type="number"
            min={minPx}
            step={1}
            value={draft ?? ptToPx(bodyHeight)}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); if (e.key === 'Escape') setDraft(null); }}
            className="w-20 text-right text-xs px-2 py-1.5 rounded-md border border-gray-200 bg-white
                       focus:outline-none focus:ring-1 focus:ring-red-300 focus:border-red-400
                       text-gray-800 [appearance:textfield]
                       [&::-webkit-outer-spin-button]:appearance-none
                       [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="text-xs text-gray-400 w-4">px</span>
        </div>
      </FieldRow>
      <p className="text-[11px] text-gray-400 leading-relaxed pb-1">
        En az {minPx}px (en alttaki bileşenin alt kenarı). Enter veya alandan çıkınca uygulanır;
        farkı otomatik olarak “son bileşen altı boşluk” yapar.
      </p>
    </>
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
        Kesikli alan baskı alanıdır. Marjin yalnızca baskı/PDF çıktısında ve “Baskı önizleme”de görünür; tasarım ekranında ve normal önizlemede bileşenler 0,0'dan başlar. Bileşen uzaklıkları marjinden bağımsızdır. Değerler px'tir (RDL'e pt yazılır).
      </p>
    </div>
  );
}

export default function LayoutSection({ settings, onChange }) {
  const { bodyHeight } = useItemPositions();
  const printable = settings.pageHeight - settings.marginTop - settings.marginBottom;
  const overflows = bodyHeight > printable + 0.01;
  return (
    <>
      <SectionHeader icon={LayoutTemplate} label="Sayfa marjini ve aralık" />

      <PageDiagram settings={settings} />

      <PxField label="Sol marjin (baskı)" name="marginLeft" settings={settings} onChange={onChange} max={400} />
      <PxField label="Sağ marjin (baskı)" name="marginRight" settings={settings} onChange={onChange} max={400} />
      <PxField label="Üst marjin (baskı)" name="marginTop" settings={settings} onChange={onChange} max={400} />
      <PxField label="Alt marjin (baskı)" name="marginBottom" settings={settings} onChange={onChange} max={400} />
      <PxField label="Bileşen aralığı" name="itemSpacing" settings={settings} onChange={onChange} max={100} />
      <PxField label="Son bileşen altı boşluk" name="bodyBottomSpace" settings={settings} onChange={onChange} max={2000} />
      <BodyHeightField settings={settings} bodyHeight={bodyHeight} onChange={onChange} />
      {overflows && (
        <p className="text-[11px] text-amber-700 bg-amber-50 rounded-md px-2 py-1.5 mb-1">
          Gövde baskı alanından ({ptToPx(printable)}px) yüksek; çıktıda boş ek sayfa oluşabilir.
        </p>
      )}
      <PxField label="Varsayılan Sol" name="defaultLeft" settings={settings} onChange={onChange} max={700} />
    </>
  );
}
