import { Plus, Trash2, Table, X, ListOrdered, Group } from 'lucide-react';

function TableEditor({ item, updateItem, deleteItem, reportItems }) {

  const addGroup = () => {
    const newGroup = { id: Date.now(), name: `Grup${Date.now()}`, mappedField: null };
    //updateItem(item.id, { groups: [...item.groups, newGroup] });
    updateItem(item.id, { groups: [...(item.groups || []), newGroup] });
  };

  const updateGroupName = (groupId, newName) => {
    const newGroups = item.groups.map(g => g.id === groupId ? { ...g, name: newName } : g);
    updateItem(item.id, { groups: newGroups });
  };

  const updateGroupMappedField = (groupId, newMappedField) => {
    const newGroups = item.groups.map(g => g.id === groupId ? { ...g, mappedField: newMappedField } : g);
    updateItem(item.id, { groups: newGroups });
  };

  const removeGroup = (groupId) => {
    const newGroups = item.groups.filter(g => g.id !== groupId);
    updateItem(item.id, { groups: newGroups });
  };

  const dataItem = reportItems.find(i => i.type ==='data')

  const addRowNumberColumn = () => {
    if (item.columns.find(c => c.mappedField === 'RowNumber')) {
      alert('Satır numarası sütunu zaten ekli.');
      return;
    }
    const newCol = { id: Date.now(), name: 'No', mappedField: 'RowNumber', width: 30 };
    updateItem(item.id, { columns: [newCol, ...item.columns] });
  };

  const addColumn = () => {
    const newCol = { id: Date.now(), name: `Sütun ${item.columns.length + 1}`, mappedField: null };
    updateItem(item.id, { columns: [...item.columns, newCol] });
  };

  const updateColumnName = (colId, newName) => {
    const newCols = item.columns.map(c => c.id === colId ? { ...c, name: newName } : c);
    updateItem(item.id, { columns: newCols });
  };

  const removeColumn = (colId) => {
    const newCols = item.columns.filter(c => c.id !== colId);
    updateItem(item.id, { columns: newCols });
  };


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
                onChange={(e) => updateColumnName(col.id, e.target.value)}
                className="flex-1 p-1.5 text-sm border border-gray-300 rounded focus:border-green-500 outline-none"
                placeholder="Alan Adı (Örn: Ad)"
              />
              <button onClick={() => removeColumn(col.id)} className="text-gray-400 hover:text-red-500">
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
                onChange={(e) => updateGroupName(group.id, e.target.value)}
                className="flex-1 p-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 outline-none"
                placeholder="Grup Adı (Örn: Bölüm)"
              />
              <select
                value={group.mappedField || ''}
                onChange={(e) => updateGroupMappedField(group.id, e.target.value || null)}
                className="w-32 p-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 outline-none"
              >
                <option value="">Alan Seç</option>
                {dataItem && dataItem.filteredJsonKeys && dataItem.filteredJsonKeys.map(key => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
              <button onClick={() => removeGroup(group.id)} className="text-gray-400 hover:text-red-500">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={addColumn}
          className="text-sm flex items-center text-green-600 hover:text-green-700 font-medium"
        >
          <Plus size={16} className="mr-1" /> Sütun Ekle
        </button>
        |
        <button
          onClick={addRowNumberColumn}
          className="text-sm flex items-center text-blue-600 hover:text-blue-700 font-medium"
        >
          <ListOrdered size={16} className="mr-1" /> Satır Numarası Ekle
        </button>
        |
        <button
          onClick={addGroup}
          className='text-sm flex items-center text-gray-600 hover:text-gray-700 font-medium'
        >
          <Group size={16} className='mr-1' /> Grup Ekle
        </button>
      </div>
    </div >
  );
};

export default TableEditor;