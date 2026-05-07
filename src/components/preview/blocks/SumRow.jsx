import { computeTotals } from '../../../utils/preview/dataUtils';
import { cellStyles } from '../styles';

export default function SumRow({ rows, visibleCols, sumColIds, label = 'TOPLAM' }) {
  if (!sumColIds.size) return null;
  const totals = computeTotals(rows, visibleCols, sumColIds);
  if (!Object.keys(totals).length) return null;
  return (
    <tr>
      {visibleCols.map((col, idx) => (
        <td key={col.id} style={cellStyles.sumCell}>
          {idx === 0
            ? label
            : totals[col.id] !== undefined
            ? totals[col.id].toLocaleString('tr-TR')
            : ''}
        </td>
      ))}
    </tr>
  );
}
