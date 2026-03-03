import { Plus, Trash2, Table, ListOrdered, Group, Sigma } from 'lucide-react';
import useReportStore from '../../store/useReportStore';
import useTableData from '../../hooks/useTableData'; // Hook'umuzu import ettik

// Alt Bileşenler
import ColumnListEditor from './table/ColumnListEditor';
import GroupListEditor from './table/GroupListEditor';
import SumListEditor from './table/SumListEditor';

function TableEditor({ item }) {
  // Store'dan sadece UI butonlarının tıklanınca çalıştıracağı fonksiyonları çekiyoruz
  const { deleteItem, addColumn, addRowNumberColumn, addGroup, addSum } = useReportStore();

  const { jsonKeys } = useTableData(item);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4 transition-all hover:shadow-md">
      {/* Üst Başlık ve Silme Butonu */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center text-green-600 font-semibold">
          <Table size={18} className="mr-2" />
          <span>Data Table</span>
        </div>
        <button onClick={() => deleteItem(item.id)} className="text-red-400 hover:text-red-600 p-1">
          <Trash2 size={18} />
        </button>
      </div>

      {/* Alt Bileşenlerin Çağrılması */}
      <ColumnListEditor tableId={item.id} columns={item.columns} />
      <GroupListEditor tableId={item.id} groups={item.groups} jsonKeys={jsonKeys} />
      <SumListEditor tableId={item.id} sums={item.sums} jsonKeys={jsonKeys} />

      {/* Aksiyon Butonları */}
      <div className="flex items-center gap-4 mt-4">
        <button onClick={() => addColumn(item.id)} className="text-sm flex items-center text-green-600 hover:text-green-700 font-medium">
          <Plus size={16} className="mr-1" /> Add Column
        </button>
        <span className="text-gray-300">|</span>
        <button onClick={() => addRowNumberColumn(item.id)} className="text-sm flex items-center text-blue-600 hover:text-blue-700 font-medium">
          <ListOrdered size={16} className="mr-1" /> Add Row No
        </button>
        <span className="text-gray-300">|</span>
        <button onClick={() => addGroup(item.id)} className='text-sm flex items-center text-gray-600 hover:text-gray-700 font-medium'>
          <Group size={16} className='mr-1' /> Add Group
        </button>
        <span className="text-gray-300">|</span>
        <button onClick={() => addSum(item.id)} className='text-sm flex items-center text-red-600 hover:text-red-700 font-medium'>
          <Sigma size={16} className='mr-1' /> Add Sum
        </button>
      </div>
    </div>
  );
}

export default TableEditor;