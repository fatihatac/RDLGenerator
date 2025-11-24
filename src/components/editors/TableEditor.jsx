import { Plus, Trash2, Table, X, ListOrdered, Group } from 'lucide-react';
import useReportStore from '../../store/useReportStore';

function TableEditor({ item }) {
  const {
    deleteItem,
    reportItems,
    addColumn,
    removeColumn,
    updateColumnName,
    addRowNumberColumn,
    addGroup,
    removeGroup,
    updateGroupName,
    updateGroupMappedField,
  } = useReportStore();

  const dataItem = reportItems.find(i => i.type === 'data');

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4 transition-all hover:shadow-md">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center text-green-600 font-semibold">
          <Table size={18} className="mr-2" />
          <span>Veri Tablosu</span>
        </div>
        <button onClick={() => deleteItem(item.id)} className="text-red-400 hover:text-red-600 p-1">
          <Trash2 size={18} />
        </button>
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">Sütun Tanımları</label>
        <div className="bg-gray-50 p-3 rounded border border-gray-100 space-y-2">
          {item.columns.length === 0 && <p className="text-xs text-gray-400 italic">Henüz sütun eklenmedi.</p>}

          {item.columns.map((col, idx) => (
            <div key={col.id} className="flex items-center gap-2">
              <span className="text-xs text-gray-400 w-6">{idx + 1}.</span>
              <input
                type="text"
                value={col.name}
                onChange={(e) => updateColumnName(item.id, col.id, e.target.value)}
                className="flex-1 p-1.5 text-sm border border-gray-300 rounded focus:border-green-500 outline-none"
                placeholder="Alan Adı (Örn: Ad)"
              />
              <button onClick={() => removeColumn(item.id, col.id)} className="text-gray-400 hover:text-red-500">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">Grup Tanımları</label>
        <div className="bg-gray-50 p-3 rounded border border-gray-100 space-y-2">
          {(item.groups || []).length === 0 && <p className="text-xs text-gray-400 italic">Henüz grup eklenmedi.</p>}

          {(item.groups || []).map((group, idx) => (
            <div key={group.id} className="flex items-center gap-2">
              <span className="text-xs text-gray-400 w-6">{idx + 1}.</span>
              <input
                type="text"
                value={group.name}
                onChange={(e) => updateGroupName(item.id, group.id, e.target.value)}
                className="flex-1 p-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 outline-none"
                placeholder="Grup Adı (Örn: Bölüm)"
              />
              <select
                value={group.mappedField || ''}
                onChange={(e) => updateGroupMappedField(item.id, group.id, e.target.value || null)}
                className="w-32 p-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 outline-none"
              >
                <option value="">Alan Seç</option>
                {dataItem && dataItem.filteredJsonKeys && dataItem.filteredJsonKeys.map(key => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
              <button onClick={() => removeGroup(item.id, group.id)} className="text-gray-400 hover:text-red-500"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => addColumn(item.id)}
          className="text-sm flex items-center text-green-600 hover:text-green-700 font-medium"
        >
          <Plus size={16} className="mr-1" /> Sütun Ekle
        </button>
        |
        <button
          onClick={() => addRowNumberColumn(item.id)}
          className="text-sm flex items-center text-blue-600 hover:text-blue-700 font-medium"
        >
          <ListOrdered size={16} className="mr-1" /> Satır Numarası Ekle
        </button>
        |
        <button
          onClick={() => addGroup(item.id)}
          className='text-sm flex items-center text-gray-600 hover:text-gray-700 font-medium'
        >
          <Group size={16} className='mr-1' /> Grup Ekle
        </button>
      </div>
    </div >
  );
};

export default TableEditor;