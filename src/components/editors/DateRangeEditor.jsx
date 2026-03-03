import { Trash2, Calendar } from 'lucide-react';
import useReportStore from '../../store/useReportStore';

function DateRangeEditor({
  item,
}) {
  const storeUpdateItem = useReportStore((state) => state.updateItem);
  const storeDeleteItem = useReportStore((state) => state.deleteItem);
  const dataItem = useReportStore((state) =>
    state.reportItems.find((reportItem) => reportItem.type === 'data')
  );

  const availableFields = dataItem?.jsonKeys || [];


  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4 transition-all hover:shadow-md">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center text-purple-600 font-semibold">
          <Calendar size={18} className="mr-2" />
          <span>Tarih Aralığı Göstergesi</span>
        </div>
        <button onClick={() => storeDeleteItem(item.id)} className="text-red-400 hover:text-red-600 p-1">
          <Trash2 size={18} />
        </button>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Veri Alanı</label>
        <select
          value={item.mappedField || ''}
          onChange={(e) => storeUpdateItem(item.id, { mappedField: e.target.value })}
          className="w-full p-2 text-sm border border-gray-300 rounded focus:border-purple-500 outline-none"
        >
          <option value="">-- Alan Seçin --</option>
          {availableFields.map(key => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DateRangeEditor;