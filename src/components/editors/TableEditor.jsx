import { memo } from 'react';
import { Plus, Table, ListOrdered, Group, Sigma } from 'lucide-react';
import { useItemActions } from '../../hooks/useItemActions';
import { useTableActions } from '../../hooks/useTableActions';
import useTableData from '../../hooks/useTableData';
import ColumnListEditor from './table/ColumnListEditor';
import GroupListEditor from './table/GroupListEditor';
import SumListEditor from './table/SumListEditor';
import PositionEditor from './PositionEditor';
import DeleteButton from '../ui/DeleteButton';
import { useToast } from '../../hooks/useToast';

function TableEditor({ item }) {
  const { deleteItem } = useItemActions(item.id);
  const { addColumn, addRowNumberColumn, addGroup, addSum } = useTableActions(item.id);
  const { jsonKeys } = useTableData(item);
  const toast = useToast();

  const handleDelete = () => {
    deleteItem();
    toast.info('Tablo silindi.');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4 transition-all hover:shadow-md">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2 text-green-600 font-semibold">
          <Table size={18} />
          <span>Veri Tablosu</span>
          {item.columns?.length > 0 && (
            <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              {item.columns.length} sütun
            </span>
          )}
        </div>
        <DeleteButton onDelete={handleDelete} />
      </div>

      <ColumnListEditor tableId={item.id} columns={item.columns} />
      <GroupListEditor tableId={item.id} groups={item.groups} jsonKeys={jsonKeys} />
      <SumListEditor tableId={item.id} sums={item.sums} jsonKeys={jsonKeys} />

      <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-gray-100">
        <button onClick={addColumn} className="text-sm flex items-center gap-1 text-green-600 hover:text-green-700 font-medium transition-colors">
          <Plus size={15} /> Sütun Ekle
        </button>
        <span className="text-gray-200">|</span>
        <button onClick={addRowNumberColumn} className="text-sm flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium transition-colors">
          <ListOrdered size={15} /> Satır No.
        </button>
        <span className="text-gray-200">|</span>
        <button onClick={addGroup} className="text-sm flex items-center gap-1 text-gray-600 hover:text-gray-700 font-medium transition-colors">
          <Group size={15} /> Grup Ekle
        </button>
        <span className="text-gray-200">|</span>
        <button onClick={addSum} className="text-sm flex items-center gap-1 text-red-600 hover:text-red-700 font-medium transition-colors">
          <Sigma size={15} /> Toplam Ekle
        </button>
      </div>
      <PositionEditor itemId={item.id} />
    </div>
  );
}

export default memo(TableEditor);
