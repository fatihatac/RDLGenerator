import React, { useMemo } from 'react';
import useReportStore from '../../store/useReportStore';
import { useShallow } from 'zustand/react/shallow';
import { ITEM_TYPES } from '../../constants/appConstants';
import { REPORT_TYPES } from '../../constants/reportTypes';

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function parseAndFlattenData(jsonString) {
  if (!jsonString?.trim()) return [];
  try {
    const raw = JSON.parse(jsonString);
    const arr = Array.isArray(raw) ? raw : [raw];
    return arr.map((row) => flattenObject(row));
  } catch {
    return [];
  }
}

function flattenObject(obj, prefix = '') {
  if (typeof obj !== 'object' || obj === null) return {};
  return Object.entries(obj).reduce((acc, [k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      Object.assign(acc, flattenObject(v, key));
    } else {
      acc[key] = v == null ? '' : String(v);
    }
    return acc;
  }, {});
}

function computeTotals(rows, visibleCols, sumColIds) {
  const totals = {};
  visibleCols.forEach((col) => {
    if (sumColIds.has(col.id) && col.mappedField && col.mappedField !== 'RowNumber') {
      totals[col.id] = rows.reduce((sum, row) => {
        const v = parseFloat(row[col.mappedField]);
        return sum + (isNaN(v) ? 0 : v);
      }, 0);
    }
  });
  return totals;
}

// ---------------------------------------------------------------------------
// Shared cell styles — mirrors SSRS default table output
// ---------------------------------------------------------------------------

const S = {
  cell: { border: '1px solid #d0d0d0', padding: '3px 8px', color: '#333', fontSize: '9pt' },
  headerCell: {
    border: '1px solid #aaa',
    padding: '5px 8px',
    backgroundColor: '#d9d9d9',
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#111',
    fontSize: '9pt',
    whiteSpace: 'nowrap',
  },
  sumCell: {
    border: '1px solid #aaa',
    padding: '3px 8px',
    backgroundColor: '#d0d0d0',
    fontWeight: 'bold',
    fontSize: '9pt',
  },
  groupHeaderCell: {
    border: '1px solid #bbb',
    padding: '4px 8px',
    backgroundColor: '#eaeaea',
    fontWeight: 'bold',
    color: '#444',
    fontSize: '8.5pt',
  },
};

// ---------------------------------------------------------------------------
// Building blocks
// ---------------------------------------------------------------------------

function Page({ children, isPortrait }) {
  return (
    <div
      style={{
        width: isPortrait ? '210mm' : '297mm',
        minHeight: isPortrait ? '297mm' : '210mm',
        padding: '18mm 22mm',
        backgroundColor: '#fff',
        boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
        fontFamily: '"Segoe UI", Tahoma, Arial, sans-serif',
        fontSize: '10pt',
        color: '#1a1a1a',
        boxSizing: 'border-box',
      }}
    >
      {children}
    </div>
  );
}

function TitleBlock({ value }) {
  if (!value?.trim()) return null;
  return (
    <div
      style={{
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '13pt',
        marginBottom: 14,
        paddingBottom: 10,
        borderBottom: '2px solid #e12f27',
        color: '#111',
      }}
    >
      {value}
    </div>
  );
}

function DateRangeBlock() {
  const today = new Date().toLocaleDateString('tr-TR');
  return (
    <div style={{ textAlign: 'right', fontSize: '9pt', color: '#666', marginBottom: 10, fontStyle: 'italic' }}>
      Tarih Aralığı: {today} – {today}
    </div>
  );
}

