import { memo } from 'react';
import { Plus, Trash2, Table, ListOrdered, Group, Sigma } from 'lucide-react';
import { useItemActions } from '../../hooks/useItemActions';
import { useTableActions } from '../../hooks/useTableActions';
import useTableData from '../../hooks/useTableData';
import ColumnListEditor from './table/ColumnListEditor';
import GroupListEditor from './table/GroupListEditor';
import SumListEditor from './table/SumListEditor';
import PositionEditor from './PositionEditor';

// FIX: useItemActions + useTableActions hook'ları kullanıldı (store'a doğrudan erişim kaldırıldı)
// FIX: React.memo ile gereksiz re-render önlendi
function TableEditor({ item }) {
  const { deleteItem } = useItemActions(item.id);
  const { addColumn, addRowNumberColumn, addGroup, addSum } = useTableActions(item.id);
  const { jsonKeys } = useTableData(item);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4 transition-all hover:shadow-md">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center text-green-600 font-semibold">
          <Table size={18} className="mr-2" />
          <span>Veri Tablosu</span>
        </div>
        <button onClick={deleteItem} className="text-red-400 hover:text-red-600 p-1">
          <Trash2 size={18} />
        </button>
      </div>

      <ColumnListEditor tableId={item.id} columns={item.columns} />
      <GroupListEditor tableId={item.id} groups={item.groups} jsonKeys={jsonKeys} />
      <SumListEditor tableId={item.id} sums={item.sums} jsonKeys={jsonKeys} />

      <div className="flex flex-wrap items-center gap-3 mt-4">
        <button onClick={addColumn} className="text-sm flex items-center text-green-600 hover:text-green-700 font-medium">
          <Plus size={16} className="mr-1" /> Sütun Ekle
        </button>
        <span className="text-gray-300">|</span>
        <button onClick={addRowNumberColumn} className="text-sm flex items-center text-blue-600 hover:text-blue-700 font-medium">
          <ListOrdered size={16} className="mr-1" /> Satır No.
        </button>
        <span className="text-gray-300">|</span>
        <button onClick={addGroup} className="text-sm flex items-center text-gray-600 hover:text-gray-700 font-medium">
          <Group size={16} className="mr-1" /> Grup Ekle
        </button>
        <span className="text-gray-300">|</span>
        <button onClick={addSum} className="text-sm flex items-center text-red-600 hover:text-red-700 font-medium">
          <Sigma size={16} className="mr-1" /> Toplam Ekle
        </button>
      </div>
      <PositionEditor itemId={item.id} />
    </div>
  );
}

export default memo(TableEditor);
