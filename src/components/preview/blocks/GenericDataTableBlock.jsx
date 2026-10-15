import { cellStyles } from '../styles';
import usePreviewFonts from '../../../hooks/usePreviewFonts';

export default function GenericDataTableBlock({ rows }) {
  const fonts = usePreviewFonts();
  if (!rows.length) {
    return (
      <div style={{ color: '#999', fontSize: '9pt', padding: '8px 0', marginBottom: 12 }}>
        Veri kaynağı boş.
      </div>
    );
  }
  const cols = Object.keys(rows[0]);
  return (
    <div style={{ marginBottom: 16, overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {cols.map((col) => (
              <th key={col} style={{ ...cellStyles.headerCell, ...fonts.header }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#f7f7f7' }}>
              {cols.map((col) => (
                <td key={col} style={{ ...cellStyles.cell, ...fonts.cell }}>
                  {row[col] ?? ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ fontSize: '8pt', color: '#999', marginTop: 3, textAlign: 'right' }}>
        {rows.length} kayıt
      </div>
    </div>
  );
}