function SumRow({ rows, visibleCols, sumColIds, label = 'TOPLAM' }) {
  if (!sumColIds.size) return null;
  const totals = computeTotals(rows, visibleCols, sumColIds);
  if (!Object.keys(totals).length) return null;
  return (
    <tr>
      {visibleCols.map((col, idx) => (
        <td key={col.id} style={S.sumCell}>
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

function FlatRows({ rows, visibleCols, offset = 0 }) {
  return rows.map((row, i) => (
    <tr key={i} style={{ backgroundColor: (offset + i) % 2 === 0 ? '#fff' : '#f7f7f7' }}>
      {visibleCols.map((col) => {
        let val = '';
        if (col.mappedField === 'RowNumber') val = offset + i + 1;
        else if (col.mappedField) val = row[col.mappedField] ?? '';
        return (
          <td key={col.id} style={S.cell}>
            {val}
          </td>
        );
      })}
    </tr>
  ));
}

function DataTableBlock({ tableItem, rows }) {
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

  // Build group map when a group field is configured
  let groupMap = null;
  if (primaryGroupField) {
    groupMap = new Map();
    rows.forEach((row) => {
      const key = row[primaryGroupField] ?? '';
      if (!groupMap.has(key)) groupMap.set(key, []);
      groupMap.get(key).push(row);
    });
  }

  const renderGrouped = () => {
    const elements = [];
    let globalIdx = 0;
    groupMap.forEach((groupRows, groupKey) => {
      elements.push(
        <tr key={`gh-${groupKey}`}>
          <td colSpan={visibleCols.length} style={S.groupHeaderCell}>
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
              <th key={col.id} style={S.headerCell}>
                {col.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={visibleCols.length} style={{ ...S.cell, textAlign: 'center', color: '#aaa', padding: '14px 8px' }}>
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

function ChartPlaceholder({ item }) {
  return (
    <div
      style={{
        height: 160,
        border: '2px dashed #e0e0e0',
        borderRadius: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ccc',
        marginBottom: 16,
        gap: 8,
        fontSize: '9pt',
      }}
    >
      <div style={{ fontSize: 32 }}>📊</div>
      <div>{(item.chartType ?? 'chart').toUpperCase()} grafik</div>
    </div>
  );
}

function GenericDataTableBlock({ rows }) {
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
              <th key={col} style={S.headerCell}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#f7f7f7' }}>
              {cols.map((col) => (
                <td key={col} style={S.cell}>
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

function EmptyState() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        color: '#ccc',
        gap: 12,
      }}
    >
      <div style={{ fontSize: 40 }}>📄</div>
      <div style={{ fontSize: '10pt' }}>Önizleme için bileşen ve veri kaynağı ekleyin.</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

function ReportPreview() {
  const { reportItems, isPortrait, setIsPortrait, reportType } = useReportStore(
    useShallow((state) => ({
      reportItems: state.reportItems,
      isPortrait: state.isPortrait,
      setIsPortrait: state.setIsPortrait,
      reportType: state.reportType,
    })),
  );

  const dataMap = useMemo(() => {
    const map = {};
    reportItems.forEach((item) => {
      if (item.type === ITEM_TYPES.DATA) {
        map[item.id] = parseAndFlattenData(item.value);
      }
    });
    return map;
  }, [reportItems]);

  // Tables without an explicit dataSourceId use the first DATA item
  const firstDataItem = reportItems.find((i) => i.type === ITEM_TYPES.DATA);
  const firstDataRows = firstDataItem ? (dataMap[firstDataItem.id] ?? []) : [];

  const isEmpty = reportItems.length === 0;
  const isFormType = reportType !== REPORT_TYPES.STANDARD;

  return (
    <div className="flex flex-col items-center w-full gap-6 pb-12">
      {/* Orientation toolbar */}
      <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 self-center">
        <span className="text-sm font-medium text-gray-600 mr-3">Kağıt Yönü:</span>
        <div className="flex bg-gray-100 p-0.5 rounded-md">
          {[
            { label: 'Dikey (Portrait)', val: true },
            { label: 'Yatay (Landscape)', val: false },
          ].map(({ label, val }) => (
            <button
              key={String(val)}
              onClick={() => setIsPortrait(val)}
              className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                isPortrait === val
                  ? 'bg-white shadow text-[#e12f27]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* A4 page */}
      <Page isPortrait={isPortrait}>
        {isEmpty ? (
          <EmptyState />
        ) : isFormType ? (
          <>
            {reportItems
              .filter((i) => i.type === ITEM_TYPES.TITLE)
              .map((item) => (
                <TitleBlock key={item.id} value={item.value} />
              ))}
            {reportItems
              .filter((i) => i.type === ITEM_TYPES.DATA)
              .map((item) => (
                <GenericDataTableBlock key={item.id} rows={dataMap[item.id] ?? []} />
              ))}
          </>
        ) : (
          reportItems.map((item) => {
            if (item.type === ITEM_TYPES.DATA) return null;
            if (item.type === ITEM_TYPES.TITLE)
              return <TitleBlock key={item.id} value={item.value} />;
            if (item.type === ITEM_TYPES.DATE_RANGE)
              return <DateRangeBlock key={item.id} />;
            if (item.type === ITEM_TYPES.TABLE)
              return <DataTableBlock key={item.id} tableItem={item} rows={firstDataRows} />;
            if (item.type === ITEM_TYPES.CHART)
              return <ChartPlaceholder key={item.id} item={item} />;
            return null;
          })
        )}
      </Page>
    </div>
  );
}

export default ReportPreview;
