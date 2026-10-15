import { SIZABLE_TYPES } from '../../../utils/core/reportCalculations';

// RDL'deki gibi mutlak konumlu içerik alanı (pt birimi).
// Her çocuk { id, _left, _top, _width, _height } bilgisiyle yerleştirilir.
// Çakışan itemlar kırmızı çerçeveyle işaretlenir.
export default function PositionedCanvas({ contentWidth, items, overlaps, children }) {
  const bottom = items.reduce((max, p) => Math.max(max, p._top + p._height), 0);

  return (
    <div
      style={{
        position: 'relative',
        width: `${contentWidth}pt`,
        minHeight: `${bottom + 40}pt`,
        outline: '1px dashed #e5e7eb',
      }}
    >
      {children.map(({ pos, node }) => {
        const overlapping = (overlaps[pos.id] ?? []).length > 0;
        return (
          <div
            key={pos.id}
            style={{
              position: 'absolute',
              left: `${pos._left}pt`,
              top: `${pos._top}pt`,
              width: `${pos._width}pt`,
              ...(SIZABLE_TYPES.has(pos.type) && pos._height > 0 && { height: `${pos._height}pt`, overflow: 'hidden' }),
              outline: overlapping ? '1.5px solid #ef4444' : 'none',
              outlineOffset: 1,
            }}
            title={overlapping ? 'Başka bir bileşenle çakışıyor' : undefined}
          >
            {node}
          </div>
        );
      })}
    </div>
  );
}
