import { Trash2, Calendar } from 'lucide-react';
import { useItemActions } from '../../hooks/useItemActions';
import { useDataSource } from '../../hooks/useDataSource';

function DateRangeEditor({
  item,
}) {
  const { updateItem, deleteItem } = useItemActions(item.id);
  const { jsonKeys } = useDataSource();



  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4 transition-all hover:shadow-md">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center text-purple-600 font-semibold">
          <Calendar size={18} className="mr-2" />
          <span>Tarih Aralığı Göstergesi</span>
        </div>
        <button onClick={deleteItem} className="text-red-400 hover:text-red-600 p-1">
          <Trash2 size={18} />
        </button>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Veri Alanı</label>
        <select
          value={item.mappedField || ''}
          onChange={(e) => updateItem({ mappedField: e.target.value })}
          className="w-full p-2 text-sm border border-gray-300 rounded focus:border-purple-500 outline-none"
        >
          <option value="">-- Alan Seçin --</option>
          {jsonKeys.map(key => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
      </div>
      <PositionEditor itemId={item.id} />
    </div>
  );
};

export default DateRangeEditor;