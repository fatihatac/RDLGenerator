import { memo } from 'react';
import { Plus, Grid3x3, Rows, Columns, Sigma } from 'lucide-react';
import useReportStore from '../../store/useReportStore';
import { useShallow } from 'zustand/react/shallow';
import { useItemActions } from '../../hooks/useItemActions';
import { useMatrixActions } from '../../hooks/useMatrixActions';
import useTableData from '../../hooks/useTableData';
import RowGroupListEditor from './matrix/RowGroupListEditor';
import ColumnGroupListEditor from './matrix/ColumnGroupListEditor';
import StaticColumnListEditor from './matrix/StaticColumnListEditor';
import PositionEditor from './PositionEditor';
import DeleteButton from '../ui/DeleteButton';
import { useToast } from '../../hooks/useToast';

function MatrixEditor({ item }) {
  const { deleteItem } = useItemActions(item.id);
  const { addRowGroup, addColumnGroup, addStaticColumn } = useMatrixActions(item.id);
  const { jsonKeys } = useTableData(item);
  const toast = useToast();

  const dataSources = useReportStore(
    useShallow((state) =>
      state.reportItems.filter((i) => i.type === 'data')
    )
  );

  const updateMatrixDataSource = useReportStore((s) => s.updateMatrixDataSource);

  const handleDelete = () => {
    deleteItem();
    toast.info('Matrix deleted.');
  };

  const totalDynamicWidth = (item.columnGroups || []).reduce((s, c) => s + (Number(c.width) || 25), 0);
  const totalStaticWidth = (item.staticColumns || []).reduce((s, c) => s + (Number(c.width) || 25), 0);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4 transition-all hover:shadow-md">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2 text-purple-600 font-semibold">
          <Grid3x3 size={18} />
          <span>Matrix (Crosstab)</span>
          {(item.columnGroups?.length || 0) + (item.staticColumns?.length || 0) > 0 && (
            <span className="text-xs font-medium bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
              {item.columnGroups?.length || 0} col groups / {item.staticColumns?.length || 0} static
            </span>
          )}
        </div>
        <DeleteButton onDelete={handleDelete} />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">Data Source</label>
        <select
          value={item.dataSourceId || ''}
          onChange={(e) => updateMatrixDataSource(item.id, e.target.value || null)}
          className="w-full p-1.5 text-sm border border-gray-300 rounded focus:border-purple-500 outline-none"
        >
          <option value="">Select Data Source</option>
          {dataSources.map((ds) => (
            <option key={ds.id} value={ds.id}>{ds.id}</option>
          ))}
        </select>
      </div>

      <RowGroupListEditor matrixId={item.id} rowGroups={item.rowGroups} jsonKeys={jsonKeys} />
      <ColumnGroupListEditor matrixId={item.id} columnGroups={item.columnGroups} jsonKeys={jsonKeys} />
      <StaticColumnListEditor matrixId={item.id} staticColumns={item.staticColumns} jsonKeys={jsonKeys} />

      {totalDynamicWidth + totalStaticWidth > 0 && (
        <div className="text-[10px] text-gray-400 mb-2">
          Est. table width: {totalDynamicWidth + totalStaticWidth + (item.rowGroups || []).reduce((s, r) => s + (Number(r.width) || 72), 0)}pt
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-gray-100">
        <button onClick={addRowGroup} className="text-sm flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium transition-colors">
          <Rows size={15} /> Row Group
        </button>
        <span className="text-gray-200">|</span>
        <button onClick={addColumnGroup} className="text-sm flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium transition-colors">
          <Columns size={15} /> Column Group
        </button>
        <span className="text-gray-200">|</span>
        <button onClick={addStaticColumn} className="text-sm flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium transition-colors">
          <Sigma size={15} /> Static Column
        </button>
      </div>
      <PositionEditor itemId={item.id} />
    </div>
  );
}

export default memo(MatrixEditor);
