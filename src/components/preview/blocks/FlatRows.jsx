import { cellStyles } from '../styles';

export default function FlatRows({ rows, visibleCols, offset = 0 }) {
  return rows.map((row, i) => (
    <tr key={i} style={{ backgroundColor: (offset + i) % 2 === 0 ? '#fff' : '#f7f7f7' }}>
      {visibleCols.map((col) => {
        let val = '';
        if (col.mappedField === 'RowNumber') val = offset + i + 1;
        else if (col.mappedField) val = row[col.mappedField] ?? '';
        return (
          <td key={col.id} style={cellStyles.cell}>
            {val}
          </td>
        );
      })}
    </tr>
  ));
}
