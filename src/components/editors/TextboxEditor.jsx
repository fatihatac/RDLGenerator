import { Trash2, FileText } from 'lucide-react';
import useReportStore from '../../store/useReportStore';

function TextboxEditor({ item }) {
  const storeUpdateItem = useReportStore((state) => state.updateItem);
  const storeDeleteItem = useReportStore((state) => state.deleteItem);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4 transition-all hover:shadow-md">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center text-blue-600 font-semibold">
          <FileText size={18} className="mr-2" />
          <span>Rapor Başlığı / Metin</span>
        </div>
        <button onClick={() => storeDeleteItem(item.id)} className="text-red-400 hover:text-red-600 p-1">
          <Trash2 size={18} />
        </button>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Görüntülenecek Metin</label>
        <input
          type="text"
          value={item.value}
          onChange={(e) => storeUpdateItem(item.id, { value: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Örn: Satış Raporu 2025"
        />
      </div>
    </div>
  );
};

export default TextboxEditor;