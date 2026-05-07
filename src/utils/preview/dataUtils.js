export function parseAndFlattenData(jsonString) {
  if (!jsonString?.trim()) return [];
  try {
    const raw = JSON.parse(jsonString);
    const arr = Array.isArray(raw) ? raw : [raw];
    return arr.map((row) => flattenObject(row));
  } catch {
    return [];
  }
}

export function flattenObject(obj, prefix = '') {
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

export function computeTotals(rows, visibleCols, sumColIds) {
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

export function buildGroupMap(rows, primaryGroupField) {
  if (!primaryGroupField) return null;
  const groupMap = new Map();
  rows.forEach((row) => {
    const key = row[primaryGroupField] ?? '';
    if (!groupMap.has(key)) groupMap.set(key, []);
    groupMap.get(key).push(row);
  });
  return groupMap;
}
