import { buildGroupMap } from '../../../utils/preview/dataUtils';
import { cellStyles } from '../styles';
import SumRow from './SumRow';
import FlatRows from './FlatRows';

export default function DataTableBlock({ tableItem, rows }) {
  const visibleCols = (tableItem.columns || []).filter((c) => c.isVisible !== false);
  const groups = tableItem.groups || [];
  const sumColIds = new Set((tableItem.sums || []).map((s) => s.columnId));
  const primaryGroupField = groups[0]?.field || null;

  if (!visibleCols.length) {
    return (
      <div style={{ color: '#999', fontSize: '9pt', padding: '8px 0', marginBottom: 12 }}>
        Sütun tanımlanmamış.
      </div>
    );
  }

  const groupMap = buildGroupMap(rows, primaryGroupField);

  const renderGrouped = () => {
    const elements = [];
    let globalIdx = 0;
    groupMap.forEach((groupRows, groupKey) => {
      elements.push(
        <tr key={`gh-${groupKey}`}>
          <td colSpan={visibleCols.length} style={cellStyles.groupHeaderCell}>
            {primaryGroupField}: {groupKey}
          </td>
        </tr>,
      );
      elements.push(
        <FlatRows key={`dr-${groupKey}`} rows={groupRows} visibleCols={visibleCols} offset={globalIdx} />,
      );
      globalIdx += groupRows.length;
      if (sumColIds.size > 0) {
        elements.push(
          <SumRow
            key={`sr-${groupKey}`}
            rows={groupRows}
            visibleCols={visibleCols}
            sumColIds={sumColIds}
            label="Ara Toplam"
          />,
        );
      }
    });
    if (sumColIds.size > 0 && groupMap.size > 1) {
      elements.push(
        <SumRow
          key="grand-total"
          rows={rows}
          visibleCols={visibleCols}
          sumColIds={sumColIds}
          label="GENEL TOPLAM"
        />,
      );
    }
    return elements;
  };

  return (
    <div style={{ marginBottom: 16, overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {visibleCols.map((col) => (
              <th key={col.id} style={cellStyles.headerCell}>
                {col.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={visibleCols.length} style={{ ...cellStyles.cell, textAlign: 'center', color: '#aaa', padding: '14px 8px' }}>
                Veri yok
              </td>
            </tr>
          ) : groupMap ? (
            renderGrouped()
          ) : (
            <>
              <FlatRows rows={rows} visibleCols={visibleCols} />
              <SumRow rows={rows} visibleCols={visibleCols} sumColIds={sumColIds} />
            </>
          )}
        </tbody>
      </table>
      {rows.length > 0 && (
        <div style={{ fontSize: '8pt', color: '#999', marginTop: 3, textAlign: 'right' }}>
          {rows.length} kayıt
        </div>
      )}
    </div>
  );
}
