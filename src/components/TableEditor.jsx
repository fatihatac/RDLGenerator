import { Plus, Trash2, Table, X } from 'lucide-react';


function TableEditor({ item, updateItem, deleteItem }) {
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

      <button
        onClick={addColumn}
        className="text-sm flex items-center text-green-600 hover:text-green-700 font-medium"
      >
        <Plus size={16} className="mr-1" /> Sütun Ekle
      </button>
    </div>
  );
};

export default TableEditor;