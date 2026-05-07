import { Grid3x3 } from 'lucide-react';

export default function MatrixBlock({ item }) {
  const rowCount = item.rowGroups?.length || 0;
  const colGroupCount = item.columnGroups?.length || 0;
  const staticColCount = item.staticColumns?.length || 0;

  return (
    <div className="border-2 border-dashed border-purple-300 rounded-lg bg-purple-50/40 p-6 mb-4 flex flex-col items-center justify-center gap-3 min-h-[120px]">
      <Grid3x3 size={36} className="text-purple-400" />
      <div className="text-sm font-medium text-purple-600">Matrix (Crosstab)</div>
      <div className="text-xs text-purple-400 flex items-center gap-4">
        <span>{rowCount} row group{rowCount !== 1 ? 's' : ''}</span>
        <span>{colGroupCount} column group{colGroupCount !== 1 ? 's' : ''}</span>
        <span>{staticColCount} static column{staticColCount !== 1 ? 's' : ''}</span>
      </div>
      {!item.dataSourceId && (
        <div className="text-[10px] text-amber-500 font-medium">No data source selected</div>
      )}
    </div>
  );
}
